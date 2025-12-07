import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { TemplateService } from '../services/TemplateService';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();
const templateService = new TemplateService();

/**
 * @route POST /api/v1/templates
 * @desc 创建通知模板
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').notEmpty(),
    body('type').isIn(['EMAIL', 'SMS', 'PUSH']),
    body('subject').notEmpty(),
    body('content').notEmpty()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const template = await templateService.create(req.body);
      res.status(201).json({ message: 'Template created', data: template });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/templates
 * @desc 获取所有模板
 */
router.get(
  '/',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const templates = await templateService.getAll();
      res.json({ data: templates });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/templates/:templateId
 * @desc 获取模板详情
 */
router.get(
  '/:templateId',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const template = await templateService.getById(req.params.templateId);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      res.json({ data: template });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route PUT /api/v1/templates/:templateId
 * @desc 更新模板
 */
router.put(
  '/:templateId',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const template = await templateService.update(req.params.templateId, req.body);
      res.json({ message: 'Template updated', data: template });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route DELETE /api/v1/templates/:templateId
 * @desc 删除模板
 */
router.delete(
  '/:templateId',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      await templateService.delete(req.params.templateId);
      res.json({ message: 'Template deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

