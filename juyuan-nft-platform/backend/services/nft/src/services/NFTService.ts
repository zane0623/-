import { ethers, Contract } from 'ethers';
import { PrismaClient } from '@prisma/client';
import Queue from 'bull';

const prisma = new PrismaClient();

interface MintNFTParams {
  walletAddress: string;
  productType: string;
  quantity: number;
  qualityGrade: string;
  harvestDate: Date;
  originBase: string;
  metadata: any;
}

export class NFTService {
  private provider: ethers.JsonRpcProvider;
  private contract: Contract;
  private mintQueue: Queue.Queue;

  constructor() {
    // 初始化区块链连接
    this.provider = new ethers.JsonRpcProvider(
      process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545'
    );

    // 初始化合约
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS || '';
    const contractABI = require('../abi/AgriProductNFT.json');
    
    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY || '',
      this.provider
    );
    
    this.contract = new Contract(contractAddress, contractABI, wallet);

    // 初始化消息队列
    this.mintQueue = new Queue('nft-mint', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });

    this.setupQueueProcessors();
  }

  /**
   * 设置队列处理器
   */
  private setupQueueProcessors() {
    this.mintQueue.process(async (job) => {
      const { walletAddress, productType, quantity, qualityGrade, harvestDate, originBase, ipfsHash } = job.data;
      
      try {
        const tx = await this.contract.mintNFT(
          walletAddress,
          productType,
          quantity,
          qualityGrade,
          Math.floor(harvestDate.getTime() / 1000),
          originBase,
          ipfsHash
        );
        
        const receipt = await tx.wait();
        return receipt;
      } catch (error) {
        console.error('Mint transaction failed:', error);
        throw error;
      }
    });
  }

  /**
   * 铸造NFT
   */
  async mintNFT(params: MintNFTParams) {
    const { walletAddress, productType, quantity, qualityGrade, harvestDate, originBase, metadata } = params;

    // 上传元数据到IPFS
    const ipfsHash = await this.uploadMetadataToIPFS(metadata);

    // 添加到队列
    const job = await this.mintQueue.add({
      walletAddress,
      productType,
      quantity,
      qualityGrade,
      harvestDate,
      originBase,
      ipfsHash
    });

    // 保存到数据库
    const nft = await prisma.nFT.create({
      data: {
        walletAddress,
        productType,
        quantity,
        qualityGrade,
        harvestDate,
        originBase,
        ipfsHash,
        status: 'PENDING',
        jobId: job.id.toString()
      }
    });

    return {
      nft,
      jobId: job.id
    };
  }

  /**
   * 批量铸造NFT
   */
  async batchMintNFT(nfts: MintNFTParams[]) {
    const results = await Promise.all(
      nfts.map(nft => this.mintNFT(nft))
    );

    return results;
  }

  /**
   * 获取NFT详情
   */
  async getNFT(tokenId: number) {
    // 从区块链获取
    const onChainData = await this.contract.getMetadata(tokenId);
    
    // 从数据库获取
    const dbData = await prisma.nFT.findFirst({
      where: { tokenId }
    });

    return {
      tokenId,
      owner: await this.contract.ownerOf(tokenId),
      productType: onChainData.productType,
      quantity: Number(onChainData.quantity),
      qualityGrade: onChainData.qualityGrade,
      harvestDate: new Date(Number(onChainData.harvestDate) * 1000),
      originBase: onChainData.originBase,
      ipfsHash: onChainData.ipfsHash,
      delivered: onChainData.delivered,
      metadata: dbData?.metadata || {}
    };
  }

  /**
   * 获取用户的NFT列表
   */
  async getUserNFTs(walletAddress: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [nfts, total] = await Promise.all([
      prisma.nFT.findMany({
        where: {
          walletAddress: walletAddress.toLowerCase()
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.nFT.count({
        where: {
          walletAddress: walletAddress.toLowerCase()
        }
      })
    ]);

    return {
      nfts,
      total
    };
  }

  /**
   * 转移NFT
   */
  async transferNFT(tokenId: number, from: string, to: string) {
    const tx = await this.contract['safeTransferFrom(address,address,uint256)'](from, to, tokenId);
    const receipt = await tx.wait();

    // 更新数据库
    await prisma.nFT.updateMany({
      where: { tokenId },
      data: {
        walletAddress: to.toLowerCase()
      }
    });

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  }

  /**
   * 标记为已交付
   */
  async markAsDelivered(tokenId: number) {
    const tx = await this.contract.markAsDelivered(tokenId);
    const receipt = await tx.wait();

    // 更新数据库
    await prisma.nFT.updateMany({
      where: { tokenId },
      data: {
        delivered: true
      }
    });

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  }

  /**
   * 获取NFT统计
   */
  async getNFTStats() {
    const [
      totalNFTs,
      totalMinted,
      totalDelivered,
      productStats
    ] = await Promise.all([
      prisma.nFT.count(),
      prisma.nFT.count({ where: { status: 'MINTED' } }),
      prisma.nFT.count({ where: { delivered: true } }),
      prisma.nFT.groupBy({
        by: ['productType'],
        _count: true
      })
    ]);

    return {
      totalNFTs,
      totalMinted,
      totalDelivered,
      productStats
    };
  }

  /**
   * 搜索NFT
   */
  async searchNFTs(filters: any, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.productType) {
      where.productType = { contains: filters.productType, mode: 'insensitive' };
    }
    if (filters.qualityGrade) {
      where.qualityGrade = filters.qualityGrade;
    }
    if (filters.originBase) {
      where.originBase = { contains: filters.originBase, mode: 'insensitive' };
    }
    if (typeof filters.delivered === 'boolean') {
      where.delivered = filters.delivered;
    }

    const [nfts, total] = await Promise.all([
      prisma.nFT.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.nFT.count({ where })
    ]);

    return {
      nfts,
      total
    };
  }

  /**
   * 上传元数据到IPFS
   */
  private async uploadMetadataToIPFS(metadata: any): Promise<string> {
    // 这里应该实际上传到IPFS
    // 简化实现，返回模拟的IPFS hash
    const hash = `Qm${Buffer.from(JSON.stringify(metadata)).toString('base64').substring(0, 44)}`;
    return hash;
  }
}


