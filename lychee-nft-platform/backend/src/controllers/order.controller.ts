/**
 * 订单控制器 - Order Controller
 */

import { Request, Response } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { web3Service } from '../services/web3.service';

/**
 * 创建订单
 * POST /api/orders
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { presale_id, quantity, wallet_address, transaction_hash } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '请先登录'
      });
    }

    // 验证必填字段
    if (!presale_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: '预售ID和数量为必填项'
      });
    }

    // 查询预售信息
    const presale = await prisma.presale.findUnique({
      where: { id: presale_id }
    });

    if (!presale) {
      return res.status(404).json({
        success: false,
        message: '预售不存在'
      });
    }

    // 检查预售状态
    if (presale.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: '该预售当前不可购买'
      });
    }

    // 检查库存
    const inventory = presale.inventory as any;
    if (inventory.available < quantity) {
      return res.status(400).json({
        success: false,
        message: '库存不足'
      });
    }

    // 检查购买限制
    if (inventory.min_purchase && quantity < inventory.min_purchase) {
      return res.status(400).json({
        success: false,
        message: `最少购买数量：${inventory.min_purchase}`
      });
    }

    if (inventory.max_purchase && quantity > inventory.max_purchase) {
      return res.status(400).json({
        success: false,
        message: `最多购买数量：${inventory.max_purchase}`
      });
    }

    // 计算价格
    const pricing = presale.pricing as any;
    const unitPrice = parseFloat(pricing.presale_price);
    const totalAmount = unitPrice * quantity;

    // 创建订单
    const order = await prisma.order.create({
      data: {
        order_number: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        user_id: userId,
        presale_id: presale_id,
        product_info: {
          title: presale.title,
          cover_image: presale.cover_image,
          description: presale.description,
          quantity: quantity,
          unit_price: unitPrice
        },
        amount_info: {
          subtotal: totalAmount,
          shipping_fee: 0,
          discount: 0,
          tax: 0,
          total: totalAmount,
          currency: pricing.currency || 'CNY'
        },
        shipping_info: {
          recipient: '',
          phone: '',
          address: '',
          tracking: ''
        },
        payment_info: transaction_hash ? {
          method: 'blockchain',
          paid_at: new Date().toISOString(),
          tx_hash: transaction_hash,
          wallet_address: wallet_address
        } : undefined,
        status: transaction_hash ? 'CONFIRMED' : 'PENDING'
      }
    });

    // 如果有交易哈希，说明已经在区块链上完成支付
    if (transaction_hash) {
      // 更新预售库存
      await prisma.presale.update({
        where: { id: presale_id },
        data: {
          inventory: {
            ...inventory,
            sold: inventory.sold + quantity,
            available: inventory.available - quantity
          }
        }
      });
    }

    logger.info(`Order created: ${order.order_number} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: '订单创建成功',
      data: order
    });
  } catch (error: any) {
    logger.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: '创建订单失败',
      error: error.message
    });
  }
};

/**
 * 获取用户订单列表
 * GET /api/orders
 */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '请先登录'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { user_id: userId };
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          presale: {
            select: {
              id: true,
              title: true,
              cover_image: true,
              status: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    logger.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: '获取订单列表失败',
      error: error.message
    });
  }
};

/**
 * 获取订单详情
 * GET /api/orders/:id
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '请先登录'
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        user_id: userId
      },
      include: {
        presale: true,
        nfts: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    logger.error('Get order by id error:', error);
    res.status(500).json({
      success: false,
      message: '获取订单详情失败',
      error: error.message
    });
  }
};

/**
 * 取消订单
 * POST /api/orders/:id/cancel
 */
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '请先登录'
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        user_id: userId
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // 只有待支付的订单才能取消
    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: '该订单不能取消'
      });
    }

    // 更新订单状态
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelled_at: new Date()
      }
    });

    // 恢复库存
    if (order.presale_id) {
      const presale = await prisma.presale.findUnique({
        where: { id: order.presale_id }
      });
      
      if (presale) {
        const inventory = presale.inventory as any;
        const productInfo = order.product_info as any;
        const orderQuantity = productInfo.quantity || 0;
        
        await prisma.presale.update({
          where: { id: order.presale_id },
          data: {
            inventory: {
              ...inventory,
              sold: Math.max(0, inventory.sold - orderQuantity),
              available: inventory.available + orderQuantity
            }
          }
        });
      }
    }

    logger.info(`Order cancelled: ${order.order_number}`);

    res.json({
      success: true,
      message: '订单已取消',
      data: updatedOrder
    });
  } catch (error: any) {
    logger.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: '取消订单失败',
      error: error.message
    });
  }
};

/**
 * 确认收货
 * POST /api/orders/:id/confirm
 */
export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '请先登录'
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        user_id: userId
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    if (order.status !== 'SHIPPED') {
      return res.status(400).json({
        success: false,
        message: '该订单不能确认收货'
      });
    }

    // 更新订单状态
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completed_at: new Date()
      }
    });

    logger.info(`Order confirmed: ${order.order_number}`);

    res.json({
      success: true,
      message: '确认收货成功',
      data: updatedOrder
    });
  } catch (error: any) {
    logger.error('Confirm order error:', error);
    res.status(500).json({
      success: false,
      message: '确认收货失败',
      error: error.message
    });
  }
};

/**
 * 获取订单统计
 * GET /api/orders/stats
 */
export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '请先登录'
      });
    }

    const [total, pending, confirmed, shipped, completed, cancelled] = await Promise.all([
      prisma.order.count({ where: { user_id: userId } }),
      prisma.order.count({ where: { user_id: userId, status: 'PENDING' } }),
      prisma.order.count({ where: { user_id: userId, status: 'CONFIRMED' } }),
      prisma.order.count({ where: { user_id: userId, status: 'SHIPPED' } }),
      prisma.order.count({ where: { user_id: userId, status: 'COMPLETED' } }),
      prisma.order.count({ where: { user_id: userId, status: 'CANCELLED' } })
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        shipped,
        completed,
        cancelled
      }
    });
  } catch (error: any) {
    logger.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: '获取订单统计失败',
      error: error.message
    });
  }
};

