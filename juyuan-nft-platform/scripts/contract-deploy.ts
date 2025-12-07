/**
 * 钜园农业NFT平台 - 智能合约部署脚本
 * 
 * 用法:
 *   npx ts-node scripts/contract-deploy.ts --network [network]
 *   
 * 网络:
 *   localhost    本地Hardhat网络
 *   mumbai       Polygon Mumbai测试网
 *   polygon      Polygon主网
 */

import { ethers, network } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

interface DeploymentInfo {
  network: string;
  chainId: number;
  deployer: string;
  timestamp: string;
  contracts: {
    AgriProductNFT: string;
    PresaleManager: string;
    EscrowManager: string;
  };
  gasUsed: {
    AgriProductNFT: string;
    PresaleManager: string;
    EscrowManager: string;
    total: string;
  };
}

async function main() {
  console.log('');
  console.log('==========================================');
  console.log('   钜园农业NFT平台 - 智能合约部署');
  console.log('==========================================');
  console.log('');

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  
  console.log(`📍 网络: ${network.name}`);
  console.log(`👤 部署者: ${deployer.address}`);
  console.log(`💰 余额: ${ethers.formatEther(balance)} ETH`);
  console.log('');

  // 检查余额
  if (balance < ethers.parseEther('0.1')) {
    console.error('❌ 余额不足，至少需要0.1 ETH');
    process.exit(1);
  }

  let totalGasUsed = BigInt(0);
  const gasUsed: Record<string, string> = {};

  // 1. 部署 AgriProductNFT 合约
  console.log('📦 部署 AgriProductNFT 合约...');
  const AgriProductNFT = await ethers.getContractFactory('AgriProductNFT');
  const nftContract = await AgriProductNFT.deploy();
  await nftContract.waitForDeployment();
  
  const nftReceipt = await nftContract.deploymentTransaction()?.wait();
  const nftGas = nftReceipt?.gasUsed || BigInt(0);
  totalGasUsed += nftGas;
  gasUsed.AgriProductNFT = nftGas.toString();
  
  const nftAddress = await nftContract.getAddress();
  console.log(`   ✅ AgriProductNFT: ${nftAddress}`);
  console.log(`   ⛽ Gas使用: ${nftGas.toString()}`);
  console.log('');

  // 2. 部署 PresaleManager 合约
  console.log('📦 部署 PresaleManager 合约...');
  const PresaleManager = await ethers.getContractFactory('PresaleManager');
  const presaleContract = await PresaleManager.deploy();
  await presaleContract.waitForDeployment();
  
  const presaleReceipt = await presaleContract.deploymentTransaction()?.wait();
  const presaleGas = presaleReceipt?.gasUsed || BigInt(0);
  totalGasUsed += presaleGas;
  gasUsed.PresaleManager = presaleGas.toString();
  
  const presaleAddress = await presaleContract.getAddress();
  console.log(`   ✅ PresaleManager: ${presaleAddress}`);
  console.log(`   ⛽ Gas使用: ${presaleGas.toString()}`);
  console.log('');

  // 3. 部署 EscrowManager 合约
  console.log('📦 部署 EscrowManager 合约...');
  const EscrowManager = await ethers.getContractFactory('EscrowManager');
  const escrowContract = await EscrowManager.deploy(deployer.address); // feeCollector = deployer
  await escrowContract.waitForDeployment();
  
  const escrowReceipt = await escrowContract.deploymentTransaction()?.wait();
  const escrowGas = escrowReceipt?.gasUsed || BigInt(0);
  totalGasUsed += escrowGas;
  gasUsed.EscrowManager = escrowGas.toString();
  
  const escrowAddress = await escrowContract.getAddress();
  console.log(`   ✅ EscrowManager: ${escrowAddress}`);
  console.log(`   ⛽ Gas使用: ${escrowGas.toString()}`);
  console.log('');

  gasUsed.total = totalGasUsed.toString();

  // 保存部署信息
  const deploymentInfo: DeploymentInfo = {
    network: network.name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AgriProductNFT: nftAddress,
      PresaleManager: presaleAddress,
      EscrowManager: escrowAddress,
    },
    gasUsed: {
      AgriProductNFT: gasUsed.AgriProductNFT,
      PresaleManager: gasUsed.PresaleManager,
      EscrowManager: gasUsed.EscrowManager,
      total: gasUsed.total,
    },
  };

  // 保存到文件
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 部署信息已保存: ${deploymentFile}`);
  console.log('');

  // 更新.env文件
  console.log('🔧 更新环境变量...');
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf-8');
    
    envContent = envContent.replace(
      /NFT_CONTRACT_ADDRESS=.*/,
      `NFT_CONTRACT_ADDRESS=${nftAddress}`
    );
    envContent = envContent.replace(
      /PRESALE_CONTRACT_ADDRESS=.*/,
      `PRESALE_CONTRACT_ADDRESS=${presaleAddress}`
    );
    envContent = envContent.replace(
      /ESCROW_CONTRACT_ADDRESS=.*/,
      `ESCROW_CONTRACT_ADDRESS=${escrowAddress}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('   ✅ .env文件已更新');
  }

  // 打印摘要
  console.log('');
  console.log('==========================================');
  console.log('            📋 部署摘要');
  console.log('==========================================');
  console.log('');
  console.log('合约地址:');
  console.log(`  AgriProductNFT:  ${nftAddress}`);
  console.log(`  PresaleManager:  ${presaleAddress}`);
  console.log(`  EscrowManager:   ${escrowAddress}`);
  console.log('');
  console.log(`总Gas使用: ${totalGasUsed.toString()}`);
  console.log('');
  console.log('==========================================');
  console.log('           ✅ 部署完成!');
  console.log('==========================================');
  console.log('');

  // 验证合约（如果在测试网或主网）
  if (network.name !== 'localhost' && network.name !== 'hardhat') {
    console.log('💡 提示: 运行以下命令验证合约:');
    console.log(`   npx hardhat verify --network ${network.name} ${nftAddress}`);
    console.log(`   npx hardhat verify --network ${network.name} ${presaleAddress}`);
    console.log(`   npx hardhat verify --network ${network.name} ${escrowAddress} ${deployer.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ 部署失败:', error);
    process.exit(1);
  });

