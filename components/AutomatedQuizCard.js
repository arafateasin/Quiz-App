import { useState, useEffect } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import icons
const Clock = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Clock })),
  { ssr: false }
);
const Zap = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Zap })),
  { ssr: false }
);
const CheckCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.CheckCircle })),
  { ssr: false }
);
const XCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.XCircle })),
  { ssr: false }
);
const Trophy = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Trophy })),
  { ssr: false }
);
const Send = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Send })),
  { ssr: false }
);
const Play = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Play })),
  { ssr: false }
);
const Square = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Square })),
  { ssr: false }
);

import { CONTRACT_ADDRESS, ABI } from "../constants/contract";

export default function AutomatedQuizCard({ address, isConnected }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current question
  const { data: questionData, refetch: refetchQuestion } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getCurrentQuestion",
    watch: true,
    enabled: mounted,
  });

  // Check if user has answered current question
  const { data: userAnswer } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "userAnswers",
    args: [currentQuestionId, address],
    enabled: mounted && isConnected && currentQuestionId !== null,
    watch: true,
  });

  // Check auto mode status
  const { data: autoMode } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "isAutoModeEnabled",
    enabled: mounted,
    watch: true,
  });

  // Get time until next question
  const { data: timeUntilNext } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getTimeUntilNextQuestion",
    enabled: mounted && autoMode,
    watch: true,
  });

  // Prepare submit answer transaction
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "submitAnswer",
    args: [currentQuestionId, selectedAnswer],
    enabled: selectedAnswer !== null && !hasSubmitted && isConnected,
  });

  const { write: submitAnswer, isLoading: isSubmitting } =
    useContractWrite(config);

  // Prepare claim reward transaction
  const { config: claimConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "claimReward",
    args: [currentQuestionId],
    enabled: canClaimReward && isConnected,
  });

  const { write: claimReward, isLoading: isClaiming } =
    useContractWrite(claimConfig);

  // Prepare toggle auto mode transaction
  const { config: toggleAutoConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "toggleAutoMode",
    enabled: isConnected,
  });

  const { write: toggleAutoMode, isLoading: isToggling } =
    useContractWrite(toggleAutoConfig);

  // Prepare check and create next question transaction
  const { config: createQuestionConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "checkAndCreateNextQuestion",
    enabled: isConnected,
  });

  const { write: createNextQuestion, isLoading: isCreating } =
    useContractWrite(createQuestionConfig);

  // Parse question data
  const question = questionData
    ? {
        id: questionData[0],
        text: questionData[1],
        options: questionData[2],
        startTime: questionData[3],
        endTime: questionData[4],
        isActive: questionData[5],
        isRevealed: questionData[6],
        totalParticipants: questionData[7],
      }
    : null;

  // Update countdown timer
  useEffect(() => {
    if (!question || !question.isActive) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Number(question.endTime) - now;
      setTimeLeft(Math.max(0, remaining));
    }, 1000);

    return () => clearInterval(timer);
  }, [question]);

  // Update current question ID
  useEffect(() => {
    if (question) {
      setCurrentQuestionId(Number(question.id));
    }
  }, [question]);

  // Check if user has submitted answer
  useEffect(() => {
    if (userAnswer && userAnswer[1]) {
      // hasAnswered
      setHasSubmitted(true);
      setSelectedAnswer(Number(userAnswer[0])); // answerIndex
    } else {
      setHasSubmitted(false);
      setSelectedAnswer(null);
    }
  }, [userAnswer]);

  // Check if question is revealed and user can claim reward
  useEffect(() => {
    if (question && question.isRevealed && hasSubmitted) {
      setShowResult(true);
      // Check if user answered correctly
      if (userAnswer && !userAnswer[2]) {
        // not yet claimed
        setCanClaimReward(true);
      }
    } else {
      setShowResult(false);
      setCanClaimReward(false);
    }
  }, [question, hasSubmitted, userAnswer]);

  // Handle answer selection
  const handleAnswerSelect = (index) => {
    if (hasSubmitted || !question?.isActive || timeLeft <= 0) return;
    setSelectedAnswer(index);
  };

  // Handle answer submission
  const handleSubmit = () => {
    if (selectedAnswer !== null && !hasSubmitted && submitAnswer) {
      submitAnswer();
    }
  };

  // Handle reward claim
  const handleClaimReward = () => {
    if (canClaimReward && claimReward) {
      claimReward();
    }
  };

  // Handle start automation
  const handleStartAutomation = async () => {
    console.log("🚀 Start automation clicked");
    console.log("Auto mode:", autoMode);
    console.log("Toggle function:", toggleAutoMode);
    console.log("Create function:", createNextQuestion);
    console.log("Is connected:", isConnected);

    if (toggleAutoMode) {
      try {
        console.log("💡 Calling toggleAutoMode...");
        // Only toggle if auto mode is currently disabled
        if (!autoMode) {
          await toggleAutoMode();
          console.log("✅ toggleAutoMode called successfully");
        } else {
          console.log("⚠️ Auto mode already enabled, skipping toggle");
        }
        // After enabling auto mode, create first question
        setTimeout(() => {
          console.log("⏰ Attempting to create first question...");
          if (createNextQuestion) {
            console.log("📝 Calling createNextQuestion...");
            createNextQuestion();
          } else {
            console.log("❌ createNextQuestion is not available");
          }
        }, 2000); // Wait 2 seconds for auto mode to be enabled
      } catch (error) {
        console.error("❌ Error starting automation:", error);
      }
    } else {
      console.log("❌ toggleAutoMode is not available");
    }
  };

  // Handle stop automation
  const handleStopAutomation = () => {
    if (toggleAutoMode && autoMode) {
      // Only toggle if auto mode is currently enabled
      toggleAutoMode();
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!mounted) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!autoMode) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
        <div className="mb-6">
          <Play className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">
            🤖 Automated Quiz System
          </h3>
          <p className="text-gray-400 mb-6">
            Ready to start the automated quiz! Click the button below to begin.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartAutomation}
          disabled={!isConnected || isToggling || isCreating}
          className={`px-8 py-4 rounded-lg font-medium transition-all ${
            isConnected
              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isToggling || isCreating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Starting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start Automated Quiz
            </div>
          )}
        </motion.button>

        {!isConnected && (
          <p className="text-sm text-gray-500 mt-4">
            Please connect your wallet first to start the quiz
          </p>
        )}

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-medium mb-2">
            📋 What happens when you start:
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• 🤖 Automated mode will be enabled</li>
            <li>• 📝 First question will be created immediately</li>
            <li>• ⏰ New questions every 30 seconds</li>
            <li>• 💰 Earn 10 tokens per correct answer</li>
            <li>• 🏆 Compete on the live leaderboard</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!question || !question.isActive) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
        <div className="mb-4">
          <Clock className="w-12 h-12 text-blue-400 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-white mb-2">
            ⏰ Waiting for Next Question
          </h3>
          <p className="text-gray-400">
            {timeUntilNext
              ? `Next question in ${formatTime(Number(timeUntilNext))}`
              : "Preparing next question..."}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Questions appear automatically every 30 seconds
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-700 rounded-xl p-6"
    >
      {/* Question Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            Question #{Number(question.id) + 1}
          </h3>
          <p className="text-gray-400 text-sm">
            {Number(question.totalParticipants)} participants
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div
              className={`text-2xl font-bold ${
                timeLeft <= 10 ? "text-red-400" : "text-blue-400"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500">Time Left</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStopAutomation}
            disabled={!isConnected || isToggling}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            {isToggling ? (
              <div className="flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                <span>Stopping...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Square className="w-3 h-3" />
                <span>Stop</span>
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <p className="text-white text-lg font-medium">{question.text}</p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(index)}
            disabled={hasSubmitted || timeLeft <= 0}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? "border-blue-500 bg-blue-500/20 text-blue-400"
                : "border-gray-600 bg-gray-800 text-white hover:border-gray-500"
            } ${
              hasSubmitted || timeLeft <= 0
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {selectedAnswer === index && (
                <CheckCircle className="w-5 h-5 text-blue-400" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!hasSubmitted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isSubmitting || timeLeft <= 0}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              selectedAnswer !== null && timeLeft > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Submitting...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Submit Answer
              </div>
            )}
          </motion.button>
        )}

        {hasSubmitted && !showResult && (
          <div className="flex-1 py-3 px-4 rounded-lg bg-green-600/20 text-green-400 text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Answer Submitted!
            </div>
          </div>
        )}

        {showResult && canClaimReward && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClaimReward}
            disabled={isClaiming}
            className="flex-1 py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all"
          >
            {isClaiming ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Claiming...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" />
                Claim 10 Tokens
              </div>
            )}
          </motion.button>
        )}
      </div>

      {/* Result Display */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {userAnswer && userAnswer[0] === question.correctAnswerIndex ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="text-white font-medium">
                {userAnswer && userAnswer[0] === question.correctAnswerIndex
                  ? "Correct!"
                  : "Incorrect"}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Correct: {question.options[question.correctAnswerIndex]}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
