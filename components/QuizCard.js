import { useState, useEffect } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { CONTRACT_ADDRESS, ABI } from "../constants/contract";

// Dynamically import icons to avoid hydration issues
const CheckCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.CheckCircle })),
  { ssr: false }
);
const XCircle = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.XCircle })),
  { ssr: false }
);
const Clock = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Clock })),
  { ssr: false }
);
const Send = dynamic(
  () => import("lucide-react").then((mod) => ({ default: mod.Send })),
  { ssr: false }
);

export default function QuizCard({ question, userAddress, onAnswerSubmit }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [userAnswer, setUserAnswer] = useState(null);

  // Check if user has already answered
  const { data: userAnswerData } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "getUserAnswer",
    args: [question?.id, userAddress],
    enabled: !!question?.id && !!userAddress,
    watch: true,
  });

  // Prepare contract write for submitting answer
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "submitAnswer",
    args: [question?.id, selectedAnswer],
    enabled: !!question?.id && selectedAnswer !== null && !hasAnswered,
  });

  const { write: submitAnswer, isLoading: isSubmitting } = useContractWrite({
    ...config,
    onSuccess: () => {
      setHasAnswered(true);
      if (onAnswerSubmit) onAnswerSubmit();
    },
  });

  useEffect(() => {
    if (userAnswerData) {
      const [answerIndex, hasAnswered, isCorrect] = userAnswerData;
      setHasAnswered(hasAnswered);
      if (hasAnswered) {
        setUserAnswer({
          answerIndex: Number(answerIndex),
          isCorrect,
        });
      }
    }
  }, [userAnswerData]);

  // Reset state when question changes
  useEffect(() => {
    if (question?.id !== undefined) {
      setSelectedAnswer(null);
      setShowResult(false);
      setHasAnswered(false);
      setUserAnswer(null);
    }
  }, [question?.id]);

  // Show results when question expires
  useEffect(() => {
    if (question && !question.isActive && hasAnswered) {
      setShowResult(true);
    }
  }, [question, hasAnswered]);

  const handleAnswerSelect = (index) => {
    if (!hasAnswered && question?.isActive) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null && !hasAnswered && submitAnswer) {
      submitAnswer();
    }
  };

  if (!question) {
    return (
      <div className="glass-effect rounded-xl p-8">
        <div className="text-center">
          <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            No Active Question
          </h2>
          <p className="text-gray-300">
            Waiting for the next question to be created...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-8"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Question #{question.id.toString()}
          </h2>
          <div className="flex items-center space-x-2">
            {question.isActive ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                Expired
              </span>
            )}
          </div>
        </div>
        <p className="text-lg text-white leading-relaxed">
          {question.question}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isUserAnswer = userAnswer?.answerIndex === index;
            const showCorrect =
              showResult && userAnswer?.isCorrect && isUserAnswer;
            const showIncorrect =
              showResult && !userAnswer?.isCorrect && isUserAnswer;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswerSelect(index)}
                disabled={hasAnswered || !question.isActive}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-primary-500 text-white border-2 border-primary-400"
                    : hasAnswered || !question.isActive
                    ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                    : "bg-white/10 text-white hover:bg-white/20 border-2 border-transparent hover:border-white/20"
                } ${
                  showCorrect
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : showIncorrect
                    ? "bg-red-500/20 border-red-500 text-red-400"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showCorrect && <CheckCircle className="w-5 h-5" />}
                  {showIncorrect && <XCircle className="w-5 h-5" />}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        {!hasAnswered && question.isActive && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null || isSubmitting}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              selectedAnswer !== null && !isSubmitting
                ? "bg-primary-500 text-white hover:bg-primary-600 neon-glow"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Answer</span>
              </>
            )}
          </motion.button>
        )}

        {hasAnswered && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Answer Submitted</span>
            </div>
            {!question.isActive && (
              <p className="text-sm text-gray-300 mt-2">
                {showResult
                  ? userAnswer?.isCorrect
                    ? "Correct! You earned 10 QUIZ tokens 🎉"
                    : "Incorrect answer. Better luck next time!"
                  : "Waiting for results..."}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Question Status */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Question ID: {question.id.toString()}</span>
          <span>
            {question.isActive
              ? `${Math.floor(question.timeLeft / 60)}:${(
                  question.timeLeft % 60
                )
                  .toString()
                  .padStart(2, "0")} remaining`
              : "Question expired"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
