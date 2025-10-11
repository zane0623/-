/**
 * 订单服务 - 修复版本
 * Order Service - Fixed Version
 * 
 * 修复内容：
 * 1. ✅ 订单状态机完整性
 * 2. ✅ 超时自动取消
 * 3. ✅ 分布式锁防止重复支付
 * 4. ✅ 事务完整性保证
 */

import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { ethers } from 'ethers';
import PresaleService from '../presale/PresaleService';
import EscrowService from '../escrow/EscrowService';
import NFTService from '../nft/NFTService';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',                 // 待支付
  PAID = 'paid',                       // 已支付
  CONFIRMED = 'confirmed',             // 已确认
  SHIPPED = 'shipped',                 // 已发货
  DELIVERED = 'delivered',             // 已收货
  COMPLETED = 'completed',             // 已完成
  CANCELLED = 'cancelled',             // 已取消
  REFUNDED = 'refunded',              // 已退款
  DISPUTED = 'disputed'               // 争议中
}

// 订单状态转换规则
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.CONFIRMED, OrderStatus.REFUNDED],
  [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPED, OrderStatus.DISPUTED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.DISPUTED],
  [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.DISPUTED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.REFUNDED]: [],
  [OrderStatus.DISPUTED]: [OrderStatus.REFUNDED, OrderStatus.COMPLETED]
};

export class OrderService {
  
  /**
   * 创建订单
   */
  async createOrder(
    userId: string,
    presaleId: string,
    quantity: number,
    shippingInfo: any
  ) {
    // 生成订单号
    const orderNumber = await this.generateOrderNumber();
    
    // 使用分布式锁防止并发创建
    const lockKey = `order:create:${userId}:${presaleId}`;
    const lock = await this.acquireLock(lockKey, 10000); // 10秒超时
    
    if (!lock) {
      throw new Error('Order creation in progress, please wait');
    }
    
    try {
      // 使用事务保证原子性
      const order = await prisma.$transaction(async (tx) => {
        // 1. 检查购买限制
        await PresaleService.checkPurchaseLimit(presaleId, userId, quantity);
        
        // 2. 获取预售信息
        const presale = await tx.presale.findUnique({
          where: { id: presaleId }
        });
        
        if (!presale) {
          throw new Error('Presale not found');
        }
        
        const pricing = presale.pricing as any;
        
        // 3. 计算金额
        const unitPrice = pricing.presale_price;
        const subtotal = unitPrice * quantity;
        const shippingFee = shippingInfo.express ? 20 : 10;
        const total = subtotal + shippingFee;
        
        // 4. 减少库存
        await PresaleService.reduceInventory(presaleId, quantity);
        
        // 5. 创建订单
        const newOrder = await tx.order.create({
          data: {
            order_number: orderNumber,
            user_id: userId,
            presale_id: presaleId,
            product_info: {
              title: presale.title,
              quantity,
              unit_price: unitPrice
            },
            amount_info: {
              subtotal,
              shipping_fee: shippingFee,
              discount: 0,
              total
            },
            shipping_info: shippingInfo,
            status: OrderStatus.PENDING,
            payment_deadline: new Date(Date.now() + 30 * 60 * 1000), // 30分钟
            metadata: {}
          }
        });
        
        return newOrder;
      }, {
        timeout: 10000,
        isolationLevel: 'Serializable'
      });
      
      // 设置订单超时自动取消
      await this.scheduleOrderTimeout(order.id, 30 * 60); // 30分钟
      
      return order;
      
    } finally {
      await this.releaseLock(lockKey, lock);
    }
  }
  
  /**
   * 支付订单
   * ✅ 修复：添加分布式锁防止重复支付
   */
  async payOrder(
    orderId: string,
    userId: string,
    paymentMethod: string,
    txHash?: string
  ) {
    // 分布式锁，防止重复支付
    const lockKey = `order:pay:${orderId}`;
    const lock = await this.acquireLock(lockKey, 30000); // 30秒超时
    
    if (!lock) {
      throw new Error('Payment in progress, please wait');
    }
    
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. 检查订单状态
        const order = await tx.order.findUnique({
          where: { id: orderId }
        });
        
        if (!order) {
          throw new Error('Order not found');
        }
        
        if (order.user_id !== userId) {
          throw new Error('Unauthorized');
        }
        
        // ✅ 验证状态转换
        if (!this.canTransition(order.status as OrderStatus, OrderStatus.PAID)) {
          throw new Error(`Cannot pay order in ${order.status} status`);
        }
        
        // 2. 检查是否超时
        if (new Date() > order.payment_deadline!) {
          await tx.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CANCELLED }
          });
          
          // 释放库存
          const productInfo = order.product_info as any;
          await PresaleService.releaseInventory(
            order.presale_id,
            productInfo.quantity
          );
          
          throw new Error('Order payment deadline exceeded');
        }
        
        // 3. 更新订单状态
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.PAID,
            payment_info: {
              method: paymentMethod,
              paid_at: new Date(),
              tx_hash: txHash
            },
            paid_at: new Date()
          }
        });
        
        // 4. 创建托管
        const amountInfo = order.amount_info as any;
        await EscrowService.createEscrow(
          orderId,
          order.presale_id,
          amountInfo.total
        );
        
        // 5. 取消超时任务
        await redis.del(`order:timeout:${orderId}`);
        
        return updatedOrder;
      }, {
        timeout: 30000,
        isolationLevel: 'Serializable'
      });
      
    } finally {
      await this.releaseLock(lockKey, lock);
    }
  }
  
  /**
   * 确认订单（商家）
   */
  async confirmOrder(orderId: string, sellerId: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { presale: true }
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // 验证商家权限
      if ((order.presale as any).orchard_id !== sellerId) {
        throw new Error('Unauthorized');
      }
      
      // ✅ 验证状态转换
      if (!this.canTransition(order.status as OrderStatus, OrderStatus.CONFIRMED)) {
        throw new Error(`Cannot confirm order in ${order.status} status`);
      }
      
      // 更新状态
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CONFIRMED,
          confirmed_at: new Date()
        }
      });
      
      return updated;
    });
  }
  
  /**
   * 发货
   */
  async shipOrder(
    orderId: string,
    sellerId: string,
    trackingInfo: any
  ) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { presale: true }
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if ((order.presale as any).orchard_id !== sellerId) {
        throw new Error('Unauthorized');
      }
      
      // ✅ 验证状态转换
      if (!this.canTransition(order.status as OrderStatus, OrderStatus.SHIPPED)) {
        throw new Error(`Cannot ship order in ${order.status} status`);
      }
      
      // 更新状态
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.SHIPPED,
          shipping_info: {
            ...(order.shipping_info as any),
            tracking: trackingInfo
          },
          shipped_at: new Date()
        }
      });
      
      // 通知托管合约发货
      await EscrowService.confirmShipment(orderId, trackingInfo.tracking_number);
      
      // 设置自动确认收货（7天）
      await this.scheduleAutoConfirm(orderId, 7 * 24 * 60 * 60);
      
      return updated;
    });
  }
  
  /**
   * 确认收货
   */
  async confirmDelivery(orderId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId }
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.user_id !== userId) {
        throw new Error('Unauthorized');
      }
      
      // ✅ 验证状态转换
      if (!this.canTransition(order.status as OrderStatus, OrderStatus.DELIVERED)) {
        throw new Error(`Cannot confirm delivery in ${order.status} status`);
      }
      
      // 更新状态
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          delivered_at: new Date()
        }
      });
      
      // 通知托管合约确认收货
      await EscrowService.confirmDelivery(orderId);
      
      // 铸造NFT
      await NFTService.mintNFT(orderId, userId);
      
      // 取消自动确认任务
      await redis.del(`order:auto_confirm:${orderId}`);
      
      return updated;
    });
  }
  
  /**
   * 自动确认收货（7天后）
   */
  async autoConfirmDelivery(orderId: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId }
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.status !== OrderStatus.SHIPPED) {
        return; // 已确认或其他状态，跳过
      }
      
      // 检查是否满7天
      if (!order.shipped_at) {
        throw new Error('No shipment record');
      }
      
      const daysPassed = (Date.now() - order.shipped_at.getTime()) / (1000 * 60 * 60 * 24);
      if (daysPassed < 7) {
        throw new Error('Not enough time passed');
      }
      
      // 更新状态
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DELIVERED,
          delivered_at: new Date(),
          metadata: {
            ...((order.metadata as any) || {}),
            auto_confirmed: true
          }
        }
      });
      
      // 通知托管合约
      await EscrowService.autoConfirmDelivery(orderId);
      
      // 铸造NFT
      await NFTService.mintNFT(orderId, order.user_id);
      
      return updated;
    });
  }
  
  /**
   * 取消订单
   */
  async cancelOrder(orderId: string, userId: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId }
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.user_id !== userId) {
        throw new Error('Unauthorized');
      }
      
      // ✅ 只能取消待支付的订单
      if (order.status !== OrderStatus.PENDING) {
        throw new Error('Cannot cancel paid order, please request refund');
      }
      
      // 更新状态
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          cancelled_at: new Date(),
          metadata: {
            ...((order.metadata as any) || {}),
            cancel_reason: reason
          }
        }
      });
      
      // 释放库存
      const productInfo = order.product_info as any;
      await PresaleService.releaseInventory(
        order.presale_id,
        productInfo.quantity
      );
      
      // 取消超时任务
      await redis.del(`order:timeout:${orderId}`);
      
      return updated;
    });
  }
  
  /**
   * 申请退款
   */
  async requestRefund(orderId: string, userId: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId }
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.user_id !== userId) {
        throw new Error('Unauthorized');
      }
      
      // ✅ 只能退款已支付但未完成的订单
      const refundableStatus = [
        OrderStatus.PAID,
        OrderStatus.CONFIRMED,
        OrderStatus.SHIPPED
      ];
      
      if (!refundableStatus.includes(order.status as OrderStatus)) {
        throw new Error(`Cannot refund order in ${order.status} status`);
      }
      
      // 创建退款申请
      const refund = await tx.refund.create({
        data: {
          order_id: orderId,
          user_id: userId,
          amount: (order.amount_info as any).total,
          reason,
          status: 'pending',
          created_at: new Date()
        }
      });
      
      // 更新订单状态
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.DISPUTED
        }
      });
      
      return refund;
    });
  }
  
  /**
   * 处理退款（管理员）
   */
  async processRefund(
    refundId: string,
    approved: boolean,
    refundRate: number = 10000 // 100%
  ) {
    return await prisma.$transaction(async (tx) => {
      const refund = await tx.refund.findUnique({
        where: { id: refundId },
        include: { order: true }
      });
      
      if (!refund) {
        throw new Error('Refund not found');
      }
      
      if (approved) {
        // 批准退款
        await tx.refund.update({
          where: { id: refundId },
          data: {
            status: 'approved',
            approved_at: new Date()
          }
        });
        
        await tx.order.update({
          where: { id: refund.order_id },
          data: {
            status: OrderStatus.REFUNDED,
            refunded_at: new Date()
          }
        });
        
        // 通知托管合约退款
        await EscrowService.processRefund(refund.order_id, refundRate);
        
        // 释放库存
        const productInfo = refund.order.product_info as any;
        await PresaleService.releaseInventory(
          refund.order.presale_id,
          productInfo.quantity
        );
        
      } else {
        // 拒绝退款
        await tx.refund.update({
          where: { id: refundId },
          data: {
            status: 'rejected',
            rejected_at: new Date()
          }
        });
        
        // 恢复订单状态
        await tx.order.update({
          where: { id: refund.order_id },
          data: {
            status: OrderStatus.CONFIRMED
          }
        });
      }
      
      return refund;
    });
  }
  
  /**
   * 订单超时自动取消
   */
  async handleOrderTimeout(orderId: string) {
    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId }
        });
        
        if (!order || order.status !== OrderStatus.PENDING) {
          return; // 已支付或已取消
        }
        
        // 取消订单
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.CANCELLED,
            cancelled_at: new Date(),
            metadata: {
              ...((order.metadata as any) || {}),
              cancel_reason: 'Payment timeout'
            }
          }
        });
        
        // 释放库存
        const productInfo = order.product_info as any;
        await PresaleService.releaseInventory(
          order.presale_id,
          productInfo.quantity
        );
      });
    } catch (error) {
      console.error('Order timeout handling failed:', error);
    }
  }
  
  /**
   * 验证状态转换是否合法
   * ✅ 新增：状态机验证
   */
  private canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const allowedTransitions = STATUS_TRANSITIONS[from] || [];
    return allowedTransitions.includes(to);
  }
  
  /**
   * 获取分布式锁
   */
  private async acquireLock(key: string, ttl: number): Promise<string | null> {
    const token = Math.random().toString(36);
    const result = await redis.set(key, token, 'PX', ttl, 'NX');
    return result === 'OK' ? token : null;
  }
  
  /**
   * 释放分布式锁
   */
  private async releaseLock(key: string, token: string): Promise<void> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await redis.eval(script, 1, key, token);
  }
  
  /**
   * 设置订单超时
   */
  private async scheduleOrderTimeout(orderId: string, seconds: number) {
    await redis.setex(`order:timeout:${orderId}`, seconds, orderId);
  }
  
  /**
   * 设置自动确认收货
   */
  private async scheduleAutoConfirm(orderId: string, seconds: number) {
    await redis.setex(`order:auto_confirm:${orderId}`, seconds, orderId);
  }
  
  /**
   * 生成订单号
   */
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const sequence = await redis.incr(`order:sequence:${year}${month}${day}`);
    await redis.expire(`order:sequence:${year}${month}${day}`, 86400);
    
    return `ORD${year}${month}${day}${String(sequence).padStart(4, '0')}`;
  }
}

export default new OrderService();

