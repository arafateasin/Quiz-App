const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Automated Quiz System...");

  const [deployer] = await ethers.getSigners();

  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log(
    "💰 Account balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address))
  );

  // Deploy QuizToken first
  console.log("\n📦 Deploying QuizToken...");
  const QuizToken = await ethers.getContractFactory(
    "contracts/AutomatedQuizApp.sol:QuizToken"
  );
  const quizToken = await QuizToken.deploy();
  await quizToken.waitForDeployment();

  const quizTokenAddress = await quizToken.getAddress();
  console.log("✅ QuizToken deployed to:", quizTokenAddress);

  // Deploy AutomatedQuizApp
  console.log("\n📦 Deploying AutomatedQuizApp...");
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const automatedQuizApp = await AutomatedQuizApp.deploy(quizTokenAddress);
  await automatedQuizApp.waitForDeployment();

  const automatedQuizAddress = await automatedQuizApp.getAddress();
  console.log("✅ AutomatedQuizApp deployed to:", automatedQuizAddress);

  // Transfer tokens to the quiz contract
  console.log("\n💰 Transferring tokens to quiz contract...");
  const tokenAmount = ethers.parseEther("100000"); // 100k tokens
  await quizToken.transfer(automatedQuizAddress, tokenAmount);
  console.log("✅ Transferred 100,000 tokens to quiz contract");

  // Set up the quiz contract as owner of token minting (if needed)
  console.log("\n🔐 Setting up permissions...");
  // The quiz contract can mint more tokens if needed

  console.log("\n🎯 Deployment Summary:");
  console.log("=====================================");
  console.log("QuizToken address:", quizTokenAddress);
  console.log("AutomatedQuizApp address:", automatedQuizAddress);
  console.log(
    "Token balance in contract:",
    ethers.formatEther(await quizToken.balanceOf(automatedQuizAddress))
  );
  console.log("=====================================");

  console.log("\n📋 Next Steps:");
  console.log("1. Update the contract address in startAutomation.js");
  console.log("2. Update the CONTRACT_ADDRESS in constants/contract.js");
  console.log(
    "3. Run: npx hardhat run scripts/startAutomation.js --network localhost"
  );
  console.log(
    "4. Your automated quiz will start creating questions every 30 seconds!"
  );

  // Save addresses to a file for easy reference
  const addresses = {
    QuizToken: quizTokenAddress,
    AutomatedQuizApp: automatedQuizAddress,
    Deployer: deployer.address,
    Network: "localhost",
    Timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n💾 Contract addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
