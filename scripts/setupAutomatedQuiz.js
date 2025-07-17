const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Setting up Automated Blockchain Quiz System");
  console.log("==============================================");

  const [deployer] = await ethers.getSigners();

  console.log("📝 Deploying with account:", deployer.address);
  console.log(
    "💰 Account balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address))
  );

  // Step 1: Deploy contracts
  console.log("\n📦 Step 1: Deploying Smart Contracts");
  console.log("-----------------------------------");

  // Deploy QuizToken
  console.log("🪙 Deploying QuizToken...");
  const QuizToken = await ethers.getContractFactory(
    "contracts/AutomatedQuizApp.sol:QuizToken"
  );
  const quizToken = await QuizToken.deploy();
  await quizToken.waitForDeployment();
  const quizTokenAddress = await quizToken.getAddress();
  console.log("✅ QuizToken deployed to:", quizTokenAddress);

  // Deploy AutomatedQuizApp
  console.log("🤖 Deploying AutomatedQuizApp...");
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const automatedQuizApp = await AutomatedQuizApp.deploy(quizTokenAddress);
  await automatedQuizApp.waitForDeployment();
  const automatedQuizAddress = await automatedQuizApp.getAddress();
  console.log("✅ AutomatedQuizApp deployed to:", automatedQuizAddress);

  // Step 2: Setup tokens
  console.log("\n💰 Step 2: Setting up Tokens");
  console.log("----------------------------");

  const tokenAmount = ethers.parseEther("500000"); // 500k tokens
  await quizToken.transfer(automatedQuizAddress, tokenAmount);
  console.log("✅ Transferred 500,000 tokens to quiz contract");

  const contractBalance = await quizToken.balanceOf(automatedQuizAddress);
  console.log(
    "💰 Contract token balance:",
    ethers.formatEther(contractBalance)
  );

  // Step 3: Initialize quiz system
  console.log("\n🎯 Step 3: Initializing Quiz System");
  console.log("-----------------------------------");

  // Check question pool
  const poolSize = await automatedQuizApp.getQuestionPool();
  console.log("📚 Question pool size:", poolSize.toString());

  // Enable auto mode
  console.log("🔄 Enabling auto mode...");
  const autoTx = await automatedQuizApp.toggleAutoMode();
  await autoTx.wait();
  console.log("✅ Auto mode enabled!");

  // Create first question manually to start the cycle
  console.log("🎪 Creating first question...");
  const firstQuestionTx = await automatedQuizApp.checkAndCreateNextQuestion();
  await firstQuestionTx.wait();
  console.log("✅ First question created!");

  // Step 4: Update configuration files
  console.log("\n📄 Step 4: Updating Configuration");
  console.log("----------------------------------");

  // Update contract constants
  const contractConstantsPath = "./constants/contract.js";
  const contractConstants = `// Auto-generated contract configuration
export const CONTRACT_ADDRESS = '${automatedQuizAddress}'
export const TOKEN_ADDRESS = '${quizTokenAddress}'

export const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_quizToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getCurrentQuestion",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "options",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isRevealed",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalParticipants",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "answerIndex",
        "type": "uint256"
      }
    ],
    "name": "submitAnswer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      }
    ],
    "name": "claimReward",
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
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questionId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "userAnswers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "answerIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "hasAnswered",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isCorrect",
        "type": "bool"
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
        "internalType": "uint256",
        "name": "totalQuestions",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "correctAnswers",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalRewards",
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
  }
]
`;

  try {
    fs.writeFileSync(contractConstantsPath, contractConstants);
    console.log("✅ Updated contract constants");
  } catch (error) {
    console.log("⚠️  Could not update contract constants:", error.message);
  }

  // Update automation script
  const automationScriptPath = "./scripts/startAutomation.js";
  const automationScript = `const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Automated Quiz System...");
  
  const automatedQuizAddress = "${automatedQuizAddress}";
  
  const [owner] = await ethers.getSigners();
  
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const contract = AutomatedQuizApp.attach(automatedQuizAddress);
  
  console.log("✅ Connected to Automated Quiz Contract");
  
  // Check if auto mode is enabled
  const autoMode = await contract.isAutoModeEnabled();
  console.log(\`🤖 Auto mode status: \${autoMode ? 'ENABLED' : 'DISABLED'}\`);
  
  if (!autoMode) {
    console.log("❌ Auto mode is not enabled. Please enable it first.");
    return;
  }
  
  console.log("🎯 Starting automated question creation cycle...");
  console.log("⏰ New questions will be created every 30 seconds");
  console.log("🎁 Rewards: 10 tokens for each correct answer");
  console.log("📊 Visit http://localhost:3001 to participate!");
  console.log("---");
  
  // Main automation loop
  let questionCount = 0;
  setInterval(async () => {
    try {
      console.log(\`⏰ [\${new Date().toLocaleTimeString()}] Checking for next question...\`);
      
      // Call the contract to check and create next question
      const tx = await contract.checkAndCreateNextQuestion();
      await tx.wait();
      
      questionCount++;
      console.log(\`✅ [\${new Date().toLocaleTimeString()}] Question \${questionCount} created successfully!\`);
      
      // Get current question details
      const currentQuestion = await contract.getCurrentQuestion();
      if (currentQuestion[1]) { // If question exists
        console.log(\`📝 Question: "\${currentQuestion[1]}"\`);
        console.log(\`⏱️  Duration: 30 seconds\`);
        console.log(\`👥 Participants: \${currentQuestion[7]}\`);
        console.log("---");
      }
      
    } catch (error) {
      console.error(\`❌ Error creating question: \${error.message}\`);
    }
  }, 31000); // Check every 31 seconds
  
  // Keep the process running
  console.log("🎮 Automated Quiz System is now running!");
  console.log("Press Ctrl+C to stop the automation");
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log("\\n🛑 Shutting down automated quiz system...");
    process.exit(0);
  });
}

main()
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });`;

  try {
    fs.writeFileSync(automationScriptPath, automationScript);
    console.log("✅ Updated automation script");
  } catch (error) {
    console.log("⚠️  Could not update automation script:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    QuizToken: quizTokenAddress,
    AutomatedQuizApp: automatedQuizAddress,
    Deployer: deployer.address,
    Network: "localhost",
    TokenBalance: ethers.formatEther(contractBalance),
    QuestionPool: poolSize.toString(),
    AutoMode: true,
    Timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "automated-quiz-deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("✅ Saved deployment info");

  // Final summary
  console.log("\n🎉 AUTOMATED QUIZ SYSTEM SETUP COMPLETE!");
  console.log("==========================================");
  console.log("🤖 Contract Address:", automatedQuizAddress);
  console.log("🪙 Token Address:", quizTokenAddress);
  console.log(
    "💰 Contract Balance:",
    ethers.formatEther(contractBalance),
    "tokens"
  );
  console.log("📚 Question Pool:", poolSize.toString(), "questions");
  console.log("⚡ Auto Mode: ENABLED");
  console.log("⏰ Question Interval: 30 seconds");
  console.log("🎁 Reward per Correct Answer: 10 tokens");

  console.log("\n🚀 Next Steps:");
  console.log("1. Your automated quiz is already running!");
  console.log("2. Visit http://localhost:3001 to participate");
  console.log("3. Questions will appear every 30 seconds automatically");
  console.log("4. Connect your wallet and start earning tokens!");

  console.log("\n📋 Optional: To monitor the automation:");
  console.log("npx hardhat run scripts/startAutomation.js --network localhost");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });
