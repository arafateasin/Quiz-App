import { useState, useEffect } from "react";
import Head from "next/head";
import { useAccount, useContractRead } from "wagmi";
import SimpleConnectButton from "../components/SimpleConnectButton";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import icons to avoid hydration issues
const Trophy = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Trophy })),
  { ssr: false }
);
const Zap = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Zap })),
  { ssr: false }
);
const Users = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Users })),
  { ssr: false }
);
const Bot = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Bot })),
  { ssr: false }
);
const Award = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Award })),
  { ssr: false }
);

import AutomatedQuizCard from "../components/AutomatedQuizCard";
import Leaderboard from "../components/Leaderboard";
import PlayerStats from "../components/PlayerStats";
import { CONTRACT_ADDRESS, ABI } from "../constants/contract";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [playerStats, setPlayerStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState("quiz");
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Read player stats
  const { data: stats } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getPlayerStats",
    args: [address],
    enabled: !!address && mounted,
    watch: true,
  });

  // Read leaderboard
  const { data: leaderboardData } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getLeaderboard",
    enabled: mounted,
    watch: true,
  });

  // Check if auto mode is enabled
  const { data: autoMode } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "isAutoModeEnabled",
    enabled: mounted,
    watch: true,
  });

  // Effect to handle stats updates
  useEffect(() => {
    if (stats) {
      setPlayerStats({
        totalQuestions: Number(stats.totalQuestions || 0),
        correctAnswers: Number(stats.correctAnswers || 0),
        totalRewards: Number(stats.totalRewards || 0),
        currentStreak: Number(stats.currentStreak || 0),
        bestStreak: Number(stats.bestStreak || 0),
        accuracy:
          Number(stats.totalQuestions || 0) > 0
            ? (Number(stats.correctAnswers || 0) /
                Number(stats.totalQuestions || 0)) *
              100
            : 0,
      });
    }
  }, [stats]);

  // Effect to handle leaderboard updates
  useEffect(() => {
    if (leaderboardData) {
      setLeaderboard(leaderboardData.slice(0, 10));
    }
  }, [leaderboardData]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Head>
        <title>🤖 Automated AI Quiz App - Blockchain Quiz Game</title>
        <meta
          name="description"
          content="Automated blockchain quiz game with 30-second questions, smart contract rewards, and real-time leaderboard"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-blue-400" />
                <h1 className="text-4xl font-bold text-white">
                  Automated AI Quiz
                </h1>
              </div>
              <SimpleConnectButton />
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>Automated Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>30 Second Rounds</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>10 Tokens/Win</span>
              </div>
            </div>
          </motion.div>

          {/* Status Bar */}
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-gray-400 text-sm">Network</div>
              <div className="text-white font-medium">Ethereum</div>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-gray-400 text-sm">Wallet</div>
              <div className="text-white font-medium">
                {isConnected
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : "Not Connected"}
              </div>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-gray-400 text-sm">Auto Mode</div>
              <div
                className={`font-medium ${
                  autoMode ? "text-green-400" : "text-red-400"
                }`}
              >
                {autoMode ? "🟢 Active" : "🔴 Inactive"}
              </div>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <div className="text-gray-400 text-sm">Your Tokens</div>
              <div className="text-white font-medium">
                {playerStats?.totalRewards || 0}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <nav className="flex bg-gray-800 p-1 rounded-lg">
            {[
              { id: "quiz", label: "Quiz", icon: Bot },
              { id: "leaderboard", label: "Leaderboard", icon: Trophy },
              { id: "stats", label: "Stats", icon: Award },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all ${
                  activeTab === id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "quiz" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AutomatedQuizCard
                  address={address}
                  isConnected={isConnected}
                />
              </motion.div>
            )}

            {activeTab === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Leaderboard leaderboard={leaderboard} />
              </motion.div>
            )}

            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PlayerStats stats={playerStats} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 mt-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="w-5 h-5" />
            <span>Automated Blockchain Quiz System</span>
          </div>
          <p className="text-sm">
            🎯 New questions every 30 seconds • 💰 10 tokens per correct answer
            • 🏆 Real-time leaderboard
          </p>
        </footer>
      </main>
    </div>
  );
}
