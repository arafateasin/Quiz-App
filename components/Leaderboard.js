import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import icons to avoid hydration issues
const Trophy = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Trophy })),
  { ssr: false }
);
const Medal = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Medal })),
  { ssr: false }
);
const Award = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Award })),
  { ssr: false }
);
const Crown = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Crown })),
  { ssr: false }
);

export default function Leaderboard({ data, currentUser }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRankIcon = (rank) => {
    if (!mounted) return null;

    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-500" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatRewards = (rewards) => {
    return (rewards / 1e18).toFixed(2);
  };

  if (!data || data.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-8">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No Players Yet
          </h2>
          <p className="text-gray-300">
            Be the first to participate and climb the leaderboard!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        <div className="flex items-center space-x-2 text-gray-300">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium">Top Performers</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((player, index) => (
          <motion.div
            key={player.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-lg ${
              player.address === currentUser
                ? "bg-primary-500/20 border-2 border-primary-400"
                : "bg-white/5 border border-white/10"
            } hover:bg-white/10 transition-all duration-200`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(
                        player.rank
                      )}`}
                    >
                      <span className="text-white font-bold text-lg">
                        {player.rank}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1">
                      {getRankIcon(player.rank)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">
                        {formatAddress(player.address)}
                      </span>
                      {player.address === currentUser && (
                        <span className="px-2 py-1 text-xs bg-primary-500 text-white rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      Score: {player.score.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-semibold">
                    {formatRewards(player.rewards)} QUIZ
                  </div>
                  <div className="text-sm text-gray-300">Total Rewards</div>
                </div>
              </div>

              {/* Rank indicator bar */}
              <div className="mt-4">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getRankColor(player.rank)}`}
                    style={{
                      width: `${Math.min(
                        (player.score / (data[0]?.score || 1)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Special effects for top 3 */}
            {player.rank <= 3 && (
              <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
                <div
                  className={`w-full h-full rounded-bl-full ${getRankColor(
                    player.rank
                  )}`}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{data.length}</div>
            <div className="text-sm text-gray-300">Total Players</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {data
                .reduce((sum, player) => sum + player.score, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Total Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {formatRewards(
                data.reduce((sum, player) => sum + player.rewards, 0)
              )}
            </div>
            <div className="text-sm text-gray-300">Total Rewards</div>
          </div>
        </div>
      </div>
    </div>
  );
}
