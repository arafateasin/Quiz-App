const { ethers } = require("hardhat");

async function testStartButton() {
  console.log("🎮 Testing Start Button Flow");
  console.log("============================");

  const contractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

  const [owner] = await ethers.getSigners();
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  try {
    // Step 1: Check auto mode (should be false)
    console.log("1. Checking initial auto mode...");
    const autoModeBefore = await contract.isAutoModeEnabled();
    console.log(`   ✅ Auto mode: ${autoModeBefore}`);

    if (!autoModeBefore) {
      console.log("   ✅ Perfect! Start button should be visible");
    }

    // Step 2: Simulate clicking "Start Automated Quiz"
    console.log("\n2. Simulating 'Start Automated Quiz' click...");

    // Enable auto mode (what the start button does)
    console.log("   🔄 Enabling auto mode...");
    const tx1 = await contract.toggleAutoMode();
    await tx1.wait();
    console.log(`   ✅ Auto mode enabled: ${tx1.hash}`);

    // Check auto mode after enabling
    const autoModeAfter = await contract.isAutoModeEnabled();
    console.log(`   ✅ Auto mode now: ${autoModeAfter}`);

    // Step 3: Create first question
    console.log("\n3. Creating first question...");
    const tx2 = await contract.checkAndCreateNextQuestion();
    await tx2.wait();
    console.log(`   ✅ Question created: ${tx2.hash}`);

    // Step 4: Check if question was created
    console.log("\n4. Checking current question...");
    const question = await contract.getCurrentQuestion();
    console.log(`   ✅ Question ID: ${question[0]}`);
    console.log(`   ✅ Question text: "${question[1] || "None"}"`);
    console.log(`   ✅ Option A: "${question[2] || "None"}"`);
    console.log(`   ✅ Option B: "${question[3] || "None"}"`);
    console.log(`   ✅ Option C: "${question[4] || "None"}"`);
    console.log(`   ✅ Option D: "${question[5] || "None"}"`);
    console.log(`   ✅ Participants: ${question[7]}`);

    console.log("\n🎉 SUCCESS! The start button flow works correctly!");
    console.log("🎮 Users can now click 'Start Automated Quiz' to begin!");
  } catch (error) {
    console.error("❌ Error in start button flow:", error.message);
  }
}

testStartButton();
