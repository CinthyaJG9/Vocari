import { useState } from "react";
import { motion } from "motion/react";
import { Home, Star, Volume2, Mic } from "lucide-react";
import { RealImage } from "../common/RealImage";  
import { FeedbackModal } from "../common/FeedbackModal";
import { wordsActivityYoung, wordsActivityOlder } from "../../data/activitiesData";
import { useSpeech } from "../../hooks/useSpeech";
interface Activity1Props {
  age: number;
  stars: number;
  onAwardStars: (amount: number) => void;
  onFinish: () => void;
  onExit: () => void;
}

export const Activity1 = ({
  age,
  stars,
  onAwardStars,
  onFinish,
  onExit,
}: Activity1Props) => {
  const isYoungUser = age <= 6;
  const currentWords = isYoungUser ? wordsActivityYoung : wordsActivityOlder;
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showMicAnimation, setShowMicAnimation] = useState(false);
  const { playWord } = useSpeech();

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    const currentActivity = currentWords[currentActivityIndex];
    const isAnswerCorrect = currentActivity.options[index] === currentActivity.correctImage;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      onAwardStars(1);
      setTimeout(() => {
        setShowMicAnimation(true);
        playWord(currentActivity.word);
      }, 800);
      setTimeout(() => setShowMicAnimation(false), 3000);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect) {
        if (currentActivityIndex < currentWords.length - 1) {
          setCurrentActivityIndex(currentActivityIndex + 1);
          setSelectedOption(null);
        } else {
          onFinish();
        }
      } else {
        setSelectedOption(null);
      }
    }, 3500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl w-full"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onExit}
          className="bg-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
        >
          <Home size={32} className="text-purple-600" />
          <span className="text-2xl font-semibold text-purple-600">Menú</span>
        </button>
        <div className="flex items-center gap-3 bg-white rounded-full px-6 py-4 shadow-lg">
          <Star className="text-yellow-500 fill-yellow-500" size={36} />
          <span className="text-3xl font-bold text-purple-600">{stars}</span>
        </div>
      </div>

      <motion.div
        key={currentActivityIndex}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-12 shadow-2xl"
      >
        <h3 className="text-5xl font-bold text-gray-800 text-center mb-8">
          Escucha y elige la imagen
        </h3>

        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => playWord(currentWords[currentActivityIndex].word)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-10 shadow-xl"
          >
            <Volume2 size={72} />
          </motion.button>
        </div>

        <div
          className={`grid gap-6 ${isYoungUser ? "grid-cols-3" : "grid-cols-4"} max-w-5xl mx-auto mb-8`}
        >
          {currentWords[currentActivityIndex].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOptionSelect(index)}
              disabled={showFeedback}
              className={`aspect-square rounded-3xl transition-all shadow-xl hover:shadow-2xl
                ${
                  selectedOption === index
                    ? isCorrect
                      ? "ring-8 ring-green-500"
                      : "ring-8 ring-red-500"
                    : ""
                }
              `}
            >
              <RealImage type={option} />
            </motion.button>
          ))}
        </div>

        {showMicAnimation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-3xl font-semibold text-purple-600">Ahora repite:</p>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="bg-gradient-to-r from-red-400 to-pink-400 rounded-full p-8"
            >
              <Mic size={64} className="text-white" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {showFeedback && <FeedbackModal isCorrect={isCorrect} />}
    </motion.div>
  );
};