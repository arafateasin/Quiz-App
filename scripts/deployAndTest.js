const { ethers } = require("hardhat");

async function deployAndTest() {
  console.log("🚀 Deploying and Testing Contract...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  try {
    // Deploy QuizToken
    console.log("🪙 Deploying QuizToken...");
    const QuizToken = await ethers.getContractFactory("QuizToken");
    const quizToken = await QuizToken.deploy();
    await quizToken.waitForDeployment();

    const tokenAddress = await quizToken.getAddress();
    console.log("✅ QuizToken deployed to:", tokenAddress);

    // Test token
    const name = await quizToken.name();
    console.log("✅ Token name:", name);

    // Deploy AutomatedQuizApp
    console.log("🤖 Deploying AutomatedQuizApp...");
    const AutomatedQuizApp = await ethers.getContractFactory(
      "AutomatedQuizApp"
    );
    const automatedQuizApp = await AutomatedQuizApp.deploy(tokenAddress);
    await automatedQuizApp.waitForDeployment();

    const contractAddress = await automatedQuizApp.getAddress();
    console.log("✅ AutomatedQuizApp deployed to:", contractAddress);

    // Test contract immediately
    console.log("🧪 Testing contract functions...");

    const autoMode = await automatedQuizApp.isAutoModeEnabled();
    console.log("✅ Auto mode status:", autoMode);

    const totalQuestions = await automatedQuizApp.getQuestionPool();
    console.log("✅ Total questions:", totalQuestions.toString());

    const currentQuestion = await automatedQuizApp.getCurrentQuestion();
    console.log(
      "✅ Current question:",
      currentQuestion[1] || "No question yet"
    );

    console.log("🎉 All tests passed!");

    return { tokenAddress, contractAddress };
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
}

deployAndTest()
  .then(({ tokenAddress, contractAddress }) => {
    console.log("\n📋 Final Addresses:");
    console.log(`Token: ${tokenAddress}`);
    console.log(`Contract: ${contractAddress}`);
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
