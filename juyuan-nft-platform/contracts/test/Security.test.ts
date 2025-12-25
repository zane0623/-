import { expect } from "chai";
import { ethers } from "hardhat";
import { AgriProductNFT, PresaleManager, EscrowManager } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Security Tests - 安全性测试", function () {
  let agriNFT: AgriProductNFT;
  let presaleManager: PresaleManager;
  let escrowManager: EscrowManager;
  let owner: SignerWithAddress;
  let attacker: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, attacker, user1, user2] = await ethers.getSigners();

    // 部署合约
    const NFTFactory = await ethers.getContractFactory("AgriProductNFT");
    agriNFT = await NFTFactory.deploy();
    await agriNFT.waitForDeployment();

    const PresaleFactory = await ethers.getContractFactory("PresaleManager");
    presaleManager = await PresaleFactory.deploy();
    await presaleManager.waitForDeployment();

    const EscrowFactory = await ethers.getContractFactory("EscrowManager");
    escrowManager = await EscrowFactory.deploy(owner.address);
    await escrowManager.waitForDeployment();
  });

  describe("权限控制测试", function () {
    it("非所有者不能铸造NFT", async function () {
      await expect(
        agriNFT.connect(attacker).mintNFT(
          attacker.address,
          "恶意产品",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "虚假产地",
          "ipfshash"
        )
      ).to.be.reverted;
    });

    it("非所有者不能暂停合约", async function () {
      await expect(
        agriNFT.connect(attacker).pause()
      ).to.be.reverted;
    });

    it("非所有者不能提取资金", async function () {
      await expect(
        agriNFT.connect(attacker).withdraw()
      ).to.be.reverted;
    });

    it("非所有者不能创建预售", async function () {
      const now = await time.latest();
      await expect(
        presaleManager.connect(attacker).createPresale(
          now + 100,
          now + 1000,
          1,
          100,
          1000,
          ethers.parseEther("0.1"),
          ethers.ZeroAddress,
          false,
          "恶意预售"
        )
      ).to.be.reverted;
    });

    it("非所有者不能修改白名单", async function () {
      const now = await time.latest();
      await presaleManager.createPresale(
        now + 100,
        now + 1000,
        1, 100, 1000,
        ethers.parseEther("0.1"),
        ethers.ZeroAddress, false, "测试"
      );

      await expect(
        presaleManager.connect(attacker).addToWhitelist(0, [attacker.address])
      ).to.be.reverted;
    });

    it("非所有者不能解决争议", async function () {
      // 先铸造一个NFT
      await agriNFT.mintNFT(
        user1.address,
        "产品",
        1000,
        "特级",
        Math.floor(Date.now() / 1000),
        "产地",
        "ipfshash"
      );
      
      // 创建一个托管
      const deadline = (await time.latest()) + 86400;
      await escrowManager.connect(user1).createEscrow(
        owner.address,
        0, // nftTokenId
        deadline,
        { value: ethers.parseEther("1") }
      );

      // 申请退款
      await escrowManager.connect(user1).requestRefund(0);

      // 攻击者尝试解决争议
      await expect(
        escrowManager.connect(attacker).resolveDispute(0, true)
      ).to.be.reverted;
    });
  });

  describe("输入验证测试", function () {
    it("预售时间范围必须有效", async function () {
      const now = await time.latest();
      await expect(
        presaleManager.createPresale(
          now + 1000, // 结束时间
          now + 100,  // 开始时间（错误）
          1, 100, 1000,
          ethers.parseEther("0.1"),
          ethers.ZeroAddress, false, "测试"
        )
      ).to.be.revertedWith("Invalid time range");
    });

    it("预售供应量不能为0", async function () {
      const now = await time.latest();
      await expect(
        presaleManager.createPresale(
          now + 100,
          now + 1000,
          1, 100, 0, // 供应量为0
          ethers.parseEther("0.1"),
          ethers.ZeroAddress, false, "测试"
        )
      ).to.be.revertedWith("Invalid total supply");
    });

    it("托管金额不能为0", async function () {
      // 先铸造一个NFT
      await agriNFT.mintNFT(
        user1.address,
        "产品",
        1000,
        "特级",
        Math.floor(Date.now() / 1000),
        "产地",
        "ipfshash"
      );
      
      const deadline = (await time.latest()) + 86400;
      await expect(
        escrowManager.connect(user1).createEscrow(
          owner.address,
          0,
          deadline,
          { value: 0 }
        )
      ).to.be.revertedWith("Invalid amount");
    });
  });

  describe("状态一致性测试", function () {
    it("暂停后不能铸造NFT", async function () {
      await agriNFT.pause();

      await expect(
        agriNFT.mintNFT(
          user1.address,
          "测试",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "产地",
          "ipfshash"
        )
      ).to.be.reverted;
    });

    it("暂停后可以恢复", async function () {
      await agriNFT.pause();
      await agriNFT.unpause();

      await expect(
        agriNFT.mintNFT(
          user1.address,
          "测试",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "产地",
          "ipfshash"
        )
      ).to.not.be.reverted;
    });

    it("已完成的托管不能再次确认", async function () {
      // 先铸造一个NFT
      await agriNFT.mintNFT(
        user1.address,
        "产品",
        1000,
        "特级",
        Math.floor(Date.now() / 1000),
        "产地",
        "ipfshash"
      );
      
      const deadline = (await time.latest()) + 86400;
      await escrowManager.connect(user1).createEscrow(
        user2.address,
        0,
        deadline,
        { value: ethers.parseEther("1") }
      );

      // 第一次确认
      await escrowManager.connect(user1).confirmDelivery(0);

      // 再次确认应该失败
      await expect(
        escrowManager.connect(user1).confirmDelivery(0)
      ).to.be.revertedWith("Invalid status");
    });

    it("已取消的预售不能购买", async function () {
      const now = await time.latest();
      await presaleManager.createPresale(
        now + 100,
        now + 1000,
        1, 100, 1000,
        ethers.parseEther("0.1"),
        ethers.ZeroAddress, false, "测试"
      );

      // 取消预售
      await presaleManager.setPresaleStatus(0, false);

      await time.increaseTo(now + 200);

      await expect(
        presaleManager.connect(user1).purchase(0, 10, {
          value: ethers.parseEther("1")
        })
      ).to.be.revertedWith("Presale not active");
    });
  });

  describe("边界条件测试", function () {
    it("购买数量边界测试 - 最小值", async function () {
      const now = await time.latest();
      await presaleManager.createPresale(
        now + 100,
        now + 1000,
        5, // 最小购买5个
        100,
        1000,
        ethers.parseEther("0.1"),
        ethers.ZeroAddress, false, "测试"
      );

      await time.increaseTo(now + 200);

      // 购买少于最小值
      await expect(
        presaleManager.connect(user1).purchase(0, 4, {
          value: ethers.parseEther("0.4")
        })
      ).to.be.revertedWith("Below minimum purchase");

      // 购买正好最小值
      await expect(
        presaleManager.connect(user1).purchase(0, 5, {
          value: ethers.parseEther("0.5")
        })
      ).to.not.be.reverted;
    });

    it("购买数量边界测试 - 最大值", async function () {
      const now = await time.latest();
      await presaleManager.createPresale(
        now + 100,
        now + 1000,
        1,
        10, // 最大购买10个
        1000,
        ethers.parseEther("0.1"),
        ethers.ZeroAddress, false, "测试"
      );

      await time.increaseTo(now + 200);

      // 购买超过最大值
      await expect(
        presaleManager.connect(user1).purchase(0, 11, {
          value: ethers.parseEther("1.1")
        })
      ).to.be.revertedWith("Exceeds maximum purchase");

      // 购买正好最大值
      await expect(
        presaleManager.connect(user1).purchase(0, 10, {
          value: ethers.parseEther("1")
        })
      ).to.not.be.reverted;
    });

    it("批量铸造最大数量限制", async function () {
      const recipients = Array(100).fill(user1.address);
      
      // 正好100个应该成功
      await expect(
        agriNFT.batchMintNFT(
          recipients,
          "产品",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "产地",
          "ipfshash"
        )
      ).to.not.be.reverted;
    });
  });

  describe("Gas优化验证", function () {
    it("批量铸造应该比单个铸造更高效", async function () {
      // 单个铸造
      const singleTx = await agriNFT.mintNFT(
        user1.address,
        "产品",
        1000,
        "特级",
        Math.floor(Date.now() / 1000),
        "产地",
        "ipfshash"
      );
      const singleReceipt = await singleTx.wait();
      const singleGas = singleReceipt!.gasUsed;

      // 批量铸造5个
      const recipients = Array(5).fill(user2.address);
      const batchTx = await agriNFT.batchMintNFT(
        recipients,
        "产品",
        1000,
        "特级",
        Math.floor(Date.now() / 1000),
        "产地",
        "ipfshash"
      );
      const batchReceipt = await batchTx.wait();
      const batchGas = batchReceipt!.gasUsed;

      // 批量铸造的平均Gas应该低于单个铸造
      const avgBatchGas = batchGas / 5n;
      expect(avgBatchGas).to.be.lt(singleGas);
      
      console.log(`单个铸造Gas: ${singleGas}`);
      console.log(`批量铸造平均Gas: ${avgBatchGas}`);
      console.log(`Gas节省: ${((Number(singleGas) - Number(avgBatchGas)) / Number(singleGas) * 100).toFixed(2)}%`);
    });
  });

  describe("事件发射验证", function () {
    it("NFT铸造应发射NFTMinted事件", async function () {
      await expect(
        agriNFT.mintNFT(
          user1.address,
          "产品",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "产地",
          "ipfshash"
        )
      )
        .to.emit(agriNFT, "NFTMinted")
        .withArgs(0, user1.address, "产品", 1000);
    });

    it("预售创建应发射PresaleCreated事件", async function () {
      const now = await time.latest();
      await expect(
        presaleManager.createPresale(
          now + 100,
          now + 1000,
          1, 100, 1000,
          ethers.parseEther("0.1"),
          ethers.ZeroAddress, false, "测试产品"
        )
      )
        .to.emit(presaleManager, "PresaleCreated")
        .withArgs(0, "测试产品", 1000, ethers.parseEther("0.1"));
    });

    it("托管创建应发射EscrowCreated事件", async function () {
      // 先铸造一个NFT
      await agriNFT.mintNFT(
        user1.address,
        "产品",
        1000,
        "特级",
        Math.floor(Date.now() / 1000),
        "产地",
        "ipfshash"
      );
      
      const deadline = (await time.latest()) + 86400;
      await expect(
        escrowManager.connect(user1).createEscrow(
          user2.address,
          0,
          deadline,
          { value: ethers.parseEther("1") }
        )
      )
        .to.emit(escrowManager, "EscrowCreated");
    });
  });

  describe("安全边界测试", function () {
    it("不能向零地址铸造NFT", async function () {
      await expect(
        agriNFT.mintNFT(
          ethers.ZeroAddress,
          "产品",
          1000,
          "特级",
          Math.floor(Date.now() / 1000),
          "产地",
          "ipfshash"
        )
      ).to.be.reverted;
    });

    it("预售支付正好等于价格应该成功", async function () {
      const now = await time.latest();
      const price = ethers.parseEther("0.1");
      
      await presaleManager.createPresale(
        now + 100,
        now + 1000,
        1, 100, 1000,
        price,
        ethers.ZeroAddress, false, "测试"
      );

      await time.increaseTo(now + 200);

      // 正好等于价格
      await expect(
        presaleManager.connect(user1).purchase(0, 1, {
          value: price
        })
      ).to.not.be.reverted;
    });

    it("多余的ETH应该被退回", async function () {
      const now = await time.latest();
      const price = ethers.parseEther("0.1");
      
      await presaleManager.createPresale(
        now + 100,
        now + 1000,
        1, 100, 1000,
        price,
        ethers.ZeroAddress, false, "测试"
      );

      await time.increaseTo(now + 200);

      const initialBalance = await ethers.provider.getBalance(user1.address);
      
      const tx = await presaleManager.connect(user1).purchase(0, 1, {
        value: ethers.parseEther("1") // 多付了0.9 ETH
      });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(user1.address);
      
      // 应该只扣除实际价格 + gas费
      expect(finalBalance).to.equal(initialBalance - price - gasUsed);
    });

    it("NFT所有权转移后原所有者不能标记交付", async function () {
      // 铸造NFT
      await agriNFT.mintNFT(
        user1.address,
        "产品",
        1000,
        "特级",
        Math.floor(Date.now() / 1000),
        "产地",
        "ipfshash"
      );

      // 只有合约owner能标记交付，普通NFT持有者不能
      await expect(
        agriNFT.connect(user1).markAsDelivered(0)
      ).to.be.reverted;
    });
  });
});
