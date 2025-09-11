// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DragonEggLycheeNFT
 * @dev 钜园农业恐龙蛋荔枝NFT预售智能合约
 * @author 钜园农业团队
 */
contract DragonEggLycheeNFT is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // 荔枝批次信息
    struct LycheeBatch {
        uint256 batchId;
        string origin;           // 产地
        uint256 harvestDate;     // 收获日期
        uint256 totalQuantity;   // 总数量(kg)
        uint256 soldQuantity;    // 已售数量(kg)
        uint256 pricePerKg;      // 每公斤价格(wei)
        address farmer;          // 农户地址
        bool isActive;           // 是否激活
        string ipfsHash;         // IPFS存储哈希
        string quality;          // 质量等级
        string variety;          // 品种
    }
    
    // 用户订单信息
    struct UserOrder {
        uint256 orderId;
        address buyer;
        uint256 batchId;
        uint256 quantity;        // 购买数量(kg)
        uint256 totalPrice;      // 总价格(wei)
        uint256 orderTime;       // 订单时间
        bool isDelivered;        // 是否已交付
        string trackingNumber;   // 物流单号
        string status;           // 订单状态
    }
    
    // 农户信息
    struct Farmer {
        address farmerAddress;
        string name;
        string certification;
        bool isVerified;
        uint256 totalSales;      // 总销售额
    }
    
    // 状态变量
    mapping(uint256 => LycheeBatch) public batches;
    mapping(uint256 => UserOrder) public orders;
    mapping(address => uint256[]) public userOrders;
    mapping(address => Farmer) public farmers;
    mapping(address => bool) public authorizedCallers;
    
    Counters.Counter private _batchIdCounter;
    Counters.Counter private _orderIdCounter;
    
    uint256 public platformFee = 250; // 2.5% 平台手续费
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // 事件定义
    event BatchCreated(
        uint256 indexed batchId, 
        string origin, 
        uint256 quantity, 
        uint256 price,
        address farmer
    );
    
    event OrderPlaced(
        uint256 indexed orderId, 
        address indexed buyer, 
        uint256 batchId,
        uint256 quantity,
        uint256 totalPrice
    );
    
    event OrderDelivered(
        uint256 indexed orderId, 
        string trackingNumber
    );
    
    event FarmerRegistered(
        address indexed farmerAddress,
        string name,
        string certification
    );
    
    event ProfitDistributed(
        uint256 amount,
        uint256 platformShare,
        uint256 farmerShare
    );
    
    // 修饰符
    modifier onlyAuthorized() {
        require(authorizedCallers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    modifier batchExists(uint256 _batchId) {
        require(batches[_batchId].batchId != 0, "Batch does not exist");
        _;
    }
    
    modifier orderExists(uint256 _orderId) {
        require(orders[_orderId].orderId != 0, "Order does not exist");
        _;
    }
    
    constructor() ERC721("DragonEggLychee", "DEL") {}
    
    /**
     * @dev 注册农户
     * @param _farmerAddress 农户地址
     * @param _name 农户姓名
     * @param _certification 认证信息
     */
    function registerFarmer(
        address _farmerAddress,
        string memory _name,
        string memory _certification
    ) external onlyOwner {
        farmers[_farmerAddress] = Farmer({
            farmerAddress: _farmerAddress,
            name: _name,
            certification: _certification,
            isVerified: true,
            totalSales: 0
        });
        
        emit FarmerRegistered(_farmerAddress, _name, _certification);
    }
    
    /**
     * @dev 创建荔枝批次
     * @param _origin 产地
     * @param _harvestDate 收获日期
     * @param _totalQuantity 总数量(kg)
     * @param _pricePerKg 每公斤价格(wei)
     * @param _farmer 农户地址
     * @param _ipfsHash IPFS存储哈希
     * @param _quality 质量等级
     * @param _variety 品种
     */
    function createBatch(
        string memory _origin,
        uint256 _harvestDate,
        uint256 _totalQuantity,
        uint256 _pricePerKg,
        address _farmer,
        string memory _ipfsHash,
        string memory _quality,
        string memory _variety
    ) external onlyAuthorized {
        require(farmers[_farmer].isVerified, "Farmer not verified");
        require(_totalQuantity > 0, "Quantity must be positive");
        require(_pricePerKg > 0, "Price must be positive");
        
        _batchIdCounter.increment();
        uint256 batchId = _batchIdCounter.current();
        
        batches[batchId] = LycheeBatch({
            batchId: batchId,
            origin: _origin,
            harvestDate: _harvestDate,
            totalQuantity: _totalQuantity,
            soldQuantity: 0,
            pricePerKg: _pricePerKg,
            farmer: _farmer,
            isActive: true,
            ipfsHash: _ipfsHash,
            quality: _quality,
            variety: _variety
        });
        
        emit BatchCreated(batchId, _origin, _totalQuantity, _pricePerKg, _farmer);
    }
    
    /**
     * @dev 购买荔枝NFT
     * @param _batchId 批次ID
     * @param _quantity 购买数量(kg)
     */
    function purchaseLychee(
        uint256 _batchId,
        uint256 _quantity
    ) external payable nonReentrant batchExists(_batchId) {
        LycheeBatch storage batch = batches[_batchId];
        
        require(batch.isActive, "Batch not active");
        require(_quantity > 0, "Quantity must be positive");
        require(batch.soldQuantity + _quantity <= batch.totalQuantity, "Insufficient quantity");
        
        uint256 totalPrice = _quantity * batch.pricePerKg;
        uint256 fee = (totalPrice * platformFee) / FEE_DENOMINATOR;
        uint256 farmerPrice = totalPrice - fee;
        
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // 更新批次信息
        batch.soldQuantity += _quantity;
        
        // 创建订单
        _orderIdCounter.increment();
        uint256 orderId = _orderIdCounter.current();
        
        orders[orderId] = UserOrder({
            orderId: orderId,
            buyer: msg.sender,
            batchId: _batchId,
            quantity: _quantity,
            totalPrice: totalPrice,
            orderTime: block.timestamp,
            isDelivered: false,
            trackingNumber: "",
            status: "confirmed"
        });
        
        userOrders[msg.sender].push(orderId);
        
        // 铸造NFT
        _safeMint(msg.sender, orderId);
        
        // 转账给农户
        payable(batch.farmer).transfer(farmerPrice);
        
        // 更新农户销售记录
        farmers[batch.farmer].totalSales += farmerPrice;
        
        emit OrderPlaced(orderId, msg.sender, _batchId, _quantity, totalPrice);
        
        // 退款多余金额
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
    }
    
    /**
     * @dev 确认交付
     * @param _orderId 订单ID
     * @param _trackingNumber 物流单号
     */
    function confirmDelivery(
        uint256 _orderId,
        string memory _trackingNumber
    ) external onlyAuthorized orderExists(_orderId) {
        UserOrder storage order = orders[_orderId];
        
        require(!order.isDelivered, "Already delivered");
        
        order.isDelivered = true;
        order.trackingNumber = _trackingNumber;
        order.status = "delivered";
        
        emit OrderDelivered(_orderId, _trackingNumber);
    }
    
    /**
     * @dev 分发平台收益
     */
    function distributeProfits() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No profits to distribute");
        
        // 50%给平台，50%给代币持有者
        uint256 platformShare = balance / 2;
        uint256 tokenHolderShare = balance - platformShare;
        
        // 转账给平台
        payable(owner()).transfer(platformShare);
        
        // TODO: 实现代币持有者分红逻辑
        
        emit ProfitDistributed(balance, platformShare, tokenHolderShare);
    }
    
    /**
     * @dev 设置平台手续费
     * @param _fee 手续费比例(基点)
     */
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high"); // 最大10%
        platformFee = _fee;
    }
    
    /**
     * @dev 设置授权调用者
     * @param _caller 调用者地址
     * @param _authorized 是否授权
     */
    function setAuthorizedCaller(address _caller, bool _authorized) external onlyOwner {
        authorizedCallers[_caller] = _authorized;
    }
    
    /**
     * @dev 暂停/恢复批次
     * @param _batchId 批次ID
     * @param _active 是否激活
     */
    function setBatchActive(uint256 _batchId, bool _active) external onlyOwner batchExists(_batchId) {
        batches[_batchId].isActive = _active;
    }
    
    /**
     * @dev 获取用户订单
     * @param _user 用户地址
     * @return 订单ID数组
     */
    function getUserOrders(address _user) external view returns (uint256[] memory) {
        return userOrders[_user];
    }
    
    /**
     * @dev 获取批次信息
     * @param _batchId 批次ID
     * @return 批次信息
     */
    function getBatchInfo(uint256 _batchId) external view batchExists(_batchId) returns (LycheeBatch memory) {
        return batches[_batchId];
    }
    
    /**
     * @dev 获取订单信息
     * @param _orderId 订单ID
     * @return 订单信息
     */
    function getOrderInfo(uint256 _orderId) external view orderExists(_orderId) returns (UserOrder memory) {
        return orders[_orderId];
    }
    
    /**
     * @dev 获取农户信息
     * @param _farmer 农户地址
     * @return 农户信息
     */
    function getFarmerInfo(address _farmer) external view returns (Farmer memory) {
        return farmers[_farmer];
    }
    
    /**
     * @dev 获取当前批次ID
     * @return 当前批次ID
     */
    function getCurrentBatchId() external view returns (uint256) {
        return _batchIdCounter.current();
    }
    
    /**
     * @dev 获取当前订单ID
     * @return 当前订单ID
     */
    function getCurrentOrderId() external view returns (uint256) {
        return _orderIdCounter.current();
    }
    
    /**
     * @dev 获取平台余额
     * @return 平台余额
     */
    function getPlatformBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev 紧急暂停合约
     */
    function emergencyPause() external onlyOwner {
        // 暂停所有非必要功能
        for (uint256 i = 1; i <= _batchIdCounter.current(); i++) {
            if (batches[i].batchId != 0) {
                batches[i].isActive = false;
            }
        }
    }
    
    /**
     * @dev 提取紧急资金
     * @param _amount 提取金额
     */
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(_amount);
    }
}
