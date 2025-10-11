# 预售系统逻辑审查报告

> 全面审查预售系统的业务逻辑、技术实现和潜在问题

## 📋 审查范围

- ✅ 业务流程逻辑
- ✅ 资金管理逻辑
- ✅ 状态转换逻辑
- ✅ 并发控制逻辑
- ✅ 数据一致性
- ✅ 安全性问题
- ✅ 边界条件处理

---

## 🔴 发现的关键问题

### 1. 【严重】库存并发问题

**位置**: `PresaleService.ts` - `reduceInventory()`

**问题描述**:
```typescript
// 当前实现
async reduceInventory(presaleId: string, quantity: number) {
  const presale = await prisma.presale.findUnique({ where: { id: presaleId } });
  const inventory = presale.inventory as any;
  
  // ❌ 问题：在读取和更新之间没有加锁，存在竞态条件
  if (inventory.available < quantity) {
    throw new Error('Insufficient inventory');
  }
  
  inventory.available -= quantity;  // 多个请求可能同时执行这里
  inventory.sold += quantity;
  
  await prisma.presale.update({
    where: { id: presaleId },
    data: { inventory: inventory }
  });
}
```

**问题影响**:
- 高并发下可能超卖
- 库存数据不一致
- 用户体验受损

**解决方案**:
```typescript
async reduceInventory(presaleId: string, quantity: number) {
  // ✅ 使用数据库原子操作
  const result = await prisma.$transaction(async (tx) => {
    // 使用 SELECT FOR UPDATE 加行锁
    const presale = await tx.$queryRaw`
      SELECT * FROM presales 
      WHERE id = ${presaleId} 
      FOR UPDATE
    `;
    
    const inventory = presale[0].inventory as any;
    
    if (inventory.available < quantity) {
      throw new Error('Insufficient inventory');
    }
    
    // 使用原子更新
    return await tx.$executeRaw`
      UPDATE presales 
      SET inventory = jsonb_set(
        jsonb_set(
          inventory,
          '{available}',
          to_jsonb((inventory->>'available')::int - ${quantity})
        ),
        '{sold}',
        to_jsonb((inventory->>'sold')::int + ${quantity})
      )
      WHERE id = ${presaleId}
      AND (inventory->>'available')::int >= ${quantity}
    `;
  });
  
  if (result === 0) {
    throw new Error('Insufficient inventory or concurrent update');
  }
}
```

**优先级**: 🔴 P0 - 必须立即修复

---

### 2. 【严重】资金分配逻辑错误

**位置**: `预售收货监管流程设计.md` - 资金管理章节

**问题描述**:
```
当前分配：
平台服务费 5%: ¥14.90
物流费用 10%: ¥29.80
首款 30%: ¥89.40
尾款 55%: ¥164.90
总计: ¥299.00  ❌ 总金额应该是 ¥298

计算：14.90 + 29.80 + 89.40 + 164.90 = 299.00
```

**问题原因**: 四舍五入导致的精度问题

**解决方案**:
```typescript
// ✅ 正确的分配逻辑
function calculateEscrowDistribution(totalAmount: number) {
  const platformFee = Math.floor(totalAmount * 0.05);      // ¥14.90
  const logisticsFee = Math.floor(totalAmount * 0.10);     // ¥29.80
  const initialPayment = Math.floor(totalAmount * 0.30);   // ¥89.40
  
  // 尾款 = 总额 - 前三项，确保不会多扣
  const finalPayment = totalAmount - platformFee - logisticsFee - initialPayment;
  // ¥298 - ¥14.90 - ¥29.80 - ¥89.40 = ¥163.90
  
  return {
    platformFee,      // ¥14.90 (5.0%)
    logisticsFee,     // ¥29.80 (10.0%)
    initialPayment,   // ¥89.40 (30.0%)
    finalPayment,     // ¥163.90 (54.99%)
    total: totalAmount // ¥298.00 (100%)
  };
}
```

**优先级**: 🔴 P0 - 必须立即修复

---

### 3. 【严重】预售状态转换缺失

**位置**: `PresaleService.ts` - `resumePresale()`

**问题描述**:
```typescript
// ❌ 问题：恢复预售时没有检查当前状态
async resumePresale(presaleId: string) {
  const updated = await prisma.presale.update({
    where: { id: presaleId },
    data: {
      status: PresaleStatus.ACTIVE  // 直接改为 ACTIVE
    }
  });
}
```

**问题影响**:
- 可能恢复已结束的预售
- 可能恢复已售罄的预售
- 状态机被破坏

**解决方案**:
```typescript
async resumePresale(presaleId: string): Promise<PresaleActivity> {
  const presale = await prisma.presale.findUnique({
    where: { id: presaleId }
  });
  
  if (!presale) {
    throw new Error('Presale not found');
  }
  
  // ✅ 检查当前状态
  if (presale.status !== PresaleStatus.PAUSED) {
    throw new Error('Can only resume paused presale');
  }
  
  // ✅ 检查时间
  const now = new Date();
  const timeline = presale.timeline as any;
  
  if (now > new Date(timeline.presale_end)) {
    throw new Error('Presale has ended, cannot resume');
  }
  
  // ✅ 检查库存
  const inventory = presale.inventory as any;
  if (inventory.available === 0) {
    throw new Error('Presale is sold out, cannot resume');
  }
  
  const updated = await prisma.presale.update({
    where: { id: presaleId },
    data: {
      status: PresaleStatus.ACTIVE
    }
  });
  
  return updated as PresaleActivity;
}
```

**优先级**: 🔴 P0 - 必须立即修复

---

### 4. 【高危】智能合约重入攻击风险

**位置**: `预售收货监管流程设计.md` - 智能合约代码

**问题描述**:
```solidity
// ❌ 问题：先转账后更新状态，存在重入攻击风险
function releaseOnDelivery(bytes32 orderId) external onlyBuyer {
    Escrow storage escrow = escrows[orderId];
    require(escrow.status == EscrowStatus.Shipped);
    
    // 先转账
    payable(escrow.seller).transfer(escrow.finalPayment);
    
    // 后更新状态 - 攻击者可能在这之前重入
    escrow.releasedAmount += escrow.finalPayment;
    escrow.status = EscrowStatus.Completed;
}
```

**解决方案**:
```solidity
// ✅ 使用 Check-Effects-Interactions 模式
function releaseOnDelivery(bytes32 orderId) external nonReentrant onlyBuyer {
    Escrow storage escrow = escrows[orderId];
    require(escrow.status == EscrowStatus.Shipped, "Invalid status");
    
    uint256 payment = escrow.finalPayment;
    
    // 1. 先检查
    require(payment > 0, "No payment to release");
    
    // 2. 再更新状态（防重入）
    escrow.releasedAmount += payment;
    escrow.status = EscrowStatus.Completed;
    escrow.confirmedAt = block.timestamp;
    
    // 3. 最后转账
    (bool success, ) = payable(escrow.seller).call{value: payment}("");
    require(success, "Transfer failed");
    
    emit DeliveryConfirmed(orderId, payment);
}
```

**优先级**: 🔴 P0 - 必须立即修复

---

### 5. 【高危】订单超时未处理

**位置**: 业务流程设计

**问题描述**:
- 用户下单后30分钟内未支付，订单状态一直是 `pending_payment`
- 锁定的库存无法释放给其他用户
- 可能导致库存被恶意占用

**解决方案**:
```typescript
// 1. 在订单创建时设置过期时间
async createOrder(data: CreateOrderDTO) {
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30分钟后
  
  const order = await prisma.order.create({
    data: {
      ...data,
      status: OrderStatus.PENDING_PAYMENT,
      expires_at: expiresAt
    }
  });
  
  // 设置定时任务检查过期
  scheduleOrderExpiration(order.order_id, expiresAt);
  
  return order;
}

// 2. 定时任务处理过期订单
async handleExpiredOrders() {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: OrderStatus.PENDING_PAYMENT,
      expires_at: {
        lte: new Date()
      }
    }
  });
  
  for (const order of expiredOrders) {
    await prisma.$transaction(async (tx) => {
      // 取消订单
      await tx.order.update({
        where: { order_id: order.order_id },
        data: {
          status: OrderStatus.CANCELLED,
          cancel_reason: 'Payment timeout'
        }
      });
      
      // 释放库存
      await this.releaseInventory(order.presale_id, order.quantity);
    });
  }
}

// 3. 每分钟执行一次
cron.schedule('* * * * *', () => {
  handleExpiredOrders();
});
```

**优先级**: 🟠 P1 - 应尽快修复

---

### 6. 【高危】预售结束后仍可购买

**位置**: 购买流程

**问题描述**:
- 预售时间判断只在前端做
- 后端没有检查当前时间是否在预售期内
- 用户可以通过API直接购买

**解决方案**:
```typescript
async purchaseNFT(presaleId: string, quantity: number, userId: string) {
  const presale = await prisma.presale.findUnique({
    where: { id: presaleId }
  });
  
  if (!presale) {
    throw new Error('Presale not found');
  }
  
  // ✅ 检查预售状态
  if (presale.status !== PresaleStatus.ACTIVE) {
    throw new Error('Presale is not active');
  }
  
  // ✅ 检查时间
  const now = new Date();
  const timeline = presale.timeline as any;
  
  if (now < new Date(timeline.presale_start)) {
    throw new Error('Presale has not started yet');
  }
  
  if (now > new Date(timeline.presale_end)) {
    throw new Error('Presale has ended');
  }
  
  // ✅ 检查库存
  const inventory = presale.inventory as any;
  if (inventory.available < quantity) {
    throw new Error('Insufficient inventory');
  }
  
  // ✅ 检查用户限购
  const userPurchased = await this.getUserPurchasedCount(presaleId, userId);
  if (userPurchased + quantity > inventory.limit_per_user) {
    throw new Error('Exceeds purchase limit per user');
  }
  
  // 继续购买流程...
}
```

**优先级**: 🟠 P1 - 应尽快修复

---

### 7. 【中危】价格策略逻辑不完整

**位置**: `Presale.model.ts` - PricingStrategy

**问题描述**:
```typescript
interface PricingStrategy {
  original_price: number;
  presale_price: number;
  discount_rate: number;  // ❌ 这个字段是冗余的还是计算出来的？
  deposit?: number;       // ❌ 定金和尾款的关系没有明确
  final_payment?: number;
  group_discount?: GroupDiscount[];  // ❌ 团购优惠如何计算？
  early_bird_discount?: EarlyBirdDiscount;  // ❌ 早鸟优惠如何计算？
}
```

**问题影响**:
- 价格计算不明确
- 多种优惠叠加规则不清晰
- 可能出现负价格或异常价格

**解决方案**:
```typescript
interface PricingStrategy {
  original_price: number;      // 原价（只读，不参与计算）
  base_price: number;          // 基础预售价
  
  // 定金模式（可选）
  deposit_mode: boolean;       // 是否使用定金模式
  deposit_amount?: number;     // 定金金额
  deposit_rate?: number;       // 定金比例（deposit_amount = base_price * deposit_rate）
  // final_payment 自动计算：base_price - deposit_amount
  
  // 优惠策略（按优先级应用）
  discounts: {
    early_bird?: {
      end_time: Date;
      discount_type: 'rate' | 'amount';
      discount_value: number;  // 折扣率（0.1=10%off）或折扣金额
    };
    group_discount?: Array<{
      min_quantity: number;
      discount_type: 'rate' | 'amount';
      discount_value: number;
    }>;
    coupon_allowed: boolean;   // 是否允许使用优惠券
  };
}

// 价格计算函数
function calculateFinalPrice(
  strategy: PricingStrategy,
  quantity: number,
  purchaseTime: Date,
  couponAmount?: number
): PriceBreakdown {
  let price = strategy.base_price * quantity;
  const discounts: Array<{name: string, amount: number}> = [];
  
  // 1. 早鸟优惠
  if (strategy.discounts.early_bird && purchaseTime <= strategy.discounts.early_bird.end_time) {
    const earlyBird = strategy.discounts.early_bird;
    const discount = earlyBird.discount_type === 'rate'
      ? price * earlyBird.discount_value
      : earlyBird.discount_value * quantity;
    price -= discount;
    discounts.push({ name: 'Early Bird', amount: discount });
  }
  
  // 2. 团购优惠
  if (strategy.discounts.group_discount) {
    const applicable = strategy.discounts.group_discount
      .filter(g => quantity >= g.min_quantity)
      .sort((a, b) => b.min_quantity - a.min_quantity)[0];
      
    if (applicable) {
      const discount = applicable.discount_type === 'rate'
        ? price * applicable.discount_value
        : applicable.discount_value * quantity;
      price -= discount;
      discounts.push({ name: `Group (${quantity}+)`, amount: discount });
    }
  }
  
  // 3. 优惠券（如果允许）
  if (strategy.discounts.coupon_allowed && couponAmount) {
    price -= couponAmount;
    discounts.push({ name: 'Coupon', amount: couponAmount });
  }
  
  // 确保价格不为负
  price = Math.max(0, price);
  
  return {
    original_total: strategy.original_price * quantity,
    base_total: strategy.base_price * quantity,
    final_price: price,
    discounts,
    total_discount: discounts.reduce((sum, d) => sum + d.amount, 0),
    savings_rate: ((strategy.original_price * quantity - price) / (strategy.original_price * quantity) * 100).toFixed(2) + '%'
  };
}
```

**优先级**: 🟡 P2 - 建议修复

---

### 8. 【中危】溯源数据可被篡改

**位置**: 溯源系统

**问题描述**:
- 溯源数据只存在数据库中，可以被修改
- `blockchain_hash` 字段可能为空
- 没有定期验证机制

**解决方案**:
```typescript
// 1. 上传溯源数据时必须上链
async uploadTraceData(data: TraceDataDTO) {
  // 计算数据哈希
  const dataHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(data))
  );
  
  // 上链
  const tx = await traceContract.recordTrace(
    data.nft_token_id,
    data.stage,
    dataHash,
    Math.floor(Date.now() / 1000)
  );
  
  await tx.wait();
  
  // 存入数据库
  await prisma.trace_record.create({
    data: {
      ...data,
      data_hash: dataHash,
      blockchain_tx: tx.hash,
      blockchain_timestamp: Math.floor(Date.now() / 1000),
      verified: true
    }
  });
}

// 2. 验证溯源数据完整性
async verifyTraceData(traceId: string): Promise<boolean> {
  const record = await prisma.trace_record.findUnique({
    where: { trace_id: traceId }
  });
  
  if (!record || !record.blockchain_tx) {
    return false;
  }
  
  // 计算当前数据哈希
  const currentHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(JSON.stringify(record.data))
  );
  
  // 从链上获取记录的哈希
  const onChainHash = await traceContract.getTraceHash(
    record.nft_token_id,
    record.stage
  );
  
  // 比对哈希
  return currentHash === onChainHash;
}

// 3. 定期验证
cron.schedule('0 0 * * *', async () => {
  const records = await prisma.trace_record.findMany({
    where: {
      verified: true,
      created_at: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 最近7天
      }
    }
  });
  
  for (const record of records) {
    const isValid = await verifyTraceData(record.trace_id);
    if (!isValid) {
      // 发送告警
      await alertService.send({
        level: 'critical',
        message: `Trace data tampered: ${record.trace_id}`,
        details: record
      });
    }
  }
});
```

**优先级**: 🟡 P2 - 建议修复

---

### 9. 【中危】NFT铸造时机不当

**位置**: 购买流程

**问题描述**:
- 当前流程：用户支付后立即铸造NFT
- 问题：如果后续果园无法发货，NFT已经铸造给用户
- 用户持有NFT但无法收到实物

**建议方案**:

**方案A：延迟铸造**
```typescript
// 在确认收货后才铸造NFT
async confirmDelivery(orderId: string) {
  await prisma.$transaction(async (tx) => {
    // 1. 更新订单状态
    await tx.order.update({
      where: { order_id: orderId },
      data: { status: OrderStatus.COMPLETED }
    });
    
    // 2. 释放尾款
    await releaseEscrow(orderId, 'final_payment');
    
    // 3. 铸造NFT
    const tokenId = await mintNFT({
      owner: order.buyer_address,
      metadata: order.nft_metadata
    });
    
    // 4. 更新订单NFT信息
    await tx.order.update({
      where: { order_id: orderId },
      data: { nft_token_id: tokenId }
    });
  });
}
```

**方案B：预铸造+锁定**（推荐）
```typescript
// 支付后铸造但锁定转移功能
async createOrder(data: CreateOrderDTO) {
  // 1. 铸造NFT（但标记为锁定状态）
  const tokenId = await mintLockedNFT({
    owner: data.buyer_address,
    metadata: data.nft_metadata,
    locked: true  // 锁定，不可转移
  });
  
  // 2. 创建订单
  const order = await prisma.order.create({
    data: {
      ...data,
      nft_token_id: tokenId,
      status: OrderStatus.PAID
    }
  });
  
  return order;
}

// 确认收货后解锁NFT
async confirmDelivery(orderId: string) {
  const order = await getOrder(orderId);
  
  // 解锁NFT，用户可以自由转移
  await unlockNFT(order.nft_token_id);
  
  // 更新订单状态
  await updateOrderStatus(orderId, OrderStatus.COMPLETED);
}

// 退款时销毁NFT
async refundOrder(orderId: string) {
  const order = await getOrder(orderId);
  
  // 销毁NFT
  await burnNFT(order.nft_token_id);
  
  // 退款
  await processRefund(order);
}
```

**优先级**: 🟡 P2 - 建议调整

---

### 10. 【低危】浏览量统计不准确

**位置**: `PresaleService.ts` - `incrementViews()`

**问题描述**:
```typescript
// ❌ 问题：每次获取详情都增加浏览量
async getPresaleDetail(presaleId: string) {
  const presale = await prisma.presale.findUnique({...});
  
  // 无论谁访问都增加浏览量，包括：
  // - 同一用户多次访问
  // - 爬虫访问
  // - API测试
  await this.incrementViews(presaleId);
  
  return presale;
}
```

**解决方案**:
```typescript
async getPresaleDetail(
  presaleId: string,
  userId?: string,
  userIp?: string
) {
  const presale = await prisma.presale.findUnique({...});
  
  // ✅ 使用Redis去重，同一用户/IP在24小时内只计数一次
  const viewKey = `presale:view:${presaleId}:${userId || userIp}`;
  const viewed = await redis.get(viewKey);
  
  if (!viewed) {
    // 首次访问，增加浏览量
    await this.incrementViews(presaleId);
    
    // 设置24小时过期
    await redis.setex(viewKey, 86400, '1');
  }
  
  return presale;
}
```

**优先级**: 🟢 P3 - 可选优化

---

## 🟡 业务逻辑建议

### 1. 补充退款流程

当前文档中有争议处理，但缺少完整的退款流程：

```typescript
enum RefundType {
  FULL_REFUND = 'full_refund',        // 全额退款
  PARTIAL_REFUND = 'partial_refund',  // 部分退款
  COMPENSATION = 'compensation'        // 补偿
}

interface RefundRequest {
  order_id: string;
  type: RefundType;
  reason: string;
  evidence: string[];
  refund_amount?: number;  // 部分退款时需要
}

async processRefund(request: RefundRequest) {
  const order = await getOrder(request.order_id);
  
  // 1. 验证退款条件
  validateRefundConditions(order, request);
  
  // 2. 计算退款金额
  const refundAmount = calculateRefundAmount(order, request);
  
  // 3. 从托管合约退款
  await releaseEscrowToB买家(order.order_id, refundAmount);
  
  // 4. 更新订单状态
  await updateOrder(order.order_id, {
    status: OrderStatus.REFUNDED,
    refund_amount: refundAmount,
    refund_reason: request.reason
  });
  
  // 5. 释放库存
  await releaseInventory(order.presale_id, order.quantity);
  
  // 6. 处理NFT
  if (order.nft_token_id) {
    await burnNFT(order.nft_token_id);
  }
  
  // 7. 更新信用分
  await updateCreditScore(order.orchard_id, -10);  // 果园扣分
}
```

### 2. 补充用户限购逻辑

```typescript
// 检查用户购买限制
async checkPurchaseLimit(
  presaleId: string,
  userId: string,
  quantity: number
): Promise<void> {
  const presale = await getPresale(presaleId);
  const inventory = presale.inventory;
  
  // 1. 检查单次购买限制
  if (quantity < inventory.min_purchase) {
    throw new Error(`Minimum purchase is ${inventory.min_purchase}`);
  }
  
  if (quantity > inventory.max_purchase) {
    throw new Error(`Maximum purchase is ${inventory.max_purchase}`);
  }
  
  // 2. 检查用户累计购买限制
  const userOrders = await prisma.order.findMany({
    where: {
      presale_id: presaleId,
      user_id: userId,
      status: {
        in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.COMPLETED]
      }
    }
  });
  
  const totalPurchased = userOrders.reduce(
    (sum, order) => sum + order.quantity,
    0
  );
  
  if (totalPurchased + quantity > inventory.limit_per_user) {
    throw new Error(
      `You can only purchase ${inventory.limit_per_user} in total. ` +
      `Already purchased: ${totalPurchased}`
    );
  }
}
```

### 3. 补充收货地址验证

```typescript
interface ShippingAddress {
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  postal_code?: string;
}

async validateShippingAddress(
  address: ShippingAddress,
  presaleId: string
): Promise<void> {
  const presale = await getPresale(presaleId);
  
  // 1. 检查配送区域
  const shippingInfo = presale.shipping;
  const fullAddress = `${address.province}-${address.city}`;
  
  const isInRange = shippingInfo.regions.some(region => 
    region === '全国' || fullAddress.includes(region)
  );
  
  if (!isInRange) {
    throw new Error('This area is not in delivery range');
  }
  
  // 2. 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(address.phone)) {
    throw new Error('Invalid phone number');
  }
  
  // 3. 验证收件人姓名
  if (address.recipient.length < 2 || address.recipient.length > 20) {
    throw new Error('Invalid recipient name');
  }
  
  // 4. 验证详细地址
  if (address.address.length < 5) {
    throw new Error('Detailed address is too short');
  }
}
```

---

## 📊 总结

### 问题严重程度分布

| 严重程度 | 数量 | 问题列表 |
|---------|------|---------|
| 🔴 P0（严重）| 4 | 库存并发、资金分配、状态转换、重入攻击 |
| 🟠 P1（高危）| 2 | 订单超时、预售时间检查 |
| 🟡 P2（中危）| 3 | 价格策略、溯源验证、NFT铸造时机 |
| 🟢 P3（低危）| 1 | 浏览量统计 |
| **总计** | **10** | |

### 修复优先级建议

#### 第一批（必须修复）- P0
1. ✅ 库存并发控制 - 使用数据库事务和行锁
2. ✅ 资金分配精度 - 修正计算逻辑
3. ✅ 状态转换检查 - 完善状态机
4. ✅ 智能合约安全 - 防重入攻击

#### 第二批（应尽快修复）- P1
5. ✅ 订单超时处理 - 添加定时任务
6. ✅ 预售时间验证 - 后端强制检查

#### 第三批（建议修复）- P2
7. ✅ 价格策略完善 - 明确计算规则
8. ✅ 溯源数据验证 - 定期校验机制
9. ✅ NFT铸造优化 - 采用锁定方案

#### 第四批（可选优化）- P3
10. ✅ 浏览量去重 - Redis缓存

### 业务逻辑补充

- ✅ 完整退款流程
- ✅ 用户限购检查
- ✅ 收货地址验证
- ✅ 库存释放机制
- ✅ 信用评分系统

---

## 💡 最佳实践建议

### 1. 代码审查清单

在每次发布前检查：

```
数据一致性：
□ 所有金额计算使用整数（分）
□ 所有库存操作使用事务
□ 所有状态转换有验证

安全性：
□ 所有用户输入已验证
□ 所有金额操作有上下限
□ 所有合约调用有重入保护

业务逻辑：
□ 所有时间判断在后端
□ 所有限制条件已实施
□ 所有异常情况已处理
```

### 2. 测试用例建议

```typescript
// 并发测试
describe('Inventory Concurrency', () => {
  it('should handle concurrent purchases correctly', async () => {
    // 100个用户同时购买最后10个库存
    // 应该只有10个成功，90个失败
  });
});

// 边界测试
describe('Price Calculation', () => {
  it('should handle precision correctly', () => {
    // 测试各种金额组合
    // 确保总和始终等于100%
  });
});

// 状态机测试
describe('Presale Status', () => {
  it('should validate all state transitions', () => {
    // 测试所有可能的状态转换
    // 确保非法转换被拒绝
  });
});
```

### 3. 监控告警建议

```typescript
// 关键指标监控
const alerts = [
  {
    name: '库存异常',
    condition: 'inventory.sold > inventory.total',
    level: 'critical'
  },
  {
    name: '资金不一致',
    condition: 'escrow.released + escrow.locked != escrow.total',
    level: 'critical'
  },
  {
    name: '订单超时',
    condition: 'pending_orders_age > 30m',
    level: 'warning'
  },
  {
    name: '溯源数据异常',
    condition: 'trace_verification_failed',
    level: 'high'
  }
];
```

---

**审查日期**: 2025-10-05  
**审查人**: AI Code Reviewer  
**下次审查**: 修复完成后

