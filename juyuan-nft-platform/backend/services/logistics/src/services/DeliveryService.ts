import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface CreateDeliveryParams {
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  address: {
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    weight?: number;
  }>;
  notes?: string;
}

interface ShipDeliveryParams {
  deliveryId: string;
  courier: string;
  trackingNumber: string;
  estimatedDelivery?: Date;
}

export class DeliveryService {
  /**
   * 创建配送订单
   */
  async createDelivery(params: CreateDeliveryParams) {
    const {
      orderId,
      recipientName,
      recipientPhone,
      address,
      items,
      notes
    } = params;

    const delivery = await prisma.delivery.create({
      data: {
        orderId,
        recipientName,
        recipientPhone,
        address,
        items,
        notes,
        status: 'PENDING'
      }
    });

    // 通知物流合作伙伴
    await this.notifyLogisticsPartner(delivery);

    return delivery;
  }

  /**
   * 获取配送详情
   */
  async getDelivery(deliveryId: string) {
    return await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        trackingEvents: {
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });
  }

  /**
   * 根据订单ID获取配送信息
   */
  async getDeliveriesByOrderId(orderId: string) {
    return await prisma.delivery.findMany({
      where: { orderId },
      include: {
        trackingEvents: {
          orderBy: {
            timestamp: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * 发货
   */
  async shipDelivery(params: ShipDeliveryParams) {
    const { deliveryId, courier, trackingNumber, estimatedDelivery } = params;

    const delivery = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        status: 'SHIPPED',
        courier,
        trackingNumber,
        shippedAt: new Date(),
        estimatedDelivery
      }
    });

    // 添加追踪事件
    await prisma.trackingEvent.create({
      data: {
        deliveryId,
        status: 'SHIPPED',
        description: `已由${courier}发货，运单号：${trackingNumber}`,
        timestamp: new Date()
      }
    });

    // 通知用户
    await this.notifyUser(delivery, 'SHIPPED');

    return delivery;
  }

  /**
   * 更新配送状态
   */
  async updateDeliveryStatus(
    deliveryId: string,
    status: string,
    notes?: string
  ) {
    const delivery = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        status,
        ...(status === 'DELIVERED' && { deliveredAt: new Date() }),
        ...(status === 'CANCELLED' && { cancelledAt: new Date() })
      }
    });

    // 添加追踪事件
    await prisma.trackingEvent.create({
      data: {
        deliveryId,
        status,
        description: notes || `状态更新为：${status}`,
        timestamp: new Date()
      }
    });

    // 如果已送达，触发NFT交付确认
    if (status === 'DELIVERED') {
      await this.triggerNFTDelivery(delivery);
    }

    // 通知用户
    await this.notifyUser(delivery, status);

    return delivery;
  }

  /**
   * 确认收货
   */
  async confirmDelivery(
    deliveryId: string,
    rating?: number,
    feedback?: string
  ) {
    const delivery = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
        rating,
        feedback
      }
    });

    // 触发NFT交付确认
    await this.triggerNFTDelivery(delivery);

    return delivery;
  }

  /**
   * 获取配送统计
   */
  async getDeliveryStats() {
    const [
      totalDeliveries,
      pendingDeliveries,
      shippedDeliveries,
      deliveredDeliveries,
      statusStats
    ] = await Promise.all([
      prisma.delivery.count(),
      prisma.delivery.count({ where: { status: 'PENDING' } }),
      prisma.delivery.count({ where: { status: 'SHIPPED' } }),
      prisma.delivery.count({ where: { status: 'DELIVERED' } }),
      prisma.delivery.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    // 平均配送时间
    const deliveries = await prisma.delivery.findMany({
      where: {
        status: 'DELIVERED',
        shippedAt: { not: null },
        deliveredAt: { not: null }
      },
      select: {
        shippedAt: true,
        deliveredAt: true
      }
    });

    const avgDeliveryTime = deliveries.length > 0
      ? deliveries.reduce((sum, d) => {
          const time = d.deliveredAt!.getTime() - d.shippedAt!.getTime();
          return sum + time;
        }, 0) / deliveries.length / (1000 * 60 * 60 * 24) // 转换为天
      : 0;

    return {
      totalDeliveries,
      pendingDeliveries,
      shippedDeliveries,
      deliveredDeliveries,
      avgDeliveryTime: avgDeliveryTime.toFixed(2),
      statusStats
    };
  }

  /**
   * 搜索配送订单
   */
  async searchDeliveries(filters: any, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.courier) {
      where.courier = { contains: filters.courier, mode: 'insensitive' };
    }
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          trackingEvents: {
            take: 1,
            orderBy: {
              timestamp: 'desc'
            }
          }
        }
      }),
      prisma.delivery.count({ where })
    ]);

    return {
      deliveries,
      total
    };
  }

  /**
   * 通知物流合作伙伴
   */
  private async notifyLogisticsPartner(delivery: any) {
    try {
      // 这里应该调用实际的物流API
      console.log('Notifying logistics partner for delivery:', delivery.id);
    } catch (error) {
      console.error('Error notifying logistics partner:', error);
    }
  }

  /**
   * 通知用户
   */
  private async notifyUser(delivery: any, status: string) {
    try {
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/api/v1/notifications/send`,
        {
          userId: delivery.userId,
          type: 'DELIVERY_UPDATE',
          data: {
            deliveryId: delivery.id,
            status,
            trackingNumber: delivery.trackingNumber
          }
        }
      );
    } catch (error) {
      console.error('Error notifying user:', error);
    }
  }

  /**
   * 触发NFT交付
   */
  private async triggerNFTDelivery(delivery: any) {
    try {
      await axios.post(
        `${process.env.NFT_SERVICE_URL}/api/v1/nft/confirm-delivery`,
        {
          orderId: delivery.orderId,
          deliveryId: delivery.id
        }
      );
    } catch (error) {
      console.error('Error triggering NFT delivery:', error);
    }
  }
}


