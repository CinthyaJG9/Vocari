import { motion } from "motion/react";
import { Star } from "lucide-react";

interface RewardsScreenProps {
  starsEarned: number;
  totalStars: number;
  onBackToMenu: () => void;
}

export const RewardsScreen = ({ starsEarned, totalStars, onBackToMenu }: RewardsScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="text-center max-w-4xl w-full"
    >
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
          y: [0, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-8"
      >
        <Star className="text-yellow-400 fill-yellow-400 w-48 h-48 mx-auto drop-shadow-2xl" />
      </motion.div>

      <h2 className="text-7xl font-bold text-purple-600 mb-12">¡Excelente trabajo!</h2>

      <div className="bg-white rounded-3xl p-16 shadow-2xl mb-12">
        <p className="text-5xl font-bold text-green-600 mb-8">
          Ganaste +{starsEarned} {starsEarned === 1 ? "estrella" : "estrellas"}
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          {[...Array(Math.min(starsEarned, 5))].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Star className="text-yellow-500 fill-yellow-500 w-16 h-16" />
            </motion.div>
          ))}
        </div>

        <div className="h-px bg-gray-200 my-8"></div>

        <p className="text-3xl text-gray-600">
          Total acumulado:{" "}
          <span className="font-bold text-purple-600">{totalStars} estrellas</span>
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBackToMenu}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-20 py-8 text-4xl font-bold shadow-2xl"
      >
        Volver al Menú
      </motion.button>
    </motion.div>
  );
};