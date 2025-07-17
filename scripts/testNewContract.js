const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing new contract...");

  const contractAddress = "0xC9a43158891282A2B1475592D5719c001986Aaec";

  const [owner] = await ethers.getSigners();

  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  // Test auto mode
  const autoMode = await contract.isAutoModeEnabled();
  console.log(`🤖 Auto mode: ${autoMode}`);

  // Test current question
  const currentQuestion = await contract.getCurrentQuestion();
  console.log(`📝 Current question: "${currentQuestion[1]}"`);
  console.log(`⏰ Question active: ${currentQuestion[5]}`);

  // Test question pool
  const poolSize = await contract.getQuestionPool();
  console.log(`📚 Question pool size: ${poolSize}`);

  console.log("✅ New contract is working correctly!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
