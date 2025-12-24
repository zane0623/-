import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import axios from 'axios';

const prisma = new PrismaClient();

interface CreatePresaleParams {
  productType: string;
  maxSupply: number;
  price: number;
  currency: string;
  startTime: string;
  endTime: string;
  minPurchase?: number;
  maxPurchase?: number;
  whitelistEnabled?: boolean;
  metadata?: any;
}

interface PurchaseParams {
  presaleId: string;
  userId: string;
  walletAddress?: string;
  quantity: number;
  paymentMethod: string;
}

export class PresaleService {
  /**
   * 创建预售活动
   */
  async createPresale(params: CreatePresaleParams) {
    const {
      productType,
      maxSupply,
      price,
      currency,
      startTime,
      endTime,
      minPurchase = 1,
      maxPurchase = 100,
      whitelistEnabled = false,
      metadata
    } = params;

    // 验证时间
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      throw new Error('End time must be after start time');
    }

    const presale = await prisma.presale.create({
      data: {
        productType,
        maxSupply,
        currentSupply: 0,
        price,
        currency,
        startTime: start,
        endTime: end,
        minPurchase,
        maxPurchase,
        whitelistEnabled,
        status: start > new Date() ? 'UPCOMING' : 'ACTIVE',
        metadata: metadata || {}
      }
    });

    return presale;
  }

  /**
   * 获取预售列表
   */
  async getPresales(status?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    // 自动更新状态
    const now = new Date();
    await prisma.presale.updateMany({
      where: {
        status: 'UPCOMING',
        startTime: { lte: now }
      },
      data: { status: 'ACTIVE' }
    });

    await prisma.presale.updateMany({
      where: {
        status: 'ACTIVE',
        endTime: { lte: now }
      },
      data: { status: 'ENDED' }
    });

    const [presales, total] = await Promise.all([
      prisma.presale.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.presale.count({ where })
    ]);

    return { presales, total };
  }

  /**
   * 获取预售详情
   */
  async getPresaleById(presaleId: string) {
    return await prisma.presale.findUnique({
      where: { id: presaleId },
      include: {
        _count: {
          select: { purchases: true }
        }
      }
    });
  }

  /**
   * 参与预售购买
   */
  async purchase(params: PurchaseParams) {
    const { presaleId, userId, walletAddress, quantity, paymentMethod } = params;

    // 获取预售信息
    const presale = await prisma.presale.findUnique({
      where: { id: presaleId }
    });

    if (!presale) {
      throw new Error('Presale not found');
    }

    // 检查状态
    if (presale.status !== 'ACTIVE') {
      throw new Error('Presale is not active');
    }

    // 检查库存
    if (presale.currentSupply + quantity > presale.maxSupply) {
      throw new Error('Exceeds available supply');
    }

    // 检查购买限制
    if (quantity < presale.minPurchase) {
      throw new Error(`Minimum purchase is ${presale.minPurchase}`);
    }

    if (quantity > presale.maxPurchase) {
      throw new Error(`Maximum purchase is ${presale.maxPurchase}`);
    }

    // 检查白名单
    if (presale.whitelistEnabled && walletAddress) {
      const whitelist = await prisma.whitelist.findFirst({
        where: {
          presaleId,
          address: walletAddress.toLowerCase()
        }
      });

      if (!whitelist) {
        throw new Error('Not whitelisted');
      }
    }

    // 检查用户购买限制
    const userPurchases = await prisma.purchase.aggregate({
      where: {
        presaleId,
        userId
      },
      _sum: { quantity: true }
    });

    const totalPurchased = (userPurchases._sum.quantity || 0) + quantity;
    if (totalPurchased > presale.maxPurchase) {
      throw new Error(`Purchase limit exceeded. You can only buy ${presale.maxPurchase - (userPurchases._sum.quantity || 0)} more`);
    }

    // 计算总金额
    const totalAmount = presale.price * quantity;

    // 创建购买记录
    const purchase = await prisma.$transaction(async (tx: any) => {
      // 创建购买记录
      const newPurchase = await tx.purchase.create({
        data: {
          presaleId,
          userId,
          walletAddress,
          quantity,
          unitPrice: presale.price,
          totalAmount,
          currency: presale.currency,
          paymentMethod,
          status: 'PENDING'
        }
      });

      // 更新预售库存
      await tx.presale.update({
        where: { id: presaleId },
        data: {
          currentSupply: { increment: quantity }
        }
      });

      return newPurchase;
    });

    // 触发支付流程
    await this.initiatePayment(purchase, paymentMethod);

    return purchase;
  }

  /**
   * 获取预售的购买记录
   */
  async getPresalePurchases(presaleId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where: { presaleId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, username: true, walletAddress: true }
          }
        }
      }),
      prisma.purchase.count({ where: { presaleId } })
    ]);

    return { purchases, total };
  }

  /**
   * 获取用户购买记录
   */
  async getUserPurchases(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          presale: {
            select: { productType: true, price: true, currency: true }
          }
        }
      }),
      prisma.purchase.count({ where: { userId } })
    ]);

    return { purchases, total };
  }

  /**
   * 取消预售
   */
  async cancelPresale(presaleId: string) {
    const presale = await prisma.presale.update({
      where: { id: presaleId },
      data: { status: 'CANCELLED' }
    });

    // 触发退款流程
    await this.processRefunds(presaleId);

    return presale;
  }

  /**
   * 获取预售统计
   */
  async getPresaleStats() {
    const [
      totalPresales,
      activePresales,
      totalSales,
      totalRevenue
    ] = await Promise.all([
      prisma.presale.count(),
      prisma.presale.count({ where: { status: 'ACTIVE' } }),
      prisma.purchase.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { quantity: true }
      }),
      prisma.purchase.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { totalAmount: true }
      })
    ]);

    return {
      totalPresales,
      activePresales,
      totalSales: totalSales._sum.quantity || 0,
      totalRevenue: totalRevenue._sum.totalAmount || 0
    };
  }

  /**
   * 初始化支付
   */
  private async initiatePayment(purchase: any, paymentMethod: string) {
    try {
      await axios.post(
        `${process.env.PAYMENT_SERVICE_URL}/api/v1/payment/initiate`,
        {
          purchaseId: purchase.id,
          amount: purchase.totalAmount,
          currency: purchase.currency,
          method: paymentMethod,
          userId: purchase.userId
        }
      );
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  }

  /**
   * 处理退款
   */
  private async processRefunds(presaleId: string) {
    const purchases = await prisma.purchase.findMany({
      where: {
        presaleId,
        status: 'CONFIRMED'
      }
    });

    for (const purchase of purchases) {
      try {
        await axios.post(
          `${process.env.PAYMENT_SERVICE_URL}/api/v1/payment/${purchase.id}/refund`,
          { reason: 'Presale cancelled' }
        );
      } catch (error) {
        console.error('Error processing refund:', error);
      }
    }
  }
}

