const hre = require("hardhat");

async function main() {
  const ExpenseTracker = await hre.ethers.getContractFactory("ExpenseTracker");
  const expenseTracker = await ExpenseTracker.deploy();

  const GasFeeTracker = await hre.ethers.getContractFactory("GasFeeTracker");
  const contract = await GasFeeTracker.deploy();

  console.log(`Contract deployed at: ${await expenseTracker.getAddress()}`);
  console.log(`Contract deployed to: ${await contract.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
