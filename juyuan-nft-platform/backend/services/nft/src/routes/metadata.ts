import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';
import { MetadataService } from '../services/MetadataService';

const router = express.Router();
const metadataService = new MetadataService();

/**
 * @route GET /api/v1/metadata/:tokenId
 * @desc 获取NFT元数据（ERC-721标准）
 * @access Public
 */
router.get(
  '/:tokenId',
  [
    param('tokenId').isInt({ min: 0 }).withMessage('Invalid token ID')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { tokenId } = req.params;
      const metadata = await metadataService.getMetadata(parseInt(tokenId));

      if (!metadata) {
        return res.status(404).json({
          error: 'Metadata not found'
        });
      }

      // ERC-721标准元数据格式
      res.json(metadata);
    } catch (error: any) {
      console.error('Get metadata error:', error);
      res.status(500).json({
        error: 'Failed to get metadata',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/v1/metadata/upload
 * @desc 上传元数据到IPFS
 * @access Private
 */
router.post(
  '/upload',
  async (req: Request, res: Response) => {
    try {
      const metadata = req.body;
      const ipfsHash = await metadataService.uploadToIPFS(metadata);

      res.json({
        message: 'Metadata uploaded successfully',
        data: {
          ipfsHash,
          url: `ipfs://${ipfsHash}`
        }
      });
    } catch (error: any) {
      console.error('Upload metadata error:', error);
      res.status(500).json({
        error: 'Failed to upload metadata',
        message: error.message
      });
    }
  }
);

export default router;


