import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';

const prisma = new PrismaClient();

interface AddEventParams {
  tokenId: number;
  eventType: string;
  description: string;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  operator?: string;
  metadata?: any;
}

interface AddMediaParams {
  type: string;
  url: string;
  description?: string;
}

export class EventService {
  /**
   * 添加溯源事件
   */
  async addEvent(params: AddEventParams) {
    const { tokenId, eventType, description, location, operator, metadata } = params;

    // 创建事件
    const event = await prisma.traceEvent.create({
      data: {
        tokenId,
        eventType,
        description,
        location: location || {},
        operator,
        metadata: metadata || {},
        timestamp: new Date()
      }
    });

    // 可选：将事件hash上链
    // const txHash = await this.recordOnChain(event);
    // await prisma.traceEvent.update({
    //   where: { id: event.id },
    //   data: { txHash }
    // });

    return event;
  }

  /**
   * 获取NFT的所有溯源事件
   */
  async getEvents(tokenId: number) {
    return await prisma.traceEvent.findMany({
      where: { tokenId },
      include: { media: true },
      orderBy: { timestamp: 'asc' }
    });
  }

  /**
   * 批量添加溯源事件
   */
  async addBatchEvents(events: AddEventParams[]) {
    const results = await Promise.all(
      events.map(e => this.addEvent(e))
    );

    return {
      count: results.length,
      events: results
    };
  }

  /**
   * 更新溯源事件
   */
  async updateEvent(eventId: string, data: Partial<AddEventParams>) {
    return await prisma.traceEvent.update({
      where: { id: eventId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  /**
   * 为事件添加媒体文件
   */
  async addMedia(eventId: string, media: AddMediaParams) {
    return await prisma.traceMedia.create({
      data: {
        eventId,
        type: media.type,
        url: media.url,
        description: media.description
      }
    });
  }

  /**
   * 删除溯源事件
   */
  async deleteEvent(eventId: string) {
    // 先删除关联的媒体
    await prisma.traceMedia.deleteMany({
      where: { eventId }
    });

    return await prisma.traceEvent.delete({
      where: { id: eventId }
    });
  }

  /**
   * 获取事件类型统计
   */
  async getEventStats(tokenId: number) {
    const events = await prisma.traceEvent.groupBy({
      by: ['eventType'],
      where: { tokenId },
      _count: true
    });

    return events.map((e: { eventType: string; _count: number }) => ({
      eventType: e.eventType,
      count: e._count
    }));
  }

  /**
   * 记录到区块链（可选）
   */
  private async recordOnChain(event: any): Promise<string | null> {
    try {
      // 计算事件hash
      const eventHash = ethers.keccak256(
        ethers.toUtf8Bytes(JSON.stringify({
          tokenId: event.tokenId,
          eventType: event.eventType,
          timestamp: event.timestamp.toISOString()
        }))
      );

      // 这里应该调用智能合约记录hash
      // const contract = new ethers.Contract(...)
      // const tx = await contract.recordEvent(eventHash)
      // return tx.hash

      return eventHash;
    } catch (error) {
      // Error logging handled by error handler middleware
      return null;
    }
  }
}

