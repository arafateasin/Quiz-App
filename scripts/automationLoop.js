const { ethers } = require("hardhat");

async function startAutomationLoop() {
  console.log("🚀 Starting Automated Quiz Loop...");

  const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

  const [owner] = await ethers.getSigners();
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  // Check if auto mode is enabled
  const autoMode = await contract.isAutoModeEnabled();
  console.log(`🤖 Auto mode status: ${autoMode ? "ENABLED" : "DISABLED"}`);

  if (!autoMode) {
    console.log(
      "❌ Auto mode is not enabled. Please enable it first using the Start button."
    );
    return;
  }

  console.log("🎯 Starting question creation loop...");
  console.log("⏰ New questions will be created every 30 seconds");
  console.log("📊 Visit http://localhost:3004 to participate!");
  console.log("---");

  // Function to create questions
  const createQuestion = async () => {
    try {
      const autoModeCheck = await contract.isAutoModeEnabled();
      if (!autoModeCheck) {
        console.log("🛑 Auto mode disabled. Stopping automation...");
        return false;
      }

      console.log(
        `⏰ [${new Date().toLocaleTimeString()}] Creating next question...`
      );

      const tx = await contract.checkAndCreateNextQuestion();
      await tx.wait();

      const currentQuestion = await contract.getCurrentQuestion();
      if (currentQuestion[1]) {
        console.log(
          `✅ [${new Date().toLocaleTimeString()}] Question created: "${
            currentQuestion[1]
          }"`
        );
        console.log(`👥 Participants: ${currentQuestion[7]}`);
        console.log("---");
      }

      return true;
    } catch (error) {
      console.error(`❌ Error creating question: ${error.message}`);
      return true; // Continue even if there's an error
    }
  };

  // Create first question immediately
  await createQuestion();

  // Set up interval for subsequent questions
  const interval = setInterval(async () => {
    const shouldContinue = await createQuestion();
    if (!shouldContinue) {
      clearInterval(interval);
      console.log("🛑 Automation stopped.");
    }
  }, 31000); // Every 31 seconds

  console.log("🎮 Automated Quiz System is now running!");
  console.log("💡 Press Ctrl+C to stop or use the Stop button in the UI");

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down automated quiz system...");
    clearInterval(interval);
    process.exit(0);
  });

  // Keep process alive
  await new Promise(() => {}); // This will run indefinitely
}

startAutomationLoop().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
