import { expect } from "chai";
import { ethers } from "hardhat";
import { EscrowManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("EscrowManager", function () {
  let escrowManager: EscrowManager;
  let owner: SignerWithAddress;
  let buyer: SignerWithAddress;
  let seller: SignerWithAddress;
  let feeCollector: SignerWithAddress;
  let arbiter: SignerWithAddress;

  const PLATFORM_FEE = 250; // 2.5%
  const NFT_TOKEN_ID = 1;
  const ESCROW_AMOUNT = ethers.parseEther("1");

  beforeEach(async function () {
    [owner, buyer, seller, feeCollector, arbiter] = await ethers.getSigners();

    const EscrowManagerFactory = await ethers.getContractFactory("EscrowManager");
    escrowManager = await EscrowManagerFactory.deploy(feeCollector.address);
    await escrowManager.waitForDeployment();
  });

  describe("部署", function () {
    it("应该正确设置手续费收集者", async function () {
      expect(await escrowManager.feeCollector()).to.equal(feeCollector.address);
    });

    it("应该正确设置平台手续费", async function () {
      expect(await escrowManager.platformFee()).to.equal(PLATFORM_FEE);
    });

    it("应该正确设置所有者", async function () {
      expect(await escrowManager.owner()).to.equal(owner.address);
    });
  });

  describe("创建托管", function () {
    it("应该成功创建托管", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60; // 7天后

      await expect(
        escrowManager.connect(buyer).createEscrow(
          seller.address,
          NFT_TOKEN_ID,
          deadline,
          { value: ESCROW_AMOUNT }
        )
      )
        .to.emit(escrowManager, "EscrowCreated")
        .withArgs(0, buyer.address, seller.address, ESCROW_AMOUNT);

      const escrow = await escrowManager.escrows(0);
      expect(escrow.buyer).to.equal(buyer.address);
      expect(escrow.seller).to.equal(seller.address);
      expect(escrow.amount).to.equal(ESCROW_AMOUNT);
      expect(escrow.nftTokenId).to.equal(NFT_TOKEN_ID);
      expect(escrow.status).to.equal(0); // Active
      expect(escrow.deliveryDeadline).to.equal(deadline);
    });

    it("托管金额为0时应该失败", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      await expect(
        escrowManager.connect(buyer).createEscrow(
          seller.address,
          NFT_TOKEN_ID,
          deadline,
          { value: 0 }
        )
      ).to.be.revertedWith("Invalid amount");
    });

    it("卖家地址为零地址时应该失败", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      await expect(
        escrowManager.connect(buyer).createEscrow(
          ethers.ZeroAddress,
          NFT_TOKEN_ID,
          deadline,
          { value: ESCROW_AMOUNT }
        )
      ).to.be.revertedWith("Invalid seller");
    });

    it("截止日期在过去时应该失败", async function () {
      const now = await time.latest();
      const pastDeadline = now - 1000;

      await expect(
        escrowManager.connect(buyer).createEscrow(
          seller.address,
          NFT_TOKEN_ID,
          pastDeadline,
          { value: ESCROW_AMOUNT }
        )
      ).to.be.revertedWith("Invalid deadline");
    });

    it("应该按顺序递增托管ID", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID + 1,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      const escrow0 = await escrowManager.escrows(0);
      const escrow1 = await escrowManager.escrows(1);

      expect(escrow0.escrowId).to.equal(0);
      expect(escrow1.escrowId).to.equal(1);
    });
  });

  describe("确认交付", function () {
    let escrowId: number;

    beforeEach(async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      const tx = await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );
      await tx.wait();

      escrowId = 0;
    });

    it("买家应该能确认交付", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      const feeCollectorBalanceBefore = await ethers.provider.getBalance(feeCollector.address);

      await expect(escrowManager.connect(buyer).confirmDelivery(escrowId))
        .to.emit(escrowManager, "DeliveryConfirmed")
        .withArgs(escrowId);

      const escrow = await escrowManager.escrows(escrowId);
      expect(escrow.status).to.equal(1); // Completed

      const expectedFee = (ESCROW_AMOUNT * BigInt(PLATFORM_FEE)) / BigInt(10000);
      const expectedSellerAmount = ESCROW_AMOUNT - expectedFee;

      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const feeCollectorBalanceAfter = await ethers.provider.getBalance(feeCollector.address);

      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedSellerAmount);
      expect(feeCollectorBalanceAfter - feeCollectorBalanceBefore).to.equal(expectedFee);
    });

    it("非买家不能确认交付", async function () {
      await expect(
        escrowManager.connect(seller).confirmDelivery(escrowId)
      ).to.be.revertedWith("Only buyer can confirm");
    });

    it("已完成的托管不能再次确认", async function () {
      await escrowManager.connect(buyer).confirmDelivery(escrowId);

      await expect(
        escrowManager.connect(buyer).confirmDelivery(escrowId)
      ).to.be.revertedWith("Invalid status");
    });

    it("正确计算平台手续费", async function () {
      const escrowAmount = ethers.parseEther("10");
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      const tx = await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: escrowAmount }
      );
      await tx.wait();

      const newEscrowId = 1;

      const feeCollectorBalanceBefore = await ethers.provider.getBalance(feeCollector.address);
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

      await escrowManager.connect(buyer).confirmDelivery(newEscrowId);

      const expectedFee = (escrowAmount * BigInt(PLATFORM_FEE)) / BigInt(10000); // 2.5%
      const expectedSellerAmount = escrowAmount - expectedFee;

      const feeCollectorBalanceAfter = await ethers.provider.getBalance(feeCollector.address);
      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

      expect(feeCollectorBalanceAfter - feeCollectorBalanceBefore).to.equal(expectedFee);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedSellerAmount);
    });
  });

  describe("自动释放", function () {
    let escrowId: number;
    let deadline: number;

    beforeEach(async function () {
      const now = await time.latest();
      deadline = now + 7 * 24 * 60 * 60;

      const tx = await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );
      await tx.wait();

      escrowId = 0;
    });

    it("截止日期后7天应该可以自动释放", async function () {
      await time.increaseTo(deadline + 7 * 24 * 60 * 60 + 1);

      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

      await escrowManager.autoRelease(escrowId);

      const escrow = await escrowManager.escrows(escrowId);
      expect(escrow.status).to.equal(1); // Completed

      const expectedFee = (ESCROW_AMOUNT * BigInt(PLATFORM_FEE)) / BigInt(10000);
      const expectedSellerAmount = ESCROW_AMOUNT - expectedFee;

      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedSellerAmount);
    });

    it("截止日期后7天之前不能自动释放", async function () {
      await time.increaseTo(deadline + 6 * 24 * 60 * 60);

      await expect(
        escrowManager.autoRelease(escrowId)
      ).to.be.revertedWith("Too early");
    });

    it("已完成的托管不能自动释放", async function () {
      await escrowManager.connect(buyer).confirmDelivery(escrowId);

      await time.increaseTo(deadline + 7 * 24 * 60 * 60 + 1);

      await expect(
        escrowManager.autoRelease(escrowId)
      ).to.be.revertedWith("Invalid status");
    });
  });

  describe("申请退款", function () {
    let escrowId: number;
    let deadline: number;

    beforeEach(async function () {
      const now = await time.latest();
      deadline = now + 7 * 24 * 60 * 60;

      const tx = await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );
      await tx.wait();

      escrowId = 0;
    });

    it("买家应该能在截止日期前申请退款", async function () {
      await expect(escrowManager.connect(buyer).requestRefund(escrowId))
        .to.emit(escrowManager, "DisputeRaised")
        .withArgs(escrowId);

      const escrow = await escrowManager.escrows(escrowId);
      expect(escrow.status).to.equal(3); // Disputed
    });

    it("非买家不能申请退款", async function () {
      await expect(
        escrowManager.connect(seller).requestRefund(escrowId)
      ).to.be.revertedWith("Only buyer can request");
    });

    it("截止日期后不能申请退款", async function () {
      await time.increaseTo(deadline + 1);

      await expect(
        escrowManager.connect(buyer).requestRefund(escrowId)
      ).to.be.revertedWith("Deadline passed");
    });

    it("已完成的托管不能申请退款", async function () {
      await escrowManager.connect(buyer).confirmDelivery(escrowId);

      await expect(
        escrowManager.connect(buyer).requestRefund(escrowId)
      ).to.be.revertedWith("Invalid status");
    });
  });

  describe("解决争议", function () {
    let escrowId: number;

    beforeEach(async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      const tx = await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );
      await tx.wait();

      escrowId = 0;

      // 买家申请退款，进入争议状态
      await escrowManager.connect(buyer).requestRefund(escrowId);
    });

    it("所有者应该能解决争议（买家获胜）", async function () {
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);

      await expect(escrowManager.connect(owner).resolveDispute(escrowId, true))
        .to.emit(escrowManager, "DisputeResolved")
        .withArgs(escrowId, true)
        .and.to.emit(escrowManager, "EscrowRefunded")
        .withArgs(escrowId);

      const escrow = await escrowManager.escrows(escrowId);
      expect(escrow.status).to.equal(2); // Refunded

      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(ESCROW_AMOUNT);
    });

    it("所有者应该能解决争议（卖家获胜）", async function () {
      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      const feeCollectorBalanceBefore = await ethers.provider.getBalance(feeCollector.address);

      await expect(escrowManager.connect(owner).resolveDispute(escrowId, false))
        .to.emit(escrowManager, "DisputeResolved")
        .withArgs(escrowId, false);

      const escrow = await escrowManager.escrows(escrowId);
      expect(escrow.status).to.equal(1); // Completed

      const expectedFee = (ESCROW_AMOUNT * BigInt(PLATFORM_FEE)) / BigInt(10000);
      const expectedSellerAmount = ESCROW_AMOUNT - expectedFee;

      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const feeCollectorBalanceAfter = await ethers.provider.getBalance(feeCollector.address);

      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(expectedSellerAmount);
      expect(feeCollectorBalanceAfter - feeCollectorBalanceBefore).to.equal(expectedFee);
    });

    it("非所有者不能解决争议", async function () {
      await expect(
        escrowManager.connect(buyer).resolveDispute(escrowId, true)
      ).to.be.reverted;
    });

    it("非争议状态的托管不能解决", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      const tx = await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );
      await tx.wait();

      const newEscrowId = 1;

      await expect(
        escrowManager.connect(owner).resolveDispute(newEscrowId, true)
      ).to.be.revertedWith("Not in dispute");
    });
  });

  describe("平台手续费管理", function () {
    it("所有者应该能更新平台手续费", async function () {
      const newFee = 300; // 3%
      await escrowManager.connect(owner).updatePlatformFee(newFee);
      expect(await escrowManager.platformFee()).to.equal(newFee);
    });

    it("手续费不能超过5%", async function () {
      const tooHighFee = 501;
      await expect(
        escrowManager.connect(owner).updatePlatformFee(tooHighFee)
      ).to.be.revertedWith("Fee too high");
    });

    it("非所有者不能更新平台手续费", async function () {
      await expect(
        escrowManager.connect(buyer).updatePlatformFee(300)
      ).to.be.reverted;
    });
  });

  describe("手续费收集者管理", function () {
    it("所有者应该能更新手续费收集者", async function () {
      const newCollector = arbiter.address;
      await escrowManager.connect(owner).updateFeeCollector(newCollector);
      expect(await escrowManager.feeCollector()).to.equal(newCollector);
    });

    it("不能设置零地址为手续费收集者", async function () {
      await expect(
        escrowManager.connect(owner).updateFeeCollector(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid address");
    });

    it("非所有者不能更新手续费收集者", async function () {
      await expect(
        escrowManager.connect(buyer).updateFeeCollector(arbiter.address)
      ).to.be.reverted;
    });
  });

  describe("完整流程场景", function () {
    it("场景1：正常交付流程", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      // 1. 创建托管
      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      const escrowId = 0;

      // 2. 买家确认交付
      await escrowManager.connect(buyer).confirmDelivery(escrowId);

      // 3. 验证状态
      const escrow = await escrowManager.escrows(escrowId);
      expect(escrow.status).to.equal(1); // Completed
    });

    it("场景2：争议退款流程", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      // 1. 创建托管
      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      const escrowId = 0;

      // 2. 买家申请退款
      await escrowManager.connect(buyer).requestRefund(escrowId);

      // 3. 仲裁者解决争议（买家获胜）
      const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);
      await escrowManager.connect(owner).resolveDispute(escrowId, true);

      // 4. 验证退款
      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);
      expect(buyerBalanceAfter - buyerBalanceBefore).to.equal(ESCROW_AMOUNT);

      const escrow = await escrowManager.escrows(escrowId);
      expect(escrow.status).to.equal(2); // Refunded
    });

    it("场景3：自动释放流程", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      // 1. 创建托管
      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      const escrowId = 0;

      // 2. 等待超过截止日期+7天
      await time.increaseTo(deadline + 7 * 24 * 60 * 60 + 1);

      // 3. 自动释放
      await escrowManager.autoRelease(escrowId);

      // 4. 验证状态
      const escrow = await escrowManager.escrows(escrowId);
      expect(escrow.status).to.equal(1); // Completed
    });

    it("场景4：多个托管并行", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      // 创建3个托管
      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        1,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        2,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        3,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      // 第一个正常完成
      await escrowManager.connect(buyer).confirmDelivery(0);

      // 第二个申请退款
      await escrowManager.connect(buyer).requestRefund(1);
      await escrowManager.connect(owner).resolveDispute(1, true);

      // 第三个等待自动释放
      await time.increaseTo(deadline + 7 * 24 * 60 * 60 + 1);
      await escrowManager.autoRelease(2);

      // 验证所有状态
      const escrow0 = await escrowManager.escrows(0);
      const escrow1 = await escrowManager.escrows(1);
      const escrow2 = await escrowManager.escrows(2);

      expect(escrow0.status).to.equal(1); // Completed
      expect(escrow1.status).to.equal(2); // Refunded
      expect(escrow2.status).to.equal(1); // Completed
    });
  });

  describe("重入攻击防护", function () {
    it("确认交付应该防止重入攻击", async function () {
      const now = await time.latest();
      const deadline = now + 7 * 24 * 60 * 60;

      await escrowManager.connect(buyer).createEscrow(
        seller.address,
        NFT_TOKEN_ID,
        deadline,
        { value: ESCROW_AMOUNT }
      );

      // ReentrancyGuard 应该阻止重入
      await escrowManager.connect(buyer).confirmDelivery(0);

      // 尝试再次确认应该失败
      await expect(
        escrowManager.connect(buyer).confirmDelivery(0)
      ).to.be.revertedWith("Invalid status");
    });
  });
});


