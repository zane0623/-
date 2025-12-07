import { expect } from "chai";
import { ethers } from "hardhat";
import { AgriProductNFT, PresaleManager, EscrowManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

/**
 * 端到端集成测试
 * 测试完整的业务流程：预售 → 购买 → NFT铸造 → 托管 → 交付
 */
describe("Integration Tests - 完整业务流程", function () {
  let nftContract: AgriProductNFT;
  let presaleManager: PresaleManager;
  let escrowManager: EscrowManager;
  
  let owner: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer1: SignerWithAddress;
  let buyer2: SignerWithAddress;
  let feeCollector: SignerWithAddress;

  const PRICE = ethers.parseEther("0.1");
  const PRODUCT_TYPE = "恐龙蛋荔枝";
  const QUALITY_GRADE = "特级";
  const ORIGIN_BASE = "广东增城基地";

  beforeEach(async function () {
    [owner, seller, buyer1, buyer2, feeCollector] = await ethers.getSigners();

    // 部署所有合约
    const NFTFactory = await ethers.getContractFactory("AgriProductNFT");
    nftContract = await NFTFactory.deploy();
    await nftContract.waitForDeployment();

    const PresaleFactory = await ethers.getContractFactory("PresaleManager");
    presaleManager = await PresaleFactory.deploy();
    await presaleManager.waitForDeployment();

    const EscrowFactory = await ethers.getContractFactory("EscrowManager");
    escrowManager = await EscrowFactory.deploy(feeCollector.address);
    await escrowManager.waitForDeployment();
  });

  describe("场景1: 完整的预售-购买-交付流程", function () {
    it("应该完成从预售到交付的完整流程", async function () {
      const now = await time.latest();
      const startTime = now + 100;
      const endTime = now + 10000;
      const harvestDate = now + 30 * 24 * 60 * 60; // 30天后采收

      // 1. 创建预售批次
      console.log("Step 1: 创建预售批次");
      await nftContract.createPresaleBatch(
        100, // maxSupply
        PRICE,
        startTime,
        endTime,
        PRODUCT_TYPE
      );

      const batch = await nftContract.presaleBatches(0);
      expect(batch.maxSupply).to.equal(100);
      expect(batch.price).to.equal(PRICE);

      // 2. 等待预售开始
      console.log("Step 2: 等待预售开始");
      await time.increaseTo(startTime + 10);

      // 3. 买家购买
      console.log("Step 3: 买家购买");
      const purchaseAmount = 5;
      const totalCost = PRICE * BigInt(purchaseAmount);

      await nftContract.connect(buyer1).purchaseFromBatch(
        0, // batchId
        purchaseAmount,
        { value: totalCost }
      );

      const updatedBatch = await nftContract.presaleBatches(0);
      expect(updatedBatch.currentSupply).to.equal(purchaseAmount);

      // 4. 为买家铸造NFT
      console.log("Step 4: 铸造NFT");
      for (let i = 0; i < purchaseAmount; i++) {
        await nftContract.mintNFT(
          buyer1.address,
          PRODUCT_TYPE,
          100, // quantity per NFT
          QUALITY_GRADE,
          harvestDate,
          ORIGIN_BASE,
          `QmHash${i}`
        );
      }

      // 验证买家拥有的NFT数量
      const buyerNFTs = await nftContract.getUserNFTs(buyer1.address);
      expect(buyerNFTs.length).to.equal(purchaseAmount);

      // 5. 创建托管
      console.log("Step 5: 创建托管");
      const deliveryDeadline = harvestDate + 7 * 24 * 60 * 60; // 采收后7天交付
      
      await escrowManager.connect(buyer1).createEscrow(
        seller.address,
        buyerNFTs[0], // 第一个NFT的tokenId
        deliveryDeadline,
        { value: PRICE }
      );

      const escrow = await escrowManager.escrows(0);
      expect(escrow.buyer).to.equal(buyer1.address);
      expect(escrow.seller).to.equal(seller.address);
      expect(escrow.amount).to.equal(PRICE);

      // 6. 标记NFT为已交付
      console.log("Step 6: 标记NFT为已交付");
      await nftContract.markAsDelivered(buyerNFTs[0]);

      const metadata = await nftContract.getMetadata(buyerNFTs[0]);
      expect(metadata.delivered).to.be.true;

      // 7. 买家确认收货
      console.log("Step 7: 买家确认收货");
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      
      await escrowManager.connect(buyer1).confirmDelivery(0);

      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const expectedFee = (PRICE * BigInt(250)) / BigInt(10000); // 2.5%
      const expectedSellerAmount = PRICE - expectedFee;

      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedSellerAmount);

      const finalEscrow = await escrowManager.escrows(0);
      expect(finalEscrow.status).to.equal(1); // Completed

      console.log("✅ 完整流程测试通过!");
    });
  });

  describe("场景2: 多买家并发购买", function () {
    it("应该正确处理多个买家同时购买", async function () {
      const now = await time.latest();
      const startTime = now + 100;
      const endTime = now + 10000;

      // 创建预售批次
      await nftContract.createPresaleBatch(
        100,
        PRICE,
        startTime,
        endTime,
        PRODUCT_TYPE
      );

      await time.increaseTo(startTime + 10);

      // 两个买家同时购买
      const buyer1Amount = 30;
      const buyer2Amount = 40;

      await Promise.all([
        nftContract.connect(buyer1).purchaseFromBatch(
          0,
          buyer1Amount,
          { value: PRICE * BigInt(buyer1Amount) }
        ),
        nftContract.connect(buyer2).purchaseFromBatch(
          0,
          buyer2Amount,
          { value: PRICE * BigInt(buyer2Amount) }
        )
      ]);

      const batch = await nftContract.presaleBatches(0);
      expect(batch.currentSupply).to.equal(buyer1Amount + buyer2Amount);

      console.log("✅ 多买家并发购买测试通过!");
    });
  });

  describe("场景3: 退款流程", function () {
    it("应该正确处理争议退款", async function () {
      const now = await time.latest();
      const deliveryDeadline = now + 7 * 24 * 60 * 60;

      // 创建托管
      await escrowManager.connect(buyer1).createEscrow(
        seller.address,
        1, // tokenId
        deliveryDeadline,
        { value: PRICE }
      );

      // 买家申请退款
      await escrowManager.connect(buyer1).requestRefund(0);

      const escrow = await escrowManager.escrows(0);
      expect(escrow.status).to.equal(3); // Disputed

      // 仲裁者解决争议（买家获胜）
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer1.address);
      
      await escrowManager.connect(owner).resolveDispute(0, true);

      const buyerBalanceAfter = await ethers.provider.getBalance(buyer1.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(PRICE);

      const finalEscrow = await escrowManager.escrows(0);
      expect(finalEscrow.status).to.equal(2); // Refunded

      console.log("✅ 退款流程测试通过!");
    });
  });

  describe("场景4: 批量铸造和查询", function () {
    it("应该正确批量铸造NFT并查询", async function () {
      const now = await time.latest();
      const harvestDate = now + 30 * 24 * 60 * 60;
      const batchSize = 50;

      // 批量铸造
      for (let i = 0; i < batchSize; i++) {
        await nftContract.mintNFT(
          buyer1.address,
          PRODUCT_TYPE,
          100,
          QUALITY_GRADE,
          harvestDate,
          ORIGIN_BASE,
          `QmBatchHash${i}`
        );
      }

      // 查询用户NFT
      const userNFTs = await nftContract.getUserNFTs(buyer1.address);
      expect(userNFTs.length).to.equal(batchSize);

      // 验证每个NFT的元数据
      for (const tokenId of userNFTs) {
        const metadata = await nftContract.getMetadata(tokenId);
        expect(metadata.productType).to.equal(PRODUCT_TYPE);
        expect(metadata.qualityGrade).to.equal(QUALITY_GRADE);
        expect(metadata.originBase).to.equal(ORIGIN_BASE);
      }

      console.log("✅ 批量铸造和查询测试通过!");
    });
  });

  describe("场景5: 预售超卖保护", function () {
    it("应该防止预售超卖", async function () {
      const now = await time.latest();
      const startTime = now + 100;
      const endTime = now + 10000;

      // 创建小批量预售
      const maxSupply = 10;
      await nftContract.createPresaleBatch(
        maxSupply,
        PRICE,
        startTime,
        endTime,
        PRODUCT_TYPE
      );

      await time.increaseTo(startTime + 10);

      // 买家1购买全部
      await nftContract.connect(buyer1).purchaseFromBatch(
        0,
        maxSupply,
        { value: PRICE * BigInt(maxSupply) }
      );

      // 买家2尝试购买应该失败
      await expect(
        nftContract.connect(buyer2).purchaseFromBatch(
          0,
          1,
          { value: PRICE }
        )
      ).to.be.revertedWith("Exceeds max supply");

      console.log("✅ 预售超卖保护测试通过!");
    });
  });

  describe("场景6: 自动释放托管", function () {
    it("超时后应该自动释放托管给卖家", async function () {
      const now = await time.latest();
      const deliveryDeadline = now + 7 * 24 * 60 * 60;

      // 创建托管
      await escrowManager.connect(buyer1).createEscrow(
        seller.address,
        1,
        deliveryDeadline,
        { value: PRICE }
      );

      // 等待超时（截止日期后7天）
      await time.increaseTo(deliveryDeadline + 7 * 24 * 60 * 60 + 1);

      // 自动释放
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      await escrowManager.autoRelease(0);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

      const expectedFee = (PRICE * BigInt(250)) / BigInt(10000);
      const expectedSellerAmount = PRICE - expectedFee;

      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedSellerAmount);

      const escrow = await escrowManager.escrows(0);
      expect(escrow.status).to.equal(1); // Completed

      console.log("✅ 自动释放托管测试通过!");
    });
  });

  describe("场景7: 完整的电商流程模拟", function () {
    it("应该模拟完整的电商流程", async function () {
      console.log("\n========== 电商流程模拟 ==========\n");

      const now = await time.latest();
      const presaleStart = now + 100;
      const presaleEnd = now + 10000;
      const harvestDate = now + 30 * 24 * 60 * 60;
      const deliveryDeadline = harvestDate + 7 * 24 * 60 * 60;

      // 阶段1: 商家创建预售
      console.log("📦 阶段1: 商家创建预售");
      await nftContract.createPresaleBatch(
        1000,
        PRICE,
        presaleStart,
        presaleEnd,
        "2024年首批恐龙蛋荔枝"
      );
      console.log("   预售批次已创建");

      // 阶段2: 预售开始，用户购买
      console.log("🛒 阶段2: 用户购买预售");
      await time.increaseTo(presaleStart + 10);
      
      await nftContract.connect(buyer1).purchaseFromBatch(
        0,
        10,
        { value: PRICE * BigInt(10) }
      );
      console.log("   用户1购买了10份");

      await nftContract.connect(buyer2).purchaseFromBatch(
        0,
        5,
        { value: PRICE * BigInt(5) }
      );
      console.log("   用户2购买了5份");

      // 阶段3: 产品成熟，铸造NFT
      console.log("🌱 阶段3: 产品成熟，铸造NFT");
      await time.increaseTo(harvestDate);

      // 为buyer1铸造NFT
      for (let i = 0; i < 10; i++) {
        await nftContract.mintNFT(
          buyer1.address,
          PRODUCT_TYPE,
          100,
          QUALITY_GRADE,
          harvestDate,
          ORIGIN_BASE,
          `QmBuyer1NFT${i}`
        );
      }
      console.log("   为用户1铸造了10个NFT");

      // 为buyer2铸造NFT
      for (let i = 0; i < 5; i++) {
        await nftContract.mintNFT(
          buyer2.address,
          PRODUCT_TYPE,
          100,
          QUALITY_GRADE,
          harvestDate,
          ORIGIN_BASE,
          `QmBuyer2NFT${i}`
        );
      }
      console.log("   为用户2铸造了5个NFT");

      // 阶段4: 物流配送，创建托管
      console.log("🚚 阶段4: 物流配送");
      const buyer1NFTs = await nftContract.getUserNFTs(buyer1.address);
      
      await escrowManager.connect(buyer1).createEscrow(
        seller.address,
        buyer1NFTs[0],
        deliveryDeadline,
        { value: PRICE }
      );
      console.log("   用户1创建托管，等待配送");

      // 阶段5: 确认收货
      console.log("✅ 阶段5: 确认收货");
      await nftContract.markAsDelivered(buyer1NFTs[0]);
      await escrowManager.connect(buyer1).confirmDelivery(0);
      console.log("   用户1确认收货");

      // 验证最终状态
      const finalBatch = await nftContract.presaleBatches(0);
      const finalEscrow = await escrowManager.escrows(0);

      expect(finalBatch.currentSupply).to.equal(15);
      expect(finalEscrow.status).to.equal(1);

      console.log("\n========== 流程完成 ==========");
      console.log(`   总销售: ${finalBatch.currentSupply}份`);
      console.log(`   托管状态: 已完成`);
      console.log("================================\n");
    });
  });
});

