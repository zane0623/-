/**
 * 认证路由 - Authentication Routes
 */

import { Router } from 'express';
import { register, login, getCurrentUser, logout, verifyToken } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// 注册
router.post('/register', register);

// 登录
router.post('/login', login);

// 登出
router.post('/logout', authenticateToken, logout);

// 获取当前用户（需要认证）
router.get('/me', authenticateToken, getCurrentUser);

// 验证Token
router.post('/verify', verifyToken);

// Web3钱包登录（暂未实现）
router.post('/wallet-login', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Web3钱包登录功能即将推出'
  });
});

export default router;
