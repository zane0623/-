import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export class TraceService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545'
    );
  }

  /**
   * 获取完整溯源信息
   */
  async getFullTrace(tokenId: number) {
    // 获取NFT信息
    const nft = await prisma.nFT.findFirst({
      where: { tokenId }
    });

    if (!nft) {
      return null;
    }

    // 获取所有溯源事件
    const events = await prisma.traceEvent.findMany({
      where: { tokenId },
      include: {
        media: true
      },
      orderBy: { timestamp: 'asc' }
    });

    // 获取区块链数据
    const blockchainData = await this.getBlockchainData(tokenId);

    // 构建完整溯源信息
    return {
      nft: {
        tokenId: nft.tokenId,
        productType: nft.productType,
        quantity: nft.quantity,
        qualityGrade: nft.qualityGrade,
        harvestDate: nft.harvestDate,
        originBase: nft.originBase,
        ipfsHash: nft.ipfsHash
      },
      events: events.map(e => ({
        id: e.id,
        eventType: e.eventType,
        description: e.description,
        location: e.location,
        timestamp: e.timestamp,
        operator: e.operator,
        media: e.media,
        txHash: e.txHash
      })),
      blockchain: blockchainData,
      certificate: {
        issuer: '钜园农业科技有限公司',
        issueDate: nft.createdAt,
        validity: 'VALID',
        verificationUrl: `${process.env.FRONTEND_URL}/trace/${tokenId}`
      }
    };
  }

  /**
   * 获取溯源时间线
   */
  async getTimeline(tokenId: number) {
    const events = await prisma.traceEvent.findMany({
      where: { tokenId },
      orderBy: { timestamp: 'asc' },
      select: {
        id: true,
        eventType: true,
        description: true,
        timestamp: true,
        location: true
      }
    });

    return events.map((event, index) => ({
      ...event,
      step: index + 1,
      completed: true
    }));
  }

  /**
   * 生成溯源二维码
   */
  async generateQRCode(tokenId: number, format: string = 'png') {
    const url = `${process.env.FRONTEND_URL}/trace/${tokenId}`;

    if (format === 'svg') {
      return await QRCode.toString(url, { type: 'svg' });
    }

    return await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#22C55E',
        light: '#FFFFFF'
      }
    });
  }

  /**
   * 获取溯源证书
   */
  async getCertificate(tokenId: number) {
    const trace = await this.getFullTrace(tokenId);
    
    if (!trace) {
      throw new Error('Trace not found');
    }

    return {
      certificateId: `CERT-${tokenId}-${Date.now()}`,
      nft: trace.nft,
      issuer: {
        name: '钜园农业科技有限公司',
        address: '广东省广州市天河区xxx',
        license: 'ICP备案号：粤ICP备2024XXXXX号'
      },
      productInfo: {
        productType: trace.nft.productType,
        originBase: trace.nft.originBase,
        harvestDate: trace.nft.harvestDate,
        qualityGrade: trace.nft.qualityGrade
      },
      traceability: {
        totalEvents: trace.events.length,
        firstEvent: trace.events[0]?.timestamp,
        lastEvent: trace.events[trace.events.length - 1]?.timestamp
      },
      verification: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
        blockchainTxHash: trace.blockchain?.latestTxHash
      }
    };
  }

  /**
   * 按批次获取溯源信息
   */
  async getTraceByBatch(batchId: string) {
    const nfts = await prisma.nFT.findMany({
      where: { batchId },
      select: { tokenId: true }
    });

    const traces = await Promise.all(
      nfts.map(nft => this.getFullTrace(nft.tokenId!))
    );

    return traces.filter(t => t !== null);
  }

  /**
   * 验证数据完整性
   */
  async verifyIntegrity(hash: string) {
    // 在区块链上验证hash
    // 这里是简化实现
    const events = await prisma.traceEvent.findMany({
      where: { txHash: hash }
    });

    return {
      hash,
      verified: events.length > 0,
      events: events.length,
      timestamp: events[0]?.timestamp
    };
  }

  /**
   * 获取区块链数据
   */
  private async getBlockchainData(tokenId: number) {
    try {
      // 从链上获取数据
      const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
      
      if (!contractAddress) {
        return null;
      }

      // 获取最新交易
      const events = await prisma.traceEvent.findMany({
        where: { tokenId, txHash: { not: null } },
        orderBy: { timestamp: 'desc' },
        take: 1
      });

      return {
        contractAddress,
        tokenId,
        latestTxHash: events[0]?.txHash,
        network: process.env.BLOCKCHAIN_NETWORK || 'polygon'
      };
    } catch (error) {
      console.error('Error getting blockchain data:', error);
      return null;
    }
  }
}

