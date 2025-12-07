import express, { Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { NFTService } from '../services/NFTService';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const nftService = new NFTService();

/**
 * @route POST /api/v1/nft/mint
 * @desc 铸造新NFT
 * @access Private (Admin only)
 */
router.post(
  '/mint',
  authenticate,
  [
    body('walletAddress').isEthereumAddress().withMessage('Invalid wallet address'),
    body('productType').notEmpty().withMessage('Product type is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be positive'),
    body('qualityGrade').notEmpty().withMessage('Quality grade is required'),
    body('harvestDate').isISO8601().withMessage('Invalid harvest date'),
    body('originBase').notEmpty().withMessage('Origin base is required'),
    body('metadata').isObject().withMessage('Metadata must be an object')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        walletAddress,
        productType,
        quantity,
        qualityGrade,
        harvestDate,
        originBase,
        metadata
      } = req.body;

      const result = await nftService.mintNFT({
        walletAddress,
        productType,
        quantity,
        qualityGrade,
        harvestDate: new Date(harvestDate),
        originBase,
        metadata
      });

      res.status(201).json({
        message: 'NFT minted successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Mint NFT error:', error);
      res.status(500).json({
        error: 'Failed to mint NFT',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/v1/nft/batch-mint
 * @desc 批量铸造NFT
 * @access Private (Admin only)
 */
router.post(
  '/batch-mint',
  authenticate,
  [
    body('nfts').isArray({ min: 1, max: 100 }).withMessage('NFTs must be an array (1-100 items)'),
    body('nfts.*.walletAddress').isEthereumAddress(),
    body('nfts.*.productType').notEmpty(),
    body('nfts.*.quantity').isInt({ min: 1 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nfts } = req.body;
      const result = await nftService.batchMintNFT(nfts);

      res.status(201).json({
        message: `${result.length} NFTs minted successfully`,
        data: result
      });
    } catch (error: any) {
      console.error('Batch mint error:', error);
      res.status(500).json({
        error: 'Failed to batch mint NFTs',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/nft/:tokenId
 * @desc 获取NFT详情
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
      const nft = await nftService.getNFT(parseInt(tokenId));

      if (!nft) {
        return res.status(404).json({
          error: 'NFT not found'
        });
      }

      res.json({
        message: 'NFT retrieved successfully',
        data: nft
      });
    } catch (error: any) {
      console.error('Get NFT error:', error);
      res.status(500).json({
        error: 'Failed to get NFT',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/nft/user/:walletAddress
 * @desc 获取用户的所有NFT
 * @access Public
 */
router.get(
  '/user/:walletAddress',
  [
    param('walletAddress').isEthereumAddress().withMessage('Invalid wallet address'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { walletAddress } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await nftService.getUserNFTs(walletAddress, page, limit);

      res.json({
        message: 'User NFTs retrieved successfully',
        data: result.nfts,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error: any) {
      console.error('Get user NFTs error:', error);
      res.status(500).json({
        error: 'Failed to get user NFTs',
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/v1/nft/:tokenId/transfer
 * @desc 转移NFT
 * @access Private
 */
router.put(
  '/:tokenId/transfer',
  authenticate,
  [
    param('tokenId').isInt({ min: 0 }).withMessage('Invalid token ID'),
    body('to').isEthereumAddress().withMessage('Invalid recipient address')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { tokenId } = req.params;
      const { to } = req.body;
      const from = req.user?.walletAddress;

      if (!from) {
        return res.status(401).json({ error: 'Wallet address not found' });
      }

      const result = await nftService.transferNFT(
        parseInt(tokenId),
        from,
        to
      );

      res.json({
        message: 'NFT transferred successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Transfer NFT error:', error);
      res.status(500).json({
        error: 'Failed to transfer NFT',
        message: error.message
      });
    }
  }
);

/**
 * @route PUT /api/v1/nft/:tokenId/deliver
 * @desc 标记NFT为已交付
 * @access Private (Admin only)
 */
router.put(
  '/:tokenId/deliver',
  authenticate,
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
      const result = await nftService.markAsDelivered(parseInt(tokenId));

      res.json({
        message: 'NFT marked as delivered',
        data: result
      });
    } catch (error: any) {
      console.error('Mark delivered error:', error);
      res.status(500).json({
        error: 'Failed to mark NFT as delivered',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/nft/stats/overview
 * @desc 获取NFT统计概览
 * @access Public
 */
router.get(
  '/stats/overview',
  async (req: Request, res: Response) => {
    try {
      const stats = await nftService.getNFTStats();

      res.json({
        message: 'NFT stats retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Get NFT stats error:', error);
      res.status(500).json({
        error: 'Failed to get NFT stats',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/v1/nft/search
 * @desc 搜索NFT
 * @access Public
 */
router.get(
  '/search',
  [
    query('productType').optional().isString(),
    query('qualityGrade').optional().isString(),
    query('originBase').optional().isString(),
    query('delivered').optional().isBoolean()
  ],
  async (req: Request, res: Response) => {
    try {
      const filters = {
        productType: req.query.productType as string,
        qualityGrade: req.query.qualityGrade as string,
        originBase: req.query.originBase as string,
        delivered: req.query.delivered === 'true'
      };

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await nftService.searchNFTs(filters, page, limit);

      res.json({
        message: 'NFTs searched successfully',
        data: result.nfts,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error: any) {
      console.error('Search NFTs error:', error);
      res.status(500).json({
        error: 'Failed to search NFTs',
        message: error.message
      });
    }
  }
);

export default router;


