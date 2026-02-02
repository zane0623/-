"use strict";
// ========================================
// 钜园农业NFT平台 - 常量定义
// ========================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = exports.REDIS_KEYS = exports.ERROR_CODES = exports.QUALITY_GRADES = exports.PRODUCT_TYPES = exports.CURRENCIES = exports.NETWORKS = exports.CONFIG = void 0;
// 系统配置
exports.CONFIG = {
    // JWT配置
    JWT: {
        ACCESS_TOKEN_EXPIRES: '15m',
        REFRESH_TOKEN_EXPIRES: '7d',
        ISSUER: 'juyuan-nft-platform'
    },
    // 分页配置
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100
    },
    // 缓存过期时间（秒）
    CACHE_TTL: {
        USER: 3600, // 1小时
        NFT: 1800, // 30分钟
        PRESALE: 300, // 5分钟
        EXCHANGE_RATE: 60, // 1分钟
        HOT_DATA: 60 // 1分钟
    },
    // 文件上传限制
    UPLOAD: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        ALLOWED_DOC_TYPES: ['application/pdf']
    }
};
// 区块链网络配置
exports.NETWORKS = {
    POLYGON: {
        chainId: 137,
        name: 'Polygon Mainnet',
        rpcUrl: 'https://polygon-rpc.com',
        explorerUrl: 'https://polygonscan.com',
        currency: 'MATIC'
    },
    POLYGON_MUMBAI: {
        chainId: 80001,
        name: 'Polygon Mumbai',
        rpcUrl: 'https://rpc-mumbai.maticvigil.com',
        explorerUrl: 'https://mumbai.polygonscan.com',
        currency: 'MATIC'
    },
    ETHEREUM: {
        chainId: 1,
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/',
        explorerUrl: 'https://etherscan.io',
        currency: 'ETH'
    }
};
// 支持的货币
exports.CURRENCIES = {
    FIAT: ['CNY', 'USD', 'SGD', 'THB', 'MYR', 'VND', 'JPY', 'KRW'],
    CRYPTO: ['ETH', 'MATIC', 'USDT', 'USDC', 'DAI']
};
// 产品类型
exports.PRODUCT_TYPES = [
    { code: 'GRAPE', name: '葡萄', emoji: '🍇' },
    { code: 'ORANGE', name: '脐橙', emoji: '🍊' },
    { code: 'RICE', name: '大米', emoji: '🌾' },
    { code: 'LYCHEE', name: '荔枝', emoji: '🍒' },
    { code: 'LONGAN', name: '龙眼', emoji: '🫐' },
    { code: 'MANGO', name: '芒果', emoji: '🥭' },
    { code: 'APPLE', name: '苹果', emoji: '🍎' },
    { code: 'PEACH', name: '桃子', emoji: '🍑' },
    { code: 'WATERMELON', name: '西瓜', emoji: '🍉' },
    { code: 'STRAWBERRY', name: '草莓', emoji: '🍓' },
    { code: 'CHERRY', name: '樱桃', emoji: '🍒' },
    { code: 'PLUM', name: '李子', emoji: '🫐' },
    { code: 'TEA', name: '茶叶', emoji: '🍵' },
    { code: 'HONEY', name: '蜂蜜', emoji: '🍯' }
];
// 质量等级
exports.QUALITY_GRADES = [
    { code: 'PREMIUM', name: '特级', description: '最高品质，精选中的精选' },
    { code: 'GRADE_A', name: '一级', description: '优质产品，品质上乘' },
    { code: 'GRADE_B', name: '二级', description: '良好品质，性价比高' },
    { code: 'STANDARD', name: '标准', description: '标准品质，日常食用' }
];
// 错误码
exports.ERROR_CODES = {
    // 通用错误 1xxx
    UNKNOWN_ERROR: { code: '1000', message: '未知错误' },
    INVALID_PARAMS: { code: '1001', message: '参数无效' },
    UNAUTHORIZED: { code: '1002', message: '未授权' },
    FORBIDDEN: { code: '1003', message: '禁止访问' },
    NOT_FOUND: { code: '1004', message: '资源不存在' },
    RATE_LIMITED: { code: '1005', message: '请求过于频繁' },
    // 用户错误 2xxx
    USER_NOT_FOUND: { code: '2001', message: '用户不存在' },
    USER_ALREADY_EXISTS: { code: '2002', message: '用户已存在' },
    INVALID_SIGNATURE: { code: '2003', message: '签名无效' },
    USER_BANNED: { code: '2004', message: '用户已被封禁' },
    KYC_REQUIRED: { code: '2005', message: '需要完成KYC认证' },
    // 预售错误 3xxx
    PRESALE_NOT_FOUND: { code: '3001', message: '预售不存在' },
    PRESALE_NOT_STARTED: { code: '3002', message: '预售未开始' },
    PRESALE_ENDED: { code: '3003', message: '预售已结束' },
    PRESALE_SOLD_OUT: { code: '3004', message: '预售已售罄' },
    EXCEEDS_PURCHASE_LIMIT: { code: '3005', message: '超出购买限制' },
    // 支付错误 4xxx
    INSUFFICIENT_BALANCE: { code: '4001', message: '余额不足' },
    PAYMENT_FAILED: { code: '4002', message: '支付失败' },
    PAYMENT_TIMEOUT: { code: '4003', message: '支付超时' },
    INVALID_CURRENCY: { code: '4004', message: '不支持的币种' },
    // NFT错误 5xxx
    NFT_NOT_FOUND: { code: '5001', message: 'NFT不存在' },
    NFT_NOT_OWNER: { code: '5002', message: '非NFT所有者' },
    NFT_ALREADY_DELIVERED: { code: '5003', message: 'NFT已交付' },
    MINT_FAILED: { code: '5004', message: '铸造失败' },
    // 物流错误 6xxx
    DELIVERY_NOT_FOUND: { code: '6001', message: '物流信息不存在' },
    INVALID_ADDRESS: { code: '6002', message: '配送地址无效' },
    DELIVERY_AREA_NOT_SUPPORTED: { code: '6003', message: '不支持的配送区域' }
};
// Redis键前缀
exports.REDIS_KEYS = {
    USER: 'user:',
    USER_SESSION: 'session:',
    NFT: 'nft:',
    PRESALE: 'presale:',
    PRESALE_LIST: 'presale:list',
    EXCHANGE_RATE: 'rate:',
    NONCE: 'nonce:',
    RATE_LIMIT: 'ratelimit:',
    CACHE: 'cache:'
};
// 事件名称
exports.EVENTS = {
    // 用户事件
    USER_REGISTERED: 'user.registered',
    USER_LOGGED_IN: 'user.logged_in',
    USER_KYC_SUBMITTED: 'user.kyc.submitted',
    USER_KYC_APPROVED: 'user.kyc.approved',
    // 预售事件
    PRESALE_CREATED: 'presale.created',
    PRESALE_STARTED: 'presale.started',
    PRESALE_ENDED: 'presale.ended',
    PRESALE_PURCHASED: 'presale.purchased',
    // NFT事件
    NFT_MINTED: 'nft.minted',
    NFT_TRANSFERRED: 'nft.transferred',
    NFT_DELIVERED: 'nft.delivered',
    // 支付事件
    PAYMENT_INITIATED: 'payment.initiated',
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',
    REFUND_INITIATED: 'refund.initiated',
    REFUND_COMPLETED: 'refund.completed',
    // 物流事件
    DELIVERY_CREATED: 'delivery.created',
    DELIVERY_SHIPPED: 'delivery.shipped',
    DELIVERY_COMPLETED: 'delivery.completed'
};
//# sourceMappingURL=index.js.map