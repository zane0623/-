import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WhitelistService {
  /**
   * 添加白名单地址
   */
  async addToWhitelist(presaleId: string, addresses: string[]) {
    const normalizedAddresses = addresses.map(addr => addr.toLowerCase());
    
    // 过滤已存在的地址
    const existing = await prisma.whitelist.findMany({
      where: {
        presaleId,
        address: { in: normalizedAddresses }
      },
      select: { address: true }
    });

    const existingAddresses = new Set(existing.map(e => e.address));
    const newAddresses = normalizedAddresses.filter(addr => !existingAddresses.has(addr));

    // 批量创建
    if (newAddresses.length > 0) {
      await prisma.whitelist.createMany({
        data: newAddresses.map(address => ({
          presaleId,
          address
        }))
      });
    }

    return {
      added: newAddresses.length,
      skipped: addresses.length - newAddresses.length,
      total: await prisma.whitelist.count({ where: { presaleId } })
    };
  }

  /**
   * 移除白名单地址
   */
  async removeFromWhitelist(presaleId: string, addresses: string[]) {
    const normalizedAddresses = addresses.map(addr => addr.toLowerCase());

    const result = await prisma.whitelist.deleteMany({
      where: {
        presaleId,
        address: { in: normalizedAddresses }
      }
    });

    return {
      removed: result.count,
      total: await prisma.whitelist.count({ where: { presaleId } })
    };
  }

  /**
   * 获取白名单列表
   */
  async getWhitelist(presaleId: string, page: number = 1, limit: number = 100) {
    const skip = (page - 1) * limit;

    const [whitelist, total] = await Promise.all([
      prisma.whitelist.findMany({
        where: { presaleId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.whitelist.count({ where: { presaleId } })
    ]);

    return {
      addresses: whitelist.map(w => w.address),
      total
    };
  }

  /**
   * 检查地址是否在白名单中
   */
  async isWhitelisted(presaleId: string, address: string): Promise<boolean> {
    const entry = await prisma.whitelist.findFirst({
      where: {
        presaleId,
        address: address.toLowerCase()
      }
    });

    return !!entry;
  }

  /**
   * 从CSV导入白名单
   */
  async importFromCSV(presaleId: string, csvData: string) {
    // 解析CSV数据
    const lines = csvData.split('\n');
    const addresses: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && trimmed.startsWith('0x') && trimmed.length === 42) {
        addresses.push(trimmed);
      }
    }

    if (addresses.length === 0) {
      throw new Error('No valid addresses found in CSV');
    }

    return await this.addToWhitelist(presaleId, addresses);
  }

  /**
   * 清空白名单
   */
  async clearWhitelist(presaleId: string) {
    const result = await prisma.whitelist.deleteMany({
      where: { presaleId }
    });

    return { removed: result.count };
  }
}

