const { ethers } = require("hardhat");

async function initializeQuizSystem() {
  console.log("🚀 Initializing Automated Quiz System...");

  const contractAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";
  const tokenAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

  const [deployer] = await ethers.getSigners();
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  const QuizToken = await ethers.getContractFactory("QuizToken");
  const token = QuizToken.attach(tokenAddress);

  try {
    // Transfer tokens to contract
    console.log("💰 Transferring tokens to quiz contract...");
    const tokenAmount = ethers.parseEther("100000");
    await token.transfer(contractAddress, tokenAmount);
    console.log("✅ Transferred 100,000 tokens to quiz contract");

    // Enable auto mode
    console.log("🤖 Enabling auto mode...");
    await contract.toggleAutoMode();
    console.log("✅ Auto mode enabled");

    // Create first question
    console.log("🎯 Creating first question...");
    await contract.checkAndCreateNextQuestion();
    console.log("✅ First question created");

    // Check status
    const autoMode = await contract.isAutoModeEnabled();
    const currentQuestion = await contract.getCurrentQuestion();
    const balance = await token.balanceOf(contractAddress);

    console.log("\n🎉 INITIALIZATION COMPLETE!");
    console.log("================================");
    console.log(`🤖 Auto Mode: ${autoMode ? "ENABLED" : "DISABLED"}`);
    console.log(`🎯 Current Question: "${currentQuestion[1] || "None"}"`);
    console.log(`💰 Contract Balance: ${ethers.formatEther(balance)} tokens`);
    console.log(`📄 Contract Address: ${contractAddress}`);
    console.log(`🪙 Token Address: ${tokenAddress}`);
    console.log("================================");
    console.log("🚀 Ready to start automated quiz!");
    console.log("Visit http://localhost:3004 to participate");
  } catch (error) {
    console.error("❌ Error during initialization:", error.message);
    throw error;
  }
}

initializeQuizSystem().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
