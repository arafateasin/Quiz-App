const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Quiz App contracts to local test network...");

  try {
    // Get the deployer's signer
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deploying with account:", deployer.address);

    // Check balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

    // Deploy QuizToken first
    console.log("\n📄 Deploying QuizToken...");
    const QuizToken = await ethers.getContractFactory("contracts/AutomatedQuizApp.sol:QuizToken");
    const quizToken = await QuizToken.deploy();
    await quizToken.waitForDeployment();
    const tokenAddress = await quizToken.getAddress();
    console.log("✅ QuizToken deployed to:", tokenAddress);

    // Deploy AutomatedQuizApp
    console.log("\n📄 Deploying AutomatedQuizApp...");
    const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
    const automatedQuizApp = await AutomatedQuizApp.deploy(tokenAddress);
    await automatedQuizApp.waitForDeployment();
    const contractAddress = await automatedQuizApp.getAddress();
    console.log("✅ AutomatedQuizApp deployed to:", contractAddress);

    // Transfer tokens to quiz app for rewards
    console.log("\n💸 Transferring tokens to quiz app...");
    const transferAmount = ethers.parseEther("100000"); // 100k tokens
    await quizToken.transfer(contractAddress, transferAmount);
    console.log("✅ Transferred 100k tokens to AutomatedQuizApp");

    // Update contract configuration
    console.log("\n⚙️ Updating contract configuration...");
    const configPath = path.join(__dirname, "..", "constants", "contract.js");
    
    // Read the ABI from the contract
    const contractABI = JSON.stringify(automatedQuizApp.interface.formatJson(), null, 2);
    
    const configContent = `// Auto-generated contract configuration - LOCAL TEST NETWORK
export const CONTRACT_ADDRESS = "${contractAddress}";
export const TOKEN_ADDRESS = "${tokenAddress}";

export const ABI = ${contractABI};

// For testing - these addresses are from local deployment
console.log("📍 Contract deployed at:", CONTRACT_ADDRESS);
console.log("🪙 Token deployed at:", TOKEN_ADDRESS);
`;

    fs.writeFileSync(configPath, configContent);
    console.log("✅ Updated contract configuration");

    // Enable auto mode
    console.log("\n🤖 Enabling auto mode...");
    await automatedQuizApp.toggleAutoMode();
    console.log("✅ Auto mode enabled");

    console.log("\n🎉 Deployment completed successfully!");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🪙 Token Address:", tokenAddress);
    console.log("🚀 You can now start the automation keeper and use the quiz app!");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
