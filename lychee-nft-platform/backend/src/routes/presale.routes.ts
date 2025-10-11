/**
 * 预售路由 - Presale Routes
 */

import { Router } from 'express';
import { PresaleController } from '../controllers/presale.controller';

const router = Router();

// 获取所有预售
router.get('/', PresaleController.getAll);

// 获取单个预售详情
router.get('/:id', PresaleController.getById);

// 创建预售
router.post('/', PresaleController.create);

// 更新预售
router.put('/:id', PresaleController.update);

// 删除预售
router.delete('/:id', PresaleController.delete);

export default router;
