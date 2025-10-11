/**
 * 预售控制器
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PresaleController {
  /**
   * 获取所有预售列表
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const presales = await prisma.presale.findMany({
        where: {
          status: {
            in: ['ACTIVE', 'SCHEDULED']
          },
          audit_status: 'APPROVED'
        },
        include: {
          orchard: {
            select: {
              id: true,
              name: true,
              location: true,
              verified: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      res.json(presales);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取单个预售详情
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const presale = await prisma.presale.findUnique({
        where: { id },
        include: {
          orchard: true
        }
      });

      if (!presale) {
        return res.status(404).json({
          success: false,
          message: 'Presale not found'
        });
      }

      res.json(presale);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建预售
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const presale = await prisma.presale.create({
        data: {
          ...data,
          presale_number: `PS${Date.now()}`,
          stats: data.stats || {
            views: 0,
            likes: 0,
            shares: 0,
            conversion_rate: 0
          }
        }
      });

      res.status(201).json(presale);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新预售
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const presale = await prisma.presale.update({
        where: { id },
        data
      });

      res.json(presale);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除预售
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.presale.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Presale deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

