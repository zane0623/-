# 钜园农业农产品NFT预售平台
## 功能实施计划 (FIP - Functional Implementation Plan)

**版本：** 1.0  
**日期：** 2025年9月  
**文档负责人：** 技术团队  
**状态：** 待审批  

---

## 文档概述

### 目的
本功能实施计划(FIP)将产品需求文档(PRD)中定义的功能需求转化为详细的技术实施方案，为开发团队提供明确的实施指导。

### 适用范围
- 开发团队：前端、后端、区块链、移动端
- 测试团队：质量保证和测试工程师
- 运维团队：DevOps和基础设施团队
- 产品团队：产品经理和项目经理

### 参考文档
- 钜园农业农产品NFT预售平台PRD.md
- 钜园农业农产品NFT预售平台需求文档.md
- 钜园农业恐龙蛋荔枝NFT预售平台产品设计文档.md

---

## 第一部分：NFT/RWA核心系统实施

### 1.1 NFT智能合约实施

#### 功能概述
实现ERC-721标准的农产品NFT智能合约，支持多链部署。

#### 技术实施细节

**智能合约架构**
```solidity
// 主NFT合约结构
contract AgriProductNFT is ERC721, Ownable, Pausable {
    // 农产品元数据结构
    struct ProductMetadata {
        uint256 tokenId;           // NFT ID
        string productType;        // 产品类型（荔枝、龙眼等）
        uint256 quantity;          // 数量（克）
        string qualityGrade;       // 质量等级
        uint256 harvestDate;       // 收获日期
        string originBase;         // 生产基地
        string ipfsHash;           // IPFS元数据哈希
        bool delivered;            // 是否已交付
    }
    
    // 预售批次结构
    struct PresaleBatch {
        uint256 batchId;           // 批次ID
        uint256 maxSupply;         // 最大供应量
        uint256 currentSupply;     // 当前供应量
        uint256 price;             // 价格
        uint256 startTime;         // 开始时间
        uint256 endTime;           // 结束时间
        bool active;               // 是否激活
    }
}
```

**实施步骤**

1. **合约开发**（第1-2周）
   - 创建AgriProductNFT合约继承ERC721标准
   - 实现产品元数据结构和存储
   - 添加批量铸造功能
   - 实现暂停机制（紧急情况）
   - 添加访问控制（管理员角色）

2. **铸造功能实现**（第2-3周）
   ```solidity
   function mintNFT(
       address to,
       string memory productType,
       uint256 quantity,
       string memory qualityGrade,
       uint256 harvestDate,
       string memory originBase,
       string memory ipfsHash
   ) public onlyOwner returns (uint256)
   ```

3. **批次管理功能**（第3周）
   ```solidity
   function createPresaleBatch(
       uint256 maxSupply,
       uint256 price,
       uint256 startTime,
       uint256 endTime
   ) public onlyOwner
   
   function purchaseFromBatch(
       uint256 batchId,
       uint256 amount
   ) public payable
   ```

4. **Gas优化**（第4周）
   - 使用批量操作减少交易次数
   - 优化存储结构降低gas成本
   - 实现EIP-2309批量铸造事件

5. **多链部署**（第5周）
   - 部署到Polygon Mumbai测试网
   - 部署到Arbitrum Goerli测试网
   - 部署到以太坊Goerli测试网
   - 验证合约源代码

**交付物**
- [ ] AgriProductNFT.sol 智能合约代码
- [ ] 合约部署脚本
- [ ] 合约单元测试（覆盖率>90%）
- [ ] Gas优化报告
- [ ] 多链部署文档
- [ ] 合约ABI和地址清单

**验收标准**
- ✓ 通过所有单元测试
- ✓ Gas成本低于行业标准30%
- ✓ 通过安全审计（无高危漏洞）
- ✓ 成功部署到3条链
- ✓ 支持批量铸造（1次交易最多100个NFT）

---

### 1.2 预售合约实施

#### 功能概述
实现自动化预售管理合约，支持时间锁定、白名单和退款机制。

#### 技术实施细节

**预售合约结构**
```solidity
contract PresaleManager {
    // 预售配置
    struct PresaleConfig {
        uint256 startTime;
        uint256 endTime;
        uint256 minPurchase;
        uint256 maxPurchase;
        uint256 totalSupply;
        uint256 soldAmount;
        address paymentToken;
        bool whitelistEnabled;
    }
    
    // 用户购买记录
    mapping(address => uint256) public userPurchases;
    
    // 白名单
    mapping(address => bool) public whitelist;
}
```

**实施步骤**

1. **预售逻辑开发**（第6-7周）
   - 实现时间窗口控制
   - 添加购买数量限制
   - 实现白名单功能
   - 添加支付处理（ETH/USDT/USDC）

2. **退款机制**（第7周）
   ```solidity
   function refund(uint256 presaleId) public {
       require(presaleFailed(presaleId), "Presale not failed");
       uint256 amount = userPurchases[msg.sender];
       require(amount > 0, "No purchase found");
       // 退款逻辑
   }
   ```

3. **集成测试**（第8周）
   - 测试预售完整流程
   - 测试退款机制
   - 测试边界条件

**交付物**
- [ ] PresaleManager.sol 合约代码
- [ ] 预售管理脚本
- [ ] 集成测试套件
- [ ] 预售操作手册

**验收标准**
- ✓ 支持多种支付代币
- ✓ 准确的时间窗口控制
- ✓ 完善的退款机制
- ✓ 白名单功能正常

---

### 1.3 托管合约实施

#### 功能概述
实现安全的资金托管合约，确保交付前资金安全。

#### 技术实施细节

**托管合约结构**
```solidity
contract EscrowManager {
    enum EscrowStatus { Active, Completed, Refunded, Disputed }
    
    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        uint256 nftTokenId;
        EscrowStatus status;
        uint256 deliveryDeadline;
    }
    
    mapping(uint256 => Escrow) public escrows;
}
```

**实施步骤**

1. **托管逻辑开发**（第9-10周）
   - 创建托管账户
   - 实现自动释放机制
   - 添加争议解决流程
   - 实现多签名确认

2. **交付确认机制**（第10周）
   ```solidity
   function confirmDelivery(uint256 escrowId) public {
       require(msg.sender == escrow.buyer, "Not buyer");
       _releaseToSeller(escrowId);
   }
   
   function autoRelease(uint256 escrowId) public {
       require(block.timestamp > escrow.deliveryDeadline + 7 days);
       _releaseToSeller(escrowId);
   }
   ```

**交付物**
- [ ] EscrowManager.sol 合约代码
- [ ] 争议解决流程文档
- [ ] 托管测试报告

**验收标准**
- ✓ 资金安全托管
- ✓ 自动释放功能正常
- ✓ 争议处理机制完善

---

## 第二部分：后端服务实施

### 2.1 微服务架构设计

#### 服务划分

**核心服务列表**
1. **用户服务 (User Service)** - 端口: 3001
2. **NFT服务 (NFT Service)** - 端口: 3002
3. **预售服务 (Presale Service)** - 端口: 3003
4. **支付服务 (Payment Service)** - 端口: 3004
5. **溯源服务 (Traceability Service)** - 端口: 3005
6. **物流服务 (Logistics Service)** - 端口: 3006
7. **合规服务 (Compliance Service)** - 端口: 3007
8. **通知服务 (Notification Service)** - 端口: 3008
9. **国际化服务 (i18n Service)** - 端口: 3009 ⭐ NEW
10. **多币种服务 (Multi-Currency Service)** - 端口: 3010 ⭐ NEW

#### 技术栈
- **框架**: Node.js 18 + Express.js 4.18
- **语言**: TypeScript 5.0
- **数据库**: PostgreSQL 15 + Prisma ORM
- **缓存**: Redis 7
- **消息队列**: Bull Queue + Redis
- **API文档**: Swagger/OpenAPI 3.0

---

### 2.2 用户服务实施

#### 功能范围
- 用户注册和登录
- KYC/AML验证
- 用户画像管理
- 权限和角色管理

#### 数据库设计

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    kyc_status VARCHAR(20) DEFAULT 'pending',
    kyc_tier INT DEFAULT 0,
    role VARCHAR(20) DEFAULT 'consumer',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_wallet (wallet_address),
    INDEX idx_email (email)
);

-- KYC记录表
CREATE TABLE kyc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    document_image_url TEXT,
    verification_status VARCHAR(20),
    verified_at TIMESTAMP,
    verifier_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 用户画像表
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    full_name VARCHAR(100),
    date_of_birth DATE,
    nationality VARCHAR(3),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(3),
    postal_code VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'zh-CN',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### API端点设计

**用户注册**
```typescript
POST /api/v1/users/register
Request:
{
  "walletAddress": "0x...",
  "email": "user@example.com",
  "phone": "+86 138 xxxx xxxx"
}

Response:
{
  "success": true,
  "data": {
    "userId": "uuid",
    "walletAddress": "0x...",
    "kycStatus": "pending"
  }
}
```

**KYC提交**
```typescript
POST /api/v1/users/kyc/submit
Headers: Authorization: Bearer {jwt_token}
Request:
{
  "documentType": "passport",
  "documentNumber": "E12345678",
  "documentImages": ["base64_image_1", "base64_image_2"],
  "selfieImage": "base64_selfie"
}

Response:
{
  "success": true,
  "data": {
    "kycId": "uuid",
    "status": "pending_review",
    "estimatedReviewTime": "24 hours"
  }
}
```

#### 实施步骤

1. **数据库设计与创建**（第11周）
   - 设计数据库表结构
   - 创建Prisma schema
   - 生成数据库迁移
   - 创建种子数据

2. **核心API开发**（第12-13周）
   - 实现用户注册/登录
   - JWT认证中间件
   - 钱包签名验证
   - 用户信息CRUD

3. **KYC集成**（第14周）
   - 集成Jumio/Onfido KYC服务
   - 实现文档上传
   - 实现人脸识别验证
   - KYC状态管理

4. **测试与优化**（第15周）
   - 单元测试
   - 集成测试
   - 性能测试
   - 安全测试

**交付物**
- [ ] 用户服务源代码
- [ ] Prisma数据库模式
- [ ] API文档（Swagger）
- [ ] 单元测试（覆盖率>80%）
- [ ] 集成测试套件
- [ ] 部署文档

**验收标准**
- ✓ 支持Web3钱包登录
- ✓ KYC流程完整
- ✓ API响应时间<200ms
- ✓ 通过安全测试

---

### 2.3 NFT服务实施

#### 功能范围
- NFT铸造管理
- NFT元数据存储
- NFT交易记录
- NFT查询和展示

#### 数据库设计

```sql
-- NFT表
CREATE TABLE nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_id BIGINT UNIQUE NOT NULL,
    contract_address VARCHAR(42) NOT NULL,
    chain_id INT NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    quality_grade VARCHAR(20),
    harvest_date TIMESTAMP,
    origin_base VARCHAR(100),
    ipfs_hash VARCHAR(100),
    metadata_uri TEXT,
    is_delivered BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_token (token_id),
    INDEX idx_owner (owner_address),
    INDEX idx_product_type (product_type)
);

-- NFT交易历史
CREATE TABLE nft_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_id UUID REFERENCES nfts(id),
    from_address VARCHAR(42),
    to_address VARCHAR(42) NOT NULL,
    transaction_type VARCHAR(20),
    transaction_hash VARCHAR(66),
    price DECIMAL(20, 8),
    currency VARCHAR(10),
    timestamp TIMESTAMP DEFAULT NOW(),
    INDEX idx_nft (nft_id),
    INDEX idx_from (from_address),
    INDEX idx_to (to_address)
);

-- 产品元数据
CREATE TABLE product_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_id UUID REFERENCES nfts(id),
    name VARCHAR(200),
    description TEXT,
    image_url TEXT,
    attributes JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### API端点设计

**铸造NFT**
```typescript
POST /api/v1/nfts/mint
Headers: Authorization: Bearer {admin_jwt_token}
Request:
{
  "productType": "lychee",
  "quantity": 1000,
  "qualityGrade": "premium",
  "harvestDate": "2025-06-01",
  "originBase": "Guangdong",
  "batchSize": 100,
  "chainId": 137
}

Response:
{
  "success": true,
  "data": {
    "batchId": "uuid",
    "tokenIds": [1, 2, 3, ..., 100],
    "transactionHash": "0x...",
    "ipfsHashes": ["Qm...", ...]
  }
}
```

**查询NFT详情**
```typescript
GET /api/v1/nfts/{tokenId}
Response:
{
  "success": true,
  "data": {
    "tokenId": 123,
    "owner": "0x...",
    "productType": "lychee",
    "quantity": 1000,
    "qualityGrade": "premium",
    "harvestDate": "2025-06-01",
    "metadata": {
      "name": "Premium Dragon Egg Lychee #123",
      "description": "...",
      "image": "ipfs://...",
      "attributes": [...]
    },
    "traceability": {
      "stages": [...]
    }
  }
}
```

#### 实施步骤

1. **数据库与模型**（第16周）
   - 创建数据库表
   - 定义Prisma模型
   - 实现数据访问层

2. **IPFS集成**（第17周）
   - 集成IPFS节点（Pinata/Infura）
   - 实现元数据上传
   - 生成NFT元数据JSON

3. **区块链交互**（第18周）
   - 使用ethers.js连接区块链
   - 实现NFT铸造调用
   - 监听区块链事件
   - 同步链上数据到数据库

4. **API开发**（第19周）
   - NFT查询接口
   - NFT转移记录
   - 批量操作接口

**交付物**
- [ ] NFT服务源代码
- [ ] IPFS集成文档
- [ ] 区块链同步脚本
- [ ] API文档
- [ ] 测试报告

**验收标准**
- ✓ 成功铸造NFT到区块链
- ✓ IPFS元数据正确存储
- ✓ 区块链事件实时同步
- ✓ API响应时间<300ms

---

### 2.4 支付服务实施

#### 功能范围
- 多币种支付处理
- 加密货币支付
- 法币支付（微信/支付宝/信用卡）
- 支付状态追踪
- 退款处理

#### 数据库设计

```sql
-- 支付订单表
CREATE TABLE payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    nft_token_ids JSONB,
    transaction_hash VARCHAR(66),
    external_order_id VARCHAR(100),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_order_number (order_number),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

-- 支付交易记录
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_order_id UUID REFERENCES payment_orders(id),
    transaction_type VARCHAR(20),
    amount DECIMAL(20, 8),
    currency VARCHAR(10),
    gateway VARCHAR(20),
    gateway_transaction_id VARCHAR(100),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 支付网关集成

**加密货币支付流程**
```typescript
// 1. 创建支付订单
POST /api/v1/payments/crypto/create
Request:
{
  "nftTokenIds": [123, 124, 125],
  "paymentToken": "USDT",
  "chain": "polygon"
}

Response:
{
  "orderId": "uuid",
  "orderNumber": "PAY20250930001",
  "amount": "150.00",
  "currency": "USDT",
  "paymentAddress": "0x...",
  "expiresAt": "2025-09-30T12:00:00Z"
}

// 2. 监听支付确认
GET /api/v1/payments/crypto/{orderId}/status
Response:
{
  "status": "confirmed",
  "confirmations": 12,
  "transactionHash": "0x..."
}
```

**法币支付流程**
```typescript
// 微信支付
POST /api/v1/payments/wechat/create
Request:
{
  "nftTokenIds": [123],
  "amount": "998.00",
  "currency": "CNY"
}

Response:
{
  "orderId": "uuid",
  "wechatPayParams": {
    "appId": "...",
    "timeStamp": "...",
    "nonceStr": "...",
    "package": "...",
    "signType": "...",
    "paySign": "..."
  }
}
```

#### 实施步骤

1. **支付网关集成**（第20-21周）
   - 集成加密货币支付（ethers.js）
   - 集成微信支付SDK
   - 集成支付宝SDK
   - 集成Stripe（信用卡）

2. **支付逻辑开发**（第22周）
   - 订单创建
   - 支付状态监控
   - 支付确认
   - 自动退款

3. **安全加固**（第23周）
   - 签名验证
   - 防重放攻击
   - 金额校验
   - 风控规则

**交付物**
- [ ] 支付服务源代码
- [ ] 支付网关集成文档
- [ ] 安全测试报告
- [ ] 支付流程文档

**验收标准**
- ✓ 支持5种以上支付方式
- ✓ 支付成功率>99%
- ✓ 通过PCI DSS安全检查
- ✓ 退款处理正常

---

### 2.5 国际化服务实施 ⭐ NEW

#### 功能范围
- 多语言内容管理
- 翻译内容存储和检索
- 语言自动检测
- 本地化内容适配

#### 数据库设计

```sql
-- 翻译内容表
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(key, language_code),
    INDEX idx_key (key),
    INDEX idx_language (language_code)
);

-- 支持语言表
CREATE TABLE supported_languages (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    direction VARCHAR(3) DEFAULT 'ltr',
    is_active BOOLEAN DEFAULT true,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 用户语言偏好表
CREATE TABLE user_language_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    language_code VARCHAR(10) REFERENCES supported_languages(code),
    auto_detect BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### API端点设计

**获取翻译内容**
```typescript
GET /api/v1/i18n/translations
Query Parameters:
- language: zh-CN | en-US | th-TH | ms-MY | vi-VN | ja-JP | ko-KR
- keys: string[] (逗号分隔)
- category: string (optional)

Response:
{
  "success": true,
  "data": {
    "home.title": "钜园农业NFT预售平台",
    "home.subtitle": "区块链赋能优质农产品",
    "product.buy": "立即购买"
  }
}
```

**自动语言检测**
```typescript
POST /api/v1/i18n/detect
Request:
{
  "ip": "203.xx.xx.xx",
  "acceptLanguage": "zh-CN,zh;q=0.9,en;q=0.8"
}

Response:
{
  "success": true,
  "data": {
    "detectedLanguage": "zh-CN",
    "detectedRegion": "SG",
    "suggestions": ["zh-CN", "en-US"]
  }
}
```

#### 实施步骤

1. **基础架构搭建**（第24周）
   - 创建i18n微服务
   - 设计数据库表结构
   - 实现翻译内容CRUD API
   - 集成i18next框架

2. **多语言内容录入**（第25周）
   - 准备8种语言的翻译内容
   - 建立翻译工作流程
   - 集成翻译服务API（Google Translate作为辅助）
   - 实现内容审核流程

3. **语言检测集成**（第26周）
   - 基于IP的地理位置检测
   - Accept-Language头部解析
   - 用户偏好存储和检索
   - 语言切换API

4. **本地化内容管理**（第27周）
   - 产品名称和描述本地化
   - 法律条款本地化
   - 邮件模板本地化
   - 通知消息本地化

**交付物**
- [ ] 国际化服务源代码
- [ ] 8种语言翻译内容
- [ ] 翻译管理后台
- [ ] API文档
- [ ] 语言检测测试报告

**验收标准**
- ✓ 支持8种语言
- ✓ API响应时间<100ms
- ✓ 翻译覆盖率100%（所有关键页面）
- ✓ 自动检测准确率>95%

---

### 2.6 多币种服务实施 ⭐ NEW

#### 功能范围
- 多货币汇率管理
- 实时汇率更新
- 货币转换计算
- 历史汇率记录

#### 数据库设计

```sql
-- 支持货币表
CREATE TABLE supported_currencies (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimal_places INT DEFAULT 2,
    is_fiat BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 汇率表
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency VARCHAR(10) REFERENCES supported_currencies(code),
    to_currency VARCHAR(10) REFERENCES supported_currencies(code),
    rate DECIMAL(20, 8) NOT NULL,
    source VARCHAR(50),
    timestamp TIMESTAMP DEFAULT NOW(),
    INDEX idx_currencies (from_currency, to_currency),
    INDEX idx_timestamp (timestamp)
);

-- 历史汇率表（用于审计）
CREATE TABLE historical_exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_currency VARCHAR(10),
    to_currency VARCHAR(10),
    rate DECIMAL(20, 8) NOT NULL,
    date DATE NOT NULL,
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(from_currency, to_currency, date)
);

-- 用户货币偏好表
CREATE TABLE user_currency_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    currency_code VARCHAR(10) REFERENCES supported_currencies(code),
    auto_detect BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### API端点设计

**获取汇率**
```typescript
GET /api/v1/currency/rates
Query Parameters:
- from: USD | SGD | CNY | HKD | THB | MYR | VND | JPY | KRW | EUR
- to: USD | SGD | CNY | HKD | THB | MYR | VND | JPY | KRW | EUR
- date: YYYY-MM-DD (optional, 默认当前)

Response:
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "SGD",
    "rate": 1.35,
    "timestamp": "2025-09-30T10:00:00Z",
    "source": "aggregated"
  }
}
```

**货币转换**
```typescript
POST /api/v1/currency/convert
Request:
{
  "amount": 100.00,
  "from": "USD",
  "to": "CNY"
}

Response:
{
  "success": true,
  "data": {
    "originalAmount": 100.00,
    "originalCurrency": "USD",
    "convertedAmount": 720.50,
    "convertedCurrency": "CNY",
    "rate": 7.205,
    "timestamp": "2025-09-30T10:00:00Z"
  }
}
```

**批量汇率获取**
```typescript
POST /api/v1/currency/rates/batch
Request:
{
  "base": "USD",
  "targets": ["SGD", "CNY", "HKD", "THB", "EUR"]
}

Response:
{
  "success": true,
  "data": {
    "base": "USD",
    "rates": {
      "SGD": 1.35,
      "CNY": 7.205,
      "HKD": 7.82,
      "THB": 35.20,
      "EUR": 0.92
    },
    "timestamp": "2025-09-30T10:00:00Z"
  }
}
```

#### 实施步骤

1. **汇率数据源集成**（第24周）
   - 集成多家汇率API提供商（CoinGecko、CurrencyLayer、ExchangeRate-API）
   - 实现汇率聚合算法（取多源平均值）
   - 建立汇率更新定时任务（每5分钟）
   - 实现汇率缓存机制

2. **货币转换引擎**（第25周）
   - 实现多币种转换逻辑
   - 处理小数位数规则（JPY/KRW无小数）
   - 实现四舍五入规则
   - 加密货币汇率集成（8位小数）

3. **历史汇率管理**（第26周）
   - 每日汇率快照存储
   - 历史汇率查询API
   - 汇率趋势分析
   - 审计报告生成

4. **货币自动检测**（第27周）
   - 基于IP地理位置的货币检测
   - 基于用户账户地区的货币选择
   - 用户货币偏好存储
   - 货币切换API

**交付物**
- [ ] 多币种服务源代码
- [ ] 汇率数据源集成
- [ ] 历史汇率存储系统
- [ ] API文档
- [ ] 汇率准确性测试报告

**验收标准**
- ✓ 支持10种法币 + 4种加密货币
- ✓ 汇率更新频率<5分钟
- ✓ 汇率准确性>99.9%（与市场汇率对比）
- ✓ API响应时间<50ms（使用缓存）
- ✓ 历史汇率完整保存

---

### 2.7 合规服务扩展 ⭐ ENHANCED

#### 新增功能范围（基于PRD合规框架）

**多司法管辖区合规管理：**
- 新加坡MAS合规监控
- 中国数字藏品合规
- 香港SFC合规
- 东南亚各国合规（泰国、马来西亚、越南）
- 日韩合规准备（Phase 3）
- 欧美合规准备（Phase 3）

#### 扩展数据库设计

```sql
-- 司法管辖区配置表
CREATE TABLE jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50),
    regulatory_body VARCHAR(200),
    kyc_tier_required INT DEFAULT 1,
    transaction_limit DECIMAL(20, 2),
    requires_license BOOLEAN DEFAULT false,
    license_type VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 合规规则表
CREATE TABLE compliance_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_id UUID REFERENCES jurisdictions(id),
    rule_type VARCHAR(50) NOT NULL,
    rule_name VARCHAR(200) NOT NULL,
    description TEXT,
    threshold_amount DECIMAL(20, 2),
    threshold_currency VARCHAR(10),
    action_required VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 牌照申请跟踪表
CREATE TABLE license_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_id UUID REFERENCES jurisdictions(id),
    license_type VARCHAR(100) NOT NULL,
    application_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    approval_date DATE,
    expiry_date DATE,
    cost_usd DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 合规报告表
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_id UUID REFERENCES jurisdictions(id),
    report_type VARCHAR(50) NOT NULL,
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW(),
    submitted_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft',
    file_url TEXT,
    created_by UUID REFERENCES users(id)
);
```

#### 新增API端点

**获取司法管辖区要求**
```typescript
GET /api/v1/compliance/jurisdiction/{code}
Example: GET /api/v1/compliance/jurisdiction/SG

Response:
{
  "success": true,
  "data": {
    "code": "SG",
    "name": "Singapore",
    "regulatoryBody": "MAS",
    "kycTierRequired": 2,
    "transactionLimit": 10000,
    "requiresLicense": true,
    "licenseType": "PSA Standard Payment Institution",
    "complianceRequirements": [
      "KYC/AML verification",
      "Transaction monitoring",
      "PDPA compliance",
      "GST registration if revenue > SGD 1M"
    ]
  }
}
```

**合规检查**
```typescript
POST /api/v1/compliance/check
Request:
{
  "userId": "uuid",
  "transactionAmount": 15000,
  "currency": "USD",
  "jurisdiction": "SG",
  "transactionType": "nft_purchase"
}

Response:
{
  "success": true,
  "data": {
    "compliant": false,
    "violations": [
      {
        "rule": "Enhanced KYC Required",
        "description": "Transactions over SGD 10,000 require enhanced KYC",
        "action": "BLOCK_TRANSACTION",
        "remediation": "User must complete enhanced KYC verification"
      }
    ],
    "requiredActions": [
      "COMPLETE_ENHANCED_KYC",
      "PROVIDE_SOURCE_OF_FUNDS"
    ]
  }
}
```

**生成监管报告**
```typescript
POST /api/v1/compliance/reports/generate
Request:
{
  "jurisdiction": "SG",
  "reportType": "monthly_aml",
  "periodStart": "2025-09-01",
  "periodEnd": "2025-09-30"
}

Response:
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "jurisdiction": "SG",
    "reportType": "monthly_aml",
    "status": "generating",
    "estimatedCompletion": "2025-10-01T10:00:00Z"
  }
}
```

#### 实施步骤

1. **司法管辖区配置**（第28周）
   - 录入9个司法管辖区的合规要求
   - 配置各地区的KYC层级
   - 设置交易限额规则
   - 建立合规规则引擎

2. **多国KYC集成**（第29周）
   - 新加坡KYC流程（Jumio集成）
   - 中国实名认证（人脸识别）
   - 香港KYC流程
   - 东南亚KYC适配

3. **牌照申请管理**（第30周）
   - 新加坡PSA牌照申请跟踪
   - 中国ICP备案管理
   - 香港公司注册追踪
   - 牌照成本预算管理

4. **监管报告自动化**（第31周）
   - AML月度报告生成（新加坡）
   - 交易数据报告（中国）
   - 可疑交易报告（STR）
   - 大额交易报告

**交付物**
- [ ] 扩展合规服务源代码
- [ ] 9个司法管辖区配置
- [ ] KYC多国适配
- [ ] 监管报告模板
- [ ] 牌照申请管理系统
- [ ] 合规检查引擎

**验收标准**
- ✓ 支持9个司法管辖区合规检查
- ✓ KYC流程通过率>95%
- ✓ 合规检查响应时间<100ms
- ✓ 自动报告生成准确率100%
- ✓ 零合规违规事件

---

## 第三部分：前端应用实施

### 3.1 微信小程序实施

#### 技术栈
- **框架**: 微信小程序原生框架
- **语言**: TypeScript + WXML + WXSS
- **状态管理**: MobX
- **UI组件**: WeUI + 自定义组件
- **Web3集成**: WalletConnect v2

#### 页面结构

```
pages/
├── index/                 # 首页
│   ├── index.wxml
│   ├── index.ts
│   ├── index.wxss
│   └── index.json
├── category/              # 分类页
├── product/               # 产品详情
│   ├── detail/
│   └── traceability/
├── nft/                   # NFT相关
│   ├── collection/        # 我的收藏
│   ├── detail/            # NFT详情
│   └── purchase/          # 购买页面
├── wallet/                # 钱包
│   ├── connect/
│   ├── balance/
│   └── transactions/
├── user/                  # 用户中心
│   ├── profile/
│   ├── kyc/
│   ├── orders/
│   └── settings/
└── governance/            # 治理
    ├── proposals/
    └── voting/
```

#### 核心功能实现

**1. Web3钱包连接**（第24周）
```typescript
// utils/wallet.ts
import WalletConnect from "@walletconnect/client";

class WalletManager {
  private connector: WalletConnect | null = null;
  
  async connect(): Promise<string> {
    this.connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal
    });
    
    if (!this.connector.connected) {
      await this.connector.createSession();
    }
    
    const accounts = await this.connector.sendCustomRequest({
      method: "eth_accounts"
    });
    
    return accounts[0];
  }
  
  async signMessage(message: string): Promise<string> {
    return await this.connector!.signPersonalMessage([
      message,
      this.connector!.accounts[0]
    ]);
  }
}
```

**2. NFT购买流程**（第25周）
```typescript
// pages/product/purchase/purchase.ts
Page({
  data: {
    product: null,
    selectedQuantity: 1,
    paymentMethod: 'wechat'
  },
  
  async onPurchase() {
    // 1. 创建订单
    const order = await api.createOrder({
      productId: this.data.product.id,
      quantity: this.data.selectedQuantity
    });
    
    // 2. 发起支付
    if (this.data.paymentMethod === 'wechat') {
      const payParams = await api.createWechatPayment(order.id);
      wx.requestPayment({
        ...payParams,
        success: () => this.onPaymentSuccess(order.id),
        fail: () => this.onPaymentFail()
      });
    } else if (this.data.paymentMethod === 'crypto') {
      await this.cryptoPayment(order);
    }
  }
});
```

**3. 产品溯源展示**（第26周）
```typescript
// components/traceability-timeline/index.ts
Component({
  properties: {
    nftId: String
  },
  
  data: {
    stages: []
  },
  
  async attached() {
    const traceData = await api.getTraceability(this.properties.nftId);
    this.setData({
      stages: [
        {
          stage: '种植',
          date: traceData.plantingDate,
          location: traceData.originBase,
          images: traceData.plantingImages,
          data: {
            temperature: traceData.avgTemperature,
            humidity: traceData.avgHumidity
          }
        },
        {
          stage: '生长',
          ...
        },
        // ... 更多阶段
      ]
    });
  }
});
```

#### 实施步骤

1. **基础框架搭建**（第24周）
   - 项目初始化
   - 路由配置
   - 全局样式
   - 工具函数库

2. **核心页面开发**（第25-27周）
   - 首页和分类页
   - 产品详情页
   - NFT购买流程
   - 用户中心

3. **Web3功能**（第28周）
   - 钱包连接
   - 签名验证
   - NFT查询
   - 交易历史

4. **测试与优化**（第29周）
   - 真机测试
   - 性能优化
   - 兼容性测试

**交付物**
- [ ] 微信小程序源代码
- [ ] 组件库文档
- [ ] 测试报告
- [ ] 上线审核材料

**验收标准**
- ✓ 通过微信审核
- ✓ 首屏加载时间<2秒
- ✓ 支持iOS和Android
- ✓ 用户体验流畅

---

### 3.2 管理后台实施

#### 技术栈
- **框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **UI库**: Ant Design 5.0
- **状态管理**: Zustand
- **图表**: ECharts/Recharts
- **Web3**: ethers.js v6

#### 功能模块

**1. 仪表板**（第30周）
```typescript
// pages/dashboard/index.tsx
export default function Dashboard() {
  return (
    <div className="dashboard">
      <Row gutter={16}>
        <Col span={6}>
          <StatCard
            title="总销售额"
            value="$2,450,000"
            trend="+12.5%"
            icon={<DollarOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="NFT铸造总量"
            value="15,234"
            trend="+8.2%"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="活跃用户"
            value="8,456"
            trend="+15.3%"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="待审核KYC"
            value="124"
            status="warning"
          />
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <SalesChart />
        </Col>
        <Col span={8}>
          <ProductDistribution />
        </Col>
      </Row>
    </div>
  );
}
```

**2. NFT管理**（第31周）
```typescript
// pages/nft/management/index.tsx
export default function NFTManagement() {
  const [nfts, setNfts] = useState([]);
  
  const columns = [
    { title: 'Token ID', dataIndex: 'tokenId' },
    { title: '产品类型', dataIndex: 'productType' },
    { title: '持有者', dataIndex: 'owner' },
    { title: '状态', dataIndex: 'status' },
    { title: '铸造时间', dataIndex: 'createdAt' },
    {
      title: '操作',
      render: (record) => (
        <>
          <Button onClick={() => viewDetails(record)}>详情</Button>
          <Button onClick={() => burnNFT(record)}>销毁</Button>
        </>
      )
    }
  ];
  
  return (
    <Card title="NFT管理">
      <Table
        columns={columns}
        dataSource={nfts}
        pagination={{
          pageSize: 20,
          total: totalCount
        }}
      />
    </Card>
  );
}
```

**3. 合规监控**（第32周）
```typescript
// pages/compliance/monitoring/index.tsx
export default function ComplianceMonitoring() {
  return (
    <Tabs>
      <TabPane tab="KYC审核" key="kyc">
        <KYCReviewQueue />
      </TabPane>
      <TabPane tab="交易监控" key="transactions">
        <TransactionMonitoring
          alerts={highValueTransactions}
          suspiciousActivities={flaggedActivities}
        />
      </TabPane>
      <TabPane tab="监管报告" key="reports">
        <RegulatoryReports
          jurisdictions={['Singapore', 'China', 'Hong Kong']}
        />
      </TabPane>
    </Tabs>
  );
}
```

#### 实施步骤

1. **项目搭建**（第30周）
   - Next.js项目初始化
   - 配置TypeScript和ESLint
   - 集成Ant Design
   - 设置路由和布局

2. **核心功能开发**（第31-33周）
   - 仪表板和数据可视化
   - NFT管理模块
   - 用户和KYC管理
   - 预售管理
   - 合规监控

3. **权限系统**（第34周）
   - RBAC实现
   - 路由守卫
   - 操作日志

**交付物**
- [ ] 管理后台源代码
- [ ] 部署文档
- [ ] 用户手册
- [ ] 测试报告

**验收标准**
- ✓ 完整的CRUD功能
- ✓ 实时数据更新
- ✓ 权限控制完善
- ✓ 响应式设计

---

## 第四部分：DevOps与部署

### 4.1 容器化部署

#### Docker配置

**后端服务Dockerfile**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: juyuan_nft
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  user-service:
    build: ./services/user-service
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/juyuan_nft
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  nft-service:
    build: ./services/nft-service
    ports:
      - "3002:3000"
    depends_on:
      - postgres
      - redis

  payment-service:
    build: ./services/payment-service
    ports:
      - "3004:3000"
    depends_on:
      - postgres
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - user-service
      - nft-service
      - payment-service

volumes:
  postgres_data:
  redis_data:
```

### 4.2 CI/CD流程

#### GitHub Actions配置

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: |
          docker-compose build
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker-compose push

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/juyuan-nft
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

### 4.3 监控与日志

#### Prometheus配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:3000']
  
  - job_name: 'nft-service'
    static_configs:
      - targets: ['nft-service:3000']
  
  - job_name: 'payment-service'
    static_configs:
      - targets: ['payment-service:3000']
```

#### 日志聚合（ELK Stack）

```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  elasticsearch:
    image: elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: logstash:8.0.0
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: kibana:8.0.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

**交付物**
- [ ] Docker配置文件
- [ ] CI/CD流水线
- [ ] 监控配置
- [ ] 部署文档
- [ ] 运维手册

**验收标准**
- ✓ 自动化部署成功率>95%
- ✓ 服务可用性>99.9%
- ✓ 监控告警及时
- ✓ 日志完整可查

---

## 第五部分：测试策略

### 5.1 智能合约测试

#### 单元测试
```typescript
// test/AgriProductNFT.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AgriProductNFT", function () {
  it("Should mint NFT with correct metadata", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("AgriProductNFT");
    const nft = await NFT.deploy();
    
    await nft.mintNFT(
      addr1.address,
      "lychee",
      1000,
      "premium",
      Date.now(),
      "Guangdong",
      "QmTest123"
    );
    
    expect(await nft.ownerOf(1)).to.equal(addr1.address);
    const metadata = await nft.getMetadata(1);
    expect(metadata.productType).to.equal("lychee");
  });
  
  it("Should enforce max supply per batch", async function () {
    // 测试批次供应量限制
  });
  
  it("Should allow only owner to mint", async function () {
    // 测试权限控制
  });
});
```

### 5.2 API测试

#### 集成测试
```typescript
// test/integration/user-service.test.ts
describe("User Service API", () => {
  it("POST /api/v1/users/register should create new user", async () => {
    const response = await request(app)
      .post('/api/v1/users/register')
      .send({
        walletAddress: '0x123...',
        email: 'test@example.com'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.data.userId).toBeDefined();
  });
  
  it("POST /api/v1/users/kyc/submit should accept KYC documents", async () => {
    // KYC提交测试
  });
});
```

### 5.3 性能测试

#### 负载测试（k6）
```javascript
// tests/load/presale.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://api.juyuan-nft.com/api/v1/nfts');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

**测试交付物**
- [ ] 单元测试套件（覆盖率>90%）
- [ ] 集成测试套件
- [ ] 性能测试报告
- [ ] 安全测试报告
- [ ] 用户验收测试清单

---

## 第六部分：安全实施

### 6.1 智能合约安全

#### 安全措施
1. **访问控制**
   - 使用OpenZeppelin的Ownable和AccessControl
   - 多重签名钱包（Gnosis Safe）
   - 时间锁机制

2. **重入攻击防护**
   - 使用ReentrancyGuard
   - Checks-Effects-Interactions模式

3. **溢出保护**
   - 使用Solidity 0.8+自动溢出检查
   - SafeMath库（向后兼容）

#### 审计清单
- [ ] Slither静态分析
- [ ] Mythril安全扫描
- [ ] 第三方审计（CertiK/OpenZeppelin）
- [ ] 形式化验证关键函数
- [ ] 漏洞赏金计划

### 6.2 后端安全

#### 安全配置
```typescript
// 安全中间件
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// JWT验证
app.use(jwtMiddleware);

// SQL注入防护（使用ORM）
// XSS防护
// CSRF防护
```

**安全交付物**
- [ ] 安全审计报告
- [ ] 渗透测试报告
- [ ] 安全配置文档
- [ ] 应急响应预案

---

## 附录

### A. 技术栈总览

| 层级 | 技术选型 | 版本 |
|------|---------|------|
| 智能合约 | Solidity | 0.8.20 |
| 区块链 | Ethereum/Polygon/Arbitrum | - |
| 后端框架 | Node.js + Express | 18.x / 4.18 |
| 前端框架 | Next.js + React | 14 / 18 |
| 移动端 | WeChat Mini Program | - |
| 数据库 | PostgreSQL | 15 |
| 缓存 | Redis | 7 |
| 消息队列 | Bull | 4.x |
| 容器化 | Docker | 24.x |
| 编排 | Kubernetes | 1.28 |
| **国际化** ⭐ | **i18next + react-i18next** | **23.x** |
| **汇率数据** ⭐ | **CoinGecko + CurrencyLayer** | **-** |
| **KYC/AML** ⭐ | **Jumio + Onfido** | **-** |
| **区块链分析** ⭐ | **Chainalysis + Elliptic** | **-** |

### B. 关键时间节点（更新）⭐

| 阶段 | 时间 | 里程碑 |
|------|------|--------|
| Phase 1 | 第1-15周 | 智能合约+用户服务完成 |
| Phase 2 | 第16-23周 | NFT服务+支付服务完成 |
| Phase 3 | 第24-27周 | **国际化服务+多币种服务+微信小程序完成** ⭐ |
| Phase 4 | 第28-31周 | **多国合规服务+管理后台完成** ⭐ |
| Phase 5 | 第32-34周 | **牌照申请+监管报告系统完成** ⭐ |
| Phase 6 | 第35-40周 | 测试+部署+上线 |

**更新说明：** 
- Phase 3 新增国际化和多币种服务实施
- Phase 4 新增多国合规服务扩展
- Phase 5 新增牌照申请管理和监管报告自动化
- 整体项目周期保持40周不变

### C. 团队配置建议（扩展）⭐

| 角色 | 人数 | 职责 |
|------|------|------|
| 区块链工程师 | 2 | 智能合约开发和审计 |
| 后端工程师 | **5** ⭐ | 微服务开发（新增国际化+多币种服务） |
| 前端工程师 | 3 | Web和小程序开发 |
| 测试工程师 | 2 | 测试和质量保证 |
| DevOps工程师 | 1 | 部署和运维 |
| 安全工程师 | 1 | 安全审计和防护 |
| 产品经理 | 1 | 需求和进度管理 |
| **合规专员** ⭐ | **3** | **多国合规管理（新加坡、中国、香港各1名）** |
| **翻译专员** ⭐ | **2** | **多语言内容翻译和审核** |
| **法务顾问** ⭐ | **外聘** | **各市场法律咨询（9个司法管辖区）** |

**新增人员说明：**
- **后端工程师增加1名**：专职负责国际化和多币种服务开发
- **合规专员3名**：分别负责新加坡、中国、香港市场合规
- **翻译专员2名**：负责8种语言的内容翻译和本地化
- **外聘法务顾问**：各市场1家律所提供法律咨询服务

---

### D. 国际化实施清单 ⭐ NEW

#### D.1 支持语言列表

| 语言 | 代码 | 优先级 | 完成状态 |
|------|------|--------|---------|
| 简体中文 | zh-CN | P0 | [ ] |
| 繁体中文 | zh-TW | P0 | [ ] |
| 英语 | en-US | P0 | [ ] |
| 泰语 | th-TH | P1 | [ ] |
| 马来语 | ms-MY | P1 | [ ] |
| 越南语 | vi-VN | P1 | [ ] |
| 日语 | ja-JP | P2 | [ ] |
| 韩语 | ko-KR | P2 | [ ] |

#### D.2 支持货币列表

| 货币 | 代码 | 类型 | 小数位 | 优先级 | 完成状态 |
|------|------|------|--------|--------|---------|
| 美元 | USD | 法币 | 2 | P0 | [ ] |
| 新加坡元 | SGD | 法币 | 2 | P0 | [ ] |
| 人民币 | CNY | 法币 | 2 | P0 | [ ] |
| 港币 | HKD | 法币 | 2 | P0 | [ ] |
| 泰铢 | THB | 法币 | 2 | P1 | [ ] |
| 林吉特 | MYR | 法币 | 2 | P1 | [ ] |
| 越南盾 | VND | 法币 | 0 | P1 | [ ] |
| 日元 | JPY | 法币 | 0 | P2 | [ ] |
| 韩元 | KRW | 法币 | 0 | P2 | [ ] |
| 欧元 | EUR | 法币 | 2 | P2 | [ ] |
| 以太坊 | ETH | 加密 | 8 | P0 | [ ] |
| USDT | USDT | 加密 | 8 | P0 | [ ] |
| USDC | USDC | 加密 | 8 | P0 | [ ] |
| 比特币 | BTC | 加密 | 8 | P1 | [ ] |

#### D.3 支付方式本地化

| 地区 | 支付方式 | 优先级 | 集成状态 |
|------|---------|--------|---------|
| 中国 | 微信支付 | P0 | [ ] |
| 中国 | 支付宝 | P0 | [ ] |
| 中国 | 银联卡 | P1 | [ ] |
| 新加坡 | PayNow | P0 | [ ] |
| 新加坡 | GrabPay | P1 | [ ] |
| 香港 | PayMe | P1 | [ ] |
| 香港 | 八达通 | P1 | [ ] |
| 泰国 | PromptPay | P1 | [ ] |
| 马来西亚 | Touch 'n Go | P1 | [ ] |
| 越南 | MoMo | P1 | [ ] |
| 国际 | Stripe | P0 | [ ] |
| 国际 | PayPal | P1 | [ ] |

#### D.4 物流合作伙伴

| 地区 | 物流商 | 服务类型 | 集成状态 |
|------|--------|---------|---------|
| 中国 | 顺丰速运 | 冷链配送 | [ ] |
| 中国 | 京东物流 | 标准配送 | [ ] |
| 新加坡 | Ninja Van | 标准配送 | [ ] |
| 新加坡 | DHL | 冷链配送 | [ ] |
| 泰国 | Kerry Express | 标准配送 | [ ] |
| 马来西亚 | Poslaju | 标准配送 | [ ] |
| 越南 | Giao Hàng Nhanh | 标准配送 | [ ] |
| 国际 | FedEx | 国际冷链 | [ ] |

---

### E. 合规实施清单 ⭐ NEW

#### E.1 司法管辖区合规状态

| 司法管辖区 | 监管机构 | 牌照类型 | 申请状态 | 成本（USD） | 完成状态 |
|-----------|---------|---------|---------|------------|---------|
| 新加坡 | MAS | PSA牌照 | 未开始 | $190,000 | [ ] |
| 中国 | PBOC/CAC | ICP备案 | 未开始 | $60,000 | [ ] |
| 香港 | SFC | 公司注册 | 未开始 | $120,000 | [ ] |
| 泰国 | Thai SEC | 数字资产牌照 | 未开始 | $230,000 | [ ] |
| 马来西亚 | SC Malaysia | 交易所注册 | 未开始 | - | [ ] |
| 越南 | SBV | 待定 | 未开始 | - | [ ] |
| 日本 | FSA | 待定 | 未开始 | $250,000 | [ ] |
| 韩国 | FSC | VASP注册 | 未开始 | - | [ ] |
| 欧盟 | - | MiCA合规 | 未开始 | - | [ ] |

**合规成本总计：** $850,000（首年）

#### E.2 KYC层级配置

| KYC层级 | 交易限额 | 要求文件 | 适用地区 | 完成状态 |
|---------|---------|---------|---------|---------|
| 基础KYC | <$1,000 | 姓名+邮箱 | 全球 | [ ] |
| 标准KYC | <$10,000 | 身份证+地址 | 全球 | [ ] |
| 增强KYC | >$10,000 | 资金来源+职业 | 新加坡、香港 | [ ] |
| 实名认证 | 不限 | 身份证+人脸识别 | 中国 | [ ] |

#### E.3 监管报告自动化

| 报告类型 | 频率 | 提交至 | 自动化状态 |
|---------|------|--------|-----------|
| AML月度报告 | 月度 | MAS (新加坡) | [ ] |
| 大额交易报告 | 实时 | STRO (新加坡) | [ ] |
| 可疑交易报告 | 实时 | JFIU (香港) | [ ] |
| 交易数据报告 | 季度 | PBOC (中国) | [ ] |

---

### F. 版本更新历史 ⭐ NEW

| 版本 | 日期 | 更新内容 | 负责人 |
|------|------|---------|--------|
| v1.0 | 2025-09 | 初始版本 | 技术团队 |
| **v1.1** ⭐ | **2025-09** | **新增国际化、多币种、多国合规服务** | **技术团队** |

**v1.1 更新摘要：**
- ✅ 新增国际化服务实施计划（2.5节）
- ✅ 新增多币种服务实施计划（2.6节）
- ✅ 扩展合规服务支持多国合规（2.7节）
- ✅ 更新技术栈总览
- ✅ 调整项目时间表和里程碑
- ✅ 扩展团队配置建议
- ✅ 新增国际化实施清单（附录D）
- ✅ 新增合规实施清单（附录E）

---

**文档状态：** 待审批  
**当前版本：** v1.1 ⭐  
**下次更新：** 2025年10月  
**审批人：** CTO、技术总监、产品总监、首席合规官 ⭐ 