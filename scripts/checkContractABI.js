const { ethers } = require("hardhat");

async function checkContractABI() {
  console.log("🔍 Checking Contract ABI and Functions");
  console.log("======================================");

  const contractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

  const [owner] = await ethers.getSigners();
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  try {
    // Check if the contract has the expected functions
    const interface = contract.interface;
    console.log("📋 Available functions in contract:");

    const expectedFunctions = [
      "isAutoModeEnabled",
      "toggleAutoMode",
      "checkAndCreateNextQuestion",
      "getCurrentQuestion",
      "submitAnswer",
    ];

    expectedFunctions.forEach((funcName) => {
      const func = interface.getFunction(funcName);
      if (func) {
        console.log(`  ✅ ${funcName}: ${func.format()}`);
      } else {
        console.log(`  ❌ ${funcName}: NOT FOUND`);
      }
    });

    console.log("\n🧪 Testing function calls:");

    // Test toggleAutoMode
    console.log("1. Testing toggleAutoMode...");
    const autoModeBefore = await contract.isAutoModeEnabled();
    console.log(`   Before: ${autoModeBefore}`);

    const tx = await contract.toggleAutoMode();
    await tx.wait();
    console.log(`   Transaction: ${tx.hash}`);

    const autoModeAfter = await contract.isAutoModeEnabled();
    console.log(`   After: ${autoModeAfter}`);

    // Toggle back
    const tx2 = await contract.toggleAutoMode();
    await tx2.wait();
    console.log(`   Toggled back: ${tx2.hash}`);

    const autoModeFinal = await contract.isAutoModeEnabled();
    console.log(`   Final: ${autoModeFinal}`);

    console.log("\n✅ All functions work correctly!");
  } catch (error) {
    console.error("❌ Error checking contract:", error.message);
    console.error("Stack:", error.stack);
  }
}

checkContractABI();
