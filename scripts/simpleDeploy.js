const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Automated Quiz System...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log(
    "💰 Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address))
  );

  // Deploy QuizToken
  const QuizToken = await ethers.getContractFactory("QuizToken");
  const quizToken = await QuizToken.deploy();
  await quizToken.waitForDeployment();

  const tokenAddress = await quizToken.getAddress();
  console.log("🪙 QuizToken deployed to:", tokenAddress);

  // Deploy AutomatedQuizApp
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const automatedQuizApp = await AutomatedQuizApp.deploy(tokenAddress);
  await automatedQuizApp.waitForDeployment();

  const contractAddress = await automatedQuizApp.getAddress();
  console.log("🤖 AutomatedQuizApp deployed to:", contractAddress);

  // Transfer tokens to the quiz app contract
  const tokenAmount = ethers.parseEther("100000");
  await quizToken.transfer(contractAddress, tokenAmount);

  console.log("💰 Transferred 100,000 tokens to quiz contract");

  // Enable auto mode
  await automatedQuizApp.toggleAutoMode();
  console.log("🤖 Auto mode enabled");

  // Create first question
  await automatedQuizApp.checkAndCreateNextQuestion();
  console.log("🎯 First question created");

  console.log("\n🎉 Deployment complete!");
  console.log("=====================================");
  console.log(`🪙 Token Address: ${tokenAddress}`);
  console.log(`🤖 Contract Address: ${contractAddress}`);
  console.log("=====================================");

  // Test the contract
  const autoMode = await automatedQuizApp.isAutoModeEnabled();
  console.log(`✅ Auto mode status: ${autoMode}`);

  const currentQuestion = await automatedQuizApp.getCurrentQuestion();
  console.log(`✅ Current question: "${currentQuestion[1]}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
