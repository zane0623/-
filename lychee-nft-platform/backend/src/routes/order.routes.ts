/**
 * 订单路由 - Order Routes
 */

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet'
  });
});

export default router;
