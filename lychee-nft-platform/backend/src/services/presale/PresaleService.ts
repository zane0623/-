/**
 * 预售服务
 * Presale Service
 */

import { PrismaClient } from '@prisma/client';
import {
  PresaleActivity,
  CreatePresaleDTO,
  UpdatePresaleDTO,
  QueryPresaleDTO,
  PresaleStatus,
  AuditStatus
} from '../../models/Presale.model';

const prisma = new PrismaClient();

export class PresaleService {
  
  /**
   * 创建预售活动
   */
  async createPresale(
    orchardId: string,
    data: CreatePresaleDTO
  ): Promise<PresaleActivity> {
    // 生成预售编号
    const presaleNumber = await this.generatePresaleNumber();
    
    // 创建预售记录
    const presale = await prisma.presale.create({
      data: {
        presale_number: presaleNumber,
        orchard_id: orchardId,
        title: data.title,
        subtitle: data.subtitle || '',
        description: data.description,
        cover_image: data.cover_image,
        banner_images: data.banner_images || [],
        product_info: data.product_info as any,
        pricing: data.pricing as any,
        inventory: data.inventory as any,
        timeline: data.timeline as any,
        nft_config: data.nft_config || {},
        shipping: data.shipping as any,
        tags: data.tags || [],
        status: PresaleStatus.DRAFT,
        audit_status: AuditStatus.PENDING,
        stats: {
          views: 0,
          likes: 0,
          shares: 0,
          conversion_rate: 0
        }
      }
    });
    
    return presale as PresaleActivity;
  }
  
  /**
   * 获取预售列表
   */
  async getPresaleList(query: QueryPresaleDTO) {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      sort = 'latest',
      keyword,
      orchard_id
    } = query;
    
    const skip = (page - 1) * limit;
    
    // 构建查询条件
    const where: any = {};
    
    if (category) {
      where.product_info = {
        path: ['category'],
        equals: category
      };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (orchard_id) {
      where.orchard_id = orchard_id;
    }
    
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ];
    }
    
    // 构建排序
    let orderBy: any = {};
    switch (sort) {
      case 'latest':
        orderBy = { created_at: 'desc' };
        break;
      case 'popular':
        orderBy = { stats: { path: ['views'], value: 'desc' } };
        break;
      case 'price_asc':
        orderBy = { pricing: { path: ['presale_price'], value: 'asc' } };
        break;
      case 'price_desc':
        orderBy = { pricing: { path: ['presale_price'], value: 'desc' } };
        break;
    }
    
    // 查询数据
    const [list, total] = await Promise.all([
      prisma.presale.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          orchard: {
            select: {
              id: true,
              name: true,
              location: true,
              rating: true
            }
          }
        }
      }),
      prisma.presale.count({ where })
    ]);
    
    return {
      list: list as PresaleActivity[],
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }
  
  /**
   * 获取预售详情
   */
  async getPresaleDetail(presaleId: string): Promise<PresaleActivity> {
    const presale = await prisma.presale.findUnique({
      where: { id: presaleId },
      include: {
        orchard: true
      }
    });
    
    if (!presale) {
      throw new Error('Presale not found');
    }
    
    // 增加浏览量
    await this.incrementViews(presaleId);
    
    return presale as PresaleActivity;
  }
  
  /**
   * 更新预售活动
   */
  async updatePresale(
    presaleId: string,
    data: UpdatePresaleDTO
  ): Promise<PresaleActivity> {
    // 检查预售是否存在
    const existingPresale = await prisma.presale.findUnique({
      where: { id: presaleId }
    });
    
    if (!existingPresale) {
      throw new Error('Presale not found');
    }
    
    // 检查状态是否允许修改
    if (existingPresale.status === PresaleStatus.ACTIVE) {
      throw new Error('Cannot update active presale');
    }
    
    // 更新数据
    const updated = await prisma.presale.update({
      where: { id: presaleId },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
    
    return updated as PresaleActivity;
  }
  
  /**
   * 审核预售活动
   */
  async reviewPresale(
    presaleId: string,
    approved: boolean,
    reason?: string
  ): Promise<PresaleActivity> {
    const presale = await prisma.presale.update({
      where: { id: presaleId },
      data: {
        audit_status: approved ? AuditStatus.APPROVED : AuditStatus.REJECTED,
        status: approved ? PresaleStatus.APPROVED : PresaleStatus.DRAFT,
        audit_reason: reason
      }
    });
    
    return presale as PresaleActivity;
  }
  
  /**
   * 发布预售活动
   */
  async publishPresale(presaleId: string): Promise<PresaleActivity> {
    // 检查审核状态
    const presale = await prisma.presale.findUnique({
      where: { id: presaleId }
    });
    
    if (!presale) {
      throw new Error('Presale not found');
    }
    
    if (presale.audit_status !== AuditStatus.APPROVED) {
      throw new Error('Presale not approved');
    }
    
    // 检查是否到预售时间
    const now = new Date();
    const timeline = presale.timeline as any;
    
    let newStatus = PresaleStatus.SCHEDULED;
    if (now >= new Date(timeline.presale_start)) {
      newStatus = PresaleStatus.ACTIVE;
    }
    
    // 更新状态
    const updated = await prisma.presale.update({
      where: { id: presaleId },
      data: {
        status: newStatus,
        published_at: new Date()
      }
    });
    
    return updated as PresaleActivity;
  }
  
  /**
   * 暂停预售活动
   */
  async pausePresale(presaleId: string): Promise<PresaleActivity> {
    const updated = await prisma.presale.update({
      where: { id: presaleId },
      data: {
        status: PresaleStatus.PAUSED
      }
    });
    
    return updated as PresaleActivity;
  }
  
  /**
   * 恢复预售活动
   */
  async resumePresale(presaleId: string): Promise<PresaleActivity> {
    const updated = await prisma.presale.update({
      where: { id: presaleId },
      data: {
        status: PresaleStatus.ACTIVE
      }
    });
    
    return updated as PresaleActivity;
  }
  
  /**
   * 减少库存
   */
  async reduceInventory(
    presaleId: string,
    quantity: number
  ): Promise<void> {
    const presale = await prisma.presale.findUnique({
      where: { id: presaleId }
    });
    
    if (!presale) {
      throw new Error('Presale not found');
    }
    
    const inventory = presale.inventory as any;
    
    // 检查库存
    if (inventory.available < quantity) {
      throw new Error('Insufficient inventory');
    }
    
    // 更新库存
    inventory.available -= quantity;
    inventory.sold += quantity;
    
    await prisma.presale.update({
      where: { id: presaleId },
      data: {
        inventory: inventory,
        // 如果售罄，更新状态
        status: inventory.available === 0 
          ? PresaleStatus.SOLD_OUT 
          : presale.status
      }
    });
  }
  
  /**
   * 增加浏览量
   */
  async incrementViews(presaleId: string): Promise<void> {
    await prisma.presale.update({
      where: { id: presaleId },
      data: {
        stats: {
          increment: { views: 1 }
        }
      }
    });
  }
  
  /**
   * 点赞
   */
  async likePresale(presaleId: string): Promise<void> {
    await prisma.presale.update({
      where: { id: presaleId },
      data: {
        stats: {
          increment: { likes: 1 }
        }
      }
    });
  }
  
  /**
   * 分享
   */
  async sharePresale(presaleId: string): Promise<void> {
    await prisma.presale.update({
      where: { id: presaleId },
      data: {
        stats: {
          increment: { shares: 1 }
        }
      }
    });
  }
  
  /**
   * 获取预售统计
   */
  async getPresaleStats(presaleId: string) {
    const presale = await prisma.presale.findUnique({
      where: { id: presaleId }
    });
    
    if (!presale) {
      throw new Error('Presale not found');
    }
    
    const inventory = presale.inventory as any;
    const pricing = presale.pricing as any;
    const stats = presale.stats as any;
    
    return {
      total_supply: inventory.total,
      sold_count: inventory.sold,
      available_count: inventory.available,
      sold_rate: (inventory.sold / inventory.total * 100).toFixed(2) + '%',
      total_sales: inventory.sold * pricing.presale_price,
      views: stats.views,
      likes: stats.likes,
      shares: stats.shares,
      conversion_rate: stats.conversion_rate
    };
  }
  
  /**
   * 生成预售编号
   */
  private async generatePresaleNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // 查询当天已有的预售数量
    const count = await prisma.presale.count({
      where: {
        presale_number: {
          startsWith: `PS${year}${month}${day}`
        }
      }
    });
    
    const sequence = String(count + 1).padStart(3, '0');
    return `PS${year}${month}${day}${sequence}`;
  }
  
  /**
   * 检查预售状态并自动更新
   */
  async checkAndUpdateStatus(): Promise<void> {
    const now = new Date();
    
    // 将已开始的预售设为进行中
    await prisma.presale.updateMany({
      where: {
        status: PresaleStatus.SCHEDULED,
        timeline: {
          path: ['presale_start'],
          lte: now
        }
      },
      data: {
        status: PresaleStatus.ACTIVE
      }
    });
    
    // 将已结束的预售设为已结束
    await prisma.presale.updateMany({
      where: {
        status: PresaleStatus.ACTIVE,
        timeline: {
          path: ['presale_end'],
          lte: now
        }
      },
      data: {
        status: PresaleStatus.ENDED
      }
    });
  }
}

export default new PresaleService();

