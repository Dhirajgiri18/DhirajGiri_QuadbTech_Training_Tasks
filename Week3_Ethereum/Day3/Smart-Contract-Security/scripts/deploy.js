const hre = require("hardhat");

async function main() {
  const SafeBank = await hre.ethers.deployContract("SafeBank");
  await SafeBank.waitForDeployment();
  console.log("✅ SafeBank deployed at:", SafeBank.target);

  const VulnerableBank = await hre.ethers.deployContract("VulnerableBank");
  await VulnerableBank.waitForDeployment();
  console.log("⚠️ VulnerableBank deployed at:", VulnerableBank.target);

  const ReentrancyAttacker = await hre.ethers.deployContract(
    "ReentrancyAttacker",
    [VulnerableBank.target]
  );
  await ReentrancyAttacker.waitForDeployment();
  console.log("💣 Attacker deployed at:", ReentrancyAttacker.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
