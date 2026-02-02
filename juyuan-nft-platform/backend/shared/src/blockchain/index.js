"use strict";
// ========================================
// 钜园农业NFT平台 - 区块链工具
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowContractService = exports.PresaleContractService = exports.NFTContractService = exports.ContractService = exports.weiUtils = void 0;
exports.getProvider = getProvider;
exports.getSigner = getSigner;
exports.verifySignature = verifySignature;
exports.generateLoginMessage = generateLoginMessage;
exports.generateNonce = generateNonce;
exports.isValidAddress = isValidAddress;
exports.formatAddress = formatAddress;
exports.shortenAddress = shortenAddress;
exports.createEventListener = createEventListener;
const ethers_1 = require("ethers");
const logger_1 = require("../logger");
const constants_1 = require("../constants");
const logger = (0, logger_1.createLogger)('blockchain');
// 获取Provider
function getProvider(network = 'POLYGON_MUMBAI') {
    const config = constants_1.NETWORKS[network];
    return new ethers_1.ethers.JsonRpcProvider(config.rpcUrl);
}
// 获取Signer（需要私钥）
function getSigner(privateKey, network = 'POLYGON_MUMBAI') {
    const provider = getProvider(network);
    return new ethers_1.ethers.Wallet(privateKey, provider);
}
// 验证签名（钱包登录）
async function verifySignature(message, signature, expectedAddress) {
    try {
        const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    }
    catch (error) {
        logger.error('Signature verification failed', { error });
        return false;
    }
}
// 生成登录消息
function generateLoginMessage(walletAddress, nonce) {
    return `欢迎登录钜园农业NFT平台！

请签名此消息以验证您的身份。
此操作不会花费任何Gas费用。

钱包地址: ${walletAddress}
随机数: ${nonce}
时间戳: ${new Date().toISOString()}`;
}
// 生成随机数
function generateNonce() {
    return ethers_1.ethers.hexlify(ethers_1.ethers.randomBytes(16));
}
// 检查地址格式
function isValidAddress(address) {
    return ethers_1.ethers.isAddress(address);
}
// 格式化地址（校验和格式）
function formatAddress(address) {
    if (!isValidAddress(address)) {
        throw new Error('Invalid address');
    }
    return ethers_1.ethers.getAddress(address);
}
// 缩短地址显示
function shortenAddress(address, chars = 4) {
    if (!isValidAddress(address)) {
        return address;
    }
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
// Wei转换工具
exports.weiUtils = {
    toWei: (value, decimals = 18) => {
        return ethers_1.ethers.parseUnits(value.toString(), decimals);
    },
    fromWei: (value, decimals = 18) => {
        return ethers_1.ethers.formatUnits(value, decimals);
    },
    toEther: (value) => {
        return ethers_1.ethers.formatEther(value);
    },
    parseEther: (value) => {
        return ethers_1.ethers.parseEther(value);
    }
};
// 合约交互基类
class ContractService {
    constructor(address, abi, signerOrProvider) {
        if (signerOrProvider instanceof ethers_1.ethers.Wallet) {
            this.signer = signerOrProvider;
            this.provider = signerOrProvider.provider;
            this.contract = new ethers_1.ethers.Contract(address, abi, signerOrProvider);
        }
        else {
            this.provider = signerOrProvider;
            this.contract = new ethers_1.ethers.Contract(address, abi, signerOrProvider);
        }
    }
    // 获取合约地址
    get address() {
        return this.contract.target;
    }
    // 等待交易确认
    async waitForTransaction(txHash, confirmations = 1) {
        const receipt = await this.provider.waitForTransaction(txHash, confirmations);
        return receipt;
    }
    // 估算Gas
    async estimateGas(method, ...args) {
        return await this.contract[method].estimateGas(...args);
    }
    // 获取当前Gas价格
    async getGasPrice() {
        const feeData = await this.provider.getFeeData();
        return feeData.gasPrice || 0n;
    }
}
exports.ContractService = ContractService;
// NFT合约服务
class NFTContractService extends ContractService {
    // 获取NFT所有者
    async ownerOf(tokenId) {
        return await this.contract.ownerOf(tokenId);
    }
    // 获取NFT元数据URI
    async tokenURI(tokenId) {
        return await this.contract.tokenURI(tokenId);
    }
    // 获取用户NFT余额
    async balanceOf(address) {
        return await this.contract.balanceOf(address);
    }
    // 获取NFT元数据
    async getMetadata(tokenId) {
        return await this.contract.getMetadata(tokenId);
    }
    // 获取用户所有NFT
    async getUserTokens(address) {
        const tokens = await this.contract.getUserTokens(address);
        return tokens.map((t) => Number(t));
    }
    // 铸造NFT（需要signer）
    async mintNFT(to, productType, quantity, qualityGrade, harvestDate, originBase, ipfsHash) {
        if (!this.signer) {
            throw new Error('Signer required for minting');
        }
        return await this.contract.mintNFT(to, productType, quantity, qualityGrade, harvestDate, originBase, ipfsHash);
    }
    // 批量铸造
    async batchMintNFT(recipients, productType, quantity, qualityGrade, harvestDate, originBase, ipfsHash) {
        if (!this.signer) {
            throw new Error('Signer required for batch minting');
        }
        return await this.contract.batchMintNFT(recipients, productType, quantity, qualityGrade, harvestDate, originBase, ipfsHash);
    }
    // 标记已交付
    async markAsDelivered(tokenId) {
        if (!this.signer) {
            throw new Error('Signer required');
        }
        return await this.contract.markAsDelivered(tokenId);
    }
}
exports.NFTContractService = NFTContractService;
// 预售合约服务
class PresaleContractService extends ContractService {
    // 获取预售信息
    async getPresaleInfo(presaleId) {
        return await this.contract.getPresaleInfo(presaleId);
    }
    // 获取用户购买量
    async getUserPurchase(presaleId, address) {
        return await this.contract.getUserPurchase(presaleId, address);
    }
    // 检查是否在白名单
    async isWhitelisted(presaleId, address) {
        return await this.contract.isWhitelisted(presaleId, address);
    }
    // 购买
    async purchase(presaleId, amount, value) {
        if (!this.signer) {
            throw new Error('Signer required for purchase');
        }
        return await this.contract.purchase(presaleId, amount, { value });
    }
    // 创建预售（管理员）
    async createPresale(startTime, endTime, minPurchase, maxPurchase, totalSupply, priceInWei, paymentToken, whitelistEnabled, productType) {
        if (!this.signer) {
            throw new Error('Signer required');
        }
        return await this.contract.createPresale(startTime, endTime, minPurchase, maxPurchase, totalSupply, priceInWei, paymentToken, whitelistEnabled, productType);
    }
    // 添加白名单
    async addToWhitelist(presaleId, users) {
        if (!this.signer) {
            throw new Error('Signer required');
        }
        return await this.contract.addToWhitelist(presaleId, users);
    }
}
exports.PresaleContractService = PresaleContractService;
// 托管合约服务
class EscrowContractService extends ContractService {
    // 获取托管信息
    async getEscrow(escrowId) {
        return await this.contract.escrows(escrowId);
    }
    // 创建托管
    async createEscrow(seller, tokenId, deliveryDeadline, value) {
        if (!this.signer) {
            throw new Error('Signer required');
        }
        return await this.contract.createEscrow(seller, tokenId, deliveryDeadline, { value });
    }
    // 确认交付
    async confirmDelivery(escrowId) {
        if (!this.signer) {
            throw new Error('Signer required');
        }
        return await this.contract.confirmDelivery(escrowId);
    }
    // 申请退款
    async requestRefund(escrowId) {
        if (!this.signer) {
            throw new Error('Signer required');
        }
        return await this.contract.requestRefund(escrowId);
    }
    // 发起争议
    async initiateDispute(escrowId, reason) {
        if (!this.signer) {
            throw new Error('Signer required');
        }
        return await this.contract.initiateDispute(escrowId, reason);
    }
}
exports.EscrowContractService = EscrowContractService;
// 事件监听器
function createEventListener(contract, eventName, callback) {
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
//# sourceMappingURL=index.js.map