const { ethers } = require("hardhat");
const { SAMPLE_QUESTIONS } = require("../constants/contract");

async function main() {
  const [owner] = await ethers.getSigners();

  // Replace with your deployed contract address
  const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

  const AIQuizApp = await ethers.getContractFactory("AIQuizApp");
  const contract = AIQuizApp.attach(contractAddress);

  console.log("Creating sample questions...");

  for (let i = 0; i < SAMPLE_QUESTIONS.length; i++) {
    const question = SAMPLE_QUESTIONS[i];

    console.log(`Creating question ${i + 1}: ${question.question}`);

    const tx = await contract.createQuestion(
      question.question,
      question.options,
      question.correctAnswer
    );

    await tx.wait();
    console.log(`Question ${i + 1} created successfully!`);

    // Wait for the question to expire before creating the next one
    if (i < SAMPLE_QUESTIONS.length - 1) {
      console.log("Waiting for question to expire...");
      await new Promise((resolve) => setTimeout(resolve, 32000)); // Wait 32 seconds

      // Reveal the answer
      console.log(`Revealing answer for question ${i}`);
      const revealTx = await contract.revealAnswer(i);
      await revealTx.wait();
      console.log(`Answer revealed for question ${i}`);
    }
  }

  console.log("All sample questions created!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
