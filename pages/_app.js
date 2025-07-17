import "../styles/globals.css";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Local Hardhat network configuration
const localHardhat = {
  id: 31337,
  name: "Localhost",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: {
      name: "Local Explorer",
      url: "http://localhost:8545",
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [localHardhat],
  [publicProvider()]
);

// Create wallet connectors for localhost testing
const connectors = [
  new MetaMaskConnector({ chains }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: "Automated AI Quiz",
      appLogoUrl: "https://avatars.githubusercontent.com/u/37784886",
    },
  }),
  new InjectedConnector({
    chains,
    options: {
      name: "Injected Wallet",
      shimDisconnect: true,
    },
  }),
];

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} />
      </WagmiConfig>
    </QueryClientProvider>
  );
}
