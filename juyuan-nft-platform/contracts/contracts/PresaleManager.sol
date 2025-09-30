// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PresaleManager
 * @dev 预售管理合约，支持多币种支付和白名单
 */
contract PresaleManager is Ownable, Pausable, ReentrancyGuard {
    
    // 预售配置结构
    struct PresaleConfig {
        uint256 presaleId;          // 预售ID
        uint256 startTime;          // 开始时间
        uint256 endTime;            // 结束时间
        uint256 minPurchase;        // 最小购买量
        uint256 maxPurchase;        // 最大购买量
        uint256 totalSupply;        // 总供应量
        uint256 soldAmount;         // 已售数量
        uint256 priceInWei;         // ETH价格
        address paymentToken;       // 支付代币地址（0x0表示ETH）
        bool whitelistEnabled;      // 是否启用白名单
        bool active;                // 是否激活
        string productType;         // 产品类型
    }
    
    // 用户购买记录结构
    struct PurchaseRecord {
        address buyer;              // 购买者
        uint256 amount;             // 购买数量
        uint256 paidAmount;         // 支付金额
        address paymentToken;       // 支付代币
        uint256 timestamp;          // 购买时间
        bool refunded;              // 是否已退款
    }
    
    // 预售映射
    mapping(uint256 => PresaleConfig) public presales;
    mapping(uint256 => mapping(address => uint256)) public userPurchases;
    mapping(uint256 => mapping(address => bool)) public whitelist;
    mapping(uint256 => PurchaseRecord[]) public purchaseHistory;
    
    uint256 private _presaleIdCounter;
    
    // 支持的支付代币
    mapping(address => bool) public supportedTokens;
    
    // 事件
    event PresaleCreated(uint256 indexed presaleId, string productType, uint256 totalSupply, uint256 price);
    event Purchase(uint256 indexed presaleId, address indexed buyer, uint256 amount, uint256 paidAmount);
    event Refund(uint256 indexed presaleId, address indexed buyer, uint256 amount);
    event WhitelistUpdated(uint256 indexed presaleId, address indexed user, bool status);
    event PresaleStatusChanged(uint256 indexed presaleId, bool active);
    
    constructor() {
        // ETH默认支持
        supportedTokens[address(0)] = true;
    }
    
    /**
     * @dev 创建新的预售
     */
    function createPresale(
        uint256 startTime,
        uint256 endTime,
        uint256 minPurchase,
        uint256 maxPurchase,
        uint256 totalSupply,
        uint256 priceInWei,
        address paymentToken,
        bool whitelistEnabled,
        string memory productType
    ) external onlyOwner returns (uint256) {
        require(startTime < endTime, "Invalid time range");
        require(minPurchase > 0 && minPurchase <= maxPurchase, "Invalid purchase limits");
        require(totalSupply > 0, "Invalid total supply");
        require(priceInWei > 0, "Invalid price");
        require(supportedTokens[paymentToken], "Payment token not supported");
        
        uint256 presaleId = _presaleIdCounter++;
        
        presales[presaleId] = PresaleConfig({
            presaleId: presaleId,
            startTime: startTime,
            endTime: endTime,
            minPurchase: minPurchase,
            maxPurchase: maxPurchase,
            totalSupply: totalSupply,
            soldAmount: 0,
            priceInWei: priceInWei,
            paymentToken: paymentToken,
            whitelistEnabled: whitelistEnabled,
            active: true,
            productType: productType
        });
        
        emit PresaleCreated(presaleId, productType, totalSupply, priceInWei);
        
        return presaleId;
    }
    
    /**
     * @dev 购买NFT
     */
    function purchase(uint256 presaleId, uint256 amount) external payable nonReentrant whenNotPaused {
        PresaleConfig storage presale = presales[presaleId];
        
        require(presale.active, "Presale not active");
        require(block.timestamp >= presale.startTime, "Presale not started");
        require(block.timestamp <= presale.endTime, "Presale ended");
        require(amount >= presale.minPurchase, "Below minimum purchase");
        require(amount <= presale.maxPurchase, "Exceeds maximum purchase");
        require(presale.soldAmount + amount <= presale.totalSupply, "Exceeds total supply");
        
        if (presale.whitelistEnabled) {
            require(whitelist[presaleId][msg.sender], "Not whitelisted");
        }
        
        uint256 totalCost = amount * presale.priceInWei;
        
        // 处理支付
        if (presale.paymentToken == address(0)) {
            // ETH支付
            require(msg.value >= totalCost, "Insufficient ETH");
            
            // 退还多余的ETH
            if (msg.value > totalCost) {
                payable(msg.sender).transfer(msg.value - totalCost);
            }
        } else {
            // ERC20代币支付
            require(msg.value == 0, "Do not send ETH");
            IERC20 token = IERC20(presale.paymentToken);
            require(
                token.transferFrom(msg.sender, address(this), totalCost),
                "Token transfer failed"
            );
        }
        
        // 更新购买记录
        presale.soldAmount += amount;
        userPurchases[presaleId][msg.sender] += amount;
        
        purchaseHistory[presaleId].push(PurchaseRecord({
            buyer: msg.sender,
            amount: amount,
            paidAmount: totalCost,
            paymentToken: presale.paymentToken,
            timestamp: block.timestamp,
            refunded: false
        }));
        
        emit Purchase(presaleId, msg.sender, amount, totalCost);
    }
    
    /**
     * @dev 批量添加白名单
     */
    function addToWhitelist(uint256 presaleId, address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[presaleId][users[i]] = true;
            emit WhitelistUpdated(presaleId, users[i], true);
        }
    }
    
    /**
     * @dev 批量移除白名单
     */
    function removeFromWhitelist(uint256 presaleId, address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[presaleId][users[i]] = false;
            emit WhitelistUpdated(presaleId, users[i], false);
        }
    }
    
    /**
     * @dev 退款（仅当预售失败时）
     */
    function refund(uint256 presaleId) external nonReentrant {
        PresaleConfig storage presale = presales[presaleId];
        
        require(!presale.active || block.timestamp > presale.endTime, "Presale still active");
        require(presale.soldAmount < presale.totalSupply / 2, "Presale not failed");
        
        uint256 purchasedAmount = userPurchases[presaleId][msg.sender];
        require(purchasedAmount > 0, "No purchase found");
        
        uint256 refundAmount = purchasedAmount * presale.priceInWei;
        
        // 清除购买记录
        userPurchases[presaleId][msg.sender] = 0;
        
        // 处理退款
        if (presale.paymentToken == address(0)) {
            payable(msg.sender).transfer(refundAmount);
        } else {
            IERC20 token = IERC20(presale.paymentToken);
            require(token.transfer(msg.sender, refundAmount), "Token transfer failed");
        }
        
        emit Refund(presaleId, msg.sender, purchasedAmount);
    }
    
    /**
     * @dev 更新预售状态
     */
    function setPresaleStatus(uint256 presaleId, bool active) external onlyOwner {
        presales[presaleId].active = active;
        emit PresaleStatusChanged(presaleId, active);
    }
    
    /**
     * @dev 添加支持的支付代币
     */
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }
    
    /**
     * @dev 移除支持的支付代币
     */
    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
    }
    
    /**
     * @dev 提取资金
     */
    function withdraw(address token) external onlyOwner {
        if (token == address(0)) {
            // 提取ETH
            uint256 balance = address(this).balance;
            require(balance > 0, "No balance");
            payable(owner()).transfer(balance);
        } else {
            // 提取ERC20代币
            IERC20 tokenContract = IERC20(token);
            uint256 balance = tokenContract.balanceOf(address(this));
            require(balance > 0, "No balance");
            require(tokenContract.transfer(owner(), balance), "Transfer failed");
        }
    }
    
    /**
     * @dev 获取预售信息
     */
    function getPresaleInfo(uint256 presaleId) external view returns (PresaleConfig memory) {
        return presales[presaleId];
    }
    
    /**
     * @dev 获取用户购买量
     */
    function getUserPurchase(uint256 presaleId, address user) external view returns (uint256) {
        return userPurchases[presaleId][user];
    }
    
    /**
     * @dev 检查是否在白名单中
     */
    function isWhitelisted(uint256 presaleId, address user) external view returns (bool) {
        return whitelist[presaleId][user];
    }
    
    /**
     * @dev 获取购买历史
     */
    function getPurchaseHistory(uint256 presaleId) external view returns (PurchaseRecord[] memory) {
        return purchaseHistory[presaleId];
    }
    
    /**
     * @dev 暂停合约
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev 恢复合约
     */
    function unpause() external onlyOwner {
        _unpause();
    }
} 