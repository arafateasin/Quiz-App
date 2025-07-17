const { ethers } = require("hardhat");

async function main() {
  console.log("🔧 Checking and fixing auto mode...");

  const automatedQuizAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";

  const [owner] = await ethers.getSigners();

  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(automatedQuizAddress);

  // Check current auto mode status
  const currentAutoMode = await contract.isAutoModeEnabled();
  console.log(
    `🤖 Current auto mode: ${currentAutoMode ? "ENABLED" : "DISABLED"}`
  );

  if (!currentAutoMode) {
    console.log("🔄 Enabling auto mode...");
    const tx = await contract.toggleAutoMode();
    await tx.wait();
    console.log("✅ Auto mode enabled!");
  } else {
    console.log("✅ Auto mode is already enabled!");
  }

  // Check status again
  const newAutoMode = await contract.isAutoModeEnabled();
  console.log(`🤖 New auto mode: ${newAutoMode ? "ENABLED" : "DISABLED"}`);

  // Get current question to verify system is working
  const currentQuestion = await contract.getCurrentQuestion();
  console.log(`📝 Current question: "${currentQuestion[1]}"`);
  console.log(`⏰ Question active: ${currentQuestion[5]}`);

  // Create a new question to test
  console.log("🎪 Creating new question...");
  const createTx = await contract.checkAndCreateNextQuestion();
  await createTx.wait();

  const newQuestion = await contract.getCurrentQuestion();
  console.log(`✅ New question created: "${newQuestion[1]}"`);

  console.log("🎯 Auto mode should now be working correctly!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
