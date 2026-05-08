import { useState } from "react";
import { motion } from "motion/react";
import { Home, Star, Volume2 } from "lucide-react";
import { ImagePlaceholder } from "../common/ImagePlaceholder";
import { FeedbackModal } from "../common/FeedbackModal";
import { soundActivityYoung, wordCompleteActivityOlder } from "../../data/activitiesData";
import { useSpeech } from "../../hooks/useSpeech";

interface Activity3Props {
  age: number;
  stars: number;
  onAwardStars: (amount: number) => void;
  onFinish: () => void;
  onExit: () => void;
}

export const Activity3= ({
  age,
  stars,
  onAwardStars,
  onFinish,
  onExit,
}: Activity3Props) => {
  const isYoungUser = age <= 6;
  const currentSounds = soundActivityYoung;
  const currentWordComplete = wordCompleteActivityOlder;
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { playWord } = useSpeech();

  const handleSoundSelect = (index: number) => {
    setSelectedOption(index);
    const currentActivity = currentSounds[currentActivityIndex];
    const isAnswerCorrect = currentActivity.options[index] === currentActivity.correctImage;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      onAwardStars(1);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect) {
        if (currentActivityIndex < currentSounds.length - 1) {
          setCurrentActivityIndex(currentActivityIndex + 1);
          setSelectedOption(null);
        } else {
          onFinish();
        }
      }
    }, 2000);
  };

  const handleLetterSelect = (letter: string) => {
    const currentActivity = currentWordComplete[currentActivityIndex];
    const isAnswerCorrect = letter === currentActivity.correctOption;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      onAwardStars(1);
      setTimeout(() => playWord(currentActivity.word), 500);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect) {
        if (currentActivityIndex < currentWordComplete.length - 1) {
          setCurrentActivityIndex(currentActivityIndex + 1);
        } else {
          onFinish();
        }
      }
    }, 2500);
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
        {isYoungUser ? (
          <>
            <h3 className="text-5xl font-bold text-gray-800 text-center mb-8">
              Encuentra el sonido
            </h3>

            <div className="flex justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => playWord(currentSounds[currentActivityIndex].sound)}
                className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full p-10 shadow-xl"
              >
                <Volume2 size={72} />
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
              {currentSounds[currentActivityIndex].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSoundSelect(index)}
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
                  <ImagePlaceholder type={option} />
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-5xl font-bold text-gray-800 text-center mb-8">
              Completa la palabra
            </h3>

            <div className="flex justify-center mb-8">
              <div className="w-64 h-64">
                <ImagePlaceholder type={currentWordComplete[currentActivityIndex].image} size="large" />
              </div>
            </div>

            <div className="text-center mb-12">
              <p className="text-7xl font-bold text-purple-600 tracking-wider">
                {currentWordComplete[currentActivityIndex].incomplete}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
              {currentWordComplete[currentActivityIndex].options.map((letter, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLetterSelect(letter)}
                  disabled={showFeedback}
                  className="aspect-square rounded-3xl bg-gradient-to-br from-blue-400 to-purple-400 text-white text-6xl font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {showFeedback && <FeedbackModal isCorrect={isCorrect} />}
    </motion.div>
  );
};