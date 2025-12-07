import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload { id: string; email?: string; role: string; }

declare global {
  namespace Express { interface Request { user?: UserPayload; } }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret') as UserPayload;
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

