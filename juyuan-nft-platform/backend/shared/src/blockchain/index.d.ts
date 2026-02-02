import { ethers } from 'ethers';
export declare function getProvider(network?: 'POLYGON' | 'POLYGON_MUMBAI' | 'ETHEREUM'): ethers.JsonRpcProvider;
export declare function getSigner(privateKey: string, network?: 'POLYGON' | 'POLYGON_MUMBAI' | 'ETHEREUM'): ethers.Wallet;
export declare function verifySignature(message: string, signature: string, expectedAddress: string): Promise<boolean>;
export declare function generateLoginMessage(walletAddress: string, nonce: string): string;
export declare function generateNonce(): string;
export declare function isValidAddress(address: string): boolean;
export declare function formatAddress(address: string): string;
export declare function shortenAddress(address: string, chars?: number): string;
export declare const weiUtils: {
    toWei: (value: string | number, decimals?: number) => bigint;
    fromWei: (value: bigint | string, decimals?: number) => string;
    toEther: (value: bigint | string) => string;
    parseEther: (value: string) => bigint;
};
export declare class ContractService {
    protected contract: ethers.Contract;
    protected provider: ethers.Provider;
    protected signer?: ethers.Wallet;
    constructor(address: string, abi: ethers.InterfaceAbi, signerOrProvider: ethers.Wallet | ethers.Provider);
    get address(): string;
    waitForTransaction(txHash: string, confirmations?: number): Promise<ethers.TransactionReceipt | null>;
    estimateGas(method: string, ...args: any[]): Promise<bigint>;
    getGasPrice(): Promise<bigint>;
}
export declare class NFTContractService extends ContractService {
    ownerOf(tokenId: number): Promise<string>;
    tokenURI(tokenId: number): Promise<string>;
    balanceOf(address: string): Promise<bigint>;
    getMetadata(tokenId: number): Promise<any>;
    getUserTokens(address: string): Promise<number[]>;
    mintNFT(to: string, productType: string, quantity: number, qualityGrade: string, harvestDate: number, originBase: string, ipfsHash: string): Promise<ethers.TransactionResponse>;
    batchMintNFT(recipients: string[], productType: string, quantity: number, qualityGrade: string, harvestDate: number, originBase: string, ipfsHash: string): Promise<ethers.TransactionResponse>;
    markAsDelivered(tokenId: number): Promise<ethers.TransactionResponse>;
}
export declare class PresaleContractService extends ContractService {
    getPresaleInfo(presaleId: number): Promise<any>;
    getUserPurchase(presaleId: number, address: string): Promise<bigint>;
    isWhitelisted(presaleId: number, address: string): Promise<boolean>;
    purchase(presaleId: number, amount: number, value: bigint): Promise<ethers.TransactionResponse>;
    createPresale(startTime: number, endTime: number, minPurchase: number, maxPurchase: number, totalSupply: number, priceInWei: bigint, paymentToken: string, whitelistEnabled: boolean, productType: string): Promise<ethers.TransactionResponse>;
    addToWhitelist(presaleId: number, users: string[]): Promise<ethers.TransactionResponse>;
}
export declare class EscrowContractService extends ContractService {
    getEscrow(escrowId: number): Promise<any>;
    createEscrow(seller: string, tokenId: number, deliveryDeadline: number, value: bigint): Promise<ethers.TransactionResponse>;
    confirmDelivery(escrowId: number): Promise<ethers.TransactionResponse>;
    requestRefund(escrowId: number): Promise<ethers.TransactionResponse>;
    initiateDispute(escrowId: number, reason: string): Promise<ethers.TransactionResponse>;
}
export declare function createEventListener(contract: ethers.Contract, eventName: string, callback: (event: any) => void): () => void;
//# sourceMappingURL=index.d.ts.map