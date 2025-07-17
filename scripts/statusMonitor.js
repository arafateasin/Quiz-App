const { ethers } = require("hardhat");

async function monitorQuizStatus() {
  console.log("📊 Automated Quiz System Status Monitor");
  console.log("=====================================");

  const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const tokenAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

  const [owner] = await ethers.getSigners();
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  const QuizToken = await ethers.getContractFactory("QuizToken");
  const token = QuizToken.attach(tokenAddress);

  try {
    // System Status
    const autoMode = await contract.isAutoModeEnabled();
    const currentQuestionIndex = await contract.getCurrentQuestion();
    const totalQuestions = await contract.getQuestionPool();
    const questionInterval = 30; // Fixed interval

    console.log(`🤖 Auto Mode: ${autoMode ? "✅ ENABLED" : "❌ DISABLED"}`);
    console.log(
      `📝 Current Question: ${
        currentQuestionIndex[1] || "None"
      }/${totalQuestions}`
    );
    console.log(`⏰ Question Interval: ${questionInterval} seconds`);
    console.log("");

    // Current Question Details
    const currentQuestion = await contract.getCurrentQuestion();
    if (currentQuestion[1]) {
      console.log("🎯 Current Question Details:");
      console.log(`   Question: "${currentQuestion[1]}"`);
      console.log(`   Option A: ${currentQuestion[2]}`);
      console.log(`   Option B: ${currentQuestion[3]}`);
      console.log(`   Option C: ${currentQuestion[4]}`);
      console.log(`   Option D: ${currentQuestion[5]}`);
      console.log(`   Correct Answer: ${currentQuestion[6]}`);
      console.log(`   Participants: ${currentQuestion[7]}`);
      console.log(
        `   Created At: ${new Date(currentQuestion[8] * 1000).toLocaleString()}`
      );
      console.log("");
    } else {
      console.log("❌ No current question available");
      console.log("");
    }

    // Token Status
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const tokenSupply = await token.totalSupply();
    const contractBalance = await token.balanceOf(contractAddress);

    console.log("🪙 Token Status:");
    console.log(`   Name: ${tokenName} (${tokenSymbol})`);
    console.log(`   Total Supply: ${ethers.utils.formatEther(tokenSupply)}`);
    console.log(
      `   Contract Balance: ${ethers.utils.formatEther(contractBalance)}`
    );
    console.log("");

    // Network Status
    const provider = ethers.provider;
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const balance = await provider.getBalance(owner.address);

    console.log("🌐 Network Status:");
    console.log(`   Network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log(`   Block Number: ${blockNumber}`);
    console.log(`   Owner Balance: ${ethers.utils.formatEther(balance)} ETH`);
    console.log(`   Owner Address: ${owner.address}`);
    console.log("");

    // Contract Addresses
    console.log("📄 Contract Addresses:");
    console.log(`   Quiz Contract: ${contractAddress}`);
    console.log(`   Token Contract: ${tokenAddress}`);
    console.log("");

    // Usage Instructions
    console.log("🚀 Usage Instructions:");
    console.log("   1. Visit http://localhost:3004 to access the quiz");
    console.log("   2. Connect your wallet using the Connect button");
    console.log("   3. Click 'Start Automated Quiz' to begin automation");
    console.log("   4. Run 'npm run automation' to start the backend loop");
    console.log("   5. Answer questions to earn tokens!");
    console.log("");

    if (autoMode) {
      console.log("🎮 System is ACTIVE and ready for participants!");
    } else {
      console.log(
        "⚠️  System is INACTIVE. Click 'Start Automated Quiz' to begin."
      );
    }
  } catch (error) {
    console.error("❌ Error monitoring status:", error.message);
  }
}

monitorQuizStatus().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
