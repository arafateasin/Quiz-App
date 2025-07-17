const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Deploying Quiz App to Ethereum Mainnet...");
  console.log("⚠️  WARNING: This will deploy to MAINNET and cost real ETH!");
  console.log("Deploying with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Check if we have enough ETH for deployment
  if (balance < ethers.parseEther("0.1")) {
    console.log(
      "❌ Insufficient ETH balance. Need at least 0.1 ETH for deployment."
    );
    process.exit(1);
  }

  // Deploy QuizToken first
  console.log("\n📝 Deploying QuizToken...");
  const QuizToken = await ethers.getContractFactory("QuizToken");
  const quizToken = await QuizToken.deploy();
  await quizToken.waitForDeployment();

  const tokenAddress = await quizToken.getAddress();
  console.log("✅ QuizToken deployed to:", tokenAddress);

  // Deploy AutomatedQuizApp
  console.log("\n📝 Deploying AutomatedQuizApp...");
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const automatedQuizApp = await AutomatedQuizApp.deploy(tokenAddress);
  await automatedQuizApp.waitForDeployment();

  const contractAddress = await automatedQuizApp.getAddress();
  console.log("✅ AutomatedQuizApp deployed to:", contractAddress);

  // Transfer some tokens to the quiz app contract for rewards
  console.log("\n💰 Transferring tokens to contract...");
  const transferAmount = ethers.parseEther("100000"); // 100k tokens
  await quizToken.transfer(contractAddress, transferAmount);
  console.log("✅ Transferred 100k tokens to AutomatedQuizApp contract");

  // Initialize the question pool
  console.log("\n📚 Initializing question pool...");
  const questions = [
    {
      question: "What is the native cryptocurrency of Ethereum?",
      options: ["Bitcoin", "Ether", "Litecoin", "Dogecoin"],
      correctAnswer: 1,
    },
    {
      question: "Which consensus mechanism does Ethereum 2.0 use?",
      options: [
        "Proof of Work",
        "Proof of Stake",
        "Proof of Authority",
        "Delegated Proof of Stake",
      ],
      correctAnswer: 1,
    },
    {
      question: "What does 'DeFi' stand for?",
      options: [
        "Decentralized Finance",
        "Digital Finance",
        "Distributed Finance",
        "Dynamic Finance",
      ],
      correctAnswer: 0,
    },
    {
      question: "What is a smart contract?",
      options: [
        "A legal document",
        "Self-executing code",
        "A mobile app",
        "A website",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswer: 1,
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
    },
    {
      question: "What does 'AI' stand for?",
      options: [
        "Artificial Intelligence",
        "Advanced Internet",
        "Automated Input",
        "Active Interface",
      ],
      correctAnswer: 0,
    },
    {
      question:
        "Which programming language is known for blockchain development?",
      options: ["JavaScript", "Solidity", "Python", "Java"],
      correctAnswer: 1,
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Pacific", "Indian", "Arctic"],
      correctAnswer: 1,
    },
  ];

  // Add questions to pool
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await automatedQuizApp.addQuestionToPool(
      q.question,
      q.options,
      q.correctAnswer
    );
    console.log(`✅ Added question ${i + 1}: "${q.question}"`);
  }

  console.log("\n🎉 Deployment Summary:");
  console.log("═══════════════════════════════════════");
  console.log("QuizToken:", tokenAddress);
  console.log("AutomatedQuizApp:", contractAddress);
  console.log("Network: Ethereum Mainnet");
  console.log("Deployer:", deployer.address);
  console.log("═══════════════════════════════════════");
  console.log("\n📋 Next Steps:");
  console.log("1. Update constants/contract.js with new address");
  console.log("2. Update .env.local with mainnet configuration");
  console.log("3. Switch MetaMask to Ethereum Mainnet");
  console.log("4. Your contract is now live on mainnet!");
  console.log("\n🚀 Contract is ready for automated quiz system!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
