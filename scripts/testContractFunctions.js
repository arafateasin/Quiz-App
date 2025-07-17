const { ethers } = require("hardhat");

async function testContract() {
  const contractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

  const [owner] = await ethers.getSigners();
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(contractAddress);

  // Check if contract exists
  const code = await ethers.provider.getCode(contractAddress);
  console.log("Contract code length:", code.length);

  if (code === "0x") {
    console.log("❌ No contract at this address");
    return;
  }

  console.log("✅ Contract exists");

  // List all functions in the contract
  const interface = contract.interface;
  console.log("Available functions:");

  for (const [name, fragment] of Object.entries(interface.functions)) {
    console.log(`  - ${name}: ${fragment.format()}`);
  }

  // Try to call a simple function
  try {
    const result = await contract.getQuestionPool();
    console.log("✅ getQuestionPool:", result.toString());
  } catch (error) {
    console.log("❌ getQuestionPool failed:", error.message);
  }
}

testContract();
