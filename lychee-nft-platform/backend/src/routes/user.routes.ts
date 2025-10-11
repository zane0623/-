/**
 * 用户路由 - User Routes
 */

import { Router } from 'express';

const router = Router();

router.get('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Not implemented yet'
  });
});

export default router;
