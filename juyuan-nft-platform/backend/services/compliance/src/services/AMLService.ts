import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface AMLCheckParams {
  userId: string;
  transactionType: string;
  amount: number;
  currency: string;
  walletAddress?: string;
}

export class AMLService {
  // 风险阈值
  private readonly HIGH_RISK_THRESHOLD = 10000; // USD
  private readonly MEDIUM_RISK_THRESHOLD = 1000; // USD

  /**
   * 执行AML检查
   */
  async check(params: AMLCheckParams) {
    const { userId, transactionType, amount, currency, walletAddress } = params;

    // 获取用户风险评估
    const userRisk = await this.getUserRisk(userId);

    // 计算交易风险
    const transactionRisk = this.calculateTransactionRisk(amount, currency);

    // 检查钱包地址（如果有）
    let walletRisk = 'LOW';
    if (walletAddress) {
      const walletCheck = await this.checkWallet(walletAddress);
      walletRisk = walletCheck.riskLevel;
    }

    // 综合风险评估
    const overallRisk = this.calculateOverallRisk(userRisk.riskLevel, transactionRisk, walletRisk);

    // 记录AML检查
    const amlRecord = await prisma.aMLCheck.create({
      data: {
        userId,
        transactionType,
        amount,
        currency,
        walletAddress,
        riskLevel: overallRisk,
        userRiskLevel: userRisk.riskLevel,
        transactionRiskLevel: transactionRisk,
        walletRiskLevel: walletRisk,
        passed: overallRisk !== 'HIGH',
        checkedAt: new Date()
      }
    });

    // 如果高风险，发送告警
    if (overallRisk === 'HIGH') {
      await this.sendAlert(amlRecord);
    }

    return {
      checkId: amlRecord.id,
      passed: amlRecord.passed,
      riskLevel: overallRisk,
      details: {
        userRisk: userRisk.riskLevel,
        transactionRisk,
        walletRisk
      },
      requiresManualReview: overallRisk === 'HIGH'
    };
  }

  /**
   * 检查钱包地址
   */
  async checkWallet(walletAddress: string) {
    try {
      // 调用区块链分析服务（如Chainalysis, Elliptic）
      // 这里是示例实现
      
      // 检查已知的高风险地址列表
      const blacklist = await this.getBlacklist();
      const isBlacklisted = blacklist.includes(walletAddress.toLowerCase());

      if (isBlacklisted) {
        return {
          walletAddress,
          riskLevel: 'HIGH',
          reason: 'Address is blacklisted',
          safe: false
        };
      }

      return {
        walletAddress,
        riskLevel: 'LOW',
        reason: 'No known risks',
        safe: true
      };
    } catch (error) {
      console.error('Wallet check error:', error);
      return {
        walletAddress,
        riskLevel: 'UNKNOWN',
        reason: 'Unable to verify',
        safe: false
      };
    }
  }

  /**
   * 获取用户风险评估
   */
  async getUserRisk(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        kycApplications: { where: { status: 'APPROVED' }, take: 1 },
        purchases: { take: 100, orderBy: { createdAt: 'desc' } }
      }
    });

    if (!user) {
      return { riskLevel: 'HIGH', reason: 'User not found' };
    }

    // 评估因素
    const factors = {
      hasKyc: user.kycApplications.length > 0,
      transactionCount: user.purchases.length,
      accountAge: this.getAccountAge(user.createdAt)
    };

    // 计算风险等级
    let riskLevel = 'LOW';
    
    if (!factors.hasKyc) {
      riskLevel = 'MEDIUM';
    }
    
    if (factors.accountAge < 7) {
      riskLevel = 'MEDIUM';
    }

    return {
      userId,
      riskLevel,
      factors
    };
  }

  /**
   * 获取AML报告
   */
  async getReports(filters: {
    startDate?: Date;
    endDate?: Date;
    riskLevel?: string;
  }) {
    const where: any = {};

    if (filters.startDate) {
      where.checkedAt = { gte: filters.startDate };
    }
    if (filters.endDate) {
      where.checkedAt = { ...where.checkedAt, lte: filters.endDate };
    }
    if (filters.riskLevel) {
      where.riskLevel = filters.riskLevel;
    }

    const reports = await prisma.aMLCheck.findMany({
      where,
      orderBy: { checkedAt: 'desc' },
      take: 100
    });

    const summary = {
      total: reports.length,
      highRisk: reports.filter(r => r.riskLevel === 'HIGH').length,
      mediumRisk: reports.filter(r => r.riskLevel === 'MEDIUM').length,
      lowRisk: reports.filter(r => r.riskLevel === 'LOW').length,
      passed: reports.filter(r => r.passed).length,
      failed: reports.filter(r => !r.passed).length
    };

    return { reports, summary };
  }

  /**
   * 计算交易风险
   */
  private calculateTransactionRisk(amount: number, currency: string): string {
    // 转换为USD
    const usdAmount = this.convertToUSD(amount, currency);

    if (usdAmount >= this.HIGH_RISK_THRESHOLD) {
      return 'HIGH';
    }
    if (usdAmount >= this.MEDIUM_RISK_THRESHOLD) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  /**
   * 计算综合风险
   */
  private calculateOverallRisk(...risks: string[]): string {
    if (risks.includes('HIGH')) return 'HIGH';
    if (risks.includes('MEDIUM')) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * 转换为USD
   */
  private convertToUSD(amount: number, currency: string): number {
    const rates: Record<string, number> = {
      USD: 1, ETH: 2000, BTC: 40000, USDT: 1, USDC: 1,
      CNY: 0.14, SGD: 0.75, HKD: 0.13
    };
    return amount * (rates[currency] || 1);
  }

  /**
   * 获取账户年龄（天）
   */
  private getAccountAge(createdAt: Date): number {
    return Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * 获取黑名单
   */
  private async getBlacklist(): Promise<string[]> {
    // 实际应该从数据库或外部服务获取
    return [];
  }

  /**
   * 发送告警
   */
  private async sendAlert(amlRecord: any) {
    console.log(`HIGH RISK ALERT: AML Check ${amlRecord.id}`);
    // 发送通知给合规团队
  }
}

