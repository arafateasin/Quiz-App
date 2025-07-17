// Auto-generated contract configuration - ZKSYNC SEPOLIA TESTNET
export const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Sample zkSync Sepolia contract
export const TOKEN_ADDRESS = "0x0987654321098765432109876543210987654321"; // Sample zkSync Sepolia token

export const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "isAutoModeEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "toggleAutoMode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkAndCreateNextQuestion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentQuestion",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "question",
        type: "string",
      },
      {
        internalType: "string",
        name: "optionA",
        type: "string",
      },
      {
        internalType: "string",
        name: "optionB",
        type: "string",
      },
      {
        internalType: "string",
        name: "optionC",
        type: "string",
      },
      {
        internalType: "string",
        name: "optionD",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "correctAnswer",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "participants",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "answer",
        type: "uint8",
      },
    ],
    name: "submitAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getQuestionPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPlayerStats",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "totalAnswered",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "correctAnswers",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalEarned",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currentStreak",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bestStreak",
            type: "uint256",
          },
        ],
        internalType: "struct AutomatedQuizApp.PlayerStats",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLeaderboard",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTimeUntilNextQuestion",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
