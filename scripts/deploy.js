const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Quiz App contracts...");

  // Get the deployer's signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy QuizToken first (from AutomatedQuizApp.sol)
  const QuizToken = await ethers.getContractFactory(
    "contracts/AutomatedQuizApp.sol:QuizToken"
  );
  const quizToken = await QuizToken.deploy();
  await quizToken.waitForDeployment();

  console.log("QuizToken deployed to:", await quizToken.getAddress());

  // Deploy AutomatedQuizApp
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const automatedQuizApp = await AutomatedQuizApp.deploy(
    await quizToken.getAddress()
  );
  await automatedQuizApp.waitForDeployment();

  console.log(
    "AutomatedQuizApp deployed to:",
    await automatedQuizApp.getAddress()
  );

  // Transfer some tokens to the quiz app contract for rewards
  const transferAmount = ethers.parseEther("100000"); // 100k tokens
  await quizToken.transfer(await automatedQuizApp.getAddress(), transferAmount);
  console.log("Transferred 100k tokens to AutomatedQuizApp contract");

  // Sample questions for testing
  const sampleQuestions = [
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
        "Delegated Proof of Stake",
        "Proof of Authority",
      ],
      correctAnswer: 1,
    },
    {
      question: "What does 'DeFi' stand for?",
      options: [
        "Decentralized Finance",
        "Digital Finance",
        "Distributed Finance",
        "Defined Finance",
      ],
      correctAnswer: 0,
    },
  ];

  console.log("\nDeployment completed!");
  console.log("QuizToken address:", await quizToken.getAddress());
  console.log("AutomatedQuizApp address:", await automatedQuizApp.getAddress());
  console.log("\nSample questions available for testing:");
  sampleQuestions.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
