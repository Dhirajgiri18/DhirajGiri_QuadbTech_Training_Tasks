const hre = require("hardhat");

async function main() {
  const SimpleBank = await hre.ethers.getContractFactory("SimpleBank");
  const simpleBank = await SimpleBank.deploy();
  await simpleBank.deployed();

  console.log(`SimpleBank deployed to: ${simpleBank.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
