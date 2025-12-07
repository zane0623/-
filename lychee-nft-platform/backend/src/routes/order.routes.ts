/**
 * 订单路由 - Order Routes
 */

import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  confirmOrder,
  getOrderStats
} from '../controllers/order.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// 所有订单路由都需要认证
router.use(authenticateToken);

// 创建订单
router.post('/', createOrder);

// 获取用户订单列表
router.get('/', getUserOrders);

// 获取订单统计
router.get('/stats', getOrderStats);

// 获取订单详情
router.get('/:id', getOrderById);

// 取消订单
router.post('/:id/cancel', cancelOrder);

// 确认收货
router.post('/:id/confirm', confirmOrder);

export default router;
