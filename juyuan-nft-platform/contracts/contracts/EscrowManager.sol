// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title EscrowManager
 * @dev 托管合约，确保交付前资金安全
 */
contract EscrowManager is Ownable, ReentrancyGuard {
    
    enum EscrowStatus { Active, Completed, Refunded, Disputed }
    
    struct Escrow {
        uint256 escrowId;           // 托管ID
        address buyer;              // 买家
        address seller;             // 卖家
        uint256 amount;             // 托管金额
        uint256 nftTokenId;         // NFT Token ID
        EscrowStatus status;        // 状态
        uint256 deliveryDeadline;   // 交付截止日期
        uint256 createdAt;          // 创建时间
        address arbiter;            // 仲裁者
    }
    
    mapping(uint256 => Escrow) public escrows;
    uint256 private _escrowIdCounter;
    
    // 手续费（基点，100 = 1%）
    uint256 public platformFee = 250; // 2.5%
    address public feeCollector;
    
    event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount);
    event DeliveryConfirmed(uint256 indexed escrowId);
    event EscrowRefunded(uint256 indexed escrowId);
    event DisputeRaised(uint256 indexed escrowId);
    event DisputeResolved(uint256 indexed escrowId, bool buyerWins);
    
    constructor(address _feeCollector) {
        feeCollector = _feeCollector;
    }
    
    /**
     * @dev 创建托管
     */
    function createEscrow(
        address seller,
        uint256 nftTokenId,
        uint256 deliveryDeadline
    ) external payable returns (uint256) {
        require(msg.value > 0, "Invalid amount");
        require(seller != address(0), "Invalid seller");
        require(deliveryDeadline > block.timestamp, "Invalid deadline");
        
        uint256 escrowId = _escrowIdCounter++;
        
        escrows[escrowId] = Escrow({
            escrowId: escrowId,
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            nftTokenId: nftTokenId,
            status: EscrowStatus.Active,
            deliveryDeadline: deliveryDeadline,
            createdAt: block.timestamp,
            arbiter: owner()
        });
        
        emit EscrowCreated(escrowId, msg.sender, seller, msg.value);
        
        return escrowId;
    }
    
    /**
     * @dev 确认交付
     */
    function confirmDelivery(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        
        require(msg.sender == escrow.buyer, "Only buyer can confirm");
        require(escrow.status == EscrowStatus.Active, "Invalid status");
        
        _releaseToSeller(escrowId);
        
        emit DeliveryConfirmed(escrowId);
    }
    
    /**
     * @dev 自动释放（交付截止日期后7天）
     */
    function autoRelease(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        
        require(escrow.status == EscrowStatus.Active, "Invalid status");
        require(block.timestamp > escrow.deliveryDeadline + 7 days, "Too early");
        
        _releaseToSeller(escrowId);
    }
    
    /**
     * @dev 申请退款
     */
    function requestRefund(uint256 escrowId) external nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        
        require(msg.sender == escrow.buyer, "Only buyer can request");
        require(escrow.status == EscrowStatus.Active, "Invalid status");
        require(block.timestamp < escrow.deliveryDeadline, "Deadline passed");
        
        escrow.status = EscrowStatus.Disputed;
        emit DisputeRaised(escrowId);
    }
    
    /**
     * @dev 解决争议
     */
    function resolveDispute(uint256 escrowId, bool buyerWins) external onlyOwner nonReentrant {
        Escrow storage escrow = escrows[escrowId];
        
        require(escrow.status == EscrowStatus.Disputed, "Not in dispute");
        
        if (buyerWins) {
            _refundToBuyer(escrowId);
        } else {
            _releaseToSeller(escrowId);
        }
        
        emit DisputeResolved(escrowId, buyerWins);
    }
    
    /**
     * @dev 释放给卖家
     */
    function _releaseToSeller(uint256 escrowId) private {
        Escrow storage escrow = escrows[escrowId];
        
        uint256 fee = (escrow.amount * platformFee) / 10000;
        uint256 sellerAmount = escrow.amount - fee;
        
        escrow.status = EscrowStatus.Completed;
        
        payable(feeCollector).transfer(fee);
        payable(escrow.seller).transfer(sellerAmount);
    }
    
    /**
     * @dev 退款给买家
     */
    function _refundToBuyer(uint256 escrowId) private {
        Escrow storage escrow = escrows[escrowId];
        
        escrow.status = EscrowStatus.Refunded;
        
        payable(escrow.buyer).transfer(escrow.amount);
        
        emit EscrowRefunded(escrowId);
    }
    
    /**
     * @dev 更新手续费
     */
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee too high"); // 最多5%
        platformFee = newFee;
    }
    
    /**
     * @dev 更新手续费收集者
     */
    function updateFeeCollector(address newCollector) external onlyOwner {
        require(newCollector != address(0), "Invalid address");
        feeCollector = newCollector;
    }
} 