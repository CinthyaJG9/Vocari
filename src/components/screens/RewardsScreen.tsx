import { motion } from "motion/react";
import { Star, Home } from "lucide-react";

interface RewardsScreenProps {
  starsEarned: number;
  totalStars: number;
  onBackToMenu: () => void;
}

export const RewardsScreen = ({ starsEarned, totalStars, onBackToMenu }: RewardsScreenProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-center"
        >
          {/* Animación de estrella */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 5, -5, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1, repeat: 2 }}
            className="mb-4"
          >
            <Star className="text-yellow-400 fill-yellow-400 w-20 h-20 md:w-24 md:h-24 mx-auto drop-shadow-2xl" />
          </motion.div>

          <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-3">
            ¡Excelente trabajo!
          </h2>

          {/* Estrellas ganadas */}
          <div className="bg-green-50 rounded-2xl p-4 mb-4">
            <p className="text-green-600 font-bold text-lg md:text-xl">
              Ganaste +{starsEarned} {starsEarned === 1 ? "estrella" : "estrellas"}
            </p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(Math.min(starsEarned, 5))].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="text-yellow-500 fill-yellow-500 w-6 h-6" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Total acumulado */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-6">
            <p className="text-purple-600 font-medium text-base md:text-lg">
              Total acumulado:{" "}
              <span className="font-bold text-purple-700 text-xl md:text-2xl">
                {totalStars}
              </span>{" "}
              estrellas
            </p>
          </div>

          {/* Botón volver */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToMenu}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-8 md:px-10 py-3 md:py-4 text-lg md:text-xl font-bold shadow-xl flex items-center justify-center gap-2 mx-auto w-full md:w-auto"
          >
            <Home size={20} />
            Volver al Menú
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};