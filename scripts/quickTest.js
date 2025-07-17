const { ethers } = require("hardhat");

async function quickTest() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // Get contract code
  const code = await ethers.provider.getCode(contractAddress);
  console.log("Contract code:", code);

  // Get contract factory
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  try {
    // Try to call a function
    console.log("Calling isAutoModeEnabled...");
    const result = await contract.isAutoModeEnabled();
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

quickTest();
