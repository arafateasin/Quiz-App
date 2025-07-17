#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

function log(message, color = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function executeCommand(command, description) {
  log(`\n${COLORS.BLUE}📋 ${description}${COLORS.RESET}`);
  try {
    execSync(command, { stdio: 'inherit' });
    log(`${COLORS.GREEN}✅ ${description} completed${COLORS.RESET}`);
  } catch (error) {
    log(`${COLORS.RED}❌ ${description} failed${COLORS.RESET}`);
    throw error;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`${COLORS.GREEN}✅ ${description} exists${COLORS.RESET}`);
    return true;
  } else {
    log(`${COLORS.YELLOW}⚠️ ${description} not found${COLORS.RESET}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const network = args[0] || 'local';

  log(`${COLORS.BOLD}🎯 Blockchain Quiz App Setup${COLORS.RESET}`);
  log(`${COLORS.BLUE}🌐 Network: ${network}${COLORS.RESET}\n`);

  // Check prerequisites
  log(`${COLORS.YELLOW}🔍 Checking prerequisites...${COLORS.RESET}`);
  
  checkFile('package.json', 'Package.json');
  checkFile('hardhat.config.js', 'Hardhat configuration');
  checkFile('contracts/AutomatedQuizApp.sol', 'Smart contract');

  // Install dependencies
  executeCommand('npm install', 'Installing dependencies');

  if (network === 'local') {
    log(`\n${COLORS.BOLD}🏠 Setting up LOCAL testing environment${COLORS.RESET}`);
    
    // Start local blockchain in background
    log(`${COLORS.BLUE}🔧 Starting local blockchain node...${COLORS.RESET}`);
    log(`${COLORS.YELLOW}⚠️ Please run 'npm run hardhat:node' in a separate terminal${COLORS.RESET}`);
    
    // Wait for user confirmation
    log(`${COLORS.BLUE}Press Enter when local node is running...${COLORS.RESET}`);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      
      // Deploy contracts
      executeCommand('npm run hardhat:deploy-local', 'Deploying contracts to local network');
      
      log(`\n${COLORS.GREEN}🎉 Local setup complete!${COLORS.RESET}`);
      log(`${COLORS.BLUE}📋 Next steps:${COLORS.RESET}`);
      log(`${COLORS.YELLOW}   1. npm run dev (start the app)${COLORS.RESET}`);
      log(`${COLORS.YELLOW}   2. npm run automation-keeper (optional)${COLORS.RESET}`);
      log(`${COLORS.YELLOW}   3. Open http://localhost:3004${COLORS.RESET}`);
      log(`${COLORS.YELLOW}   4. Connect MetaMask to localhost:8545${COLORS.RESET}`);
    });
    
  } else if (network === 'zksync') {
    log(`\n${COLORS.BOLD}🌐 Setting up zkSync Sepolia testnet${COLORS.RESET}`);
    
    // Check environment variables
    const envPath = path.join(__dirname, '.env');
    if (!checkFile(envPath, 'Environment file (.env)')) {
      log(`${COLORS.RED}❌ Please create .env file with:${COLORS.RESET}`);
      log(`${COLORS.YELLOW}   PRIVATE_KEY=your_private_key_here${COLORS.RESET}`);
      log(`${COLORS.YELLOW}   INFURA_API_KEY=your_infura_key_here${COLORS.RESET}`);
      process.exit(1);
    }
    
    // Deploy to zkSync Sepolia
    executeCommand('npm run hardhat:deploy --network zkSyncSepolia', 'Deploying to zkSync Sepolia');
    
    log(`\n${COLORS.GREEN}🎉 zkSync Sepolia setup complete!${COLORS.RESET}`);
    log(`${COLORS.BLUE}📋 Next steps:${COLORS.RESET}`);
    log(`${COLORS.YELLOW}   1. npm run dev (start the app)${COLORS.RESET}`);
    log(`${COLORS.YELLOW}   2. Add zkSync Sepolia to MetaMask${COLORS.RESET}`);
    log(`${COLORS.YELLOW}   3. Get test ETH from zkSync faucet${COLORS.RESET}`);
    log(`${COLORS.YELLOW}   4. Open http://localhost:3004${COLORS.RESET}`);
    
  } else {
    log(`${COLORS.RED}❌ Invalid network. Use 'local' or 'zksync'${COLORS.RESET}`);
    log(`${COLORS.YELLOW}📋 Usage:${COLORS.RESET}`);
    log(`${COLORS.YELLOW}   node setup.js local   # Local testing${COLORS.RESET}`);
    log(`${COLORS.YELLOW}   node setup.js zksync  # zkSync Sepolia${COLORS.RESET}`);
    process.exit(1);
  }
}

main().catch((error) => {
  log(`${COLORS.RED}❌ Setup failed: ${error.message}${COLORS.RESET}`);
  process.exit(1);
});
