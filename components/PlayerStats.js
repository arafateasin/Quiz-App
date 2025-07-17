import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import icons to avoid hydration issues
const TrendingUp = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.TrendingUp })),
  { ssr: false }
);
const Target = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Target })),
  { ssr: false }
);
const Zap = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Zap })),
  { ssr: false }
);
const Award = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Award })),
  { ssr: false }
);
const BarChart3 = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.BarChart3 })),
  { ssr: false }
);
const Trophy = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Trophy })),
  { ssr: false }
);
const Flame = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Flame })),
  { ssr: false }
);
const Star = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Star })),
  { ssr: false }
);

export default function PlayerStats({ stats }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!stats) {
    return (
      <div className="glass-effect rounded-xl p-8">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No Stats Available
          </h2>
          <p className="text-gray-300">
            Start participating in quizzes to see your statistics!
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Questions",
      value: stats.totalQuestions,
      icon: BarChart3,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Correct Answers",
      value: stats.correctAnswers,
      icon: Target,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/30",
    },
    {
      title: "Accuracy",
      value: `${stats.accuracy}%`,
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      title: "Current Streak",
      value: stats.currentStreak,
      icon: Flame,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      borderColor: "border-orange-500/30",
    },
    {
      title: "Best Streak",
      value: stats.bestStreak,
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500/30",
    },
    {
      title: "Total Rewards",
      value: `${(stats.totalRewards / 1e18).toFixed(2)} QUIZ`,
      icon: Award,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
    },
  ];

  const getPerformanceLevel = (accuracy) => {
    if (accuracy >= 90) return { label: "Excellent", color: "text-green-400" };
    if (accuracy >= 70) return { label: "Good", color: "text-blue-400" };
    if (accuracy >= 50) return { label: "Average", color: "text-yellow-400" };
    return { label: "Needs Improvement", color: "text-red-400" };
  };

  const performance = getPerformanceLevel(stats.accuracy);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="glass-effect rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Statistics</h2>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className={`text-sm font-medium ${performance.color}`}>
              {performance.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-300">
                {stat.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="glass-effect rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">
          Performance Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accuracy Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Accuracy Rate</span>
              <span className="text-white font-semibold">
                {stats.accuracy}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${stats.accuracy}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="text-sm text-gray-400">
              {stats.correctAnswers} correct out of {stats.totalQuestions}{" "}
              questions
            </div>
          </div>

          {/* Streak Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Streak Progress</span>
              <span className="text-white font-semibold">
                {stats.currentStreak} / {stats.bestStreak}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ width: 0 }}
                animate={{
                  width:
                    stats.bestStreak > 0
                      ? `${(stats.currentStreak / stats.bestStreak) * 100}%`
                      : "0%",
                }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
            <div className="text-sm text-gray-400">
              {stats.currentStreak === stats.bestStreak &&
              stats.currentStreak > 0
                ? "At your best streak!"
                : `${
                    stats.bestStreak - stats.currentStreak
                  } away from your best`}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-effect rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-6">Achievements</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* First Answer Achievement */}
          <div
            className={`p-4 rounded-lg border ${
              stats.totalQuestions > 0
                ? "bg-green-500/20 border-green-500/30"
                : "bg-gray-500/20 border-gray-500/30"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Zap
                className={`w-6 h-6 ${
                  stats.totalQuestions > 0 ? "text-green-400" : "text-gray-400"
                }`}
              />
              <div>
                <div className="text-white font-medium">First Steps</div>
                <div className="text-sm text-gray-300">
                  Answer your first question
                </div>
              </div>
            </div>
          </div>

          {/* Streak Achievement */}
          <div
            className={`p-4 rounded-lg border ${
              stats.bestStreak >= 5
                ? "bg-orange-500/20 border-orange-500/30"
                : "bg-gray-500/20 border-gray-500/30"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Flame
                className={`w-6 h-6 ${
                  stats.bestStreak >= 5 ? "text-orange-400" : "text-gray-400"
                }`}
              />
              <div>
                <div className="text-white font-medium">On Fire</div>
                <div className="text-sm text-gray-300">
                  Get a 5-question streak
                </div>
              </div>
            </div>
          </div>

          {/* Accuracy Achievement */}
          <div
            className={`p-4 rounded-lg border ${
              stats.accuracy >= 80 && stats.totalQuestions >= 10
                ? "bg-purple-500/20 border-purple-500/30"
                : "bg-gray-500/20 border-gray-500/30"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Target
                className={`w-6 h-6 ${
                  stats.accuracy >= 80 && stats.totalQuestions >= 10
                    ? "text-purple-400"
                    : "text-gray-400"
                }`}
              />
              <div>
                <div className="text-white font-medium">Sharp Shooter</div>
                <div className="text-sm text-gray-300">
                  80%+ accuracy (10+ questions)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
