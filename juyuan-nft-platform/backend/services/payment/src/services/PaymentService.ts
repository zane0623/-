import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { ethers } from 'ethers';
import axios from 'axios';

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-11-15'
});

interface CreateStripePaymentParams {
  amount: number;
  currency: string;
  userId?: string;
  presaleId?: number;
  metadata?: any;
}

interface CreateWeChatPaymentParams {
  amount: number;
  description: string;
  userId?: string;
  presaleId?: number;
}

interface CreateAlipayPaymentParams {
  amount: number;
  subject: string;
  userId?: string;
  presaleId?: number;
}

interface CreateCryptoPaymentParams {
  amount: number;
  currency: string;
  userId?: string;
  walletAddress?: string;
  presaleId: number;
}

export class PaymentService {
  /**
   * 创建Stripe支付意图
   */
  async createStripePaymentIntent(params: CreateStripePaymentParams) {
    const { amount, currency, userId, presaleId, metadata } = params;

    // 创建Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe使用分为单位
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        userId: userId || '',
        presaleId: presaleId?.toString() || '',
        ...metadata
      }
    });

    // 保存到数据库
    const payment = await prisma.payment.create({
      data: {
        userId: userId || '',
        amount,
        currency,
        method: 'STRIPE',
        status: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
        presaleId,
        metadata: metadata || {}
      }
    });

    return {
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      stripePaymentIntentId: paymentIntent.id
    };
  }

  /**
   * 创建微信支付订单
   */
  async createWeChatPayment(params: CreateWeChatPaymentParams) {
    const { amount, description, userId, presaleId } = params;

    // 生成订单号
    const outTradeNo = `WX${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

    // 这里应该调用微信支付API
    // 简化实现
    const wechatOrder = {
      outTradeNo,
      prepayId: `prepay_${Date.now()}`,
      codeUrl: `weixin://wxpay/bizpayurl?pr=${Date.now()}`
    };

    // 保存到数据库
    const payment = await prisma.payment.create({
      data: {
        userId: userId || '',
        amount,
        currency: 'CNY',
        method: 'WECHAT',
        status: 'PENDING',
        outTradeNo,
        presaleId,
        metadata: { description }
      }
    });

    return {
      paymentId: payment.id,
      ...wechatOrder
    };
  }

  /**
   * 创建支付宝订单
   */
  async createAlipayPayment(params: CreateAlipayPaymentParams) {
    const { amount, subject, userId, presaleId } = params;

    // 生成订单号
    const outTradeNo = `ALI${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

    // 这里应该调用支付宝API
    // 简化实现
    const alipayOrder = {
      outTradeNo,
      payUrl: `https://alipay.com/pay?order=${outTradeNo}`
    };

    // 保存到数据库
    const payment = await prisma.payment.create({
      data: {
        userId: userId || '',
        amount,
        currency: 'CNY',
        method: 'ALIPAY',
        status: 'PENDING',
        outTradeNo,
        presaleId,
        metadata: { subject }
      }
    });

    return {
      paymentId: payment.id,
      ...alipayOrder
    };
  }

  /**
   * 创建加密货币支付
   */
  async createCryptoPayment(params: CreateCryptoPaymentParams) {
    const { amount, currency, userId, walletAddress, presaleId } = params;

    // 生成支付地址（这里应该是平台的收款地址）
    const paymentAddress = process.env.PLATFORM_CRYPTO_ADDRESS || '';

    // 保存到数据库
    const payment = await prisma.payment.create({
      data: {
        userId: userId || '',
        amount,
        currency,
        method: 'CRYPTO',
        status: 'PENDING',
        walletAddress,
        presaleId,
        metadata: {
          paymentAddress,
          network: 'ethereum' // 或其他网络
        }
      }
    });

    return {
      paymentId: payment.id,
      paymentAddress,
      amount,
      currency,
      network: 'ethereum'
    };
  }

  /**
   * 获取支付详情
   */
  async getPayment(paymentId: string) {
    return await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });
  }

  /**
   * 获取用户支付历史
   */
  async getUserPayments(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.payment.count({
        where: { userId }
      })
    ]);

    return {
      payments,
      total
    };
  }

  /**
   * 确认支付
   */
  async confirmPayment(paymentId: string) {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date()
      }
    });

    // 触发后续流程（如：铸造NFT）
    await this.triggerPostPaymentActions(payment);

    return payment;
  }

  /**
   * 退款
   */
  async refundPayment(paymentId: string, reason?: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'CONFIRMED') {
      throw new Error('Only confirmed payments can be refunded');
    }

    // 根据支付方式处理退款
    if (payment.method === 'STRIPE' && payment.stripePaymentIntentId) {
      await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        reason: 'requested_by_customer'
      });
    }

    // 更新数据库
    const refundedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
        metadata: {
          ...payment.metadata as object,
          refundReason: reason
        }
      }
    });

    return refundedPayment;
  }

  /**
   * 获取支付统计
   */
  async getPaymentStats() {
    const [
      totalPayments,
      totalAmount,
      successfulPayments,
      pendingPayments,
      methodStats
    ] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { amount: true }
      }),
      prisma.payment.count({ where: { status: 'CONFIRMED' } }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.payment.groupBy({
        by: ['method'],
        _count: true,
        _sum: { amount: true }
      })
    ]);

    return {
      totalPayments,
      totalAmount: totalAmount._sum.amount || 0,
      successfulPayments,
      pendingPayments,
      methodStats
    };
  }

  /**
   * 处理Stripe支付成功
   */
  async handleStripePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (payment) {
      await this.confirmPayment(payment.id);
    }
  }

  /**
   * 处理Stripe支付失败
   */
  async handleStripePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'FAILED' }
    });
  }

  /**
   * 处理Stripe退款
   */
  async handleStripeRefund(charge: Stripe.Charge) {
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: charge.payment_intent as string },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date()
      }
    });
  }

  /**
   * 处理微信支付成功
   */
  async handleWeChatPaymentSuccess(data: { outTradeNo: string; transactionId: string }) {
    const payment = await prisma.payment.findFirst({
      where: { outTradeNo: data.outTradeNo }
    });

    if (payment) {
      await this.confirmPayment(payment.id);
    }
  }

  /**
   * 处理支付宝支付成功
   */
  async handleAlipayPaymentSuccess(data: { outTradeNo: string; tradeNo: string }) {
    const payment = await prisma.payment.findFirst({
      where: { outTradeNo: data.outTradeNo }
    });

    if (payment) {
      await this.confirmPayment(payment.id);
    }
  }

  /**
   * 触发支付后续操作
   */
  private async triggerPostPaymentActions(payment: any) {
    try {
      // 通知NFT服务铸造NFT
      if (payment.presaleId) {
        await axios.post(
          `${process.env.NFT_SERVICE_URL}/api/v1/nft/mint-from-payment`,
          {
            paymentId: payment.id,
            presaleId: payment.presaleId,
            userId: payment.userId
          }
        );
      }

      // 通知通知服务
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/notifications/send`,
        {
          userId: payment.userId,
          type: 'PAYMENT_SUCCESS',
          data: {
            paymentId: payment.id,
            amount: payment.amount,
            currency: payment.currency
          }
        }
      );
    } catch (error) {
      console.error('Error triggering post-payment actions:', error);
    }
  }
}


