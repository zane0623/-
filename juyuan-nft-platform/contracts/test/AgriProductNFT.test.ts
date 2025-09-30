import { expect } from "chai";
import { ethers } from "hardhat";
import { AgriProductNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("AgriProductNFT", function () {
  let nftContract: AgriProductNFT;
  let owner: SignerWithAddress;
  let buyer1: SignerWithAddress;
  let buyer2: SignerWithAddress;

  beforeEach(async function () {
    [owner, buyer1, buyer2] = await ethers.getSigners();

    const NFTFactory = await ethers.getContractFactory("AgriProductNFT");
    nftContract = await NFTFactory.deploy();
    await nftContract.waitForDeployment();
  });

  describe("部署", function () {
    it("应该正确设置合约名称和符号", async function () {
      expect(await nftContract.name()).to.equal("JuyuanAgriProductNFT");
      expect(await nftContract.symbol()).to.equal("JANFT");
    });

    it("应该设置正确的所有者", async function () {
      expect(await nftContract.owner()).to.equal(owner.address);
    });
  });

  describe("铸造NFT", function () {
    const productData = {
      productType: "恐龙蛋荔枝",
      quantity: 1000,
      qualityGrade: "特级",
      harvestDate: Math.floor(Date.now() / 1000),
      originBase: "广东基地",
      ipfsHash: "QmTest123456789",
    };

    it("应该成功铸造单个NFT", async function () {
      const tx = await nftContract.mintNFT(
        buyer1.address,
        productData.productType,
        productData.quantity,
        productData.qualityGrade,
        productData.harvestDate,
        productData.originBase,
        productData.ipfsHash
      );

      await expect(tx)
        .to.emit(nftContract, "NFTMinted")
        .withArgs(0, buyer1.address, productData.productType, productData.quantity);

      expect(await nftContract.ownerOf(0)).to.equal(buyer1.address);
    });

    it("应该正确存储NFT元数据", async function () {
      await nftContract.mintNFT(
        buyer1.address,
        productData.productType,
        productData.quantity,
        productData.qualityGrade,
        productData.harvestDate,
        productData.originBase,
        productData.ipfsHash
      );

      const metadata = await nftContract.getMetadata(0);
      expect(metadata.productType).to.equal(productData.productType);
      expect(metadata.quantity).to.equal(productData.quantity);
      expect(metadata.qualityGrade).to.equal(productData.qualityGrade);
      expect(metadata.originBase).to.equal(productData.originBase);
      expect(metadata.ipfsHash).to.equal(productData.ipfsHash);
      expect(metadata.delivered).to.be.false;
    });

    it("应该成功批量铸造NFT", async function () {
      const recipients = [buyer1.address, buyer2.address];

      const tx = await nftContract.batchMintNFT(
        recipients,
        productData.productType,
        productData.quantity,
        productData.qualityGrade,
        productData.harvestDate,
        productData.originBase,
        productData.ipfsHash
      );

      await tx.wait();

      expect(await nftContract.ownerOf(0)).to.equal(buyer1.address);
      expect(await nftContract.ownerOf(1)).to.equal(buyer2.address);
    });

    it("批量铸造不应超过100个", async function () {
      const recipients = Array(101).fill(buyer1.address);

      await expect(
        nftContract.batchMintNFT(
          recipients,
          productData.productType,
          productData.quantity,
          productData.qualityGrade,
          productData.harvestDate,
          productData.originBase,
          productData.ipfsHash
        )
      ).to.be.revertedWith("Invalid batch size");
    });

    it("非所有者不能铸造NFT", async function () {
      await expect(
        nftContract.connect(buyer1).mintNFT(
          buyer2.address,
          productData.productType,
          productData.quantity,
          productData.qualityGrade,
          productData.harvestDate,
          productData.originBase,
          productData.ipfsHash
        )
      ).to.be.reverted;
    });
  });

  describe("预售批次", function () {
    let batchId: bigint;
    const batchData = {
      maxSupply: 100,
      price: ethers.parseEther("0.1"),
      startTime: 0,
      endTime: 0,
      productType: "恐龙蛋荔枝",
    };

    beforeEach(async function () {
      const now = await time.latest();
      batchData.startTime = now + 100;
      batchData.endTime = now + 1000;

      const tx = await nftContract.createPresaleBatch(
        batchData.maxSupply,
        batchData.price,
        batchData.startTime,
        batchData.endTime,
        batchData.productType
      );

      const receipt = await tx.wait();
      batchId = 0n; // 第一个批次ID为0
    });

    it("应该成功创建预售批次", async function () {
      const batch = await nftContract.presaleBatches(batchId);
      expect(batch.maxSupply).to.equal(batchData.maxSupply);
      expect(batch.price).to.equal(batchData.price);
      expect(batch.productType).to.equal(batchData.productType);
      expect(batch.active).to.be.true;
    });

    it("应该在正确的时间窗口内购买", async function () {
      await time.increaseTo(batchData.startTime + 10);

      const amount = 5;
      const totalCost = batchData.price * BigInt(amount);

      await expect(
        nftContract.connect(buyer1).purchaseFromBatch(batchId, amount, {
          value: totalCost,
        })
      )
        .to.emit(nftContract, "BatchPurchase")
        .withArgs(batchId, buyer1.address, amount);
    });

    it("在预售开始前不能购买", async function () {
      const amount = 5;
      const totalCost = batchData.price * BigInt(amount);

      await expect(
        nftContract.connect(buyer1).purchaseFromBatch(batchId, amount, {
          value: totalCost,
        })
      ).to.be.revertedWith("Not in sale period");
    });

    it("在预售结束后不能购买", async function () {
      await time.increaseTo(batchData.endTime + 10);

      const amount = 5;
      const totalCost = batchData.price * BigInt(amount);

      await expect(
        nftContract.connect(buyer1).purchaseFromBatch(batchId, amount, {
          value: totalCost,
        })
      ).to.be.revertedWith("Not in sale period");
    });

    it("支付金额不足应该失败", async function () {
      await time.increaseTo(batchData.startTime + 10);

      const amount = 5;
      const insufficientPayment = batchData.price * BigInt(amount - 1);

      await expect(
        nftContract.connect(buyer1).purchaseFromBatch(batchId, amount, {
          value: insufficientPayment,
        })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("不应超过最大供应量", async function () {
      await time.increaseTo(batchData.startTime + 10);

      const amount = batchData.maxSupply + 1;
      const totalCost = batchData.price * BigInt(amount);

      await expect(
        nftContract.connect(buyer1).purchaseFromBatch(batchId, amount, {
          value: totalCost,
        })
      ).to.be.revertedWith("Exceeds max supply");
    });
  });

  describe("交付管理", function () {
    beforeEach(async function () {
      await nftContract.mintNFT(
        buyer1.address,
        "荔枝",
        1000,
        "特级",
        Math.floor(Date.now() / 1000),
        "广东基地",
        "QmTest"
      );
    });

    it("应该成功标记为已交付", async function () {
      await expect(nftContract.markAsDelivered(0))
        .to.emit(nftContract, "ProductDelivered")
        .withArgs(0, buyer1.address);

      const metadata = await nftContract.getMetadata(0);
      expect(metadata.delivered).to.be.true;
    });

    it("非所有者不能标记为已交付", async function () {
      await expect(
        nftContract.connect(buyer1).markAsDelivered(0)
      ).to.be.reverted;
    });
  });

  describe("用户NFT查询", function () {
    it("应该正确返回用户的所有NFT", async function () {
      // 铸造3个NFT给buyer1
      for (let i = 0; i < 3; i++) {
        await nftContract.mintNFT(
          buyer1.address,
          "荔枝",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "广东基地",
          `QmTest${i}`
        );
      }

      const userTokens = await nftContract.getUserTokens(buyer1.address);
      expect(userTokens.length).to.equal(3);
      expect(userTokens[0]).to.equal(0);
      expect(userTokens[1]).to.equal(1);
      expect(userTokens[2]).to.equal(2);
    });
  });

  describe("暂停功能", function () {
    it("所有者应该能够暂停合约", async function () {
      await nftContract.pause();
      
      await expect(
        nftContract.mintNFT(
          buyer1.address,
          "荔枝",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "广东基地",
          "QmTest"
        )
      ).to.be.revertedWith("Pausable: paused");
    });

    it("所有者应该能够恢复合约", async function () {
      await nftContract.pause();
      await nftContract.unpause();

      await expect(
        nftContract.mintNFT(
          buyer1.address,
          "荔枝",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "广东基地",
          "QmTest"
        )
      ).to.not.be.reverted;
    });
  });

  describe("资金提取", function () {
    it("所有者应该能够提取合约余额", async function () {
      // 模拟向合约发送ETH
      await owner.sendTransaction({
        to: await nftContract.getAddress(),
        value: ethers.parseEther("1"),
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      const tx = await nftContract.withdraw();
      const receipt = await tx.wait();
      
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.closeTo(
        initialBalance + ethers.parseEther("1") - gasUsed,
        ethers.parseEther("0.01")
      );
    });

    it("非所有者不能提取余额", async function () {
      await expect(nftContract.connect(buyer1).withdraw()).to.be.reverted;
    });
  });
}); 