# 钜园农业恐龙蛋荔枝NFT预售平台实现方案

## 项目概述

### 项目背景
钜园农业控股有限公司是一家新加坡企业，在广东、广西、福建拥有大型农业生产基地。公司计划将特色产品"恐龙蛋荔枝"通过NFT/RWA（实物资产代币化）的方式进行预售，结合区块链技术实现透明化、可追溯的高端农产品预售服务。

### 项目目标
基于钜园农业恐龙蛋荔枝NFT预售平台需求文档和产品设计文档，制定详细的技术实现方案和项目执行计划，确保项目能够按时、按质完成。

### 实现范围
- 微信小程序端（买家端）
- 管理后台（中介端）
- 生产基地端（卖家端）
- 区块链智能合约
- 合规管理系统
- 数据同步系统

### 核心价值实现
- **为全球消费者**: 提供高品质、可追溯的恐龙蛋荔枝，获得NFT收藏价值和投资机会
- **为钜园农业**: 提前锁定销售，获得资金支持，扩大全球品牌影响力
- **为生产基地**: 降低市场风险，改善现金流，建立稳定的销售渠道

## 技术架构设计

### 1. 整体技术架构
```
┌─────────────────────────────────────────────────────────────┐
│                        前端层                                │
├─────────────────┬─────────────────┬─────────────────────────┤
│   微信小程序    │   管理后台      │   生产基地端            │
│   (买家端)      │   (中介端)      │   (卖家端)              │
│   - 原生小程序  │   - Vue.js 3.0  │   - H5/React Native     │
│   - Web3集成    │   - Element Plus│   - 移动端优化          │
└─────────────────┴─────────────────┴─────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        API网关层                            │
├─────────────────────────────────────────────────────────────┤
│   - 统一API入口  - 身份认证  - 权限控制  - 限流熔断        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        业务服务层                           │
├─────────────────┬─────────────────┬─────────────────────────┤
│   用户服务      │   商品服务      │   订单服务              │
│   - 用户管理    │   - NFT管理     │   - 订单管理            │
│   - 认证授权    │   - 商品管理    │   - 支付管理            │
│   - KYC/AML     │   - 库存管理    │   - 物流管理            │
├─────────────────┼─────────────────┼─────────────────────────┤
│   区块链服务    │   合规服务      │   消息服务              │
│   - 智能合约    │   - 合规审核    │   - 通知推送            │
│   - 钱包集成    │   - 风险监控    │   - 邮件短信            │
│   - 交易处理    │   - 报告生成    │   - 模板消息            │
└─────────────────┴─────────────────┴─────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        数据层                               │
├─────────────────┬─────────────────┬─────────────────────────┤
│   关系数据库    │   缓存数据库    │   区块链网络            │
│   - MySQL 8.0   │   - Redis 7.0   │   - 以太坊主网          │
│   - 主从复制    │   - 集群部署    │   - Polygon              │
│   - 读写分离    │   - 持久化      │   - Arbitrum             │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### 2. 区块链架构设计
```
┌─────────────────────────────────────────────────────────────┐
│                        区块链层                             │
├─────────────────┬─────────────────┬─────────────────────────┤
│   智能合约      │   前端集成      │   后端服务              │
│   - NFT合约     │   - Web3.js     │   - 事件监听            │
│   - 预售合约    │   - WalletConnect│   - 数据同步            │
│   - 治理合约    │   - MetaMask    │   - 状态更新            │
└─────────────────┴─────────────────┴─────────────────────────┘
```

## 详细技术实现

### 1. 智能合约开发

#### 1.1 NFT合约 (ERC-721)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract JuyuanLycheeNFT is ERC721, Ownable, ReentrancyGuard {
    struct LycheeInfo {
        uint256 tokenId;
        string origin;           // 产地
        uint256 harvestDate;     // 收获日期
        uint256 quantity;        // 数量(kg)
        uint256 price;           // 价格(wei)
        address farmer;          // 农户地址
        bool isDelivered;        // 是否已交付
        string ipfsHash;         // IPFS存储哈希
        string quality;          // 质量等级
    }
    
    mapping(uint256 => LycheeInfo) public lycheeInfo;
    mapping(address => uint256[]) public userTokens;
    
    uint256 public nextTokenId = 1;
    uint256 public maxSupply = 1000;
    uint256 public presalePrice = 0.5 ether;
    
    event NFTMinted(uint256 indexed tokenId, address indexed owner, string origin);
    event DeliveryConfirmed(uint256 indexed tokenId, string trackingNumber);
    
    constructor() ERC721("Juyuan Lychee NFT", "JLN") {}
    
    function mintNFT(
        address to,
        string memory origin,
        uint256 harvestDate,
        uint256 quantity,
        string memory ipfsHash,
        string memory quality
    ) external onlyOwner {
        require(nextTokenId <= maxSupply, "Max supply reached");
        
        uint256 tokenId = nextTokenId++;
        lycheeInfo[tokenId] = LycheeInfo({
            tokenId: tokenId,
            origin: origin,
            harvestDate: harvestDate,
            quantity: quantity,
            price: presalePrice,
            farmer: to,
            isDelivered: false,
            ipfsHash: ipfsHash,
            quality: quality
        });
        
        _safeMint(to, tokenId);
        userTokens[to].push(tokenId);
        
        emit NFTMinted(tokenId, to, origin);
    }
    
    function confirmDelivery(uint256 tokenId, string memory trackingNumber) 
        external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        lycheeInfo[tokenId].isDelivered = true;
        emit DeliveryConfirmed(tokenId, trackingNumber);
    }
    
    function getUserTokens(address user) external view returns (uint256[] memory) {
        return userTokens[user];
    }
}
```

#### 1.2 预售合约
```solidity
contract LycheePresale is ReentrancyGuard, Ownable {
    struct PresaleInfo {
        uint256 presaleId;
        uint256 totalSupply;
        uint256 soldAmount;
        uint256 price;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        address nftContract;
    }
    
    mapping(uint256 => PresaleInfo) public presales;
    mapping(address => uint256) public userPurchases;
    
    uint256 public nextPresaleId = 1;
    uint256 public platformFee = 250; // 2.5%
    
    event PresaleCreated(uint256 indexed presaleId, uint256 totalSupply, uint256 price);
    event NFTPurchased(uint256 indexed presaleId, address indexed buyer, uint256 amount);
    
    function createPresale(
        uint256 totalSupply,
        uint256 price,
        uint256 startTime,
        uint256 endTime,
        address nftContract
    ) external onlyOwner {
        uint256 presaleId = nextPresaleId++;
        presales[presaleId] = PresaleInfo({
            presaleId: presaleId,
            totalSupply: totalSupply,
            soldAmount: 0,
            price: price,
            startTime: startTime,
            endTime: endTime,
            isActive: true,
            nftContract: nftContract
        });
        
        emit PresaleCreated(presaleId, totalSupply, price);
    }
    
    function purchaseNFT(uint256 presaleId) external payable nonReentrant {
        PresaleInfo storage presale = presales[presaleId];
        require(presale.isActive, "Presale not active");
        require(block.timestamp >= presale.startTime, "Presale not started");
        require(block.timestamp <= presale.endTime, "Presale ended");
        require(presale.soldAmount < presale.totalSupply, "Sold out");
        require(msg.value >= presale.price, "Insufficient payment");
        
        presale.soldAmount++;
        userPurchases[msg.sender]++;
        
        // 铸造NFT
        JuyuanLycheeNFT nft = JuyuanLycheeNFT(presale.nftContract);
        nft.mintNFT(msg.sender, "广东茂名", block.timestamp, 5, "", "A级");
        
        emit NFTPurchased(presaleId, msg.sender, presale.price);
        
        // 退款多余金额
        if (msg.value > presale.price) {
            payable(msg.sender).transfer(msg.value - presale.price);
        }
    }
}
```

### 2. 后端服务开发

#### 2.1 项目结构
```
backend/
├── src/
│   ├── controllers/          # 控制器
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── nftController.js
│   │   ├── orderController.js
│   │   └── complianceController.js
│   ├── services/            # 业务逻辑
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── nftService.js
│   │   ├── orderService.js
│   │   ├── blockchainService.js
│   │   └── complianceService.js
│   ├── models/              # 数据模型
│   │   ├── User.js
│   │   ├── NFT.js
│   │   ├── Order.js
│   │   └── Compliance.js
│   ├── middleware/          # 中间件
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   ├── utils/               # 工具函数
│   │   ├── blockchain.js
│   │   ├── encryption.js
│   │   ├── logger.js
│   │   └── email.js
│   ├── config/              # 配置文件
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── blockchain.js
│   │   └── email.js
│   └── routes/              # 路由
│       ├── auth.js
│       ├── users.js
│       ├── nfts.js
│       ├── orders.js
│       └── compliance.js
├── tests/                   # 测试文件
├── docs/                    # API文档
├── package.json
└── README.md
```

#### 2.2 核心服务实现

**用户服务 (userService.js)**
```javascript
const User = require('../models/User');
const Compliance = require('../models/Compliance');
const { encrypt, decrypt } = require('../utils/encryption');

class UserService {
    async createUser(userData) {
        // 创建用户
        const user = new User({
            ...userData,
            password: await encrypt(userData.password),
            kycStatus: 'pending'
        });
        
        await user.save();
        
        // 创建合规记录
        const compliance = new Compliance({
            userId: user._id,
            status: 'pending',
            documents: []
        });
        
        await compliance.save();
        
        return user;
    }
    
    async updateKYCStatus(userId, status, documents) {
        const compliance = await Compliance.findOne({ userId });
        compliance.status = status;
        compliance.documents = documents;
        compliance.updatedAt = new Date();
        
        await compliance.save();
        
        // 更新用户状态
        await User.findByIdAndUpdate(userId, { kycStatus: status });
        
        return compliance;
    }
    
    async getUserProfile(userId) {
        const user = await User.findById(userId).select('-password');
        const compliance = await Compliance.findOne({ userId });
        
        return {
            user,
            compliance
        };
    }
}

module.exports = new UserService();
```

**区块链服务 (blockchainService.js)**
```javascript
const Web3 = require('web3');
const { Contract } = require('ethers');
const NFT_ABI = require('../contracts/NFT_ABI.json');
const PRESALE_ABI = require('../contracts/PRESALE_ABI.json');

class BlockchainService {
    constructor() {
        this.web3 = new Web3(process.env.ETHEREUM_RPC_URL);
        this.nftContract = new this.web3.eth.Contract(NFT_ABI, process.env.NFT_CONTRACT_ADDRESS);
        this.presaleContract = new this.web3.eth.Contract(PRESALE_ABI, process.env.PRESALE_CONTRACT_ADDRESS);
    }
    
    async mintNFT(to, origin, harvestDate, quantity, ipfsHash, quality) {
        const accounts = await this.web3.eth.getAccounts();
        const account = accounts[0];
        
        const tx = await this.nftContract.methods.mintNFT(
            to,
            origin,
            harvestDate,
            quantity,
            ipfsHash,
            quality
        ).send({
            from: account,
            gas: 500000
        });
        
        return tx;
    }
    
    async createPresale(totalSupply, price, startTime, endTime) {
        const accounts = await this.web3.eth.getAccounts();
        const account = accounts[0];
        
        const tx = await this.presaleContract.methods.createPresale(
            totalSupply,
            price,
            startTime,
            endTime,
            process.env.NFT_CONTRACT_ADDRESS
        ).send({
            from: account,
            gas: 500000
        });
        
        return tx;
    }
    
    async listenToEvents() {
        // 监听NFT铸造事件
        this.nftContract.events.NFTMinted()
            .on('data', async (event) => {
                console.log('NFT Minted:', event.returnValues);
                // 更新数据库
                await this.updateNFTInDatabase(event.returnValues);
            });
        
        // 监听预售购买事件
        this.presaleContract.events.NFTPurchased()
            .on('data', async (event) => {
                console.log('NFT Purchased:', event.returnValues);
                // 更新订单状态
                await this.updateOrderStatus(event.returnValues);
            });
    }
    
    async updateNFTInDatabase(nftData) {
        // 更新数据库中的NFT信息
        const NFT = require('../models/NFT');
        const nft = new NFT({
            tokenId: nftData.tokenId,
            owner: nftData.owner,
            origin: nftData.origin,
            contractAddress: process.env.NFT_CONTRACT_ADDRESS,
            transactionHash: nftData.transactionHash
        });
        
        await nft.save();
    }
    
    async updateOrderStatus(purchaseData) {
        // 更新订单状态
        const Order = require('../models/Order');
        await Order.findOneAndUpdate(
            { presaleId: purchaseData.presaleId, buyer: purchaseData.buyer },
            { status: 'confirmed', transactionHash: purchaseData.transactionHash }
        );
    }
}

module.exports = new BlockchainService();
```

### 3. 前端开发

#### 3.1 微信小程序开发

**项目结构**
```
miniprogram/
├── pages/                   # 页面
│   ├── index/              # 首页
│   ├── nft-detail/         # NFT详情页
│   ├── wallet/             # 钱包页面
│   ├── profile/            # 个人中心
│   └── order/              # 订单页面
├── components/             # 组件
│   ├── nft-card/           # NFT卡片
│   ├── wallet-connect/     # 钱包连接
│   ├── countdown/          # 倒计时
│   └── loading/            # 加载组件
├── utils/                  # 工具函数
│   ├── web3.js             # Web3集成
│   ├── api.js              # API调用
│   ├── storage.js          # 本地存储
│   └── utils.js            # 通用工具
├── app.js                  # 小程序入口
├── app.json                # 小程序配置
└── app.wxss                # 全局样式
```

**Web3集成 (utils/web3.js)**
```javascript
import Web3 from 'web3';
import WalletConnect from '@walletconnect/web3-provider';

class Web3Service {
    constructor() {
        this.web3 = null;
        this.account = null;
        this.chainId = null;
    }
    
    async connectWallet() {
        try {
            // 检查是否安装了MetaMask
            if (typeof window.ethereum !== 'undefined') {
                this.web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                this.account = accounts[0];
                this.chainId = await window.ethereum.request({
                    method: 'eth_chainId'
                });
                return { success: true, account: this.account };
            } else {
                // 使用WalletConnect
                const provider = new WalletConnect({
                    rpc: {
                        1: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
                        137: 'https://polygon-rpc.com'
                    }
                });
                
                await provider.enable();
                this.web3 = new Web3(provider);
                this.account = provider.accounts[0];
                this.chainId = provider.chainId;
                
                return { success: true, account: this.account };
            }
        } catch (error) {
            console.error('Wallet connection failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async purchaseNFT(presaleId, price) {
        try {
            const presaleContract = new this.web3.eth.Contract(
                PRESALE_ABI,
                PRESALE_CONTRACT_ADDRESS
            );
            
            const tx = await presaleContract.methods.purchaseNFT(presaleId)
                .send({
                    from: this.account,
                    value: price,
                    gas: 500000
                });
            
            return { success: true, transactionHash: tx.transactionHash };
        } catch (error) {
            console.error('Purchase failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getUserNFTs() {
        try {
            const nftContract = new this.web3.eth.Contract(
                NFT_ABI,
                NFT_CONTRACT_ADDRESS
            );
            
            const tokenIds = await nftContract.methods.getUserTokens(this.account).call();
            const nfts = [];
            
            for (const tokenId of tokenIds) {
                const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
                const owner = await nftContract.methods.ownerOf(tokenId).call();
                
                nfts.push({
                    tokenId,
                    tokenURI,
                    owner
                });
            }
            
            return nfts;
        } catch (error) {
            console.error('Get NFTs failed:', error);
            return [];
        }
    }
}

export default new Web3Service();
```

#### 3.2 管理后台开发

**项目结构**
```
admin/
├── src/
│   ├── views/              # 页面
│   │   ├── dashboard/      # 仪表板
│   │   ├── nft/           # NFT管理
│   │   ├── users/         # 用户管理
│   │   ├── orders/        # 订单管理
│   │   └── compliance/    # 合规管理
│   ├── components/        # 组件
│   ├── api/              # API接口
│   ├── utils/            # 工具函数
│   └── router/           # 路由配置
├── public/
├── package.json
└── README.md
```

### 4. 数据库设计

#### 4.1 用户表 (users)
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42),
    phone VARCHAR(20),
    kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 4.2 NFT表 (nfts)
```sql
CREATE TABLE nfts (
    id VARCHAR(36) PRIMARY KEY,
    token_id INT UNIQUE NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    harvest_date DATE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    ipfs_hash VARCHAR(100),
    quality VARCHAR(20) NOT NULL,
    is_delivered BOOLEAN DEFAULT FALSE,
    transaction_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 4.3 订单表 (orders)
```sql
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nft_id VARCHAR(36) NOT NULL,
    presale_id INT NOT NULL,
    quantity INT NOT NULL,
    total_amount DECIMAL(20,8) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    transaction_hash VARCHAR(66),
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (nft_id) REFERENCES nfts(id)
);
```

#### 4.4 合规表 (compliance)
```sql
CREATE TABLE compliance (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    documents JSON,
    risk_score INT DEFAULT 0,
    review_notes TEXT,
    reviewed_by VARCHAR(36),
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 项目执行计划

### 1. 项目阶段划分

#### 第一阶段：基础架构搭建 (4周)
**第1-2周：环境搭建**
- [ ] 开发环境配置
- [ ] 数据库设计和搭建
- [ ] 基础项目结构创建
- [ ] CI/CD流水线搭建

**第3-4周：核心服务开发**
- [ ] 用户认证服务
- [ ] 基础API开发
- [ ] 数据库连接和ORM配置
- [ ] 基础中间件开发

#### 第二阶段：智能合约开发 (3周)
**第5-6周：合约开发**
- [ ] NFT合约开发
- [ ] 预售合约开发
- [ ] 合约测试
- [ ] 合约部署

**第7周：合约集成**
- [ ] 前端Web3集成
- [ ] 后端区块链服务
- [ ] 事件监听和同步
- [ ] 合约交互测试

#### 第三阶段：前端开发 (4周)
**第8-9周：微信小程序开发**
- [ ] 小程序基础框架
- [ ] 页面开发
- [ ] Web3钱包集成
- [ ] API集成

**第10-11周：管理后台开发**
- [ ] Vue.js项目搭建
- [ ] 页面开发
- [ ] 组件开发
- [ ] 功能集成

#### 第四阶段：合规系统开发 (2周)
**第12-13周：合规功能**
- [ ] KYC/AML系统
- [ ] 风险评估系统
- [ ] 合规报告系统
- [ ] 监管沟通系统

#### 第五阶段：测试和优化 (3周)
**第14-15周：系统测试**
- [ ] 单元测试
- [ ] 集成测试
- [ ] 端到端测试
- [ ] 性能测试

**第16周：优化和部署**
- [ ] 性能优化
- [ ] 安全加固
- [ ] 生产环境部署
- [ ] 监控告警配置

### 2. 团队配置

#### 核心团队 (8人)
- **项目经理** (1人) - 项目管理和协调
- **技术负责人** (1人) - 技术架构和开发
- **区块链开发** (2人) - 智能合约和Web3集成
- **后端开发** (2人) - API和业务逻辑
- **前端开发** (2人) - 小程序和管理后台
- **测试工程师** (1人) - 质量保证
- **DevOps工程师** (1人) - 部署和运维

#### 支持团队 (4人)
- **UI/UX设计师** (1人) - 界面设计
- **合规专家** (1人) - 合规咨询
- **产品经理** (1人) - 产品规划
- **运营专员** (1人) - 运营支持

### 3. 风险控制

#### 技术风险
- **智能合约风险**: 代码审计、多重签名、紧急暂停
- **系统性能风险**: 负载测试、性能优化、扩容方案
- **数据安全风险**: 加密存储、访问控制、备份恢复

#### 项目风险
- **进度风险**: 里程碑管理、缓冲时间、资源调配
- **质量风险**: 代码审查、自动化测试、持续集成
- **人员风险**: 知识共享、文档完善、团队备份

#### 合规风险
- **监管风险**: 合规咨询、定期审查、政策跟踪
- **法律风险**: 法律顾问、合同审查、风险预警
- **运营风险**: 合规培训、流程规范、监控告警

## 总结

本实现方案为钜园农业恐龙蛋荔枝NFT预售平台提供了详细的技术实现路径和项目执行计划。通过16周的开发周期，将构建一个功能完整、技术先进、合规可靠的高端农产品NFT预售平台。

**核心优势**：
1. **技术先进性** - 区块链+传统农业的完美结合
2. **合规可靠性** - 多国合规，安全运营
3. **用户体验** - 简洁易用，功能完善
4. **商业价值** - 三方共赢，可持续发展
5. **可扩展性** - 模块化设计，易于扩展

通过严格按照本方案执行，项目将能够按时、按质完成，为钜园农业的数字化转型和全球化发展提供强有力的技术支撑。
