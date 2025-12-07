# 钜园农业NFT平台 API文档

版本: v1.0.0  
更新时间: 2024-11-21

## 目录

- [概述](#概述)
- [认证](#认证)
- [用户服务 API](#用户服务-api)
- [NFT服务 API](#nft服务-api)
- [支付服务 API](#支付服务-api)
- [物流服务 API](#物流服务-api)
- [预售服务 API](#预售服务-api)
- [错误处理](#错误处理)

---

## 概述

钜园农业NFT平台提供RESTful API，基于HTTP协议，使用JSON格式进行数据交换。

### Base URLs

| 环境 | Base URL |
|------|----------|
| 开发环境 | `http://localhost:3000/api/v1` |
| 测试环境 | `https://test-api.juyuan-nft.com/api/v1` |
| 生产环境 | `https://api.juyuan-nft.com/api/v1` |

### HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 认证

API使用JWT (JSON Web Token) 进行身份认证。

### 获取Token

**请求示例：**

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应示例：**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "testuser",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 使用Token

在后续请求中，将token添加到请求头：

```bash
Authorization: Bearer {token}
```

---

## 用户服务 API

### 1. 用户注册

创建新用户账户。

**端点:** `POST /auth/register`

**请求体:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "testuser"
}
```

**响应:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "testuser",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. 钱包登录

使用Web3钱包登录。

**端点:** `POST /auth/wallet-login`

**请求体:**

```json
{
  "walletAddress": "0x1234567890abcdef",
  "signature": "0xsignature",
  "message": "Sign in to Juyuan NFT Platform"
}
```

**响应:**

```json
{
  "message": "Wallet login successful",
  "user": {
    "walletAddress": "0x1234567890abcdef",
    "username": "user_0x123456",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. 获取用户信息

获取当前登录用户的信息。

**端点:** `GET /users/me`

**请求头:**
```
Authorization: Bearer {token}
```

**响应:**

```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "testuser",
    "walletAddress": "0x1234567890abcdef",
    "kycStatus": "PENDING",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. 更新用户信息

更新用户资料。

**端点:** `PUT /users/me`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**

```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

**响应:**

```json
{
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "email": "newemail@example.com",
    "username": "newusername"
  }
}
```

---

## NFT服务 API

### 1. 铸造NFT

创建新的农产品NFT（需要管理员权限）。

**端点:** `POST /nft/mint`

**请求头:**
```
Authorization: Bearer {admin_token}
```

**请求体:**

```json
{
  "walletAddress": "0x1234567890abcdef",
  "productType": "恐龙蛋荔枝",
  "quantity": 1000,
  "qualityGrade": "特级",
  "harvestDate": "2024-06-15",
  "originBase": "广东增城基地",
  "metadata": {
    "description": "特级恐龙蛋荔枝，果大核小",
    "image": "https://example.com/image.jpg"
  }
}
```

**响应:**

```json
{
  "message": "NFT minted successfully",
  "data": {
    "nft": {
      "id": "uuid",
      "tokenId": 1,
      "walletAddress": "0x1234567890abcdef",
      "productType": "恐龙蛋荔枝",
      "status": "PENDING"
    },
    "jobId": "12345"
  }
}
```

### 2. 获取NFT详情

根据token ID获取NFT信息。

**端点:** `GET /nft/{tokenId}`

**响应:**

```json
{
  "message": "NFT retrieved successfully",
  "data": {
    "tokenId": 1,
    "owner": "0x1234567890abcdef",
    "productType": "恐龙蛋荔枝",
    "quantity": 1000,
    "qualityGrade": "特级",
    "harvestDate": "2024-06-15T00:00:00.000Z",
    "originBase": "广东增城基地",
    "ipfsHash": "QmTest123456789",
    "delivered": false,
    "metadata": {}
  }
}
```

### 3. 获取用户的NFT列表

获取指定钱包地址的所有NFT。

**端点:** `GET /nft/user/{walletAddress}`

**查询参数:**
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 20

**响应:**

```json
{
  "message": "User NFTs retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "tokenId": 1,
      "productType": "恐龙蛋荔枝",
      "quantity": 1000,
      "delivered": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### 4. 转移NFT

将NFT转移给其他地址。

**端点:** `PUT /nft/{tokenId}/transfer`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**

```json
{
  "to": "0xabcdef1234567890"
}
```

**响应:**

```json
{
  "message": "NFT transferred successfully",
  "data": {
    "transactionHash": "0xtxhash",
    "blockNumber": 12345
  }
}
```

### 5. 搜索NFT

根据条件搜索NFT。

**端点:** `GET /nft/search`

**查询参数:**
- `productType` (可选): 产品类型
- `qualityGrade` (可选): 品质等级
- `originBase` (可选): 产地基地
- `delivered` (可选): 是否已交付
- `page` (可选): 页码
- `limit` (可选): 每页数量

**响应:**

```json
{
  "message": "NFTs searched successfully",
  "data": [
    {
      "id": "uuid",
      "tokenId": 1,
      "productType": "恐龙蛋荔枝",
      "qualityGrade": "特级",
      "originBase": "广东增城基地"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

---

## 支付服务 API

### 1. 创建支付意图（Stripe）

创建Stripe支付意图。

**端点:** `POST /payment/create-intent`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**

```json
{
  "amount": 100.00,
  "currency": "USD",
  "presaleId": 1,
  "metadata": {
    "description": "Purchase NFT"
  }
}
```

**响应:**

```json
{
  "message": "Payment intent created",
  "data": {
    "paymentId": "uuid",
    "clientSecret": "pi_xxx_secret_xxx",
    "stripePaymentIntentId": "pi_xxx"
  }
}
```

### 2. 创建微信支付订单

创建微信支付订单。

**端点:** `POST /payment/wechat/create`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**

```json
{
  "amount": 100.00,
  "description": "购买恐龙蛋荔枝NFT",
  "presaleId": 1
}
```

**响应:**

```json
{
  "message": "WeChat payment order created",
  "data": {
    "paymentId": "uuid",
    "outTradeNo": "WX1234567890",
    "prepayId": "prepay_xxx",
    "codeUrl": "weixin://wxpay/bizpayurl?pr=xxx"
  }
}
```

### 3. 创建加密货币支付

创建加密货币支付订单。

**端点:** `POST /payment/crypto`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**

```json
{
  "amount": 0.1,
  "currency": "ETH",
  "presaleId": 1
}
```

**响应:**

```json
{
  "message": "Crypto payment created",
  "data": {
    "paymentId": "uuid",
    "paymentAddress": "0xplatformaddress",
    "amount": 0.1,
    "currency": "ETH",
    "network": "ethereum"
  }
}
```

### 4. 获取支付详情

获取指定支付的详细信息。

**端点:** `GET /payment/{paymentId}`

**请求头:**
```
Authorization: Bearer {token}
```

**响应:**

```json
{
  "message": "Payment retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 100.00,
    "currency": "USD",
    "method": "STRIPE",
    "status": "CONFIRMED",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "confirmedAt": "2024-01-01T00:05:00.000Z"
  }
}
```

### 5. 获取用户支付历史

获取当前用户的所有支付记录。

**端点:** `GET /payment/user/{userId}`

**请求头:**
```
Authorization: Bearer {token}
```

**查询参数:**
- `page` (可选): 页码
- `limit` (可选): 每页数量

**响应:**

```json
{
  "message": "User payments retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "amount": 100.00,
      "currency": "USD",
      "method": "STRIPE",
      "status": "CONFIRMED",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## 物流服务 API

### 1. 创建配送订单

创建新的配送订单（需要管理员权限）。

**端点:** `POST /delivery/create`

**请求头:**
```
Authorization: Bearer {admin_token}
```

**请求体:**

```json
{
  "orderId": "order_123",
  "recipientName": "张三",
  "recipientPhone": "13800138000",
  "address": {
    "province": "广东省",
    "city": "广州市",
    "district": "天河区",
    "detail": "xxx街道xxx号",
    "postalCode": "510000"
  },
  "items": [
    {
      "name": "恐龙蛋荔枝",
      "quantity": 10,
      "weight": 5.0
    }
  ],
  "notes": "请在上午配送"
}
```

**响应:**

```json
{
  "message": "Delivery created successfully",
  "data": {
    "id": "uuid",
    "orderId": "order_123",
    "recipientName": "张三",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. 发货

更新配送为已发货状态。

**端点:** `PUT /delivery/{deliveryId}/ship`

**请求头:**
```
Authorization: Bearer {admin_token}
```

**请求体:**

```json
{
  "courier": "顺丰速运",
  "trackingNumber": "SF1234567890",
  "estimatedDelivery": "2024-01-05"
}
```

**响应:**

```json
{
  "message": "Delivery shipped successfully",
  "data": {
    "id": "uuid",
    "status": "SHIPPED",
    "courier": "顺丰速运",
    "trackingNumber": "SF1234567890",
    "shippedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### 3. 追踪物流

根据运单号追踪物流信息。

**端点:** `GET /tracking/{trackingNumber}`

**查询参数:**
- `courier` (可选): 快递公司

**响应:**

```json
{
  "message": "Tracking info retrieved successfully",
  "data": {
    "delivery": {
      "id": "uuid",
      "orderId": "order_123",
      "status": "IN_TRANSIT",
      "trackingNumber": "SF1234567890"
    },
    "externalTracking": {
      "trackingNumber": "SF1234567890",
      "courier": "顺丰速运",
      "status": "IN_TRANSIT",
      "events": [
        {
          "time": "2024-01-02T10:00:00.000Z",
          "status": "已揽收",
          "location": "广州市",
          "description": "快递员已揽收"
        }
      ]
    },
    "latestStatus": {
      "status": "IN_TRANSIT",
      "description": "运输中",
      "timestamp": "2024-01-02T10:00:00.000Z"
    }
  }
}
```

### 4. 确认收货

用户确认收到商品。

**端点:** `PUT /delivery/{deliveryId}/confirm`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**

```json
{
  "rating": 5,
  "feedback": "产品很新鲜，配送很快"
}
```

**响应:**

```json
{
  "message": "Delivery confirmed successfully",
  "data": {
    "id": "uuid",
    "status": "DELIVERED",
    "rating": 5,
    "deliveredAt": "2024-01-05T00:00:00.000Z"
  }
}
```

---

## 预售服务 API

### 1. 创建预售

创建新的预售活动（需要管理员权限）。

**端点:** `POST /presale/create`

**请求头:**
```
Authorization: Bearer {admin_token}
```

**请求体:**

```json
{
  "productType": "恐龙蛋荔枝",
  "maxSupply": 1000,
  "price": 0.1,
  "currency": "ETH",
  "startTime": "2024-01-01T00:00:00.000Z",
  "endTime": "2024-01-31T23:59:59.000Z",
  "minPurchase": 1,
  "maxPurchase": 10,
  "whitelistEnabled": false,
  "metadata": {
    "description": "2024年首批恐龙蛋荔枝预售",
    "image": "https://example.com/image.jpg"
  }
}
```

**响应:**

```json
{
  "message": "Presale created successfully",
  "data": {
    "id": "uuid",
    "productType": "恐龙蛋荔枝",
    "maxSupply": 1000,
    "currentSupply": 0,
    "price": 0.1,
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. 获取预售列表

获取所有活跃的预售活动。

**端点:** `GET /presale/list`

**查询参数:**
- `status` (可选): 状态筛选 (ACTIVE, UPCOMING, ENDED)
- `page` (可选): 页码
- `limit` (可选): 每页数量

**响应:**

```json
{
  "message": "Presales retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "productType": "恐龙蛋荔枝",
      "maxSupply": 1000,
      "currentSupply": 750,
      "price": 0.1,
      "status": "ACTIVE",
      "startTime": "2024-01-01T00:00:00.000Z",
      "endTime": "2024-01-31T23:59:59.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### 3. 参与预售

用户参与预售购买。

**端点:** `POST /presale/{presaleId}/purchase`

**请求头:**
```
Authorization: Bearer {token}
```

**请求体:**

```json
{
  "quantity": 5,
  "paymentMethod": "CRYPTO"
}
```

**响应:**

```json
{
  "message": "Purchase successful",
  "data": {
    "purchaseId": "uuid",
    "presaleId": "uuid",
    "quantity": 5,
    "totalAmount": 0.5,
    "status": "PENDING",
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## 错误处理

所有API错误响应遵循统一格式：

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "code": "ERROR_CODE"
}
```

### 常见错误码

| 错误码 | 说明 | HTTP状态码 |
|--------|------|------------|
| INVALID_INPUT | 输入参数无效 | 400 |
| UNAUTHORIZED | 未授权访问 | 401 |
| FORBIDDEN | 禁止访问 | 403 |
| NOT_FOUND | 资源不存在 | 404 |
| ALREADY_EXISTS | 资源已存在 | 409 |
| INSUFFICIENT_BALANCE | 余额不足 | 400 |
| PRESALE_NOT_ACTIVE | 预售未激活 | 400 |
| SOLD_OUT | 已售罄 | 400 |
| SERVER_ERROR | 服务器错误 | 500 |

### 错误响应示例

```json
{
  "error": "Validation error",
  "message": "Email is required",
  "code": "INVALID_INPUT",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## 速率限制

API实施速率限制以防止滥用：

- 未认证请求：每IP 100次/小时
- 已认证请求：1000次/小时
- 管理员请求：5000次/小时

超过限制将返回 `429 Too Many Requests` 错误。

响应头包含限制信息：

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

---

## Webhook通知

平台支持Webhook通知，可在关键事件发生时通知您的服务器。

### 支持的事件

- `payment.success` - 支付成功
- `payment.failed` - 支付失败
- `nft.minted` - NFT铸造完成
- `delivery.shipped` - 商品已发货
- `delivery.delivered` - 商品已送达
- `presale.started` - 预售开始
- `presale.ended` - 预售结束

### Webhook格式

```json
{
  "event": "payment.success",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "data": {
    "paymentId": "uuid",
    "amount": 100.00,
    "currency": "USD"
  }
}
```

---

## SDK和工具

我们提供以下SDK和工具：

- **JavaScript/TypeScript SDK**: `npm install @juyuan/sdk`
- **Python SDK**: `pip install juyuan-sdk`
- **Postman Collection**: [下载](https://api.juyuan-nft.com/postman)
- **OpenAPI Specification**: [查看](https://api.juyuan-nft.com/openapi.json)

---

## 支持

如有问题或建议，请联系：

- 📧 Email: tech@juyuan-agri.com
- 📚 文档: https://docs.juyuan-nft.com
- 💬 Discord: https://discord.gg/juyuan-nft
- 🐛 报告问题: https://github.com/juyuan-nft/issues

---

**文档版本**: v1.0.0  
**最后更新**: 2024-11-21


