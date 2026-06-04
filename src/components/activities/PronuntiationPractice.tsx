import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Mic, Volume2 } from "lucide-react";
import { syllabify, evaluateSpeech, speak, cancelSpeak } from "../../services/dynamicWordService";

interface PronunciationPracticeProps {
  word: string;
  age: number;
  userName?: string;
  onComplete: (success: boolean, starsEarned: number) => void;
  onSkip?: () => void;
}

export const PronunciationPractice = ({ word, age, userName, onComplete, onSkip }: PronunciationPracticeProps) => {
  const [step, setStep] = useState<'listening' | 'speaking' | 'feedback'>('listening');
  const [currentRepetition, setCurrentRepetition] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const recognitionRef = useRef<any>(null);
  
  const totalRepetitions = 3;
  
  // Función para hablar SIN pausas largas entre repeticiones
  const speakNatural = (text: string, rate: number = 0.75, onEnd?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.pitch = 1.1;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  };
  
  // Iniciar la práctica con un mensaje amigable
  const startPractice = () => {
    setFeedback(`🎤 ¡Vamos a practicar la palabra "${word}", ${userName || "amigo"}!`);
    speakNatural(`Vamos a repetir esta palabra, ${userName || "amigo"}. Escucha con atención`, 0.8, () => {
      setTimeout(() => {
        speakWordBySyllables();
      }, 300);
    });
  };
  
  // Decir la palabra sílaba por sílaba (fluido, sin pausas largas)
  const speakWordBySyllables = () => {
    const syllables = syllabify(word);
    let sylIndex = 0;
    
    const speakNextSyllable = () => {
      if (sylIndex < syllables.length) {
        const syl = syllables[sylIndex];
        speakNatural(syl, 0.65, () => {
          sylIndex++;
          setTimeout(speakNextSyllable, 250); 
        });
      } else {
        // Decir palabra completa
        setTimeout(() => {
          speakNatural(word, 0.7, () => {
            setTimeout(() => {
              setStep('speaking');
              setFeedback(`🎙️ ¡Ahora tú, ${userName || "amigo"}! Dime: "${word}"`);
            }, 400);
          });
        }, 300);
      }
    };
    
    speakNextSyllable();
  };
  
  // Iniciar cuando se monta el componente
  useEffect(() => {
    startPractice();
    return () => cancelSpeak();
  }, []);
  
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setFeedback("Tu navegador no soporta micrófono");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsRecording(true);
      setFeedback("🎧 Escuchando... ¡Habla claro!");
    };
    
    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      setIsRecording(false);
      evaluateAndRespond(spoken);
    };
    
    recognition.onerror = () => {
      setIsRecording(false);
      setFeedback("No te escuché. Presiona el micrófono y habla más fuerte");
      setTimeout(() => setStep('speaking'), 1500);
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  };
  
  const evaluateAndRespond = (spoken: string) => {
    const result = evaluateSpeech(spoken, word, userName);
    setLastResult(result);
    
    if (result.correct) {
      setCorrectCount(prev => prev + 1);
    }
    
    setStep('feedback');
    
    if (result.isExactlyCorrect) {
      setFeedback(`✅ ¡Muy bien, ${userName || "amigo"}! Dijiste "${word}" correctamente`);
      speakNatural(`¡Excelente pronunciación, ${userName || "amigo"}!`, 0.8);
    } else if (result.correct) {
      setFeedback(`👍 ¡Casi! Dijiste "${spoken}". La palabra es "${word}"`);
      speakNatural(`Casi lo logras. La palabra es "${word}". ¡Sigue así!`, 0.8);
    } else {
      setFeedback(`💪 Dijiste "${spoken}". La palabra es "${word}". ¡Inténtalo de nuevo!`);
      speakNatural(`Dijiste "${spoken}". Escucha con atención: ${word}`, 0.7);
    }
    
    // Decidir siguiente paso después de 2 segundos
    setTimeout(() => {
      if (currentRepetition < totalRepetitions) {
        setCurrentRepetition(prev => prev + 1);
        setStep('listening');
        setFeedback(`🔁 Repetición ${currentRepetition + 1} de ${totalRepetitions}. ¡Escucha de nuevo!`);
        speakNatural(`Vamos por la repetición número ${currentRepetition + 1}. Escucha:`, 0.8, () => {
          setTimeout(() => {
            speakWordBySyllables();
          }, 200);
        });
      } else {
        // Calcular estrellas (3 si todas correctas, 2 si 2 correctas, 1 si 1 correcta)
        let stars = 0;
        if (correctCount >= 3) stars = 3;
        else if (correctCount >= 2) stars = 2;
        else if (correctCount >= 1) stars = 1;
        
        setFeedback(`🎉 ¡Completaste las ${totalRepetitions} repeticiones! Ganaste ${stars} ${stars === 1 ? 'estrella' : 'estrellas'}`);
        speakNatural(`¡Felicidades, ${userName || "amigo"}! Terminaste la práctica.`, 0.8, () => {
          setTimeout(() => {
            onComplete(true, stars);
          }, 1500);
        });
      }
    }, 2000);
  };
  
  const skipToNext = () => {
    if (currentRepetition < totalRepetitions) {
      setCurrentRepetition(prev => prev + 1);
      setStep('listening');
      speakNatural(`Escucha de nuevo: ${word}`, 0.7, () => {
        setTimeout(() => setStep('speaking'), 500);
      });
    } else {
      onComplete(false, 0);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">
            🎤 Práctica de pronunciación
          </h3>
          
          {/* Indicador de repeticiones */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${i < currentRepetition ? 'bg-green-500 text-white' : 
                    i === currentRepetition ? 'bg-purple-500 text-white animate-pulse ring-4 ring-purple-200' : 
                    'bg-gray-200 text-gray-400'}
                `}
              >
                {i}
              </div>
            ))}
          </div>
          
          {/* Palabra actual */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
            <p className="text-5xl font-bold text-purple-600 mb-3">{word}</p>
            
            {/* Sílabas */}
            <div className="flex justify-center gap-2 flex-wrap">
              {syllabify(word).map((syl, idx) => (
                <span 
                  key={idx} 
                  className={`text-xl px-3 py-1 rounded-full transition-all
                    ${step === 'listening' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-500'}
                  `}
                >
                  {syl}
                </span>
              ))}
            </div>
          </div>
          
          {/* Feedback */}
          <div className="mb-6 min-h-[80px]">
            <p className="text-gray-700 font-medium">{feedback}</p>
            {lastResult && !lastResult.isExactlyCorrect && lastResult.spokenFeedback !== lastResult.expectedFeedback && (
              <div className="mt-3 bg-gray-100 rounded-xl p-3 text-left">
                <p className="text-sm">
                  <span className="font-bold text-red-500">Tú:</span> "{lastResult.spokenFeedback}"
                </p>
                <p className="text-sm mt-1">
                  <span className="font-bold text-green-500">Correcto:</span> "{lastResult.expectedFeedback}"
                </p>
              </div>
            )}
          </div>
          
          {/* Botones */}
          {step === 'speaking' && (
            <button
              onClick={startListening}
              disabled={isRecording}
              className={`${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-green-500 to-emerald-500'} text-white rounded-full px-8 py-4 text-xl font-bold shadow-xl flex items-center gap-3 mx-auto transition-all`}
            >
              <Mic size={24} />
              {isRecording ? "Escuchando..." : "🎙️ Decir palabra"}
            </button>
          )}
          
          {step === 'listening' && (
            <div className="flex justify-center items-center gap-2">
              <div className="flex gap-1">
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <p className="text-purple-500">Escucha al asistente...</p>
            </div>
          )}
          
          {step === 'feedback' && (
            <button
              onClick={skipToNext}
              className="text-purple-500 text-sm underline mt-2"
            >
              {currentRepetition < totalRepetitions ? "Siguiente repetición →" : "Finalizar"}
            </button>
          )}
          
          {onSkip && step !== 'feedback' && (
            <button onClick={onSkip} className="mt-4 text-gray-400 text-sm underline">
              Omitir práctica
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};