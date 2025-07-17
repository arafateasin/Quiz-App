const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Automated Quiz System...");

  const automatedQuizAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const [owner] = await ethers.getSigners();

  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(automatedQuizAddress);

  console.log("✅ Connected to Automated Quiz Contract");

  // Check if auto mode is enabled
  const autoMode = await contract.isAutoModeEnabled();
  console.log(`🤖 Auto mode status: ${autoMode ? "ENABLED" : "DISABLED"}`);

  if (!autoMode) {
    console.log("❌ Auto mode is not enabled. Please enable it first.");
    return;
  }

  console.log("🎯 Starting automated question creation cycle...");
  console.log("⏰ New questions will be created every 30 seconds");
  console.log("🎁 Rewards: 10 tokens for each correct answer");
  console.log("📊 Visit http://localhost:3001 to participate!");
  console.log("---");

  // Main automation loop
  let questionCount = 0;
  setInterval(async () => {
    try {
      console.log(
        `⏰ [${new Date().toLocaleTimeString()}] Checking for next question...`
      );

      // Call the contract to check and create next question
      const tx = await contract.checkAndCreateNextQuestion();
      await tx.wait();

      questionCount++;
      console.log(
        `✅ [${new Date().toLocaleTimeString()}] Question ${questionCount} created successfully!`
      );

      // Get current question details
      const currentQuestion = await contract.getCurrentQuestion();
      if (currentQuestion[1]) {
        // If question exists
        console.log(`📝 Question: "${currentQuestion[1]}"`);
        console.log(`⏱️  Duration: 30 seconds`);
        console.log(`👥 Participants: ${currentQuestion[7]}`);
        console.log("---");
      }
    } catch (error) {
      console.error(`❌ Error creating question: ${error.message}`);
    }
  }, 31000); // Check every 31 seconds

  // Keep the process running
  console.log("🎮 Automated Quiz System is now running!");
  console.log("Press Ctrl+C to stop the automation");

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down automated quiz system...");
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
