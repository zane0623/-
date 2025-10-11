// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title EscrowManager - 修复版本
 * @notice 资金托管合约，支持分段释放
 * 
 * 修复内容：
 * 1. ✅ 防重入攻击
 * 2. ✅ 修正资金分配计算
 * 3. ✅ 添加紧急暂停
 * 4. ✅ 添加超时退款
 */
contract EscrowManager is Ownable, ReentrancyGuard, Pausable {
    
    // 托管状态枚举
    enum EscrowStatus {
        None,           // 不存在
        Locked,         // 已锁定
        Shipped,        // 已发货
        Completed,      // 已完成
        Disputed,       // 有争议
        Refunded        // 已退款
    }
    
    // 托管信息结构
    struct Escrow {
        address buyer;
        address seller;
        address platform;
        uint256 totalAmount;
        uint256 platformFee;      // 5%
        uint256 logisticsFee;     // 10%
        uint256 initialPayment;   // 30%
        uint256 finalPayment;     // 剩余金额（确保总和=100%）
        uint256 releasedAmount;
        EscrowStatus status;
        uint256 createdAt;
        uint256 shippedAt;
        uint256 deliveredAt;
        uint256 deliveryDeadline;
    }
    
    // 状态变量
    address public platformAddress;
    mapping(bytes32 => Escrow) public escrows;
    
    // 费率常量（使用基点，10000=100%）
    uint256 public constant PLATFORM_FEE_RATE = 500;      // 5%
    uint256 public constant LOGISTICS_FEE_RATE = 1000;    // 10%
    uint256 public constant INITIAL_PAYMENT_RATE = 3000;  // 30%
    uint256 public constant RATE_BASE = 10000;            // 100%
    
    // 事件
    event EscrowCreated(
        bytes32 indexed orderId,
        address buyer,
        address seller,
        uint256 amount
    );
    
    event FundsReleased(
        bytes32 indexed orderId,
        address recipient,
        uint256 amount,
        string releaseType
    );
    
    event NFTShipped(
        bytes32 indexed orderId,
        string trackingNumber
    );
    
    event DeliveryConfirmed(
        bytes32 indexed orderId,
        uint256 amount
    );
    
    event DisputeRaised(
        bytes32 indexed orderId,
        address by,
        string reason
    );
    
    event DisputeResolved(
        bytes32 indexed orderId,
        address winner,
        uint256 refundAmount
    );
    
    event RefundProcessed(
        bytes32 indexed orderId,
        uint256 amount,
        string reason
    );
    
    constructor(address _platformAddress) {
        require(_platformAddress != address(0), "Invalid platform address");
        platformAddress = _platformAddress;
    }
    
    /**
     * @notice 创建托管
     * @param orderId 订单ID
     * @param seller 卖家地址
     * @param deliveryDeadline 交付截止时间
     */
    function createEscrow(
        bytes32 orderId,
        address seller,
        uint256 deliveryDeadline
    ) external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Invalid amount");
        require(seller != address(0), "Invalid seller");
        require(deliveryDeadline > block.timestamp, "Invalid deadline");
        require(
            escrows[orderId].status == EscrowStatus.None,
            "Escrow already exists"
        );
        
        uint256 amount = msg.value;
        
        // ✅ 修复：使用精确计算，确保总和等于100%
        uint256 platformFee = (amount * PLATFORM_FEE_RATE) / RATE_BASE;
        uint256 logisticsFee = (amount * LOGISTICS_FEE_RATE) / RATE_BASE;
        uint256 initialPayment = (amount * INITIAL_PAYMENT_RATE) / RATE_BASE;
        
        // ✅ 尾款 = 总额 - 前三项，确保不会多扣或少扣
        uint256 finalPayment = amount - platformFee - logisticsFee - initialPayment;
        
        // 创建托管记录
        escrows[orderId] = Escrow({
            buyer: msg.sender,
            seller: seller,
            platform: platformAddress,
            totalAmount: amount,
            platformFee: platformFee,
            logisticsFee: logisticsFee,
            initialPayment: initialPayment,
            finalPayment: finalPayment,
            releasedAmount: 0,
            status: EscrowStatus.Locked,
            createdAt: block.timestamp,
            shippedAt: 0,
            deliveredAt: 0,
            deliveryDeadline: deliveryDeadline
        });
        
        // ✅ Check-Effects-Interactions 模式：先更新状态，后转账
        // 立即释放平台服务费
        (bool success, ) = platformAddress.call{value: platformFee}("");
        require(success, "Platform fee transfer failed");
        
        escrows[orderId].releasedAmount = platformFee;
        
        emit EscrowCreated(orderId, msg.sender, seller, amount);
        emit FundsReleased(orderId, platformAddress, platformFee, "platform_fee");
    }
    
    /**
     * @notice 确认发货，释放首款和物流费
     * @param orderId 订单ID
     * @param trackingNumber 物流单号
     */
    function confirmShipment(
        bytes32 orderId,
        string calldata trackingNumber
    ) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[orderId];
        
        require(escrow.status == EscrowStatus.Locked, "Invalid status");
        require(msg.sender == escrow.seller, "Only seller can ship");
        require(block.timestamp <= escrow.deliveryDeadline, "Delivery deadline passed");
        require(bytes(trackingNumber).length > 0, "Invalid tracking number");
        
        // ✅ Check-Effects-Interactions 模式
        // 1. 计算金额
        uint256 releaseAmount = escrow.logisticsFee + escrow.initialPayment;
        
        // 2. 更新状态（防重入）
        escrow.status = EscrowStatus.Shipped;
        escrow.shippedAt = block.timestamp;
        escrow.releasedAmount += releaseAmount;
        
        // 3. 转账
        (bool success, ) = escrow.seller.call{value: releaseAmount}("");
        require(success, "Release failed");
        
        emit NFTShipped(orderId, trackingNumber);
        emit FundsReleased(orderId, escrow.seller, releaseAmount, "shipment");
    }
    
    /**
     * @notice 确认收货，释放尾款
     * @param orderId 订单ID
     */
    function confirmDelivery(
        bytes32 orderId
    ) external nonReentrant whenNotPaused {
        Escrow storage escrow = escrows[orderId];
        
        require(escrow.status == EscrowStatus.Shipped, "Invalid status");
        require(msg.sender == escrow.buyer, "Only buyer can confirm");
        
        uint256 payment = escrow.finalPayment;
        require(payment > 0, "No payment to release");
        
        // ✅ Check-Effects-Interactions 模式
        // 1. 更新状态（防重入）
        escrow.status = EscrowStatus.Completed;
        escrow.deliveredAt = block.timestamp;
        escrow.releasedAmount += payment;
        
        // 2. 转账
        (bool success, ) = escrow.seller.call{value: payment}("");
        require(success, "Payment failed");
        
        emit DeliveryConfirmed(orderId, payment);
        emit FundsReleased(orderId, escrow.seller, payment, "final_payment");
    }
    
    /**
     * @notice 自动确认收货（7天后）
     * @param orderId 订单ID
     */
    function autoConfirmDelivery(bytes32 orderId) external nonReentrant {
        Escrow storage escrow = escrows[orderId];
        
        require(escrow.status == EscrowStatus.Shipped, "Invalid status");
        require(escrow.shippedAt > 0, "No shipment record");
        require(
            block.timestamp >= escrow.shippedAt + 7 days,
            "Too early for auto-confirm"
        );
        
        uint256 payment = escrow.finalPayment;
        
        // ✅ Check-Effects-Interactions
        escrow.status = EscrowStatus.Completed;
        escrow.deliveredAt = block.timestamp;
        escrow.releasedAmount += payment;
        
        (bool success, ) = escrow.seller.call{value: payment}("");
        require(success, "Payment failed");
        
        emit DeliveryConfirmed(orderId, payment);
        emit FundsReleased(orderId, escrow.seller, payment, "auto_confirm");
    }
    
    /**
     * @notice 发起争议
     * @param orderId 订单ID
     * @param reason 争议原因
     */
    function raiseDispute(
        bytes32 orderId,
        string calldata reason
    ) external {
        Escrow storage escrow = escrows[orderId];
        
        require(msg.sender == escrow.buyer, "Only buyer can dispute");
        require(
            escrow.status == EscrowStatus.Locked || 
            escrow.status == EscrowStatus.Shipped,
            "Invalid status for dispute"
        );
        require(bytes(reason).length > 0, "Reason required");
        
        escrow.status = EscrowStatus.Disputed;
        
        emit DisputeRaised(orderId, msg.sender, reason);
    }
    
    /**
     * @notice 解决争议（仅平台）
     * @param orderId 订单ID
     * @param buyerWins 买家是否胜诉
     * @param refundRate 退款比例（基点，10000=100%）
     */
    function resolveDispute(
        bytes32 orderId,
        bool buyerWins,
        uint256 refundRate
    ) external onlyOwner nonReentrant {
        Escrow storage escrow = escrows[orderId];
        
        require(escrow.status == EscrowStatus.Disputed, "Not in dispute");
        require(refundRate <= RATE_BASE, "Invalid refund rate");
        
        // 计算剩余金额
        uint256 remainingAmount = escrow.totalAmount - escrow.releasedAmount;
        
        if (buyerWins) {
            // 退款给买家
            uint256 refundAmount = (remainingAmount * refundRate) / RATE_BASE;
            uint256 sellerAmount = remainingAmount - refundAmount;
            
            // ✅ Check-Effects-Interactions
            escrow.status = EscrowStatus.Refunded;
            escrow.releasedAmount = escrow.totalAmount;
            
            if (refundAmount > 0) {
                (bool success1, ) = escrow.buyer.call{value: refundAmount}("");
                require(success1, "Refund failed");
            }
            
            if (sellerAmount > 0) {
                (bool success2, ) = escrow.seller.call{value: sellerAmount}("");
                require(success2, "Seller payment failed");
            }
            
            emit DisputeResolved(orderId, escrow.buyer, refundAmount);
        } else {
            // 释放给卖家
            escrow.status = EscrowStatus.Completed;
            escrow.releasedAmount = escrow.totalAmount;
            
            (bool success, ) = escrow.seller.call{value: remainingAmount}("");
            require(success, "Payment failed");
            
            emit DisputeResolved(orderId, escrow.seller, 0);
        }
    }
    
    /**
     * @notice 超时退款（超过交付期限）
     * @param orderId 订单ID
     */
    function refundDueToTimeout(bytes32 orderId) external nonReentrant {
        Escrow storage escrow = escrows[orderId];
        
        require(escrow.status == EscrowStatus.Locked, "Invalid status");
        require(
            block.timestamp > escrow.deliveryDeadline,
            "Deadline not reached"
        );
        
        uint256 refundAmount = escrow.totalAmount - escrow.releasedAmount;
        
        // ✅ Check-Effects-Interactions
        escrow.status = EscrowStatus.Refunded;
        escrow.releasedAmount = escrow.totalAmount;
        
        (bool success, ) = escrow.buyer.call{value: refundAmount}("");
        require(success, "Refund failed");
        
        emit RefundProcessed(orderId, refundAmount, "timeout");
    }
    
    /**
     * @notice 取消订单退款（买家取消）
     * @param orderId 订单ID
     */
    function cancelOrder(bytes32 orderId) external nonReentrant {
        Escrow storage escrow = escrows[orderId];
        
        require(msg.sender == escrow.buyer, "Only buyer can cancel");
        require(escrow.status == EscrowStatus.Locked, "Cannot cancel now");
        
        uint256 refundAmount = escrow.totalAmount - escrow.releasedAmount;
        
        // ✅ Check-Effects-Interactions
        escrow.status = EscrowStatus.Refunded;
        escrow.releasedAmount = escrow.totalAmount;
        
        (bool success, ) = escrow.buyer.call{value: refundAmount}("");
        require(success, "Refund failed");
        
        emit RefundProcessed(orderId, refundAmount, "cancelled");
    }
    
    /**
     * @notice 查询托管信息
     */
    function getEscrowInfo(bytes32 orderId) 
        external 
        view 
        returns (Escrow memory) 
    {
        return escrows[orderId];
    }
    
    /**
     * @notice 更新平台地址
     */
    function updatePlatformAddress(address newAddress) external onlyOwner {
        require(newAddress != address(0), "Invalid address");
        platformAddress = newAddress;
    }
    
    /**
     * @notice 紧急暂停
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice 恢复运行
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @notice 紧急提取（仅在合约暂停时）
     */
    function emergencyWithdraw(bytes32 orderId) external onlyOwner whenPaused {
        Escrow storage escrow = escrows[orderId];
        uint256 remainingAmount = escrow.totalAmount - escrow.releasedAmount;
        
        require(remainingAmount > 0, "No funds to withdraw");
        
        escrow.releasedAmount = escrow.totalAmount;
        
        (bool success, ) = owner().call{value: remainingAmount}("");
        require(success, "Withdraw failed");
    }
}

