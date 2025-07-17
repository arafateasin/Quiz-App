# 🎯 Blockchain Quiz App - Automated Quiz System

## 🎪 **Complete Mission Implementation**

This is a fully functional blockchain-based quiz application that implements **ALL** mission requirements:

- ✅ **Every 30 seconds** a new multiple-choice question appears automatically
- ✅ **Users participate** by submitting answers through smart contracts  
- ✅ **Countdown timer** shows remaining time for each question
- ✅ **Correct answers revealed** automatically when time expires
- ✅ **10 tokens rewarded** to each user who answered correctly
- ✅ **Automatic distribution** of rewards without manual intervention

## 🚀 **Quick Start for Bounty Evaluators**

### Option 1: Local Testing (Fastest Setup)

```bash
# 1. Install dependencies
npm install

# 2. Terminal 1: Start local blockchain
npm run hardhat:node

# 3. Terminal 2: Deploy contracts
npm run hardhat:deploy-local

# 4. Terminal 3: Start application
npm run dev

# 5. Open http://localhost:3004
```

**MetaMask Setup for Local Testing:**
- Network: Add localhost:8545 (Chain ID: 31337)
- Import test account: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- This account has 10,000 test ETH

### Option 2: zkSync Sepolia Testnet

```bash
# 1. Create .env file with your keys
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_key_here

# 2. Deploy to zkSync Sepolia
npm run hardhat:deploy --network zkSyncSepolia

# 3. Start application
npm run dev
```

**MetaMask Setup for zkSync Sepolia:**
- Network Name: zkSync Sepolia Testnet
- RPC URL: https://sepolia.era.zksync.dev
- Chain ID: 300
- Currency Symbol: ETH
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- 🪙 **Token Integration**: Built-in ERC20 token support for quiz rewards

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MetaMask browser extension
- zkSync Sepolia testnet ETH (from faucet)

### 1. Clone and Install

```bash
git clone <repository-url>
cd quiz-app
npm install
```

### 2. Environment Setup

Create a `.env` file:
```env
NEXT_PUBLIC_ZKSYNC_SEPOLIA_RPC=https://sepolia.era.zksync.dev
NEXT_PUBLIC_CHAIN_ID=300
```

### 3. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3004`

## 🌐 Network Configuration

### zkSync Sepolia Testnet
- **Network Name**: zkSync Sepolia Testnet
- **RPC URL**: https://sepolia.era.zksync.dev
- **Chain ID**: 300
- **Currency**: ETH
- **Block Explorer**: https://sepolia.explorer.zksync.io

### Get Test ETH
- **Faucet 1**: https://portal.zksync.io/faucet
- **Faucet 2**: https://faucets.chain.link/

## 🔧 Smart Contract Deployment

### Deploy to zkSync Sepolia

```bash
npm run deploy:sepolia
```

### Verify Contract
```bash
npm run verify:sepolia
```

## 📁 Project Structure

```
├── components/           # React components
│   ├── AutomatedQuizCard.js
│   ├── SimpleConnectButton.js
│   └── ...
├── contracts/           # Smart contracts
│   ├── AutomatedQuizApp.sol
│   └── AIQuizApp.sol
├── constants/           # Contract addresses and ABIs
├── pages/              # Next.js pages
├── scripts/            # Deployment and utility scripts
├── styles/             # CSS and styling
└── hardhat.config.js   # Hardhat configuration
```

## 🎮 Usage

1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Add Network**: Add zkSync Sepolia testnet to your wallet
3. **Get Test ETH**: Use the faucets to get test ETH
4. **Start Quiz**: Click "Start Automated Quiz" to begin the automated quiz mode
5. **Participate**: Answer questions and earn tokens!

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run hardhat:compile` - Compile smart contracts
- `npm run hardhat:node` - Start local hardhat node
- `npm run deploy:sepolia` - Deploy to zkSync Sepolia
- `npm run test` - Run tests

### Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Blockchain**: zkSync Sepolia, Hardhat, Ethers.js
- **Wallet**: Wagmi, MetaMask, Coinbase Wallet
- **Smart Contracts**: Solidity, OpenZeppelin

## 🔐 Security

- Smart contracts follow OpenZeppelin standards
- Multi-wallet support for secure connections
- Testnet deployment for safe testing
- Environment variable protection

### 2. Deploy Smart Contracts

```bash
npm run setup
```

### 3. Start the Frontend

```bash
npm run dev
```

### 4. Visit the Application

Open [http://localhost:3004](http://localhost:3004) in your browser

## 🎮 How to Use

1. **Connect Your Wallet** - Click the "Connect" button to connect your MetaMask wallet
2. **Start the Quiz** - Click "Start Automated Quiz" to begin automation
3. **Answer Questions** - New questions appear every 30 seconds
4. **Earn Tokens** - Get rewarded with QUIZ tokens for correct answers
5. **Stop Anytime** - Use the stop button to halt automation

## 📜 Available Scripts

| Script                 | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the Next.js development server |
| `npm run hardhat:node` | Start local Hardhat blockchain       |
| `npm run setup`        | Deploy all smart contracts           |
| `npm run automation`   | Start backend automation loop        |
| `npm run status`       | Check system status                  |
| `npm run auto-on`      | Enable auto mode via CLI             |
| `npm run auto-off`     | Disable auto mode via CLI            |

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "Quiz App"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:

   - `PRIVATE_KEY`: Your wallet private key for deployment
   - `INFURA_API_KEY`: Infura project API key
   - `ETHERSCAN_API_KEY`: Etherscan API key for verification
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect project ID

## 🔧 Development Setup

### 1. Start Local Blockchain

```bash
npm run hardhat:node
```

### 2. Deploy Contracts

```bash
npm run hardhat:compile
npm run hardhat:deploy
```

### 3. Update Contract Addresses

After deployment, update the contract addresses in `constants/contract.js`:

```javascript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
export const QUIZ_TOKEN_ADDRESS = "YOUR_TOKEN_CONTRACT_ADDRESS";
```

### 4. Start Frontend

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 🧪 Testing

Run the smart contract tests:

```bash
npm run hardhat:test
```

## 📝 Smart Contract Architecture

### QuizToken (ERC20)

- Standard ERC20 token for rewards
- Mintable by contract owner
- Used for participant rewards

### AIQuizApp (Main Contract)

- **Question Management**: Create and manage quiz questions
- **Answer Submission**: Handle user answers with validation
- **Reward Distribution**: Automatic token distribution to winners
- **Leaderboard**: Track player performance and rankings
- **Statistics**: Individual player stats and achievements

### Key Functions

- `createQuestion()`: Owner creates new questions
- `submitAnswer()`: Users submit answers during active questions
- `revealAnswer()`: Owner reveals answers and distributes rewards
- `getPlayerStats()`: Retrieve individual player statistics
- `getLeaderboard()`: Get top performers

## 🎮 How to Play

1. **Connect Wallet**: Use the Connect button to link your Ethereum wallet
2. **Wait for Question**: Questions appear every 30 seconds
3. **Submit Answer**: Select your answer and submit before time expires
4. **Earn Rewards**: Get 10 QUIZ tokens for each correct answer
5. **Track Progress**: Monitor your stats and leaderboard position

## 🏆 Features Overview

### Real-time Quiz System

- Questions automatically expire after 30 seconds
- Real-time countdown timer
- Automatic answer reveal and reward distribution

### Token Economics

- **Reward Amount**: 10 QUIZ tokens per correct answer
- **Fair Distribution**: Only correct answers receive rewards
- **Automatic Payout**: Smart contract handles all distributions

### Player Statistics

- **Accuracy**: Percentage of correct answers
- **Streaks**: Current and best answer streaks
- **Total Rewards**: Cumulative tokens earned
- **Performance**: Questions attempted vs. correct

### Leaderboard System

- **Global Rankings**: Top players by score
- **Score Calculation**: Based on correct answers and streaks
- **Real-time Updates**: Automatic leaderboard updates

## 🔐 Security Features

- **Reentrancy Protection**: Using OpenZeppelin's ReentrancyGuard
- **Access Control**: Owner-only functions for question management
- **Pausable**: Emergency pause functionality
- **Input Validation**: Comprehensive validation on all inputs
- **Single Answer**: Prevents multiple answers per question

## 🌐 Deployment

### Local Development

1. Start Hardhat node: `npm run hardhat:node`
2. Deploy contracts: `npm run hardhat:deploy`
3. Start frontend: `npm run dev`

### Testnet Deployment

1. Configure testnet in `hardhat.config.js`
2. Fund your wallet with testnet ETH
3. Deploy: `npx hardhat run scripts/deploy.js --network sepolia`
4. Update contract addresses in frontend

### Mainnet Deployment

1. Ensure all security audits are complete
2. Set up mainnet configuration
3. Deploy with: `npx hardhat run scripts/deploy.js --network mainnet`

## 📊 Admin Functions

### Creating Questions

```javascript
// Use the createQuestions.js script
node scripts/createQuestions.js
```

### Manual Question Creation

```javascript
await contract.createQuestion(
  "What is 2+2?",
  ["3", "4", "5", "6"],
  1 // Index of correct answer
);
```

### Revealing Answers

```javascript
await contract.revealAnswer(questionId);
```

## 🛡️ Security Considerations

- **Private Key Management**: Never commit private keys
- **Smart Contract Auditing**: Audit contracts before mainnet
- **Input Validation**: All inputs are validated
- **Rate Limiting**: One answer per question per user
- **Access Control**: Critical functions are owner-only

## 📱 Frontend Components

### QuizCard

- Displays current question and options
- Handles answer submission
- Shows results and feedback

### CountdownTimer

- Visual countdown with progress ring
- Urgent state for final seconds
- Automatic time updates

### Leaderboard

- Top player rankings
- Score and reward display
- Real-time updates

### PlayerStats

- Individual performance metrics
- Achievement system
- Progress tracking

## 🔧 Configuration

### Smart Contract Settings

- **Question Duration**: 30 seconds (configurable)
- **Reward Amount**: 10 tokens (configurable)
- **Max Options**: 6 per question
- **Min Options**: 2 per question

### Frontend Configuration

- **Auto-refresh**: 5-second intervals
- **Wallet Support**: MetaMask, WalletConnect
- **Network Support**: Ethereum mainnet, testnets

## 📈 Monitoring

### Events

- `QuestionCreated`: New question events
- `AnswerSubmitted`: User answer events
- `QuestionRevealed`: Answer reveal events
- `RewardDistributed`: Token distribution events

### Analytics

- Player participation rates
- Question difficulty analysis
- Reward distribution patterns
- User engagement metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:

1. Check the documentation
2. Review existing issues
3. Create a new issue with details
4. Contact the development team

## 🎯 Roadmap

### Phase 1 (Current)

- ✅ Basic quiz functionality
- ✅ Token rewards
- ✅ Leaderboard system
- ✅ Wallet integration

### Phase 2 (Future)

- 🔄 AI-generated questions
- 🔄 Multiple quiz categories
- 🔄 Tournament mode
- 🔄 NFT achievements

### Phase 3 (Future)

- 🔄 Multi-chain support
- 🔄 Mobile app
- 🔄 Advanced analytics
- 🔄 Community features

## 🌟 Getting Started Quickly

1. **Install dependencies**: `npm install`
2. **Start blockchain**: `npm run hardhat:node`
3. **Deploy contracts**: `npm run hardhat:deploy`
4. **Update addresses**: Edit `constants/contract.js`
5. **Start frontend**: `npm run dev`
6. **Connect wallet**: Use MetaMask with localhost:8545
7. **Start playing**: Wait for questions and submit answers!

Ready to start building the future of decentralized education and gaming! 🚀
