import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface KYCSubmitParams {
  userId: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  documentFrontUrl: string;
  documentBackUrl?: string;
  selfieUrl: string;
}

export class KYCService {
  /**
   * 提交KYC申请
   */
  async submit(params: KYCSubmitParams) {
    // 检查是否已有待审核或已通过的申请
    const existing = await prisma.kYC.findFirst({
      where: {
        userId: params.userId,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    });

    if (existing) {
      throw new Error('You already have a pending or approved KYC application');
    }

    const kyc = await prisma.kYC.create({
      data: {
        ...params,
        dateOfBirth: new Date(params.dateOfBirth),
        status: 'PENDING'
      }
    });

    // 异步调用身份验证服务
    this.verifyIdentity(kyc.id);

    return kyc;
  }

  /**
   * 获取用户KYC状态
   */
  async getStatus(userId: string) {
    const kyc = await prisma.kYC.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    if (!kyc) {
      return { status: 'NOT_SUBMITTED', kycRequired: true };
    }

    return {
      status: kyc.status,
      submittedAt: kyc.createdAt,
      approvedAt: kyc.approvedAt,
      rejectedReason: kyc.rejectedReason,
      kycRequired: kyc.status !== 'APPROVED'
    };
  }

  /**
   * 获取KYC申请列表
   */
  async getList(status?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [applications, total] = await Promise.all([
      prisma.kYC.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, username: true } }
        }
      }),
      prisma.kYC.count({ where })
    ]);

    return { applications, total };
  }

  /**
   * 审批通过
   */
  async approve(kycId: string, reviewerId: string) {
    const kyc = await prisma.kYC.update({
      where: { id: kycId },
      data: {
        status: 'APPROVED',
        reviewerId,
        approvedAt: new Date()
      }
    });

    // 更新用户KYC状态
    await prisma.user.update({
      where: { id: kyc.userId },
      data: { kycStatus: 'VERIFIED' }
    });

    return kyc;
  }

  /**
   * 拒绝申请
   */
  async reject(kycId: string, reason: string, reviewerId: string) {
    return await prisma.kYC.update({
      where: { id: kycId },
      data: {
        status: 'REJECTED',
        rejectedReason: reason,
        reviewerId,
        reviewedAt: new Date()
      }
    });
  }

  /**
   * 身份验证（异步）
   */
  private async verifyIdentity(kycId: string) {
    try {
      // 调用第三方身份验证服务（如Jumio, Onfido）
      // 这里是示例实现
      console.log(`Verifying identity for KYC ${kycId}`);
      
      // 模拟验证结果
      // 实际应调用第三方API
    } catch (error) {
      console.error('Identity verification error:', error);
    }
  }
}

