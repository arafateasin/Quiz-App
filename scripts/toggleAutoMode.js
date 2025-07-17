const { ethers } = require("hardhat");

async function main() {
  console.log("🔄 Toggling Auto Mode...");

  const automatedQuizAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";

  const [owner] = await ethers.getSigners();

  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(automatedQuizAddress);

  // Check current status
  const beforeStatus = await contract.isAutoModeEnabled();
  console.log(`🤖 Auto mode before: ${beforeStatus}`);

  // Toggle auto mode
  console.log("🔄 Toggling auto mode...");
  const tx = await contract.toggleAutoMode();
  await tx.wait();

  // Check after status
  const afterStatus = await contract.isAutoModeEnabled();
  console.log(`🤖 Auto mode after: ${afterStatus}`);

  // If it's now enabled, create a question
  if (afterStatus) {
    console.log("🎪 Creating a question...");
    const createTx = await contract.checkAndCreateNextQuestion();
    await createTx.wait();
    console.log("✅ Question created!");
  }

  console.log("🎯 Auto mode toggle completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
