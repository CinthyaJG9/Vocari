import { motion } from "motion/react";

interface FeedbackModalProps {
  isCorrect: boolean;
}

export const FeedbackModal = ({ isCorrect }: FeedbackModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className={`${
          isCorrect ? "bg-green-400" : "bg-orange-400"
        } rounded-3xl p-16 shadow-2xl`}
      >
        <p className="text-7xl font-bold text-white text-center">
          {isCorrect ? "¡Muy bien!" : "¡Intenta otra vez!"}
        </p>
      </motion.div>
    </motion.div>
  );
};