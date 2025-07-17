const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Contract addresses from deployment
  const AIQuizAppAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  // Get the contract instance
  const AIQuizApp = await ethers.getContractAt("AIQuizApp", AIQuizAppAddress);

  // Sample questions
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Monet"],
      correct: 2,
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correct: 3,
    },
  ];

  // Create a random question
  const randomQuestion =
    questions[Math.floor(Math.random() * questions.length)];

  console.log("Creating question:", randomQuestion.question);
  console.log("Options:", randomQuestion.options);
  console.log(
    "Correct answer:",
    randomQuestion.options[randomQuestion.correct]
  );

  try {
    const tx = await AIQuizApp.createQuestion(
      randomQuestion.question,
      randomQuestion.options,
      randomQuestion.correct
    );

    await tx.wait();
    console.log("✅ Question created successfully!");
    console.log("Transaction hash:", tx.hash);

    // Get the current question to verify
    const currentQuestion = await AIQuizApp.getCurrentQuestion();
    console.log("Current question ID:", currentQuestion[0].toString());
    console.log("Question text:", currentQuestion[1]);
    console.log("Is active:", currentQuestion[5]);
    console.log("Time left:", currentQuestion[6].toString(), "seconds");
  } catch (error) {
    console.error("❌ Error creating question:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
