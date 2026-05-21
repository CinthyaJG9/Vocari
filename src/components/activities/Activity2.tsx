import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Home, Star, Mic } from "lucide-react";
import { ImagePlaceholder } from "../common/ImagePlaceholder";
import { FeedbackModal } from "../common/FeedbackModal";
import { sentencesActivityYoung, sentencesActivityOlder } from "../../data/activitiesData";
import { evaluateSpeech } from "../../services/dynamicWordService";
import { getWordByAge } from "../../services/dynamicWordService";
import { getRealImage } from "../../services/dynamicWordService";

interface Activity2Props {
  age: number;
  stars: number;
  onAwardStars: (amount: number) => void;
  onFinish: () => void;
  onExit: () => void;
}

export const Activity2 = ({
  age,
  stars,
  onAwardStars,
  onFinish,
  onExit,
}: Activity2Props) => {
  const isYoungUser = age <= 6;
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [dynamicWords, setDynamicWords] = useState<string[]>([]);

  useEffect(() => {
    const loadWords = async () => {
      const word1 = await getWordByAge(age);
      const word2 = await getWordByAge(age);
      const word3 = await getWordByAge(age);

      const image1 = await getRealImage(word1);
const image2 = await getRealImage(word2);
const image3 = await getRealImage(word3);

setDynamicWords([image1, image2, image3]);

    };

    loadWords();
  }, [currentActivityIndex]);




  const handleMicClick = () => {
    setIsSpeaking(true);

    setTimeout(() => {
      setIsSpeaking(false);
      setHasSpoken(true);

      const currentSentence = dynamicWords.join(" ");

      const simulatedSpeech = currentSentence;

      const result = evaluateSpeech(
        simulatedSpeech,
        currentSentence,
        age
      );

      setIsCorrect(result.correct);
      setShowFeedback(true);

      if (result.correct) {
       onAwardStars(1);
      }






      setTimeout(() => {
        setShowFeedback(false);
        if (result.correct) {
          if (currentActivityIndex < 4) {
  setCurrentActivityIndex(currentActivityIndex + 1);
  setHasSpoken(false);
} else {
  onFinish();
}
        } else {
          setHasSpoken(false);
        }
      }, 3000);
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
        <h3 className="text-5xl font-bold text-gray-800 text-center mb-4">
          Di una frase con estas imágenes
        </h3>
        <div className="flex justify-center mb-12">
          <p className="text-4xl">🎤</p>
        </div>

      {dynamicWords.length === 0 ? (
  <p className="text-center text-2xl text-purple-600">
    Cargando imágenes...
  </p>
) : (
  <div
    className={`grid ${
      isYoungUser ? "grid-cols-2" : "grid-cols-3"
    } gap-8 max-w-5xl mx-auto mb-12`}
  >
    {dynamicWords.map((image, index) => (
      <motion.div
        key={index}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1 }}
        className="aspect-square rounded-3xl shadow-xl"
      >
        <img
  src={image}
  alt="imagen"
  className="w-full h-full object-cover rounded-3xl"
/>
      </motion.div>
    ))}
  </div>
)}

        {!hasSpoken && !isSpeaking && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-3xl font-semibold text-purple-600">Presiona para hablar</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMicClick}
              className="bg-gradient-to-r from-red-400 to-pink-400 rounded-full p-12 shadow-2xl hover:shadow-3xl transition-all"
            >
              <Mic size={80} className="text-white" />
            </motion.button>
          </motion.div>
        )}

        {isSpeaking && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-4xl font-semibold text-purple-600">Te estoy escuchando...</p>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-12 shadow-2xl"
            >
              <Mic size={80} className="text-white" />
            </motion.div>
          </motion.div>
        )}

        {hasSpoken && !showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="text-2xl text-gray-500 italic">
              Ejemplo: {dynamicWords.join(" ")}
            </p>
          </motion.div>
        )}
      </motion.div>

      {showFeedback && <FeedbackModal isCorrect={isCorrect} />}
    </motion.div>
  );
};