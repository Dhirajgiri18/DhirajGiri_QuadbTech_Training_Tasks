const hre = require("hardhat");

async function main() {
  const ExpenseTracker = await hre.ethers.getContractFactory("ExpenseTracker");
  const expenseTracker = await ExpenseTracker.deploy();

  console.log(`Contract deployed at: ${await expenseTracker.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
