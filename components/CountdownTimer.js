import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import icons to avoid hydration issues
const Clock = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Clock })),
  { ssr: false }
);
const AlertCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.AlertCircle })),
  { ssr: false }
);

export default function CountdownTimer({ timeLeft }) {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  const [isUrgent, setIsUrgent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setDisplayTime(timeLeft);
    setIsUrgent(timeLeft <= 10 && timeLeft > 0);
  }, [timeLeft]);

  useEffect(() => {
    if (displayTime <= 0) return;

    const timer = setInterval(() => {
      setDisplayTime((prev) => {
        const newTime = Math.max(0, prev - 1);
        setIsUrgent(newTime <= 10 && newTime > 0);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [displayTime]);

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;

  const circumference = 2 * Math.PI * 45; // radius = 45
  const progress = displayTime > 0 ? (displayTime / 30) * circumference : 0;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isUrgent ? "#ef4444" : "#3b82f6"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className={`transition-all duration-1000 ease-linear ${
              isUrgent ? "animate-pulse" : ""
            }`}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className={`text-2xl font-bold transition-colors duration-300 ${
                isUrgent ? "text-red-400" : "text-white"
              }`}
            >
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
            <div className="text-xs text-gray-400">remaining</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        {displayTime > 0 ? (
          <div
            className={`flex items-center space-x-2 ${
              isUrgent ? "text-red-400" : "text-gray-300"
            }`}
          >
            {isUrgent ? (
              <AlertCircle className="w-4 h-4 animate-pulse" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isUrgent ? "Hurry up!" : "Time to answer"}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Time&apos;s up!</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full transition-colors duration-300 ${
            isUrgent ? "bg-red-500" : "bg-primary-500"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${(displayTime / 30) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
