const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy Test", function () {
  let bank, attacker, deployer, user, attackerSigner;

  beforeEach(async function () {
    [deployer, user, attackerSigner] = await ethers.getSigners();

    const VulnerableBank = await ethers.getContractFactory("VulnerableBank");
    bank = await VulnerableBank.deploy();
    await bank.waitForDeployment();
    const bankAddress = await bank.getAddress();

    const ReentrancyAttacker = await ethers.getContractFactory(
      "ReentrancyAttacker"
    );
    attacker = await ReentrancyAttacker.connect(attackerSigner).deploy(
      bankAddress
    );

    await bank.connect(user).deposit({ value: ethers.parseEther("10") });
    await bank
      .connect(attackerSigner)
      .deposit({ value: ethers.parseEther("1") });
  });

  it("should drain vulnerable bank", async function () {
    await attacker.connect(attackerSigner).attack({
      value: ethers.parseEther("1"),
      gasLimit: 3000000,
    });

    const contractBalance = await bank.getBalance(attacker.target);
    expect(contractBalance).to.equal(0);
  });
});
