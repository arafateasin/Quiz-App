import "../styles/globals.css";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// zkSync Sepolia Testnet configuration
const zkSyncSepolia = {
  id: 300,
  name: "zkSync Sepolia Testnet",
  network: "zksync-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.era.zksync.dev"],
    },
    public: {
      http: ["https://sepolia.era.zksync.dev"],
    },
  },
  blockExplorers: {
    default: {
      name: "zkSync Sepolia Explorer",
      url: "https://sepolia.explorer.zksync.io",
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [zkSyncSepolia],
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
