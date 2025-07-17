const { ethers } = require("hardhat");

async function checkContracts() {
  console.log("🔍 Checking Contract Deployment Status");
  console.log("=====================================");

  const contractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
  const tokenAddress = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";

  try {
    // Check if contracts exist
    const contractCode = await ethers.provider.getCode(contractAddress);
    const tokenCode = await ethers.provider.getCode(tokenAddress);

    console.log(
      `📄 Contract code length: ${contractCode.length} (${
        contractCode === "0x" ? "NOT DEPLOYED" : "DEPLOYED"
      })`
    );
    console.log(
      `🪙 Token code length: ${tokenCode.length} (${
        tokenCode === "0x" ? "NOT DEPLOYED" : "DEPLOYED"
      })`
    );

    if (contractCode === "0x" || tokenCode === "0x") {
      console.log("❌ Contracts not deployed! Need to redeploy.");
      return false;
    }

    // Test contract functions
    const [owner] = await ethers.getSigners();
    const AutomatedQuizApp = await ethers.getContractFactory(
      "AutomatedQuizApp"
    );
    const contract = AutomatedQuizApp.attach(contractAddress);

    console.log("🧪 Testing contract functions...");

    const autoMode = await contract.isAutoModeEnabled();
    console.log(`✅ Auto mode: ${autoMode}`);

    const totalQuestions = await contract.getQuestionPool();
    console.log(`✅ Total questions: ${totalQuestions}`);

    const currentQuestion = await contract.getCurrentQuestion();
    console.log(`✅ Current question: "${currentQuestion[1] || "None"}"`);

    return true;
  } catch (error) {
    console.error("❌ Error checking contracts:", error.message);
    return false;
  }
}

async function main() {
  const contractsOk = await checkContracts();

  if (!contractsOk) {
    console.log("\n🚀 Redeploying contracts...");

    // Redeploy
    const [deployer] = await ethers.getSigners();

    // Deploy QuizToken
    const QuizToken = await ethers.getContractFactory("QuizToken");
    const quizToken = await QuizToken.deploy();
    await quizToken.waitForDeployment();

    const tokenAddress = await quizToken.getAddress();
    console.log("✅ QuizToken deployed to:", tokenAddress);

    // Deploy AutomatedQuizApp
    const AutomatedQuizApp = await ethers.getContractFactory(
      "AutomatedQuizApp"
    );
    const automatedQuizApp = await AutomatedQuizApp.deploy(tokenAddress);
    await automatedQuizApp.waitForDeployment();

    const contractAddress = await automatedQuizApp.getAddress();
    console.log("✅ AutomatedQuizApp deployed to:", contractAddress);

    // Transfer tokens and initialize
    const tokenAmount = ethers.parseEther("100000");
    await quizToken.transfer(contractAddress, tokenAmount);
    console.log("✅ Transferred tokens to contract");

    await automatedQuizApp.toggleAutoMode();
    console.log("✅ Auto mode enabled");

    await automatedQuizApp.checkAndCreateNextQuestion();
    console.log("✅ First question created");

    console.log("\n📄 New Addresses:");
    console.log(`Contract: ${contractAddress}`);
    console.log(`Token: ${tokenAddress}`);
    console.log(
      "\n⚠️  Please update constants/contract.js with these new addresses!"
    );
  }
}

main().catch(console.error);
