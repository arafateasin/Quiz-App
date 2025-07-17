const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();

  // Contract address from deployment
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const AIQuizApp = await ethers.getContractFactory("AIQuizApp");
  const contract = AIQuizApp.attach(contractAddress);

  console.log("Creating first test question...");

  const question = "What is the native cryptocurrency of Ethereum?";
  const options = ["Bitcoin", "Ether", "Litecoin", "Dogecoin"];
  const correctAnswer = 1;

  console.log(`Creating question: ${question}`);

  const tx = await contract.createQuestion(question, options, correctAnswer);
  await tx.wait();

  console.log("Question created successfully!");
  console.log("Question will be active for 30 seconds");
  console.log("Visit http://localhost:3000 to participate!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
