// ========================================
// 钜园农业NFT平台 - 区块链工具
// ========================================

import { ethers } from 'ethers';
import { createLogger } from '../logger';
import { NETWORKS } from '../constants';
import { InvalidSignatureError } from '../errors';

const logger = createLogger('blockchain');

// 获取Provider
export function getProvider(network: 'POLYGON' | 'POLYGON_MUMBAI' | 'ETHEREUM' = 'POLYGON_MUMBAI') {
  const config = NETWORKS[network];
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

// 获取Signer（需要私钥）
export function getSigner(privateKey: string, network: 'POLYGON' | 'POLYGON_MUMBAI' | 'ETHEREUM' = 'POLYGON_MUMBAI') {
  const provider = getProvider(network);
  return new ethers.Wallet(privateKey, provider);
}

// 验证签名（钱包登录）
export async function verifySignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    logger.error('Signature verification failed', { error });
    return false;
  }
}

// 生成登录消息
export function generateLoginMessage(walletAddress: string, nonce: string): string {
  return `欢迎登录钜园农业NFT平台！

请签名此消息以验证您的身份。
此操作不会花费任何Gas费用。

钱包地址: ${walletAddress}
随机数: ${nonce}
时间戳: ${new Date().toISOString()}`;
}

// 生成随机数
export function generateNonce(): string {
  return ethers.hexlify(ethers.randomBytes(16));
}

// 检查地址格式
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

// 格式化地址（校验和格式）
export function formatAddress(address: string): string {
  if (!isValidAddress(address)) {
    throw new Error('Invalid address');
  }
  return ethers.getAddress(address);
}

// 缩短地址显示
export function shortenAddress(address: string, chars: number = 4): string {
  if (!isValidAddress(address)) {
    return address;
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Wei转换工具
export const weiUtils = {
  toWei: (value: string | number, decimals: number = 18): bigint => {
    return ethers.parseUnits(value.toString(), decimals);
  },
  
  fromWei: (value: bigint | string, decimals: number = 18): string => {
    return ethers.formatUnits(value, decimals);
  },
  
  toEther: (value: bigint | string): string => {
    return ethers.formatEther(value);
  },
  
  parseEther: (value: string): bigint => {
    return ethers.parseEther(value);
  }
};

// 合约交互基类
export class ContractService {
  protected contract: ethers.Contract;
  protected provider: ethers.Provider;
  protected signer?: ethers.Wallet;

  constructor(
    address: string,
    abi: ethers.InterfaceAbi,
    signerOrProvider: ethers.Wallet | ethers.Provider
  ) {
    if (signerOrProvider instanceof ethers.Wallet) {
      this.signer = signerOrProvider;
      this.provider = signerOrProvider.provider!;
      this.contract = new ethers.Contract(address, abi, signerOrProvider);
    } else {
      this.provider = signerOrProvider;
      this.contract = new ethers.Contract(address, abi, signerOrProvider);
    }
  }

  // 获取合约地址
  get address(): string {
    return this.contract.target as string;
  }

  // 等待交易确认
  async waitForTransaction(txHash: string, confirmations: number = 1) {
    const receipt = await this.provider.waitForTransaction(txHash, confirmations);
    return receipt;
  }

  // 估算Gas
  async estimateGas(method: string, ...args: any[]): Promise<bigint> {
    return await this.contract[method].estimateGas(...args);
  }

  // 获取当前Gas价格
  async getGasPrice(): Promise<bigint> {
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice || 0n;
  }
}

// NFT合约服务
export class NFTContractService extends ContractService {
  // 获取NFT所有者
  async ownerOf(tokenId: number): Promise<string> {
    return await this.contract.ownerOf(tokenId);
  }

  // 获取NFT元数据URI
  async tokenURI(tokenId: number): Promise<string> {
    return await this.contract.tokenURI(tokenId);
  }

  // 获取用户NFT余额
  async balanceOf(address: string): Promise<bigint> {
    return await this.contract.balanceOf(address);
  }

  // 获取NFT元数据
  async getMetadata(tokenId: number): Promise<any> {
    return await this.contract.getMetadata(tokenId);
  }

  // 获取用户所有NFT
  async getUserTokens(address: string): Promise<number[]> {
    const tokens = await this.contract.getUserTokens(address);
    return tokens.map((t: bigint) => Number(t));
  }

  // 铸造NFT（需要signer）
  async mintNFT(
    to: string,
    productType: string,
    quantity: number,
    qualityGrade: string,
    harvestDate: number,
    originBase: string,
    ipfsHash: string
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required for minting');
    }
    return await this.contract.mintNFT(
      to,
      productType,
      quantity,
      qualityGrade,
      harvestDate,
      originBase,
      ipfsHash
    );
  }

  // 批量铸造
  async batchMintNFT(
    recipients: string[],
    productType: string,
    quantity: number,
    qualityGrade: string,
    harvestDate: number,
    originBase: string,
    ipfsHash: string
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required for batch minting');
    }
    return await this.contract.batchMintNFT(
      recipients,
      productType,
      quantity,
      qualityGrade,
      harvestDate,
      originBase,
      ipfsHash
    );
  }

  // 标记已交付
  async markAsDelivered(tokenId: number): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required');
    }
    return await this.contract.markAsDelivered(tokenId);
  }
}

// 预售合约服务
export class PresaleContractService extends ContractService {
  // 获取预售信息
  async getPresaleInfo(presaleId: number): Promise<any> {
    return await this.contract.getPresaleInfo(presaleId);
  }

  // 获取用户购买量
  async getUserPurchase(presaleId: number, address: string): Promise<bigint> {
    return await this.contract.getUserPurchase(presaleId, address);
  }

  // 检查是否在白名单
  async isWhitelisted(presaleId: number, address: string): Promise<boolean> {
    return await this.contract.isWhitelisted(presaleId, address);
  }

  // 购买
  async purchase(
    presaleId: number,
    amount: number,
    value: bigint
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required for purchase');
    }
    return await this.contract.purchase(presaleId, amount, { value });
  }

  // 创建预售（管理员）
  async createPresale(
    startTime: number,
    endTime: number,
    minPurchase: number,
    maxPurchase: number,
    totalSupply: number,
    priceInWei: bigint,
    paymentToken: string,
    whitelistEnabled: boolean,
    productType: string
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required');
    }
    return await this.contract.createPresale(
      startTime,
      endTime,
      minPurchase,
      maxPurchase,
      totalSupply,
      priceInWei,
      paymentToken,
      whitelistEnabled,
      productType
    );
  }

  // 添加白名单
  async addToWhitelist(presaleId: number, users: string[]): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required');
    }
    return await this.contract.addToWhitelist(presaleId, users);
  }
}

// 托管合约服务
export class EscrowContractService extends ContractService {
  // 获取托管信息
  async getEscrow(escrowId: number): Promise<any> {
    return await this.contract.escrows(escrowId);
  }

  // 创建托管
  async createEscrow(
    seller: string,
    tokenId: number,
    deliveryDeadline: number,
    value: bigint
  ): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required');
    }
    return await this.contract.createEscrow(seller, tokenId, deliveryDeadline, { value });
  }

  // 确认交付
  async confirmDelivery(escrowId: number): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required');
    }
    return await this.contract.confirmDelivery(escrowId);
  }

  // 申请退款
  async requestRefund(escrowId: number): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required');
    }
    return await this.contract.requestRefund(escrowId);
  }

  // 发起争议
  async initiateDispute(escrowId: number, reason: string): Promise<ethers.TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer required');
    }
    return await this.contract.initiateDispute(escrowId, reason);
  }
}

// 事件监听器
export function createEventListener(
  contract: ethers.Contract,
  eventName: string,
  callback: (event: any) => void
) {
  contract.on(eventName, (...args) => {
    const event = args[args.length - 1];
    callback({
      eventName,
      args: args.slice(0, -1),
      blockNumber: event.log.blockNumber,
      transactionHash: event.log.transactionHash
    });
  });

  return () => {
    contract.off(eventName, callback);
  };
}



