const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("📋 Extracting ABI from compiled contracts...");

  // Get the contract factory to extract ABI
  const AutomatedQuizApp = await ethers.getContractFactory("AutomatedQuizApp");
  const abi = AutomatedQuizApp.interface.fragments
    .map((fragment) => fragment.format("json"))
    .map(JSON.parse);

  console.log("✅ ABI extracted successfully!");
  console.log(`📊 Total functions: ${abi.length}`);

  // Generate the constants file
  const contractConstants = `// Auto-generated contract configuration
export const CONTRACT_ADDRESS = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'
export const TOKEN_ADDRESS = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'

export const ABI = ${JSON.stringify(abi, null, 2)}
`;

  // Write to file
  fs.writeFileSync("./constants/contract.js", contractConstants);
  console.log("✅ Updated constants/contract.js with complete ABI");

  // Also save just the ABI for reference
  fs.writeFileSync("./abi.json", JSON.stringify(abi, null, 2));
  console.log("✅ Saved ABI to abi.json");

  // Test the specific function
  const contract = AutomatedQuizApp.attach(
    "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82"
  );
  const autoMode = await contract.isAutoModeEnabled();
  console.log(`🤖 Auto mode test: ${autoMode}`);

  console.log("🎯 ABI update completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
