const hre = require("hardhat");

async function main() {
  const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1M tokens
  const MyToken = await hre.ethers.deployContract("MyToken", [initialSupply]);

  await MyToken.waitForDeployment();
  console.log(`MyToken deployed at: ${await MyToken.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
