import { useState } from "react";

export default function NetworkSwitcher() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addHardhatNetwork = async () => {
    if (!window.ethereum) {
      setMessage("❌ MetaMask not found");
      return;
    }

    setIsLoading(true);
    setMessage("🔄 Adding Hardhat network...");

    try {
      // First, try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7a69" }], // 31337 in hex
      });
      setMessage("✅ Successfully switched to Hardhat network!");
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7a69", // 31337 in hex
                chainName: "Hardhat Local",
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["http://localhost:8545"],
                blockExplorerUrls: null,
              },
            ],
          });
          setMessage("✅ Successfully added and switched to Hardhat network!");
        } catch (addError) {
          if (addError.code === 4001) {
            setMessage("❌ User rejected the request");
          } else {
            setMessage(`❌ Failed to add network: ${addError.message}`);
          }
        }
      } else if (switchError.code === 4001) {
        setMessage("❌ User rejected the request");
      } else {
        setMessage(`❌ Failed to switch network: ${switchError.message}`);
      }
    }

    setIsLoading(false);
  };

  const importHardhatAccount = async () => {
    const privateKey =
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

    setMessage(`💡 To import Hardhat account:
1. Click the MetaMask extension
2. Click your account icon (top right)
3. Select "Import Account"
4. Choose "Private Key"
5. Paste this key: ${privateKey}
6. Click "Import"`);
  };

  const addNetworkManually = () => {
    setMessage(`🔧 Add network manually in MetaMask:
1. Open MetaMask
2. Click network dropdown (top left)
3. Click "Add network"
4. Click "Add a network manually"
5. Enter these details:
   - Network Name: Hardhat Local
   - New RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
6. Click "Save"
7. Switch to the new network`);
  };

  return (
    <div className="bg-blue-900 border border-blue-700 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-bold text-white mb-4">🔧 Network Setup</h3>

      <div className="space-y-3">
        <button
          onClick={addHardhatNetwork}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "🔗 Add & Switch to Hardhat Network"}
        </button>

        <button
          onClick={addNetworkManually}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          🔧 Manual Network Setup Instructions
        </button>

        <button
          onClick={importHardhatAccount}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          📋 Show Account Import Instructions
        </button>
      </div>

      {message && (
        <div className="mt-4 p-3 bg-gray-800 rounded text-sm text-white whitespace-pre-wrap">
          {message}
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-800 rounded">
        <h4 className="text-white font-medium mb-2">📝 Manual Setup:</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>
            <strong>Network Name:</strong> Hardhat Local
          </p>
          <p>
            <strong>RPC URL:</strong> http://localhost:8545
          </p>
          <p>
            <strong>Chain ID:</strong> 31337
          </p>
          <p>
            <strong>Currency:</strong> ETH
          </p>
        </div>
      </div>
    </div>
  );
}
