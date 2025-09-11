const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署钜园农业恐龙蛋荔枝NFT智能合约...");

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("部署者账户:", deployer.address);
  console.log("账户余额:", (await deployer.getBalance()).toString());

  // 部署主合约
  const DragonEggLycheeNFT = await ethers.getContractFactory("DragonEggLycheeNFT");
  const lycheeNFT = await DragonEggLycheeNFT.deploy();
  await lycheeNFT.deployed();

  console.log("DragonEggLycheeNFT 合约地址:", lycheeNFT.address);

  // 验证合约
  console.log("等待区块确认...");
  await lycheeNFT.deployTransaction.wait(5);

  console.log("合约部署完成！");
  console.log("合约地址:", lycheeNFT.address);
  console.log("部署者:", deployer.address);
  console.log("Gas 使用量:", lycheeNFT.deployTransaction.gasLimit.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
