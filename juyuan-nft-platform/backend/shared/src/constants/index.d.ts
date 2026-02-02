export declare const CONFIG: {
    JWT: {
        ACCESS_TOKEN_EXPIRES: string;
        REFRESH_TOKEN_EXPIRES: string;
        ISSUER: string;
    };
    PAGINATION: {
        DEFAULT_PAGE: number;
        DEFAULT_PAGE_SIZE: number;
        MAX_PAGE_SIZE: number;
    };
    CACHE_TTL: {
        USER: number;
        NFT: number;
        PRESALE: number;
        EXCHANGE_RATE: number;
        HOT_DATA: number;
    };
    UPLOAD: {
        MAX_FILE_SIZE: number;
        ALLOWED_IMAGE_TYPES: string[];
        ALLOWED_DOC_TYPES: string[];
    };
};
export declare const NETWORKS: {
    POLYGON: {
        chainId: number;
        name: string;
        rpcUrl: string;
        explorerUrl: string;
        currency: string;
    };
    POLYGON_MUMBAI: {
        chainId: number;
        name: string;
        rpcUrl: string;
        explorerUrl: string;
        currency: string;
    };
    ETHEREUM: {
        chainId: number;
        name: string;
        rpcUrl: string;
        explorerUrl: string;
        currency: string;
    };
};
export declare const CURRENCIES: {
    FIAT: string[];
    CRYPTO: string[];
};
export declare const PRODUCT_TYPES: {
    code: string;
    name: string;
    emoji: string;
}[];
export declare const QUALITY_GRADES: {
    code: string;
    name: string;
    description: string;
}[];
export declare const ERROR_CODES: {
    UNKNOWN_ERROR: {
        code: string;
        message: string;
    };
    INVALID_PARAMS: {
        code: string;
        message: string;
    };
    UNAUTHORIZED: {
        code: string;
        message: string;
    };
    FORBIDDEN: {
        code: string;
        message: string;
    };
    NOT_FOUND: {
        code: string;
        message: string;
    };
    RATE_LIMITED: {
        code: string;
        message: string;
    };
    USER_NOT_FOUND: {
        code: string;
        message: string;
    };
    USER_ALREADY_EXISTS: {
        code: string;
        message: string;
    };
    INVALID_SIGNATURE: {
        code: string;
        message: string;
    };
    USER_BANNED: {
        code: string;
        message: string;
    };
    KYC_REQUIRED: {
        code: string;
        message: string;
    };
    PRESALE_NOT_FOUND: {
        code: string;
        message: string;
    };
    PRESALE_NOT_STARTED: {
        code: string;
        message: string;
    };
    PRESALE_ENDED: {
        code: string;
        message: string;
    };
    PRESALE_SOLD_OUT: {
        code: string;
        message: string;
    };
    EXCEEDS_PURCHASE_LIMIT: {
        code: string;
        message: string;
    };
    INSUFFICIENT_BALANCE: {
        code: string;
        message: string;
    };
    PAYMENT_FAILED: {
        code: string;
        message: string;
    };
    PAYMENT_TIMEOUT: {
        code: string;
        message: string;
    };
    INVALID_CURRENCY: {
        code: string;
        message: string;
    };
    NFT_NOT_FOUND: {
        code: string;
        message: string;
    };
    NFT_NOT_OWNER: {
        code: string;
        message: string;
    };
    NFT_ALREADY_DELIVERED: {
        code: string;
        message: string;
    };
    MINT_FAILED: {
        code: string;
        message: string;
    };
    DELIVERY_NOT_FOUND: {
        code: string;
        message: string;
    };
    INVALID_ADDRESS: {
        code: string;
        message: string;
    };
    DELIVERY_AREA_NOT_SUPPORTED: {
        code: string;
        message: string;
    };
};
export declare const REDIS_KEYS: {
    USER: string;
    USER_SESSION: string;
    NFT: string;
    PRESALE: string;
    PRESALE_LIST: string;
    EXCHANGE_RATE: string;
    NONCE: string;
    RATE_LIMIT: string;
    CACHE: string;
};
export declare const EVENTS: {
    USER_REGISTERED: string;
    USER_LOGGED_IN: string;
    USER_KYC_SUBMITTED: string;
    USER_KYC_APPROVED: string;
    PRESALE_CREATED: string;
    PRESALE_STARTED: string;
    PRESALE_ENDED: string;
    PRESALE_PURCHASED: string;
    NFT_MINTED: string;
    NFT_TRANSFERRED: string;
    NFT_DELIVERED: string;
    PAYMENT_INITIATED: string;
    PAYMENT_COMPLETED: string;
    PAYMENT_FAILED: string;
    REFUND_INITIATED: string;
    REFUND_COMPLETED: string;
    DELIVERY_CREATED: string;
    DELIVERY_SHIPPED: string;
    DELIVERY_COMPLETED: string;
};
//# sourceMappingURL=index.d.ts.map