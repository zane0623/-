/**
 * Web3服务 - 与智能合约交互
 */

import { ethers } from 'ethers';
import { logger } from '../utils/logger';

// 智能合约ABI（简化版，实际使用时需要完整ABI）
const CONTRACT_ABI = [
  "function createBatch(string _origin, uint256 _harvestDate, uint256 _totalQuantity, uint256 _pricePerKg, address _farmer, string _ipfsHash, string _quality, string _variety) external",
  "function purchaseLychee(uint256 _batchId, uint256 _quantity) external payable",
  "function confirmDelivery(uint256 _orderId, string _trackingNumber) external",
  "function getBatchInfo(uint256 _batchId) external view returns (tuple(uint256 batchId, string origin, uint256 harvestDate, uint256 totalQuantity, uint256 soldQuantity, uint256 pricePerKg, address farmer, bool isActive, string ipfsHash, string quality, string variety))",
  "function getOrderInfo(uint256 _orderId) external view returns (tuple(uint256 orderId, address buyer, uint256 batchId, uint256 quantity, uint256 totalPrice, uint256 orderTime, bool isDelivered, string trackingNumber, string status))",
  "function getUserOrders(address _user) external view returns (uint256[])",
  "function getCurrentBatchId() external view returns (uint256)",
  "function getCurrentOrderId() external view returns (uint256)",
  "function registerFarmer(address _farmerAddress, string _name, string _certification) external",
  "function setAuthorizedCaller(address _caller, bool _authorized) external",
  "event BatchCreated(uint256 indexed batchId, string origin, uint256 quantity, uint256 price, address farmer)",
  "event OrderPlaced(uint256 indexed orderId, address indexed buyer, uint256 batchId, uint256 quantity, uint256 totalPrice)",
  "event OrderDelivered(uint256 indexed orderId, string trackingNumber)"
];

class Web3Service {
  private provider: ethers.providers.Provider | null = null;
  private contract: ethers.Contract | null = null;
  private wallet: ethers.Wallet | null = null;
  
  private contractAddress: string = process.env.CONTRACT_ADDRESS || '';
  private rpcUrl: string = process.env.RPC_URL || 'http://127.0.0.1:8545'; // 默认本地网络
  private privateKey: string = process.env.ADMIN_PRIVATE_KEY || '';

  constructor() {
    this.initialize();
  }

  /**
   * 初始化Web3连接
   */
  private async initialize() {
    try {
      // 创建Provider
      this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
      
      // 创建Wallet（用于签名交易）
      if (this.privateKey) {
        this.wallet = new ethers.Wallet(this.privateKey, this.provider);
      }
      
      // 创建合约实例
      if (this.contractAddress && this.wallet) {
        this.contract = new ethers.Contract(
          this.contractAddress,
          CONTRACT_ABI,
          this.wallet
        );
        logger.info(`Web3 service initialized with contract: ${this.contractAddress}`);
      } else {
        logger.warn('Contract address or private key not set, Web3 service running in limited mode');
      }
    } catch (error: any) {
      logger.error('Failed to initialize Web3 service:', error.message);
    }
  }

  /**
   * 检查Web3是否已初始化
   */
  isInitialized(): boolean {
    return this.provider !== null && this.contract !== null;
  }

  /**
   * 创建荔枝批次（调用智能合约）
   */
  async createBatch(params: {
    origin: string;
    harvestDate: number;
    totalQuantity: number;
    pricePerKg: string; // 以wei为单位的字符串
    farmerAddress: string;
    ipfsHash: string;
    quality: string;
    variety: string;
  }) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.createBatch(
        params.origin,
        params.harvestDate,
        params.totalQuantity,
        params.pricePerKg,
        params.farmerAddress,
        params.ipfsHash,
        params.quality,
        params.variety
      );

      const receipt = await tx.wait();
      
      // 从事件中获取batchId
      const event = receipt.events?.find((e: any) => e.event === 'BatchCreated');
      const batchId = event?.args?.batchId?.toNumber();

      logger.info(`Batch created on blockchain: ${batchId}`);
      
      return {
        success: true,
        batchId,
        transactionHash: receipt.transactionHash
      };
    } catch (error: any) {
      logger.error('Failed to create batch on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 购买荔枝（调用智能合约）
   */
  async purchaseLychee(params: {
    batchId: number;
    quantity: number;
    totalPrice: string; // 以wei为单位
    buyerAddress: string;
  }) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      // 这里需要用买家的私钥签名，实际应用中应该由前端发起交易
      // 后端不应该代替用户发起交易，这里仅作示例
      const tx = await this.contract.purchaseLychee(
        params.batchId,
        params.quantity,
        {
          value: params.totalPrice
        }
      );

      const receipt = await tx.wait();
      
      // 从事件中获取orderId
      const event = receipt.events?.find((e: any) => e.event === 'OrderPlaced');
      const orderId = event?.args?.orderId?.toNumber();

      logger.info(`Order placed on blockchain: ${orderId}`);
      
      return {
        success: true,
        orderId,
        transactionHash: receipt.transactionHash
      };
    } catch (error: any) {
      logger.error('Failed to purchase on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 确认交付（调用智能合约）
   */
  async confirmDelivery(orderId: number, trackingNumber: string) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.confirmDelivery(orderId, trackingNumber);
      const receipt = await tx.wait();

      logger.info(`Order ${orderId} delivery confirmed on blockchain`);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error: any) {
      logger.error('Failed to confirm delivery on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取批次信息（从智能合约读取）
   */
  async getBatchInfo(batchId: number) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const batch = await this.contract.getBatchInfo(batchId);
      
      return {
        success: true,
        data: {
          batchId: batch.batchId.toNumber(),
          origin: batch.origin,
          harvestDate: batch.harvestDate.toNumber(),
          totalQuantity: batch.totalQuantity.toNumber(),
          soldQuantity: batch.soldQuantity.toNumber(),
          pricePerKg: batch.pricePerKg.toString(),
          farmer: batch.farmer,
          isActive: batch.isActive,
          ipfsHash: batch.ipfsHash,
          quality: batch.quality,
          variety: batch.variety
        }
      };
    } catch (error: any) {
      logger.error('Failed to get batch info from blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取订单信息（从智能合约读取）
   */
  async getOrderInfo(orderId: number) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const order = await this.contract.getOrderInfo(orderId);
      
      return {
        success: true,
        data: {
          orderId: order.orderId.toNumber(),
          buyer: order.buyer,
          batchId: order.batchId.toNumber(),
          quantity: order.quantity.toNumber(),
          totalPrice: order.totalPrice.toString(),
          orderTime: order.orderTime.toNumber(),
          isDelivered: order.isDelivered,
          trackingNumber: order.trackingNumber,
          status: order.status
        }
      };
    } catch (error: any) {
      logger.error('Failed to get order info from blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 获取用户订单列表（从智能合约读取）
   */
  async getUserOrders(userAddress: string) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const orderIds = await this.contract.getUserOrders(userAddress);
      
      return {
        success: true,
        data: orderIds.map((id: ethers.BigNumber) => id.toNumber())
      };
    } catch (error: any) {
      logger.error('Failed to get user orders from blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 注册农户（调用智能合约）
   */
  async registerFarmer(farmerAddress: string, name: string, certification: string) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.registerFarmer(farmerAddress, name, certification);
      const receipt = await tx.wait();

      logger.info(`Farmer registered on blockchain: ${farmerAddress}`);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error: any) {
      logger.error('Failed to register farmer on blockchain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 设置授权调用者
   */
  async setAuthorizedCaller(caller: string, authorized: boolean) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.setAuthorizedCaller(caller, authorized);
      const receipt = await tx.wait();

      logger.info(`Authorized caller set: ${caller} = ${authorized}`);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error: any) {
      logger.error('Failed to set authorized caller:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Wei转换为Ether
   */
  weiToEther(wei: string): string {
    return ethers.utils.formatEther(wei);
  }

  /**
   * Ether转换为Wei
   */
  etherToWei(ether: string): string {
    return ethers.utils.parseEther(ether).toString();
  }

  /**
   * 验证地址格式
   */
  isValidAddress(address: string): boolean {
    return ethers.utils.isAddress(address);
  }
}

// 导出单例
export const web3Service = new Web3Service();

