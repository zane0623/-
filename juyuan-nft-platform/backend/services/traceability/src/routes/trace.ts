import express, { Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';
import { TraceService } from '../services/TraceService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const traceService = new TraceService();

/**
 * @route GET /api/v1/trace/:tokenId
 * @desc 获取NFT完整溯源信息
 */
router.get(
  '/:tokenId',
  [param('tokenId').isInt({ min: 0 })],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const tokenId = parseInt(req.params.tokenId);
      const trace = await traceService.getFullTrace(tokenId);
      
      if (!trace) {
        return res.status(404).json({ error: 'Trace not found' });
      }

      res.json({ data: trace });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/trace/:tokenId/timeline
 * @desc 获取NFT溯源时间线
 */
router.get(
  '/:tokenId/timeline',
  async (req: Request, res: Response) => {
    try {
      const tokenId = parseInt(req.params.tokenId);
      const timeline = await traceService.getTimeline(tokenId);
      res.json({ data: timeline });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/trace/:tokenId/qrcode
 * @desc 生成溯源二维码
 */
router.get(
  '/:tokenId/qrcode',
  async (req: Request, res: Response) => {
    try {
      const tokenId = parseInt(req.params.tokenId);
      const format = (req.query.format as string) || 'png';
      
      const qrcode = await traceService.generateQRCode(tokenId, format);
      
      if (format === 'svg') {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(qrcode);
      } else {
        res.setHeader('Content-Type', 'image/png');
        res.send(Buffer.from(qrcode.split(',')[1], 'base64'));
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/trace/:tokenId/certificate
 * @desc 获取溯源证书
 */
router.get(
  '/:tokenId/certificate',
  async (req: Request, res: Response) => {
    try {
      const tokenId = parseInt(req.params.tokenId);
      const certificate = await traceService.getCertificate(tokenId);
      res.json({ data: certificate });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/trace/batch/:batchId
 * @desc 按批次获取溯源信息
 */
router.get(
  '/batch/:batchId',
  async (req: Request, res: Response) => {
    try {
      const { batchId } = req.params;
      const trace = await traceService.getTraceByBatch(batchId);
      res.json({ data: trace });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/trace/verify/:hash
 * @desc 验证溯源数据完整性
 */
router.get(
  '/verify/:hash',
  async (req: Request, res: Response) => {
    try {
      const { hash } = req.params;
      const result = await traceService.verifyIntegrity(hash);
      res.json({ data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

