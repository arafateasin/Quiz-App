const { ethers } = require("hardhat");

async function testContractFunctions() {
  console.log("🧪 Testing Contract Functions");
  console.log("=============================");

  const contractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

  const [owner] = await ethers.getSigners();
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  try {
    // Test isAutoModeEnabled
    console.log("1. Testing isAutoModeEnabled...");
    const autoMode = await contract.isAutoModeEnabled();
    console.log(`   ✅ Auto mode: ${autoMode}`);

    // Test toggleAutoMode
    console.log("2. Testing toggleAutoMode...");
    const tx = await contract.toggleAutoMode();
    await tx.wait();
    console.log(`   ✅ Toggle transaction: ${tx.hash}`);

    // Check auto mode after toggle
    const autoModeAfter = await contract.isAutoModeEnabled();
    console.log(`   ✅ Auto mode after toggle: ${autoModeAfter}`);

    // Test checkAndCreateNextQuestion
    console.log("3. Testing checkAndCreateNextQuestion...");
    const tx2 = await contract.checkAndCreateNextQuestion();
    await tx2.wait();
    console.log(`   ✅ Create question transaction: ${tx2.hash}`);

    // Test getCurrentQuestion
    console.log("4. Testing getCurrentQuestion...");
    const question = await contract.getCurrentQuestion();
    console.log(`   ✅ Current question: "${question[1] || "None"}"`);

    console.log("\n🎉 All contract functions working correctly!");
  } catch (error) {
    console.error("❌ Error testing contract functions:", error.message);
  }
}

testContractFunctions();
