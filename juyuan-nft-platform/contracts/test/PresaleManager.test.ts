import { expect } from "chai";
import { ethers } from "hardhat";
import { PresaleManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("PresaleManager", function () {
  let presaleManager: PresaleManager;
  let owner: SignerWithAddress;
  let buyer1: SignerWithAddress;
  let buyer2: SignerWithAddress;
  let buyer3: SignerWithAddress;

  beforeEach(async function () {
    [owner, buyer1, buyer2, buyer3] = await ethers.getSigners();

    const PresaleFactory = await ethers.getContractFactory("PresaleManager");
    presaleManager = await PresaleFactory.deploy();
    await presaleManager.waitForDeployment();
  });

  describe("部署", function () {
    it("应该设置正确的所有者", async function () {
      expect(await presaleManager.owner()).to.equal(owner.address);
    });

    it("应该默认支持ETH支付", async function () {
      expect(await presaleManager.supportedTokens(ethers.ZeroAddress)).to.be.true;
    });
  });

  describe("创建预售", function () {
    let startTime: number;
    let endTime: number;

    beforeEach(async function () {
      const now = await time.latest();
      startTime = now + 100;
      endTime = now + 1000;
    });

    it("应该成功创建预售", async function () {
      const tx = await presaleManager.createPresale(
        startTime,
        endTime,
        1, // minPurchase
        100, // maxPurchase
        1000, // totalSupply
        ethers.parseEther("0.1"), // price
        ethers.ZeroAddress, // ETH payment
        false, // whitelist disabled
        "恐龙蛋荔枝"
      );

      await expect(tx)
        .to.emit(presaleManager, "PresaleCreated")
        .withArgs(0, "恐龙蛋荔枝", 1000, ethers.parseEther("0.1"));

      const presale = await presaleManager.getPresaleInfo(0);
      expect(presale.totalSupply).to.equal(1000);
      expect(presale.priceInWei).to.equal(ethers.parseEther("0.1"));
      expect(presale.active).to.be.true;
    });

    it("时间范围无效应该失败", async function () {
      await expect(
        presaleManager.createPresale(
          endTime,
          startTime, // 结束时间早于开始时间
          1,
          100,
          1000,
          ethers.parseEther("0.1"),
          ethers.ZeroAddress,
          false,
          "恐龙蛋荔枝"
        )
      ).to.be.revertedWith("Invalid time range");
    });

    it("购买限制无效应该失败", async function () {
      await expect(
        presaleManager.createPresale(
          startTime,
          endTime,
          100, // minPurchase > maxPurchase
          10,
          1000,
          ethers.parseEther("0.1"),
          ethers.ZeroAddress,
          false,
          "恐龙蛋荔枝"
        )
      ).to.be.revertedWith("Invalid purchase limits");
    });
  });

  describe("购买NFT", function () {
    let presaleId: number;
    let startTime: number;
    let endTime: number;
    const price = ethers.parseEther("0.1");

    beforeEach(async function () {
      const now = await time.latest();
      startTime = now + 100;
      endTime = now + 1000;

      await presaleManager.createPresale(
        startTime,
        endTime,
        1,
        100,
        1000,
        price,
        ethers.ZeroAddress,
        false,
        "恐龙蛋荔枝"
      );

      presaleId = 0;
    });

    it("应该成功购买NFT", async function () {
      await time.increaseTo(startTime + 10);

      const amount = 10;
      const totalCost = price * BigInt(amount);

      await expect(
        presaleManager.connect(buyer1).purchase(presaleId, amount, {
          value: totalCost,
        })
      )
        .to.emit(presaleManager, "Purchase")
        .withArgs(presaleId, buyer1.address, amount, totalCost);

      const userPurchase = await presaleManager.getUserPurchase(presaleId, buyer1.address);
      expect(userPurchase).to.equal(amount);
    });

    it("预售开始前不能购买", async function () {
      const amount = 10;
      const totalCost = price * BigInt(amount);

      await expect(
        presaleManager.connect(buyer1).purchase(presaleId, amount, {
          value: totalCost,
        })
      ).to.be.revertedWith("Presale not started");
    });

    it("预售结束后不能购买", async function () {
      await time.increaseTo(endTime + 10);

      const amount = 10;
      const totalCost = price * BigInt(amount);

      await expect(
        presaleManager.connect(buyer1).purchase(presaleId, amount, {
          value: totalCost,
        })
      ).to.be.revertedWith("Presale ended");
    });

    it("购买量低于最小值应该失败", async function () {
      await time.increaseTo(startTime + 10);

      await expect(
        presaleManager.connect(buyer1).purchase(presaleId, 0, {
          value: 0,
        })
      ).to.be.revertedWith("Below minimum purchase");
    });

    it("购买量超过最大值应该失败", async function () {
      await time.increaseTo(startTime + 10);

      const amount = 101;
      const totalCost = price * BigInt(amount);

      await expect(
        presaleManager.connect(buyer1).purchase(presaleId, amount, {
          value: totalCost,
        })
      ).to.be.revertedWith("Exceeds maximum purchase");
    });

    it("超过总供应量应该失败", async function () {
      // 创建一个小供应量的预售用于测试超卖
      const smallSupply = 50;
      await presaleManager.createPresale(
        startTime,
        endTime,
        1,
        100,
        smallSupply,  // 小供应量
        price,
        ethers.ZeroAddress,
        false,
        "测试产品"
      );
      const smallPresaleId = 1;

      await time.increaseTo(startTime + 10);

      const amount = 30;
      const totalCost = price * BigInt(amount);

      // 买家1购买30个
      await presaleManager.connect(buyer1).purchase(smallPresaleId, amount, { value: totalCost });

      // 买家2尝试购买30个应该失败（只剩20个）
      await expect(
        presaleManager.connect(buyer2).purchase(smallPresaleId, amount, { value: totalCost })
      ).to.be.revertedWith("Exceeds total supply");
    });

    it("支付金额不足应该失败", async function () {
      await time.increaseTo(startTime + 10);

      const amount = 10;
      const insufficientPayment = price * BigInt(amount - 1);

      await expect(
        presaleManager.connect(buyer1).purchase(presaleId, amount, {
          value: insufficientPayment,
        })
      ).to.be.revertedWith("Insufficient ETH");
    });

    it("多余的ETH应该被退回", async function () {
      await time.increaseTo(startTime + 10);

      const amount = 10;
      const totalCost = price * BigInt(amount);
      const overpayment = totalCost + ethers.parseEther("1");

      const initialBalance = await ethers.provider.getBalance(buyer1.address);

      const tx = await presaleManager.connect(buyer1).purchase(presaleId, amount, {
        value: overpayment,
      });
      const receipt = await tx.wait();

      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const finalBalance = await ethers.provider.getBalance(buyer1.address);

      // 应该只扣除实际花费 + gas费
      expect(finalBalance).to.equal(initialBalance - totalCost - gasUsed);
    });
  });

  describe("白名单功能", function () {
    let presaleId: number;
    let startTime: number;
    let endTime: number;

    beforeEach(async function () {
      const now = await time.latest();
      startTime = now + 100;
      endTime = now + 1000;

      await presaleManager.createPresale(
        startTime,
        endTime,
        1,
        100,
        1000,
        ethers.parseEther("0.1"),
        ethers.ZeroAddress,
        true, // 启用白名单
        "恐龙蛋荔枝"
      );

      presaleId = 0;
    });

    it("应该成功添加白名单", async function () {
      await expect(
        presaleManager.addToWhitelist(presaleId, [buyer1.address, buyer2.address])
      )
        .to.emit(presaleManager, "WhitelistUpdated")
        .withArgs(presaleId, buyer1.address, true);

      expect(await presaleManager.isWhitelisted(presaleId, buyer1.address)).to.be.true;
      expect(await presaleManager.isWhitelisted(presaleId, buyer2.address)).to.be.true;
    });

    it("应该成功移除白名单", async function () {
      await presaleManager.addToWhitelist(presaleId, [buyer1.address]);
      await presaleManager.removeFromWhitelist(presaleId, [buyer1.address]);

      expect(await presaleManager.isWhitelisted(presaleId, buyer1.address)).to.be.false;
    });

    it("不在白名单中的用户不能购买", async function () {
      await time.increaseTo(startTime + 10);

      await expect(
        presaleManager.connect(buyer1).purchase(presaleId, 10, {
          value: ethers.parseEther("1"),
        })
      ).to.be.revertedWith("Not whitelisted");
    });

    it("在白名单中的用户可以购买", async function () {
      await presaleManager.addToWhitelist(presaleId, [buyer1.address]);
      await time.increaseTo(startTime + 10);

      await expect(
        presaleManager.connect(buyer1).purchase(presaleId, 10, {
          value: ethers.parseEther("1"),
        })
      ).to.not.be.reverted;
    });
  });

  describe("退款功能", function () {
    let presaleId: number;
    let startTime: number;
    let endTime: number;
    const price = ethers.parseEther("0.1");

    beforeEach(async function () {
      const now = await time.latest();
      startTime = now + 100;
      endTime = now + 1000;

      await presaleManager.createPresale(
        startTime,
        endTime,
        1,
        100,
        1000,
        price,
        ethers.ZeroAddress,
        false,
        "恐龙蛋荔枝"
      );

      presaleId = 0;

      // 购买一些NFT
      await time.increaseTo(startTime + 10);
      await presaleManager.connect(buyer1).purchase(presaleId, 10, {
        value: price * 10n,
      });
    });

    it("预售失败时应该能够退款", async function () {
      // 结束预售
      await time.increaseTo(endTime + 10);

      // 设置预售为非激活状态（模拟失败）
      await presaleManager.setPresaleStatus(presaleId, false);

      const initialBalance = await ethers.provider.getBalance(buyer1.address);

      const tx = await presaleManager.connect(buyer1).refund(presaleId);
      const receipt = await tx.wait();

      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const finalBalance = await ethers.provider.getBalance(buyer1.address);

      // 应该收到退款
      expect(finalBalance).to.be.closeTo(
        initialBalance + (price * 10n) - gasUsed,
        ethers.parseEther("0.001")
      );
    });

    it("没有购买记录不能退款", async function () {
      await time.increaseTo(endTime + 10);
      await presaleManager.setPresaleStatus(presaleId, false);

      await expect(
        presaleManager.connect(buyer2).refund(presaleId)
      ).to.be.revertedWith("No purchase found");
    });
  });

  describe("资金提取", function () {
    it("所有者应该能够提取ETH", async function () {
      // 模拟购买，向合约发送ETH
      const now = await time.latest();
      await presaleManager.createPresale(
        now + 100,
        now + 1000,
        1,
        100,
        1000,
        ethers.parseEther("0.1"),
        ethers.ZeroAddress,
        false,
        "荔枝"
      );

      await time.increaseTo(now + 200);
      await presaleManager.connect(buyer1).purchase(0, 10, {
        value: ethers.parseEther("1"),
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      const tx = await presaleManager.withdraw(ethers.ZeroAddress);
      const receipt = await tx.wait();

      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.closeTo(
        initialBalance + ethers.parseEther("1") - gasUsed,
        ethers.parseEther("0.01")
      );
    });
  });
}); 