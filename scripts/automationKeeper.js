const hre = require("hardhat");
const { CONTRACT_ADDRESS, ABI } = require("../constants/contract");

// Automation keeper to maintain continuous quiz operation
class QuizAutomationKeeper {
    constructor(provider, contractAddress, abi) {
        this.provider = provider;
        this.contract = new hre.ethers.Contract(contractAddress, abi, provider);
        this.isRunning = false;
        this.intervalId = null;
        this.checkInterval = 5000; // Check every 5 seconds
    }

    async start() {
        console.log("🤖 Starting Quiz Automation Keeper...");
        this.isRunning = true;
        
        // Initial check
        await this.checkAndTrigger();
        
        // Set up interval for continuous monitoring
        this.intervalId = setInterval(async () => {
            if (this.isRunning) {
                await this.checkAndTrigger();
            }
        }, this.checkInterval);
        
        console.log("✅ Quiz Automation Keeper started!");
    }

    async stop() {
        console.log("🛑 Stopping Quiz Automation Keeper...");
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        console.log("✅ Quiz Automation Keeper stopped!");
    }

    async checkAndTrigger() {
        try {
            // Check if contract is deployed by testing a simple call
            const code = await this.provider.getCode(CONTRACT_ADDRESS);
            if (code === "0x") {
                console.log("⚠️ Contract not deployed yet at", CONTRACT_ADDRESS);
                return;
            }

            // Check if auto mode is enabled
            const autoMode = await this.contract.isAutoModeEnabled();
            if (!autoMode) {
                console.log("⏸️  Auto mode is disabled, waiting...");
                return;
            }

            // Get current question info
            const questionData = await this.contract.getCurrentQuestion();
            const [questionId, question, options, startTime, endTime, isActive, isRevealed] = questionData;

            const currentTime = Math.floor(Date.now() / 1000);
            
            // Check if we need to reveal current question
            if (isActive && !isRevealed && currentTime > endTime) {
                console.log(`🔍 Revealing question ${questionId}...`);
                await this.triggerAutomation();
                return;
            }

            // Check if we need to create next question
            const timeUntilNext = await this.contract.getTimeUntilNextQuestion();
            if (timeUntilNext.toNumber() === 0) {
                console.log("📝 Creating next question...");
                await this.triggerAutomation();
                return;
            }

            // Log status
            if (isActive) {
                const timeLeft = endTime - currentTime;
                console.log(`⏰ Current question ${questionId} - Time left: ${timeLeft}s`);
            } else {
                console.log(`⏳ Next question in: ${timeUntilNext.toNumber()}s`);
            }

        } catch (error) {
            if (error.message.includes("could not decode result data")) {
                console.log("⚠️ Contract not deployed or not accessible at", CONTRACT_ADDRESS);
            } else {
                console.error("❌ Error in automation keeper:", error.message);
            }
        }
    }

    async triggerAutomation() {
        try {
            // Call the autoTrigger function
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
            const contractWithSigner = this.contract.connect(wallet);
            
            const tx = await contractWithSigner.autoTrigger();
            console.log("🚀 Auto trigger transaction sent:", tx.hash);
            
            const receipt = await tx.wait();
            console.log("✅ Auto trigger confirmed in block:", receipt.blockNumber);
            
        } catch (error) {
            console.error("❌ Error triggering automation:", error.message);
        }
    }
}

// Run the automation keeper
async function main() {
    try {
        // Setup provider
        const provider = new hre.ethers.JsonRpcProvider(
            process.env.RPC_URL || "http://127.0.0.1:8545"
        );

        // Create automation keeper
        const keeper = new QuizAutomationKeeper(provider, CONTRACT_ADDRESS, ABI);
        
        // Start the keeper
        await keeper.start();
        
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log("\n🛑 Received SIGINT, shutting down gracefully...");
            await keeper.stop();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
            await keeper.stop();
            process.exit(0);
        });

        // Keep the process running
        console.log("🎯 Quiz Automation Keeper is running...");
        console.log("📋 Press Ctrl+C to stop");
        
    } catch (error) {
        console.error("❌ Failed to start automation keeper:", error);
        process.exit(1);
    }
}

// Export for use in other scripts
module.exports = { QuizAutomationKeeper };

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}
