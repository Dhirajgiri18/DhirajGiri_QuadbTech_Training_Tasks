const hre = require("hardhat");

async function main() {
  const Bank = await hre.ethers.getContractFactory("VulnerableBank");
  const bank = await Bank.deploy();
  console.log("VulnerableBank deployed at:", bank.address);

  const Attacker = await hre.ethers.getContractFactory("ReentrancyAttacker");
  const attacker = await Attacker.deploy(bank.address);
  console.log("Attacker deployed at:", attacker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
