const { ethers } = require("hardhat");

async function disableAutoMode() {
  console.log("🔄 Disabling Auto Mode");
  console.log("=====================");

  const contractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

  const [owner] = await ethers.getSigners();
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  try {
    // Check current auto mode
    const autoModeBefore = await contract.isAutoModeEnabled();
    console.log(`📊 Auto mode before: ${autoModeBefore}`);

    if (autoModeBefore) {
      // Disable auto mode
      console.log("🛑 Disabling auto mode...");
      const tx = await contract.toggleAutoMode();
      await tx.wait();
      console.log(`✅ Disabled auto mode: ${tx.hash}`);

      // Check auto mode after
      const autoModeAfter = await contract.isAutoModeEnabled();
      console.log(`📊 Auto mode after: ${autoModeAfter}`);

      console.log("\n🎉 Auto mode disabled! Start button should now appear.");
    } else {
      console.log("✅ Auto mode already disabled!");
    }
  } catch (error) {
    console.error("❌ Error disabling auto mode:", error.message);
  }
}

disableAutoMode();
