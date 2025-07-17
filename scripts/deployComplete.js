const { ethers } = require("hardhat");
const fs = require("fs");

async function deployComplete() {
  console.log("🚀 Complete Deployment and Setup");
  console.log("=================================");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log(
    "💰 Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address))
  );

  // Deploy QuizToken
  console.log("🪙 Deploying QuizToken...");
  const QuizToken = await ethers.getContractFactory("QuizToken");
  const quizToken = await QuizToken.deploy();
  await quizToken.waitForDeployment();

  const tokenAddress = await quizToken.getAddress();
  console.log("✅ QuizToken deployed to:", tokenAddress);

  // Deploy AutomatedQuizApp
  console.log("🤖 Deploying AutomatedQuizApp...");
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const automatedQuizApp = await AutomatedQuizApp.deploy(tokenAddress);
  await automatedQuizApp.waitForDeployment();

  const contractAddress = await automatedQuizApp.getAddress();
  console.log("✅ AutomatedQuizApp deployed to:", contractAddress);

  // Transfer tokens to contract
  console.log("💰 Transferring tokens to quiz contract...");
  const tokenAmount = ethers.parseEther("100000");
  await quizToken.transfer(contractAddress, tokenAmount);
  console.log("✅ Transferred 100,000 tokens to quiz contract");

  // Enable auto mode
  console.log("🤖 Enabling auto mode...");
  await automatedQuizApp.toggleAutoMode();
  console.log("✅ Auto mode enabled");

  // Create first question
  console.log("🎯 Creating first question...");
  await automatedQuizApp.checkAndCreateNextQuestion();
  console.log("✅ First question created");

  // Test the contract
  console.log("🧪 Testing contract functions...");
  const autoMode = await automatedQuizApp.isAutoModeEnabled();
  const totalQuestions = await automatedQuizApp.getQuestionPool();
  const currentQuestion = await automatedQuizApp.getCurrentQuestion();
  const balance = await quizToken.balanceOf(contractAddress);

  console.log(`✅ Auto mode: ${autoMode}`);
  console.log(`✅ Total questions: ${totalQuestions}`);
  console.log(`✅ Current question: "${currentQuestion[1] || "None"}"`);
  console.log(`✅ Contract balance: ${ethers.formatEther(balance)} tokens`);

  // Save addresses to file
  const addresses = {
    tokenAddress,
    contractAddress,
    deployedAt: new Date().toISOString(),
    network: "localhost",
  };

  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("💾 Addresses saved to deployed-addresses.json");

  // Update constants file
  const constantsContent = `// Auto-generated contract configuration
export const CONTRACT_ADDRESS = '${contractAddress}'
export const TOKEN_ADDRESS = '${tokenAddress}'

export const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "isAutoModeEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "toggleAutoMode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkAndCreateNextQuestion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentQuestion",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "optionA",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "optionB",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "optionC",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "optionD",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "correctAnswer",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "participants",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "createdAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "answer",
        "type": "uint8"
      }
    ],
    "name": "submitAnswer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getQuestionPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getPlayerStats",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "totalAnswered",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "correctAnswers",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalEarned",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currentStreak",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bestStreak",
            "type": "uint256"
          }
        ],
        "internalType": "struct AutomatedQuizApp.PlayerStats",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLeaderboard",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTimeUntilNextQuestion",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
`;

  fs.writeFileSync("constants/contract.js", constantsContent);
  console.log("✅ Constants file updated");

  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("========================");
  console.log(`🪙 Token Address: ${tokenAddress}`);
  console.log(`🤖 Contract Address: ${contractAddress}`);
  console.log(`🤖 Auto Mode: ${autoMode ? "ENABLED" : "DISABLED"}`);
  console.log(`💰 Contract Balance: ${ethers.formatEther(balance)} tokens`);
  console.log("========================");
  console.log("🚀 Ready to start automated quiz!");
  console.log("Visit http://localhost:3004 to participate");
}

deployComplete()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
