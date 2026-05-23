import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Home, Star, Volume2, Mic, RefreshCw, Loader2, Trophy } from "lucide-react";
import { getWordByAge, getRelatedWords, getRealImage, evaluateSpeech, resetWordHistory, getWordDifficulty } from "../../services/dynamicWordService";
import { PronunciationPractice } from "./PronuntiationPractice";

interface Activity1Props {
  age: number;
  stars: number;
  userName?: string;
  onAwardStars: (amount: number) => void;
  onFinish: () => void;
  onExit: () => void;
}

export const Activity1 = ({ age, stars, userName, onAwardStars, onFinish, onExit }: Activity1Props) => {
  const isYoung = age <= 7;
  const [currentWord, setCurrentWord] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionsImages, setOptionsImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showTextOnly, setShowTextOnly] = useState(false);
  
  // Estados para práctica de pronunciación
  const [showPractice, setShowPractice] = useState(false);
  const [currentPracticeWord, setCurrentPracticeWord] = useState("");
  const [pendingWordAdvance, setPendingWordAdvance] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const MAX_WORDS = 5;

  // Para niños grandes: cada 2 preguntas, una es solo texto
  useEffect(() => {
    if (!isYoung && wordCount > 0) {
      setShowTextOnly(wordCount % 2 === 0);
    }
  }, [wordCount, isYoung]);

  const loadNewWord = useCallback(async () => {
    if (wordCount >= MAX_WORDS) {
      setGameFinished(true);
      return;
    }

    setLoading(true);
    try {
      const word = await getWordByAge(age);
      const related = await getRelatedWords(word, age);
      
      setCurrentWord(word);
      setOptions(related);
      setSelectedOption(null);
      setPendingWordAdvance(false);
      
      // Cargar imágenes solo si es necesario
      if (!showTextOnly || isYoung) {
        const imagePromises = related.map(opt => getRealImage(opt));
        const imageUrls = await Promise.all(imagePromises);
        const imagesMap: Record<string, string> = {};
        related.forEach((opt, index) => {
          imagesMap[opt] = imageUrls[index];
        });
        setOptionsImages(imagesMap);
      }
    } catch (error) {
      console.error("Error loading word:", error);
    } finally {
      setLoading(false);
    }
  }, [age, wordCount, showTextOnly, isYoung]);

  useEffect(() => {
    loadNewWord();
  }, [loadNewWord]);

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'es-ES';
    utterance.rate = 0.7;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const advanceToNextWord = () => {
    if (!pendingWordAdvance) {
      setPendingWordAdvance(true);
      setTimeout(() => {
        setWordCount(prev => prev + 1);
      }, 500);
    }
  };

  const handleOptionSelect = (selected: string) => {
    if (showFeedback || pendingWordAdvance) return;
    
    setSelectedOption(selected);
    const isImgCorrect = selected === currentWord;
    
    setIsCorrect(isImgCorrect);
    setShowFeedback(true);

    if (isImgCorrect) {
      // Verificar dificultad de la palabra
      const difficulty = getWordDifficulty(currentWord, age);
      
      if (difficulty === 'hard') {
        // Palabra difícil: forzar práctica de pronunciación
        setFeedbackMessage("¡Correcto! Ahora vamos a practicar cómo se dice");
        onAwardStars(1); // Estrella por acertar la imagen
        
        setTimeout(() => {
          setShowFeedback(false);
          setCurrentPracticeWord(currentWord);
          setShowPractice(true);
        }, 1500);
      } else {
        // Palabra fácil o mediana: flujo normal
        setFeedbackMessage("¡Correcto! +1 estrella ⭐");
        onAwardStars(1);
        
        setTimeout(() => {
          setShowFeedback(false);
          advanceToNextWord();
        }, 1500);
      }
    } else {
      setFeedbackMessage(`No es "${selected}". La palabra es "${currentWord}"`);
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
      }, 2000);
    }
  };

  const handlePracticeComplete = (success: boolean, practiceStars: number) => {
    setShowPractice(false);
    
    if (success && practiceStars > 0) {
      onAwardStars(practiceStars);
      setFeedbackMessage(`¡Excelente! +${practiceStars} ${practiceStars === 1 ? 'estrella' : 'estrellas'} por tu pronunciación ⭐`);
      setShowFeedback(true);
      setIsCorrect(true);
      
      setTimeout(() => {
        setShowFeedback(false);
        advanceToNextWord();
      }, 2000);
    } else {
      advanceToNextWord();
    }
  };

  const handleSkipPractice = () => {
    setShowPractice(false);
    advanceToNextWord();
  };

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    
    recognition.onstart = () => setIsRecording(true);
    
    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      setIsRecording(false);
      const result = evaluateSpeech(spoken, currentWord, age.toString());
      
      if (result.correct) onAwardStars(result.stars);
      
      setIsCorrect(result.correct);
      setShowFeedback(true);
      setFeedbackMessage(result.message);
      
      setTimeout(() => {
        setShowFeedback(false);
        if (result.correct) {
          advanceToNextWord();
        }
      }, 2000);
    };
    
    recognition.onerror = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const resetGame = () => {
    resetWordHistory();
    setWordCount(0);
    setGameFinished(false);
    setSelectedOption(null);
    setShowPractice(false);
    setPendingWordAdvance(false);
    loadNewWord();
  };

  // Pantalla final
  if (gameFinished) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-md w-full">
          <div className="bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-yellow-500" size={50} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">¡Excelente trabajo!</h2>
          <p className="text-gray-600 mb-6">Completaste {MAX_WORDS} palabras</p>
          <div className="flex justify-center items-center gap-2 bg-purple-50 rounded-2xl py-4 mb-8">
            <Star className="text-yellow-500 fill-yellow-500" size={32} />
            <span className="text-3xl font-bold text-purple-700">{stars} estrellas</span>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={resetGame} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
              <RefreshCw size={20} /> Jugar de nuevo
            </button>
            <button onClick={onExit} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2">
              <Home size={20} /> Menú
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-purple-600">Buscando palabra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onExit} className="bg-white rounded-full p-3 shadow-md">
            <Home size={24} className="text-purple-600" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/50 px-4 py-2 rounded-full">
              <span className="text-purple-700 font-bold">Palabra {wordCount + 1}/{MAX_WORDS}</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-lg">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
              <span className="text-xl font-bold text-purple-600">{stars}</span>
            </div>
          </div>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-10">
            
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {showPractice ? "🎤 Practica la pronunciación" : "Escucha y elige"}
              </h3>
              <p className="text-gray-500">
                {showPractice 
                  ? "El asistente te ayudará a decir la palabra correctamente" 
                  : (showTextOnly && !isYoung ? "Elige la palabra correcta" : "Elige la imagen correcta")}
              </p>
            </div>

            {/* Botón escuchar (solo cuando no está en modo práctica) */}
            {!showPractice && (
              <>
                <div className="flex justify-center mb-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={speakWord}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white w-28 h-28 md:w-32 md:h-32 rounded-full shadow-xl flex items-center justify-center"
                  >
                    <Volume2 size={48} />
                  </motion.button>
                </div>

                {/* Opciones */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {options.map((option, idx) => {
                    if (showTextOnly && !isYoung) {
                      return (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOptionSelect(option)}
                          disabled={showFeedback}
                          className={`p-6 rounded-2xl shadow-md transition-all text-center
                            ${selectedOption === option 
                              ? (isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white") 
                              : "bg-purple-50 hover:bg-purple-100 text-gray-800"}
                          `}
                        >
                          <span className="text-xl font-bold capitalize">{option}</span>
                        </motion.button>
                      );
                    }
                    
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOptionSelect(option)}
                        disabled={showFeedback}
                        className={`relative aspect-square rounded-2xl overflow-hidden shadow-md transition-all
                          ${selectedOption === option 
                            ? (isCorrect ? "ring-4 ring-green-500" : "ring-4 ring-red-500") 
                            : ""}
                        `}
                      >
                        {optionsImages[option] ? (
                          <img src={optionsImages[option]} alt={option} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                          </div>
                        )}
                        {!isYoung && (
                          <div className="absolute bottom-0 inset-x-0 bg-white/90 py-1 text-center text-xs font-bold text-gray-700 capitalize">
                            {option}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Botones de práctica */}
                <div className="mt-10 flex justify-center gap-4">
                  <button
                    onClick={startRecording}
                    disabled={isRecording || showFeedback}
                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-white shadow-lg transition-all
                      ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'}
                    `}
                  >
                    <Mic size={24} />
                    {isRecording ? "Escuchando..." : "Practicar pronunciación"}
                  </button>
                  
                  <button onClick={() => loadNewWord()} className="p-3 text-gray-400 hover:text-purple-500 transition-colors">
                    <RefreshCw size={24} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Feedback modal */}
        {showFeedback && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className={`rounded-3xl p-8 shadow-2xl text-center max-w-xs w-full ${isCorrect ? "bg-green-500" : "bg-orange-500"}`}>
              <div className="text-6xl mb-4">{isCorrect ? "🌟" : "💪"}</div>
              <p className="text-xl font-bold text-white">{feedbackMessage}</p>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de práctica de pronunciación */}
        {showPractice && (
          <PronunciationPractice
            word={currentPracticeWord}
            age={age}
            userName={userName}
            onComplete={handlePracticeComplete}
            onSkip={handleSkipPractice}
          />
        )}
      </div>
    </div>
  );
};