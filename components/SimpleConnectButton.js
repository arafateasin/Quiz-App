import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect, useRef } from "react";

export default function SimpleConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showWallets, setShowWallets] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowWallets(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-white/80 text-sm">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowWallets(!showWallets)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Connect Wallet
      </button>

      {showWallets && (
        <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg min-w-[200px] z-50">
          <div className="p-2">
            <div className="text-white/80 text-sm font-medium mb-2 px-2">
              Choose Wallet
            </div>
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                  setShowWallets(false);
                }}
                className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded-md transition-colors flex items-center gap-2"
              >
                <span className="text-lg">
                  {connector.name === "MetaMask" && "🦊"}
                  {connector.name === "Coinbase Wallet" && "🔵"}
                  {connector.name === "Injected Wallet" && "💼"}
                </span>
                {connector.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
