const { ethers } = require("hardhat");

async function main() {
  console.log("🎯 Creating first question and testing full flow...");
  
  // Connect to local network
  const [owner] = await ethers.getSigners();
  console.log("Connected as:", owner.address);
  
  // Get contract instance
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const AutomatedQuizApp = await ethers.getContractAt("AutomatedQuizApp", contractAddress);
  
  // Create first question manually
  console.log("📝 Creating first question...");
  const tx = await AutomatedQuizApp.checkAndCreateNextQuestion();
  await tx.wait();
  console.log("✅ First question created!");
  
  // Get the question details
  const currentQuestion = await AutomatedQuizApp.getCurrentQuestion();
  console.log("Current question ID:", currentQuestion[0].toString());
  console.log("Question text:", currentQuestion[1]);
  console.log("Options:", currentQuestion[2]);
  console.log("Is active:", currentQuestion[5]);
  console.log("Is revealed:", currentQuestion[6]);
  
  // Submit an answer (answer index 1 - typically correct for many questions)
  console.log("📝 Submitting answer...");
  const answerTx = await AutomatedQuizApp.submitAnswer(currentQuestion[0], 1);
  await answerTx.wait();
  console.log("✅ Answer submitted!");
  
  // Check player stats
  const stats = await AutomatedQuizApp.getPlayerStats(owner.address);
  console.log("Player stats:", {
    totalQuestions: stats.totalQuestions.toString(),
    correctAnswers: stats.correctAnswers.toString(),
    totalRewards: stats.totalRewards.toString()
  });
  
  console.log("🎉 Test complete! Ready for frontend testing.");
}

main().catch(console.error);
