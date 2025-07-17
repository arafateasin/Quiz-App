const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  console.log("🚀 Starting Automated Quiz System...");

  // Get contract factory and instance
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  // Connect with first account (has deployment permissions)
  const [deployer] = await ethers.getSigners();
  console.log("✅ Connected with account:", deployer.address);

  // Check if auto mode is enabled
  const autoModeEnabled = await contract.isAutoModeEnabled();
  console.log("🤖 Auto mode status:", autoModeEnabled ? "ENABLED" : "DISABLED");

  // Enable auto mode if not already enabled
  if (!autoModeEnabled) {
    console.log("🔄 Enabling auto mode...");
    await contract.toggleAutoMode();
    console.log("✅ Auto mode enabled!");
  }

  // Function to create a question
  async function createQuestion() {
    try {
      const tx = await contract.checkAndCreateNextQuestion();
      await tx.wait();

      console.log(`✅ Question created successfully!`);

      // Get current question details
      const currentQuestion = await contract.getCurrentQuestion();
      console.log(`📝 Question: "${currentQuestion.question}"`);
      console.log(`⏱️  Duration: 30 seconds`);
      console.log(`👥 Participants: ${currentQuestion.totalParticipants}`);
    } catch (error) {
      console.log(`❌ Error creating question: ${error.message}`);
    }
  }

  // Start the automated question creation cycle
  console.log("🎯 Starting automated question creation cycle...");
  console.log("⏰ New questions will be created every 30 seconds");
  console.log("🎁 Rewards: 10 tokens for each correct answer");
  console.log("📊 Visit http://localhost:3004 to participate!");
  console.log("---");

  // Create first question immediately
  await createQuestion();

  // Set up interval for creating questions every 30 seconds
  const interval = setInterval(async () => {
    console.log("---");
    const now = new Date().toLocaleTimeString();
    console.log(`⏰ [${now}] Checking for next question...`);
    await createQuestion();
  }, 30000); // 30 seconds

  console.log("🎮 Automated Quiz System is now running!");
  console.log("Press Ctrl+C to stop the automation");

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down automated quiz system...");
    clearInterval(interval);
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
