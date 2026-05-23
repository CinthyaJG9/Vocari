import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Mic, Volume2, CheckCircle, XCircle } from "lucide-react";
import { syllabify, evaluateSpeech } from "../../services/dynamicWordService";

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
  const recognitionRef = useRef<any>(null);
  
  const totalRepetitions = 3;
  
  const speak = (text: string, rate: number = 0.7, onEnd?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.pitch = 1.1;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  };
  
  const speakWordBySyllables = () => {
    const syllables = syllabify(word);
    let sylIndex = 0;
    
    const speakNextSyllable = () => {
      if (sylIndex < syllables.length) {
        const syl = syllables[sylIndex];
        speak(syl, 0.5, () => {
          sylIndex++;
          setTimeout(speakNextSyllable, 400);
        });
      } else {
        setTimeout(() => {
          speak(word, 0.6, () => {
            setTimeout(() => {
              setStep('speaking');
              setFeedback(`🎤 Repetición ${currentRepetition} de ${totalRepetitions}: Ahora dilo tú`);
            }, 500);
          });
        }, 300);
      }
    };
    
    speakNextSyllable();
  };
  
  useEffect(() => {
    setStep('listening');
    setFeedback(`🔊 Repetición ${currentRepetition} de ${totalRepetitions}`);
    speakWordBySyllables();
  }, [currentRepetition]);
  
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
      setFeedback("🎧 Escuchando...");
    };
    
    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      setIsRecording(false);
      evaluateAndRespond(spoken);
    };
    
    recognition.onerror = () => {
      setIsRecording(false);
      setFeedback("No te escuché. Presiona el botón y habla claro");
      setTimeout(() => setStep('speaking'), 2000);
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  };
  
  const evaluateAndRespond = (spoken: string) => {
    const result = evaluateSpeech(spoken, word, userName);
    setLastResult(result);
    setStep('feedback');
    
    if (result.isExactlyCorrect) {
      // Si es correcto: solo decir "¡Muy bien, [nombre]!" y continuar
      speak(result.message, 0.8, () => {
        setFeedback(result.message);
        
        setTimeout(() => {
          if (currentRepetition < totalRepetitions) {
            setCurrentRepetition(prev => prev + 1);
            setStep('listening');
          } else {
            const totalStars = 3;
            setFeedback(`🎉 ¡Completaste las ${totalRepetitions} repeticiones! +${totalStars} estrellas`);
            setTimeout(() => {
              onComplete(true, totalStars);
            }, 2000);
          }
        }, 1500);
      });
    } else {
      // Si es incorrecto o casi correcto: decir lo que dijo y la palabra correcta
      speak(`Dijiste: ${spoken}`, 0.8, () => {
        setTimeout(() => {
          speak(`La palabra correcta es: ${word}`, 0.7, () => {
            setFeedback(result.message);
            
            setTimeout(() => {
              if (currentRepetition < totalRepetitions) {
                setCurrentRepetition(prev => prev + 1);
                setStep('listening');
              } else {
                onComplete(false, 0);
              }
            }, 3000);
          });
        }, 500);
      });
    }
  };
  
  const skipToNext = () => {
    if (currentRepetition < totalRepetitions) {
      setCurrentRepetition(prev => prev + 1);
      setStep('listening');
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
            🎤 Practica la pronunciación
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
            
            <div className="flex justify-center gap-2 flex-wrap">
              {syllabify(word).map((syl, idx) => (
                <span 
                  key={idx} 
                  className={`text-xl px-3 py-1 rounded-full transition-all
                    ${step === 'listening' 
                      ? 'bg-purple-100 text-purple-700 animate-pulse' 
                      : 'bg-gray-100 text-gray-500'}
                  `}
                >
                  {syl}
                </span>
              ))}
            </div>
          </div>
          
          {/* Feedback */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium">{feedback}</p>
            {lastResult && !lastResult.isExactlyCorrect && (
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
              className={`${isRecording ? 'bg-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105'} text-white rounded-full px-8 py-4 text-xl font-bold shadow-xl flex items-center gap-3 mx-auto transition-all`}
            >
              <Mic size={24} />
              {isRecording ? "Escuchando..." : "🎙️ Hablar ahora"}
            </button>
          )}
          
          {step === 'listening' && (
            <div className="flex justify-center items-center gap-2">
              <div className="animate-pulse flex gap-1">
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></span>
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              </div>
              <p className="text-purple-500">Escuchando al asistente...</p>
            </div>
          )}
          
          {step === 'feedback' && !lastResult?.isExactlyCorrect && (
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