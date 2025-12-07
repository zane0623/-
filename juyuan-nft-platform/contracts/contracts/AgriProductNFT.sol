// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AgriProductNFT
 * @dev 钜园农业农产品NFT合约
 * @notice 代表实物农产品的NFT，支持批量铸造和元数据管理
 */
contract AgriProductNFT is ERC721, ERC721URIStorage, Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // 农产品元数据结构
    struct ProductMetadata {
        uint256 tokenId;           // NFT ID
        string productType;        // 产品类型（荔枝、龙眼、芒果等）
        uint256 quantity;          // 数量（克）
        string qualityGrade;       // 质量等级
        uint256 harvestDate;       // 收获日期（时间戳）
        string originBase;         // 生产基地
        string ipfsHash;           // IPFS元数据哈希
        bool delivered;            // 是否已交付
        address originalOwner;     // 原始购买者
        uint256 mintTimestamp;     // 铸造时间
    }
    
    // 预售批次结构
    struct PresaleBatch {
        uint256 batchId;           // 批次ID
        uint256 maxSupply;         // 最大供应量
        uint256 currentSupply;     // 当前供应量
        uint256 price;             // 价格（wei）
        uint256 startTime;         // 开始时间
        uint256 endTime;           // 结束时间
        bool active;               // 是否激活
        string productType;        // 产品类型
    }
    
    // 存储映射
    mapping(uint256 => ProductMetadata) public productMetadata;
    mapping(uint256 => PresaleBatch) public presaleBatches;
    mapping(address => uint256[]) private userTokens;
    
    Counters.Counter private _batchIdCounter;
    
    // 事件
    event NFTMinted(uint256 indexed tokenId, address indexed to, string productType, uint256 quantity);
    event ProductDelivered(uint256 indexed tokenId, address indexed owner);
    event BatchCreated(uint256 indexed batchId, string productType, uint256 maxSupply, uint256 price);
    event BatchPurchase(uint256 indexed batchId, address indexed buyer, uint256 amount);
    
    constructor() ERC721("JuyuanAgriProductNFT", "JANFT") {}
    
    /**
     * @dev 铸造单个NFT
     */
    function mintNFT(
        address to,
        string memory productType,
        uint256 quantity,
        string memory qualityGrade,
        uint256 harvestDate,
        string memory originBase,
        string memory ipfsHash
    ) public onlyOwner whenNotPaused returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsHash);
        
        productMetadata[tokenId] = ProductMetadata({
            tokenId: tokenId,
            productType: productType,
            quantity: quantity,
            qualityGrade: qualityGrade,
            harvestDate: harvestDate,
            originBase: originBase,
            ipfsHash: ipfsHash,
            delivered: false,
            originalOwner: to,
            mintTimestamp: block.timestamp
        });
        
        userTokens[to].push(tokenId);
        
        emit NFTMinted(tokenId, to, productType, quantity);
        
        return tokenId;
    }
    
    /**
     * @dev 批量铸造NFT
     */
    function batchMintNFT(
        address[] memory recipients,
        string memory productType,
        uint256 quantity,
        string memory qualityGrade,
        uint256 harvestDate,
        string memory originBase,
        string memory ipfsHash
    ) public onlyOwner whenNotPaused returns (uint256[] memory) {
        require(recipients.length > 0 && recipients.length <= 100, "Invalid batch size");
        
        uint256[] memory tokenIds = new uint256[](recipients.length);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            tokenIds[i] = mintNFT(
                recipients[i],
                productType,
                quantity,
                qualityGrade,
                harvestDate,
                originBase,
                ipfsHash
            );
        }
        
        return tokenIds;
    }
    
    /**
     * @dev 创建预售批次
     */
    function createPresaleBatch(
        uint256 maxSupply,
        uint256 price,
        uint256 startTime,
        uint256 endTime,
        string memory productType
    ) public onlyOwner returns (uint256) {
        require(maxSupply > 0 && maxSupply <= 1000, "Invalid max supply");
        require(startTime < endTime, "Invalid time range");
        require(price > 0, "Invalid price");
        
        uint256 batchId = _batchIdCounter.current();
        _batchIdCounter.increment();
        
        presaleBatches[batchId] = PresaleBatch({
            batchId: batchId,
            maxSupply: maxSupply,
            currentSupply: 0,
            price: price,
            startTime: startTime,
            endTime: endTime,
            active: true,
            productType: productType
        });
        
        emit BatchCreated(batchId, productType, maxSupply, price);
        
        return batchId;
    }
    
    /**
     * @dev 从批次购买NFT
     */
    function purchaseFromBatch(
        uint256 batchId,
        uint256 amount
    ) public payable nonReentrant whenNotPaused {
        PresaleBatch storage batch = presaleBatches[batchId];
        
        require(batch.active, "Batch not active");
        require(block.timestamp >= batch.startTime && block.timestamp <= batch.endTime, "Not in sale period");
        require(batch.currentSupply + amount <= batch.maxSupply, "Exceeds max supply");
        require(msg.value >= batch.price * amount, "Insufficient payment");
        
        batch.currentSupply += amount;
        
        // 暂时不铸造NFT，仅记录购买
        // 实际铸造在收获后由管理员执行
        
        emit BatchPurchase(batchId, msg.sender, amount);
    }
    
    /**
     * @dev 标记产品已交付
     */
    function markAsDelivered(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        productMetadata[tokenId].delivered = true;
        emit ProductDelivered(tokenId, ownerOf(tokenId));
    }
    
    /**
     * @dev 获取用户所有的NFT
     */
    function getUserTokens(address user) public view returns (uint256[] memory) {
        return userTokens[user];
    }
    
    /**
     * @dev 获取NFT元数据
     */
    function getMetadata(uint256 tokenId) public view returns (ProductMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return productMetadata[tokenId];
    }
    
    /**
     * @dev 暂停合约
     */
    function pause() public onlyOwner {
        _pause();
    }
    
    /**
     * @dev 恢复合约
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    
    /**
     * @dev 提取合约余额
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev 获取用户所有的NFT (别名)
     */
    function getUserNFTs(address user) public view returns (uint256[] memory) {
        return userTokens[user];
    }

    /**
     * @dev 接收ETH
     */
    receive() external payable {}
    
    // The following functions are overrides required by Solidity.
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 