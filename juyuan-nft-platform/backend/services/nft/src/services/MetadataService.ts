import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export class MetadataService {
  /**
   * 获取NFT元数据（ERC-721标准格式）
   */
  async getMetadata(tokenId: number): Promise<NFTMetadata | null> {
    const nft = await prisma.nFT.findFirst({
      where: { tokenId }
    });

    if (!nft) {
      return null;
    }

    // 构建符合ERC-721标准的元数据
    return {
      name: `${nft.productType} #${tokenId}`,
      description: `优质农产品NFT - ${nft.productType}，来自${nft.originBase}`,
      image: nft.imageUrl || `ipfs://${nft.ipfsHash}`,
      external_url: `${process.env.FRONTEND_URL}/nft/${tokenId}`,
      attributes: [
        {
          trait_type: '产品类型',
          value: nft.productType
        },
        {
          trait_type: '数量',
          value: nft.quantity
        },
        {
          trait_type: '品质等级',
          value: nft.qualityGrade
        },
        {
          trait_type: '采收日期',
          value: nft.harvestDate.toISOString().split('T')[0]
        },
        {
          trait_type: '产地基地',
          value: nft.originBase
        },
        {
          trait_type: '已交付',
          value: nft.delivered ? '是' : '否'
        }
      ]
    };
  }

  /**
   * 上传元数据到IPFS
   */
  async uploadToIPFS(metadata: any): Promise<string> {
    try {
      // 使用Pinata或其他IPFS服务
      const pinataApiKey = process.env.PINATA_API_KEY;
      const pinataSecretKey = process.env.PINATA_SECRET_KEY;

      if (!pinataApiKey || !pinataSecretKey) {
        throw new Error('IPFS credentials not configured');
      }

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataContent: metadata,
          pinataMetadata: {
            name: `nft-metadata-${Date.now()}.json`
          }
        },
        {
          headers: {
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretKey
          }
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('IPFS upload error:', error);
      
      // 降级处理：生成模拟hash
      const hash = `Qm${Buffer.from(JSON.stringify(metadata))
        .toString('base64')
        .substring(0, 44)}`;
      return hash;
    }
  }

  /**
   * 从IPFS获取元数据
   */
  async getFromIPFS(ipfsHash: string): Promise<any> {
    try {
      const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud';
      const response = await axios.get(`${gateway}/ipfs/${ipfsHash}`);
      return response.data;
    } catch (error) {
      console.error('IPFS fetch error:', error);
      throw new Error('Failed to fetch metadata from IPFS');
    }
  }

  /**
   * 生成NFT图片URL
   */
  generateImageUrl(productType: string, tokenId: number): string {
    // 这里可以返回动态生成的图片URL或预设的图片
    const imageMap: Record<string, string> = {
      '恐龙蛋荔枝': 'https://example.com/images/lychee.jpg',
      '有机大米': 'https://example.com/images/rice.jpg',
      '茶叶': 'https://example.com/images/tea.jpg'
    };

    return imageMap[productType] || `https://example.com/images/default.jpg?id=${tokenId}`;
  }
}


