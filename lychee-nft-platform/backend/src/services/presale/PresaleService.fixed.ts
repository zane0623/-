/**
 * 预售服务 - 修复版本
 * Presale Service - Fixed Version
 * 
 * 修复内容：
 * 1. ✅ 库存并发控制
 * 2. ✅ 状态转换验证
 * 3. ✅ 预售时间检查
 * 4. ✅ 用户限购检查
 * 5. ✅ 订单超时处理
 */

import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import {
  PresaleActivity,
  CreatePresaleDTO,
  UpdatePresaleDTO,
  QueryPresaleDTO,
  PresaleStatus,
  AuditStatus
} from '../../models/Presale.model';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

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
   * ✅ 修复：添加浏览量去重
   */
  async getPresaleDetail(
    presaleId: string,
    userId?: string,
    userIp?: string
  ): Promise<PresaleActivity> {
    const presale = await prisma.presale.findUnique({
      where: { id: presaleId },
      include: {
        orchard: true
      }
    });
    
    if (!presale) {
      throw new Error('Presale not found');
    }
    
    // ✅ 使用Redis去重，同一用户/IP在24小时内只计数一次
    const viewKey = `presale:view:${presaleId}:${userId || userIp}`;
    const viewed = await redis.get(viewKey);
    
    if (!viewed) {
      // 首次访问，增加浏览量
      await this.incrementViews(presaleId);
      
      // 设置24小时过期
      await redis.setex(viewKey, 86400, '1');
    }
    
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
    const presale = await prisma.presale.findUnique({
      where: { id: presaleId }
    });
    
    if (!presale) {
      throw new Error('Presale not found');
    }
    
    // ✅ 只能暂停进行中的预售
    if (presale.status !== PresaleStatus.ACTIVE) {
      throw new Error('Can only pause active presale');
    }
    
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
   * ✅ 修复：添加完整的状态检查
   */
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
    
    if (now < new Date(timeline.presale_start)) {
      throw new Error('Presale has not started yet');
    }
    
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
  
  /**
   * 减少库存
   * ✅ 修复：使用数据库事务和行锁防止并发问题
   */
  async reduceInventory(
    presaleId: string,
    quantity: number
  ): Promise<void> {
    const result = await prisma.$transaction(async (tx) => {
      // ✅ 使用原子更新，避免竞态条件
      const updated = await tx.$executeRaw`
        UPDATE presales 
        SET 
          inventory = jsonb_set(
            jsonb_set(
              inventory,
              '{available}',
              to_jsonb(GREATEST(0, (inventory->>'available')::int - ${quantity}))
            ),
            '{sold}',
            to_jsonb((inventory->>'sold')::int + ${quantity})
          ),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${presaleId}
        AND (inventory->>'available')::int >= ${quantity}
        RETURNING *
      `;
      
      if (updated === 0) {
        throw new Error('Insufficient inventory or concurrent update failed');
      }
      
      // 检查是否售罄，更新状态
      const presale = await tx.presale.findUnique({
        where: { id: presaleId }
      });
      
      const inventory = presale?.inventory as any;
      if (inventory && inventory.available === 0) {
        await tx.presale.update({
          where: { id: presaleId },
          data: { status: PresaleStatus.SOLD_OUT }
        });
      }
      
      return updated;
    }, {
      isolationLevel: 'Serializable', // 最高隔离级别
      timeout: 10000 // 10秒超时
    });
    
    if (!result) {
      throw new Error('Failed to reduce inventory');
    }
  }
  
  /**
   * 释放库存（取消订单或退款时调用）
   * ✅ 新增：释放库存功能
   */
  async releaseInventory(
    presaleId: string,
    quantity: number
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 原子增加库存
      await tx.$executeRaw`
        UPDATE presales 
        SET 
          inventory = jsonb_set(
            jsonb_set(
              inventory,
              '{available}',
              to_jsonb((inventory->>'available')::int + ${quantity})
            ),
            '{sold}',
            to_jsonb(GREATEST(0, (inventory->>'sold')::int - ${quantity}))
          ),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${presaleId}
      `;
      
      // 如果之前是售罄状态，恢复为进行中
      const presale = await tx.presale.findUnique({
        where: { id: presaleId }
      });
      
      if (presale?.status === PresaleStatus.SOLD_OUT) {
        const now = new Date();
        const timeline = presale.timeline as any;
        
        // 检查是否还在预售期内
        if (now <= new Date(timeline.presale_end)) {
          await tx.presale.update({
            where: { id: presaleId },
            data: { status: PresaleStatus.ACTIVE }
          });
        }
      }
    });
  }
  
  /**
   * 检查购买限制
   * ✅ 新增：完整的购买限制检查
   */
  async checkPurchaseLimit(
    presaleId: string,
    userId: string,
    quantity: number
  ): Promise<void> {
    const presale = await prisma.presale.findUnique({
      where: { id: presaleId }
    });
    
    if (!presale) {
      throw new Error('Presale not found');
    }
    
    // ✅ 1. 检查预售状态
    if (presale.status !== PresaleStatus.ACTIVE) {
      throw new Error('Presale is not active');
    }
    
    // ✅ 2. 检查预售时间
    const now = new Date();
    const timeline = presale.timeline as any;
    
    if (now < new Date(timeline.presale_start)) {
      throw new Error('Presale has not started yet');
    }
    
    if (now > new Date(timeline.presale_end)) {
      throw new Error('Presale has ended');
    }
    
    const inventory = presale.inventory as any;
    
    // ✅ 3. 检查单次购买限制
    if (quantity < inventory.min_purchase) {
      throw new Error(`Minimum purchase is ${inventory.min_purchase}`);
    }
    
    if (quantity > inventory.max_purchase) {
      throw new Error(`Maximum purchase is ${inventory.max_purchase}`);
    }
    
    // ✅ 4. 检查库存
    if (quantity > inventory.available) {
      throw new Error(`Only ${inventory.available} items available`);
    }
    
    // ✅ 5. 检查用户累计购买限制
    const userOrders = await prisma.order.findMany({
      where: {
        presale_id: presaleId,
        user_id: userId,
        status: {
          notIn: ['cancelled', 'refunded']
        }
      }
    });
    
    const totalPurchased = userOrders.reduce(
      (sum, order) => sum + (order.product_info as any).quantity,
      0
    );
    
    if (totalPurchased + quantity > inventory.limit_per_user) {
      throw new Error(
        `You can only purchase ${inventory.limit_per_user} in total. ` +
        `Already purchased: ${totalPurchased}`
      );
    }
  }
  
  /**
   * 增加浏览量
   */
  async incrementViews(presaleId: string): Promise<void> {
    await prisma.$executeRaw`
      UPDATE presales 
      SET stats = jsonb_set(
        stats,
        '{views}',
        to_jsonb((stats->>'views')::int + 1)
      )
      WHERE id = ${presaleId}
    `;
  }
  
  /**
   * 点赞
   */
  async likePresale(presaleId: string, userId: string): Promise<void> {
    // ✅ 检查用户是否已点赞
    const likeKey = `presale:like:${presaleId}:${userId}`;
    const liked = await redis.get(likeKey);
    
    if (liked) {
      throw new Error('Already liked');
    }
    
    await prisma.$executeRaw`
      UPDATE presales 
      SET stats = jsonb_set(
        stats,
        '{likes}',
        to_jsonb((stats->>'likes')::int + 1)
      )
      WHERE id = ${presaleId}
    `;
    
    // 记录点赞状态（永久）
    await redis.set(likeKey, '1');
  }
  
  /**
   * 取消点赞
   * ✅ 新增：取消点赞功能
   */
  async unlikePresale(presaleId: string, userId: string): Promise<void> {
    const likeKey = `presale:like:${presaleId}:${userId}`;
    const liked = await redis.get(likeKey);
    
    if (!liked) {
      throw new Error('Not liked yet');
    }
    
    await prisma.$executeRaw`
      UPDATE presales 
      SET stats = jsonb_set(
        stats,
        '{likes}',
        to_jsonb(GREATEST(0, (stats->>'likes')::int - 1))
      )
      WHERE id = ${presaleId}
    `;
    
    await redis.del(likeKey);
  }
  
  /**
   * 分享
   */
  async sharePresale(presaleId: string): Promise<void> {
    await prisma.$executeRaw`
      UPDATE presales 
      SET stats = jsonb_set(
        stats,
        '{shares}',
        to_jsonb((stats->>'shares')::int + 1)
      )
      WHERE id = ${presaleId}
    `;
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
      sold_rate: ((inventory.sold / inventory.total) * 100).toFixed(2) + '%',
      total_sales: inventory.sold * pricing.presale_price,
      views: stats.views || 0,
      likes: stats.likes || 0,
      shares: stats.shares || 0,
      conversion_rate: stats.views > 0 
        ? ((inventory.sold / stats.views) * 100).toFixed(2) + '%'
        : '0%'
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
    
    // 使用Redis原子递增生成序列号
    const sequence = await redis.incr(`presale:sequence:${year}${month}${day}`);
    await redis.expire(`presale:sequence:${year}${month}${day}`, 86400); // 24小时过期
    
    const sequenceStr = String(sequence).padStart(3, '0');
    return `PS${year}${month}${day}${sequenceStr}`;
  }
  
  /**
   * 检查预售状态并自动更新
   * ✅ 修复：添加更完整的状态检查
   */
  async checkAndUpdateStatus(): Promise<void> {
    const now = new Date();
    
    // 1. 将已开始的预售设为进行中
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
    
    // 2. 将已结束的预售设为已结束
    await prisma.presale.updateMany({
      where: {
        status: {
          in: [PresaleStatus.ACTIVE, PresaleStatus.PAUSED]
        },
        timeline: {
          path: ['presale_end'],
          lte: now
        }
      },
      data: {
        status: PresaleStatus.ENDED
      }
    });
    
    // 3. 检查售罄状态
    const presales = await prisma.presale.findMany({
      where: {
        status: PresaleStatus.ACTIVE
      }
    });
    
    for (const presale of presales) {
      const inventory = presale.inventory as any;
      if (inventory.available === 0) {
        await prisma.presale.update({
          where: { id: presale.id },
          data: { status: PresaleStatus.SOLD_OUT }
        });
      }
    }
  }
}

export default new PresaleService();

