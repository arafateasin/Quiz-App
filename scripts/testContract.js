const { ethers } = require("hardhat");

async function testContract() {
  try {
    console.log("🧪 Testing contract interaction...");

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const [owner] = await ethers.getSigners();

    console.log(`📞 Connecting to contract at: ${contractAddress}`);
    console.log(`👤 Using account: ${owner.address}`);

    const AutomatedQuizApp = await ethers.getContractFactory(
      "AutomatedQuizApp"
    );
    const contract = AutomatedQuizApp.attach(contractAddress);

    console.log("📋 Contract attached successfully");

    // Test basic call
    const code = await ethers.provider.getCode(contractAddress);
    console.log(`📜 Contract code length: ${code.length}`);

    if (code === "0x") {
      console.log("❌ No contract deployed at this address!");
      return;
    }

    // Test function call
    console.log("🔍 Testing isAutoModeEnabled call...");
    const autoMode = await contract.isAutoModeEnabled();
    console.log(`✅ Auto mode status: ${autoMode}`);

    // Test other functions
    console.log("🔍 Testing getCurrentQuestionIndex...");
    const index = await contract.getCurrentQuestionIndex();
    console.log(`✅ Current question index: ${index}`);

    console.log("🔍 Testing getTotalQuestions...");
    const total = await contract.getTotalQuestions();
    console.log(`✅ Total questions: ${total}`);

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

testContract();
