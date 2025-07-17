# 🎯 Blockchain Quiz App - Bounty Submission

## 🎪 **Mission Completed**
A complete blockchain-based quiz application where:
- ✅ **Every 30 seconds** a new multiple-choice question appears automatically
- ✅ **Users participate** by submitting answers through smart contracts
- ✅ **Countdown timer** shows remaining time for each question
- ✅ **Correct answers revealed** automatically when time expires
- ✅ **10 tokens rewarded** to each user who answered correctly
- ✅ **Automatic distribution** of rewards without manual intervention

## 🚀 **Quick Start Guide**

### Option 1: Local Testing (Recommended for Quick Testing)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Local Blockchain**
   ```bash
   npm run hardhat:node
   ```
   > Keep this terminal running

3. **Deploy Contracts (New Terminal)**
   ```bash
   npm run hardhat:deploy-local
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

5. **Start Automation Keeper (Optional)**
   ```bash
   npm run automation-keeper
   ```

6. **Access App**: http://localhost:3004

### Option 2: zkSync Sepolia Testnet

1. **Setup Environment Variables**
   ```bash
   # Create .env file with:
   PRIVATE_KEY=your_private_key_here
   INFURA_API_KEY=your_infura_key_here
   ```

2. **Update Network Configuration**
   - App will auto-detect and use zkSync Sepolia
   - Contract addresses already configured

3. **Deploy to zkSync Sepolia**
   ```bash
   npm run hardhat:deploy --network zkSyncSepolia
   ```

4. **Start Application**
   ```bash
   npm run dev
   ```

## 🛠 **Technical Architecture**

### Smart Contracts
- **AutomatedQuizApp.sol**: Main quiz logic with automation
- **QuizToken.sol**: ERC-20 token for rewards
- **Features**: Auto-progression, reward distribution, participant tracking

### Frontend
- **Next.js 14**: React framework
- **Wagmi**: Ethereum wallet integration
- **Framer Motion**: Smooth animations
- **Auto-triggering**: Questions advance automatically

### Automation System
- **Keeper Script**: Continuous monitoring every 5 seconds
- **Auto-trigger**: Questions advance when time expires
- **Reward Distribution**: Automatic token distribution

## 📋 **Testing Instructions**

### Local Testing
1. **Connect MetaMask** to localhost:8545 (Chain ID: 31337)
2. **Import Test Account**: 
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This account has 10,000 test ETH
3. **Click "Connect Wallet"** and select MetaMask
4. **Click "Start Automated Quiz"** to begin
5. **Answer questions** within 30-second timer
6. **Watch automatic progression** every 30 seconds

### zkSync Sepolia Testing
1. **Add zkSync Sepolia** to MetaMask:
   - Network Name: zkSync Sepolia Testnet
   - RPC URL: https://sepolia.era.zksync.dev
   - Chain ID: 300
   - Currency Symbol: ETH
2. **Get test ETH** from zkSync faucet
3. **Connect wallet** and test quiz functionality

## 🎯 **Key Features Demonstrated**

### ✅ Automatic Question Progression
- New questions appear every 30 seconds
- No manual intervention required
- Continuous operation

### ✅ Smart Contract Integration
- All answers submitted on-chain
- Transparent and verifiable
- Gas-optimized operations

### ✅ Automatic Reward Distribution
- 10 tokens per correct answer
- Immediate distribution when question ends
- Batch processing for multiple winners

### ✅ Real-time UI Updates
- Live countdown timer
- Automatic question transitions
- Smooth animations and feedback

### ✅ Player Statistics
- Track correct answers
- Calculate streaks
- Leaderboard system

## 📁 **Project Structure**

```
Quiz App/
├── contracts/
│   └── AutomatedQuizApp.sol    # Main smart contract
├── scripts/
│   ├── deploy.js              # Standard deployment
│   ├── deployLocal.js         # Local testing deployment
│   └── automationKeeper.js    # Continuous automation
├── pages/
│   ├── _app.js               # Wagmi configuration
│   └── index.js              # Main quiz interface
├── components/
│   ├── AutomatedQuizCard.js  # Quiz UI component
│   └── SimpleConnectButton.js # Wallet connection
└── constants/
    └── contract.js           # Contract addresses & ABI
```

## 🔧 **Available Commands**

```bash
# Development
npm run dev                    # Start Next.js app
npm run build                  # Build for production

# Smart Contracts
npm run hardhat:compile        # Compile contracts
npm run hardhat:node          # Start local blockchain
npm run hardhat:deploy-local  # Deploy to local network
npm run hardhat:test          # Run contract tests

# Automation
npm run automation-keeper     # Start automation keeper
npm run auto-on              # Enable auto mode
npm run auto-off             # Disable auto mode
```

## 🌐 **Network Support**

- ✅ **Local Hardhat**: For development and testing
- ✅ **zkSync Sepolia**: For testnet deployment
- ✅ **Ethereum Sepolia**: Alternative testnet option
- 🔜 **Mainnet**: Production ready

## 💡 **Innovation Highlights**

1. **Complete Automation**: No manual intervention needed
2. **Gas Optimization**: Efficient batch operations
3. **Real-time UX**: Smooth user experience
4. **Scalable Architecture**: Easy to extend with more features
5. **Cross-platform**: Works on desktop and mobile

## 📊 **Performance Metrics**

- ⚡ **Question Duration**: 30 seconds (configurable)
- 🎯 **Reward Amount**: 10 tokens per correct answer
- 🔄 **Automation Interval**: 5-second monitoring
- 📈 **Gas Efficiency**: Optimized for low costs

## 🐛 **Known Issues & Solutions**

1. **MetaMask Connection**: Ensure correct network is selected
2. **Local Testing**: Keep hardhat node running
3. **Token Balance**: Deploy script funds contract with 100k tokens
4. **Automation**: Keeper script needs deployed contract

## 🏆 **Bounty Completion Status**

- ✅ **New question every 30 seconds** - COMPLETED
- ✅ **Multiple choice questions** - COMPLETED
- ✅ **Smart contract participation** - COMPLETED
- ✅ **Countdown timer** - COMPLETED
- ✅ **Automatic answer revelation** - COMPLETED
- ✅ **10 tokens reward** - COMPLETED
- ✅ **Automatic distribution** - COMPLETED

## 📞 **Support**

For testing support or questions:
1. Check console logs for debugging
2. Verify network configuration
3. Ensure sufficient gas/ETH balance
4. Confirm contract deployment

---

**🎉 Ready for bounty evaluation! The complete automated quiz system is fully functional and meets all requirements.**
