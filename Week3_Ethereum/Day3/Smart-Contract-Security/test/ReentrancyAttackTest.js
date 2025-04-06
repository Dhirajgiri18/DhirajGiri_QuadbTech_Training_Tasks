const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🛡️ Reentrancy Attack Test", function () {
  let safeBank, attacker, deployer, user, attackerSigner;

  beforeEach(async function () {
    [deployer, user, attackerSigner] = await ethers.getSigners();

    const SafeBank = await ethers.getContractFactory("SafeBank");
    safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment(); // ✅ ensure it's deployed
    const safeBankAddress = await safeBank.getAddress(); // ✅ get address after deployment

    const ReentrancyAttacker = await ethers.getContractFactory(
      "ReentrancyAttacker"
    );
    attacker = await ReentrancyAttacker.connect(attackerSigner).deploy(
      safeBankAddress
    );

    await safeBank.connect(user).deposit({ value: ethers.parseEther("10") });
    await safeBank
      .connect(attackerSigner)
      .deposit({ value: ethers.parseEther("1") });
  });

  it("🚫 Should prevent reentrancy attack", async function () {
    await expect(
      attacker.connect(attackerSigner).attack({
        value: ethers.parseEther("1"),
        gasLimit: 3000000,
      })
    ).to.be.reverted;
  });
});
