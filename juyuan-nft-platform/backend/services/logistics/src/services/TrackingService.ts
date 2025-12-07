import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface TrackingEvent {
  deliveryId: string;
  status: string;
  location?: string;
  description: string;
  timestamp: Date;
}

export class TrackingService {
  /**
   * 获取物流追踪信息
   */
  async getTrackingInfo(trackingNumber: string, courier?: string) {
    // 首先从数据库查找
    const delivery = await prisma.delivery.findFirst({
      where: {
        trackingNumber,
        ...(courier && { courier })
      },
      include: {
        trackingEvents: {
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });

    if (!delivery) {
      return null;
    }

    // 如果需要，从第三方物流API获取最新信息
    const externalTracking = await this.fetchExternalTracking(
      trackingNumber,
      delivery.courier
    );

    return {
      delivery,
      externalTracking,
      latestStatus: delivery.trackingEvents[0] || null
    };
  }

  /**
   * 根据配送ID获取追踪信息
   */
  async getTrackingByDeliveryId(deliveryId: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: {
        trackingEvents: {
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });

    if (!delivery) {
      return null;
    }

    // 如果有追踪号，获取外部追踪信息
    let externalTracking = null;
    if (delivery.trackingNumber) {
      externalTracking = await this.fetchExternalTracking(
        delivery.trackingNumber,
        delivery.courier
      );
    }

    return {
      delivery,
      events: delivery.trackingEvents,
      externalTracking
    };
  }

  /**
   * 添加追踪事件
   */
  async addTrackingEvent(event: TrackingEvent) {
    const trackingEvent = await prisma.trackingEvent.create({
      data: event
    });

    // 更新配送状态
    await prisma.delivery.update({
      where: { id: event.deliveryId },
      data: {
        status: event.status
      }
    });

    return trackingEvent;
  }

  /**
   * 批量添加追踪事件
   */
  async addTrackingEvents(events: TrackingEvent[]) {
    const results = await Promise.all(
      events.map(event => this.addTrackingEvent(event))
    );

    return results;
  }

  /**
   * 从第三方物流API获取追踪信息
   */
  private async fetchExternalTracking(trackingNumber: string, courier?: string) {
    try {
      // 这里应该调用实际的物流追踪API
      // 例如：顺丰、圆通、中通等快递公司的API
      
      // 模拟返回数据
      return {
        trackingNumber,
        courier,
        status: 'IN_TRANSIT',
        events: [
          {
            time: new Date().toISOString(),
            status: '运输中',
            location: '广州分拨中心',
            description: '包裹已到达广州分拨中心'
          },
          {
            time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            status: '已揽收',
            location: '深圳龙岗区',
            description: '快递员已揽收'
          }
        ]
      };

      // 实际实现示例（使用快递100 API）
      /*
      const response = await axios.post(
        'https://poll.kuaidi100.com/poll/query.do',
        {
          customer: process.env.KD100_CUSTOMER,
          sign: this.generateKD100Sign(),
          param: JSON.stringify({
            com: this.getCourierCode(courier),
            num: trackingNumber
          })
        }
      );

      return response.data;
      */
    } catch (error) {
      console.error('Error fetching external tracking:', error);
      return null;
    }
  }

  /**
   * 获取快递公司代码
   */
  private getCourierCode(courier?: string): string {
    const courierMap: Record<string, string> = {
      '顺丰': 'shunfeng',
      '圆通': 'yuantong',
      '中通': 'zhongtong',
      '申通': 'shentong',
      '韵达': 'yunda',
      'EMS': 'ems',
      '京东': 'jd'
    };

    return courierMap[courier || ''] || 'auto';
  }

  /**
   * 同步外部追踪信息
   */
  async syncExternalTracking(deliveryId: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId }
    });

    if (!delivery || !delivery.trackingNumber) {
      throw new Error('Delivery or tracking number not found');
    }

    const externalTracking = await this.fetchExternalTracking(
      delivery.trackingNumber,
      delivery.courier
    );

    if (externalTracking && externalTracking.events) {
      // 保存外部追踪事件到数据库
      for (const event of externalTracking.events) {
        await prisma.trackingEvent.upsert({
          where: {
            deliveryId_timestamp: {
              deliveryId,
              timestamp: new Date(event.time)
            }
          },
          create: {
            deliveryId,
            status: event.status,
            location: event.location,
            description: event.description,
            timestamp: new Date(event.time)
          },
          update: {
            status: event.status,
            location: event.location,
            description: event.description
          }
        });
      }
    }

    return externalTracking;
  }
}


