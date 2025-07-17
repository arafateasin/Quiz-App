const { ethers } = require("hardhat");

async function main() {
  console.log("🎯 Testing Quiz Automation...");
  
  // Connect to local network
  const [owner] = await ethers.getSigners();
  console.log("Connected as:", owner.address);
  
  // Get contract instance
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const AutomatedQuizApp = await ethers.getContractAt("AutomatedQuizApp", contractAddress);
  
  // Check if auto mode is enabled
  const autoMode = await AutomatedQuizApp.isAutoModeEnabled();
  console.log("Auto mode enabled:", autoMode);
  
  // Get current question
  const currentQuestion = await AutomatedQuizApp.getCurrentQuestion();
  console.log("Current question:", currentQuestion);
  
  // Get question pool size
  const poolSize = await AutomatedQuizApp.getQuestionPool();
  console.log("Question pool size:", poolSize.toString());
  
  // Try to trigger automation
  try {
    console.log("🚀 Triggering automation...");
    const tx = await AutomatedQuizApp.autoTrigger();
    await tx.wait();
    console.log("✅ Automation triggered successfully!");
  } catch (error) {
    console.log("⚠️ Automation trigger:", error.message);
  }
}

main().catch(console.error);
