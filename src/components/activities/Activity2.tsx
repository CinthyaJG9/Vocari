import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Star, Mic, Loader2, ArrowRight, Volume2 } from "lucide-react";

interface Activity2Props {
  age: number;
  stars: number;
  userName?: string;
  onAwardStars: (amount: number) => void;
  onFinish: () => void;
  onExit: () => void;
}

// ============================================
// FRASES POR EDAD
// ============================================

const youngPhrases = [
  { text: "El gato duerme", image: "🐱", hint: "😴" },
  { text: "El perro corre", image: "🐶", hint: "🏃" },
  { text: "La niña baila", image: "👧", hint: "💃" },
  { text: "El niño juega", image: "👦", hint: "⚽" },
  { text: "El sol brilla", image: "☀️", hint: "✨" },
  { text: "La luna sale", image: "🌙", hint: "🌃" },
  { text: "El pájaro vuela", image: "🐦", hint: "🕊️" },
  { text: "El pez nada", image: "🐟", hint: "💧" },
  { text: "El carro corre rápido", image: "🚗", hint: "💨" },
  { text: "La rana salta", image: "🐸", hint: "🦘" },
  { text: "El loro habla", image: "🦜", hint: "🗣️" },
  { text: "La cereza es roja", image: "🍒", hint: "🔴" },
  { text: "El burro come", image: "🫏", hint: "🥕" },
  { text: "La pera es dulce", image: "🍐", hint: "🍯" },
  { text: "El perro ladra", image: "🐕", hint: "🔊" },
  { text: "La vaca muge", image: "🐄", hint: "🐮"},
  { text: "El caballo galopa", image: "🐎", hint: "🏇" },
  { text: "La abeja zumba", image: "🐝", hint: "🐝" },
  { text: "El elefante trompetea", image: "🐘", hint: "📯" },
  { text: "La mariposa revolotea", image: "🦋", hint: "🦋" },
  { text: "El pez nada en el agua", image: "🐠", hint: "🌊"},
  { text: "La tortuga camina lento", image: "🐢", hint: "🐢" },
  { text: "El león ruge fuerte", image: "🦁", hint: "🗯️" },
  { text: "La serpiente se desliza", image: "🐍", hint: "🐍" },
  { text: "El mono salta de árbol en árbol", image: "🐒", hint: "🌳" },
  { text: "La flor huele bien", image: "🌸", hint: "🌺" },
  { text: "El pájaro canta en la mañana", image: "🐦", hint: "🎶" },
];

const oldPhrases = [
  { 
    text: "El astronauta viaja al espacio", 
    image: "👨‍🚀", 
    hint1: "Persona que viaja al espacio", 
    hint2: "Lugar fuera de la Tierra",
    answer1: "astronauta", 
    answer2: "espacio",
    visual1: "a_______a", 
    visual2: "e_____o" 
  },
  { 
    text: "La mariposa vuela entre las flores", 
    image: "🦋", 
    hint1: "Insecto con alas coloridas", 
    hint2: "Plantas que dan color al jardín",
    answer1: "mariposa", 
    answer2: "flores",
    visual1: "m______a", 
    visual2: "f____s" 
  },
  { 
    text: "El arquitecto diseña edificios", 
    image: "🏗️", 
    hint1: "Profesión que crea planos", 
    hint2: "Construcciones grandes",
    answer1: "arquitecto", 
    answer2: "edificios",
    visual1: "a_______o", 
    visual2: "e______s" 
  },
  {
    text: "La guitarra suena con melodía",
    image: "🎸",
    hint1: "Instrumento musical de cuerdas",
    hint2: "Combinación de sonidos agradables",
    answer1: "guitarra",
    answer2: "melodía",
    visual1: "g_____a",
    visual2: "m_____a"
  },
  {
    text: "El científico investiga nuevos descubrimientos",
    image: "🔬",
    hint1: "Persona que estudia la naturaleza",
    hint2: "Hallazgos importantes",
    answer1: "científico",
    answer2: "descubrimientos",
    visual1: "c______o",
    visual2: "d___________s"
  },
  {
    text: "La biblioteca tiene muchos libros interesantes",
    image: "📚",
    hint1: "Lugar donde se guardan libros",
    hint2: "Objetos con páginas para leer",
    answer1: "biblioteca",
    answer2: "libros",
    visual1: "b_______a",
    visual2: "l___s"
  },
  {
    text: "El pintor crea obras de arte con colores",
    image: "🎨",
    hint1: "Persona que pinta cuadros",
    hint2: "Resultados visuales de la creatividad",
    answer1: "pintor",
    answer2: "arte",
    visual1: "p___r",
    visual2: "a__e"
  },
  {
    text: "La computadora procesa información rápidamente",
    image: "💻",
    hint1: "Máquina electrónica para trabajar o jugar",
    hint2: "Datos que se manejan en la tecnología",
    answer1: "computadora",
    answer2: "información",
    visual1: "c________a",
    visual2: "i_________n"
  },
  {
    text: "El chef cocina platos deliciosos en el restaurante",
    image: "👨‍🍳",
    hint1: "Persona que prepara comida",
    hint2: "Lugar donde se sirven comidas",
    answer1: "chef",
    answer2: "restaurante",
    visual1: "c__f",
    visual2: "r________e"
  },
  {
    text: "La música clásica es apreciada por su belleza",
    image: "🎵",
    hint1: "Tipo de música considerada elegante",
    hint2: "Calidad estética de la música",
    answer1: "música",
    answer2: "belleza",
    visual1: "m____a",
    visual2: "b_____a"
  }, 
  {
    text: "El volcán erupciona con fuerza y lava",
    image: "🌋",
    hint1: "Estructura geológica que lanza material fundido",
    hint2: "Líquido caliente que sale del interior de la Tierra",
    answer1: "volcán",
    answer2: "lava",
    visual1: "v___n",
    visual2: "l__a"
  },
  {
    text: "La astronomía estudia los cuerpos celestes",
    image: "🔭",
    hint1: "Ciencia que estudia los objetos en el espacio",
    hint2: "Entidades que existen fuera de la Tierra",
    answer1: "astronomía",
    answer2: "cuerpos",
    visual1: "a______o",
    visual2: "c___s"
  },
  {
    text: "El reloj marca la hora con precisión",
    image: "⏰",
    hint1: "Objeto que muestra el tiempo",
    hint2: "Instrumento para medir el tiempo",
    answer1: "reloj",
    answer2: "hora",
    visual1: "r__j",
    visual2: "h__a"
   },
   {
    text: "La fotografía captura momentos especiales",
    image: "📸",
    hint1: "Imagen tomada con una cámara",
    hint2: "Instante que se conserva en la memoria",
    answer1: "fotografía",
    answer2: "momentos",
    visual1: "f______a",
    visual2: "m____s"
   },
   {
    text: "El deporte es importante para la salud física y mental",
    image: "⚽",
    hint1: "Actividad que mejora el estado de ánimo",
    hint2: "Práctica que fortalece el cuerpo",
    answer1: "deporte",
    answer2: "salud",
    visual1: "d____o",
    visual2: "s___d"
   }
];

// ============================================
// FUNCIONES DE VOZ
// ============================================

const speak = (text: string, rate: number = 0.75, onEnd?: () => void) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = rate;
  utterance.pitch = 1.1;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
};

const cancelSpeak = () => {
  window.speechSynthesis.cancel();
};

// ============================================
// DETECCIÓN DE PALABRAS CON R
// ============================================

const hasStrongR = (word: string): boolean => {
  return /rr/i.test(word) || /^r/i.test(word);
};

const extractWordsWithR = (phrase: string): string[] => {
  const words = phrase.toLowerCase().split(/\s+/);
  return words.filter(word => hasStrongR(word));
};

// ============================================
// COMPONENTE DE PRÁCTICA DE R
// ============================================

const RPractice = ({ word, onComplete, userName }: { 
  word: string; 
  userName?: string;
  onComplete: (success: boolean) => void;
}) => {
  const [step, setStep] = useState<'listening' | 'speaking' | 'feedback'>('listening');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setFeedback(`🎤 ¡Vamos a practicar la palabra con R, ${userName || "amigo"}!`);
    speak(`Escucha con atención: ${word}`, 0.7, () => {
      setTimeout(() => {
        setStep('speaking');
        setFeedback(`🎙️ ¡Ahora tú! Dime: "${word}"`);
      }, 500);
    });
    return () => cancelSpeak();
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      setIsRecording(false);

      const targetNorm = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const spokenNorm = spoken.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const isCorrect = spokenNorm === targetNorm || targetNorm.includes(spokenNorm) || spokenNorm.includes(targetNorm);

      if (isCorrect) {
        setFeedback(`✅ ¡Excelente! Dijiste "${word}" correctamente. ¡La R suena perfecto!`);
        speak(`¡Muy bien, ${userName || "amigo"}! La R te quedó genial.`, 0.8, () => {
          setTimeout(() => onComplete(true), 1000);
        });
      } else if (attempts === 0) {
        setAttempts(1);
        setFeedback(`Dijiste "${spoken}". ¡Intenta de nuevo! La R se pronuncia fuerte`);
        speak(`Escucha cómo se dice: ${word}. La R vibra en la lengua.`, 0.65, () => {
          setStep('speaking');
        });
      } else {
        setFeedback(`Dijiste "${spoken}". La palabra correcta es "${word}". ¡Sigue practicando!`);
        speak(`La palabra correcta es "${word}". ¡Sigue practicando la R!`, 0.8, () => {
          setTimeout(() => onComplete(false), 1000);
        });
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setFeedback("No te escuché. Presiona el micrófono y habla más fuerte");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center">
        <h3 className="text-2xl font-bold text-purple-600 mb-4">🎤 Practica la R</h3>
        <div className="bg-red-50 rounded-2xl p-6 mb-6">
          <p className="text-5xl font-bold text-red-600 mb-2">{word}</p>
          <p className="text-red-500 text-sm">💡 La R se pronuncia vibrando la lengua</p>
        </div>
        <p className="text-gray-700 mb-6">{feedback}</p>
        {step === 'speaking' && (
          <button onClick={startListening} disabled={isRecording} className={`${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white rounded-full px-8 py-4 text-xl font-bold shadow-xl flex items-center gap-3 mx-auto`}>
            <Mic size={24} /> {isRecording ? "Escuchando..." : "🎙️ Decir palabra"}
          </button>
        )}
      </motion.div>
    </div>
  );
};

// ============================================
// COMPONENTE PARA NIÑOS PEQUEÑOS (≤7 años)
// ============================================

const YoungActivity = ({ phrase, image, hint, onComplete, userName }: { 
  phrase: string; 
  image: string; 
  hint: string;
  userName?: string;
  onComplete: (stars: number, needsRPractice?: string[]) => void;
}) => {
  const [step, setStep] = useState<'listening' | 'speaking' | 'feedback'>('listening');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const recognitionRef = useRef<any>(null);
  const rWords = extractWordsWithR(phrase);

  useEffect(() => {
    setFeedback("🎧 Escucha la frase...");
    speak(`Mira la imagen. Escucha con atención: ${phrase}`, 0.75, () => {
      setFeedback("🎤 ¡Ahora es tu turno! Repite la frase");
      setStep('speaking');
    });
    return () => { cancelSpeak(); if (recognitionRef.current) recognitionRef.current.abort(); };
  }, [phrase]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      setIsRecording(false);
      const targetNorm = phrase.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const spokenNorm = spoken.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let stars = 0;
      if (spokenNorm === targetNorm || targetNorm.includes(spokenNorm) || spokenNorm.includes(targetNorm)) {
        stars = 3;
        setFeedback("🎉 ¡Excelente!");
        setStep('feedback');
        speak(`¡Muy bien, ${userName || "amigo"}!`, 0.8, () => onComplete(stars, rWords));
      } else if (attempts === 0) {
        setAttempts(1);
        setFeedback(`Escuché "${spoken}". ¡Intentémoslo una vez más!`);
        setStep('listening');
        speak(`Escucha de nuevo: ${phrase}`, 0.75, () => { setStep('speaking'); setFeedback("🎤 Repite la frase"); });
      } else {
        stars = 1;
        setFeedback("¡Bien intentado! ✨");
        setStep('feedback');
        speak(`Buen intento. La frase era "${phrase}"`, 0.8, () => onComplete(stars, rWords));
      }
    };
    recognition.onerror = () => { setIsRecording(false); setFeedback("No te escuché. ¡Inténtalo de nuevo!"); setStep('speaking'); };
    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-5 md:p-10 text-center">
      <div className="bg-purple-50 rounded-2xl p-6 md:p-8 mb-6 flex justify-center items-center gap-4">
        <span className="text-6xl md:text-8xl">{image}</span>
        <span className="text-4xl md:text-5xl">{hint}</span>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 md:p-5 mb-6">
        <p className="text-xl md:text-2xl text-purple-800 font-bold break-words">{phrase}</p>
      </div>
      <div className="mb-6 min-h-[30px]"><p className="text-base md:text-lg text-gray-600 font-medium">{feedback}</p></div>
      {step === 'speaking' && (
        <button onClick={startListening} disabled={isRecording} className={`${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'} text-white rounded-full px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold shadow-xl flex items-center gap-3 mx-auto transition-all`}>
          <Mic size={24} /> {isRecording ? "Escuchando..." : "🎙️ Hablar ahora"}
        </button>
      )}
      {step === 'listening' && (
        <div className="flex justify-center items-center gap-2 text-purple-600 font-medium">
          <Loader2 className="animate-spin" size={24} /><span>El asistente está hablando...</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE PARA NIÑOS GRANDES (≥8 años) - CON PAUSAS
// ============================================

const OldActivity = ({ phrase, image, hint1, hint2, answer1, answer2, visual1, visual2, onComplete, userName }: { 
  phrase: string; image: string; hint1: string; hint2: string; answer1: string; answer2: string; visual1: string; visual2: string; userName?: string; onComplete: (stars: number) => void;
}) => {
  const [step, setStep] = useState<'listening' | 'speaking' | 'feedback'>('listening');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const recognitionRef = useRef<any>(null);
  
  // Frase visual para mostrar (con espacios visuales)
  const displayPhrase = phrase
    .replace(answer1, "______")
    .replace(answer2, "______");
  
  // Dividir la frase en partes para hablar con pausas
  const parts = phrase.split(new RegExp(`(${answer1}|${answer2})`, 'gi'));
  
  // Función para hablar la frase con pausas (sin leer los espacios)
  const speakWithPauses = (onComplete?: () => void) => {
    let index = 0;
    
    const speakNext = () => {
      if (index >= parts.length) {
        if (onComplete) onComplete();
        return;
      }
      
      const part = parts[index];
      const isAnswer = part.toLowerCase() === answer1.toLowerCase() || part.toLowerCase() === answer2.toLowerCase();
      
      if (isAnswer) {
        // Pausa de 0.8 segundos (silencio) en lugar de leer la palabra
        setTimeout(() => {
          index++;
          speakNext();
        }, 800);
      } else if (part.trim().length > 0) {
        // Hablar la parte normal
        speak(part.trim(), 0.75, () => {
          index++;
          speakNext();
        });
      } else {
        index++;
        speakNext();
      }
    };
    
    speakNext();
  };

  useEffect(() => {
    setFeedback("🔊 Escucha la frase...");
    // Decir la introducción
    speak("Observa la imagen.", 0.8, () => {
      setTimeout(() => {
        // Decir la frase con pausas
        speakWithPauses(() => {
          setFeedback("🎤 Di la frase completa con las palabras que faltan");
          setStep('speaking');
        });
      }, 300);
    });
    return () => { cancelSpeak(); if (recognitionRef.current) recognitionRef.current.abort(); };
  }, [phrase]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      setIsRecording(false);
      const targetNorm1 = answer1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const targetNorm2 = answer2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const spokenNorm = spoken.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const found1 = spokenNorm.includes(targetNorm1) || targetNorm1.includes(spokenNorm);
      const found2 = spokenNorm.includes(targetNorm2) || targetNorm2.includes(spokenNorm);
      let stars = 0;
      if (found1 && found2) {
        stars = 3;
        setFeedback(`🎉 ¡Excelente! Las palabras son correctas`);
        speak(`¡Increíble, ${userName || "amigo"}! Las palabras son "${answer1}" y "${answer2}".`, 0.8, () => onComplete(stars));
      } else if (attempts === 0) {
        setAttempts(1);
        let missing = []; if (!found1) missing.push(answer1); if (!found2) missing.push(answer2);
        setFeedback(`Te falta${missing.length > 1 ? 'n' : ''} ${missing.join(' y ')}. ¡Intenta de nuevo!`);
        setStep('listening');
        speak(`Pista: ${!found1 ? hint1 : ''} ${!found2 ? hint2 : ''}`, 0.75, () => { setStep('speaking'); setFeedback("🎤 Di la frase completa"); });
      } else {
        stars = 1;
        setFeedback("¡Buen intento! 💡");
        setStep('feedback');
        speak(`Buen esfuerzo. Las palabras eran "${answer1}" y "${answer2}"`, 0.8, () => onComplete(stars));
      }
    };
    recognition.onerror = () => { setIsRecording(false); setFeedback("No capturé el audio. Intenta hablar claro 🎤"); setStep('speaking'); };
    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-5 md:p-10 text-center">
      <div className="bg-purple-50 rounded-2xl p-4 md:p-6 mb-6"><span className="text-6xl md:text-7xl">{image}</span></div>
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 md:p-5 mb-4">
        <p className="text-base md:text-xl text-purple-900 font-semibold leading-relaxed break-words">
          {displayPhrase.split("______").map((part, i) => (
            <span key={i}>
              {part}
              {i < displayPhrase.split("______").length - 1 && (
                <span className="inline-block px-3 md:px-4 py-1 md:py-2 mx-1 md:mx-2 bg-white rounded-xl text-purple-700 tracking-widest font-mono font-black border-2 border-purple-300 shadow-sm text-sm md:text-base">
                  {i === 0 ? visual1 : visual2}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
        <div className="bg-yellow-50 px-3 md:px-4 py-1 md:py-2 rounded-full border border-yellow-200"><p className="text-xs md:text-sm text-yellow-700 font-bold">💡 {hint1}</p></div>
        <div className="bg-yellow-50 px-3 md:px-4 py-1 md:py-2 rounded-full border border-yellow-200"><p className="text-xs md:text-sm text-yellow-700 font-bold">💡 {hint2}</p></div>
      </div>
      <div className="mb-6 min-h-[24px]"><p className="text-sm md:text-base text-gray-700 font-medium">{feedback}</p></div>
      {step === 'speaking' && (
        <button onClick={startListening} disabled={isRecording} className={`${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'} text-white rounded-full px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold shadow-xl flex items-center gap-3 mx-auto transition-all`}>
          <Mic size={24} /> {isRecording ? "Escuchando..." : "🎙️ Decir frase completa"}
        </button>
      )}
      {step === 'listening' && (
        <div className="flex justify-center items-center gap-2 text-purple-600 font-medium">
          <Loader2 className="animate-spin" size={24} /><span>El asistente está hablando...</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const Activity2 = ({ age, stars, userName, onAwardStars, onFinish, onExit }: Activity2Props) => {
  const isYoung = age <= 7;
  const phrases = isYoung ? youngPhrases : oldPhrases;
  const [shuffledPhrases, setShuffledPhrases] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showRPractice, setShowRPractice] = useState(false);
  const [pendingRPracticeWords, setPendingRPracticeWords] = useState<string[]>([]);
  const [tempStars, setTempStars] = useState(0);

  useEffect(() => {
    const shuffled = [...phrases].sort(() => Math.random() - 0.5);
    setShuffledPhrases(shuffled.slice(0, 3));
  }, []);

  const currentPhrase = shuffledPhrases[currentIndex];

  const advanceToNext = () => {
    if (currentIndex + 1 < shuffledPhrases.length) {
      setCurrentIndex(prev => prev + 1);
      setShowActivity(true);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleYoungComplete = (earnedStars: number, rWords: string[] = []) => {
    setTempStars(earnedStars);
    if (rWords.length > 0) {
      setPendingRPracticeWords(rWords);
      setShowRPractice(true);
    } else {
      if (earnedStars > 0) onAwardStars(earnedStars);
      setShowActivity(false);
      advanceToNext();
    }
  };

  const handleRPracticeComplete = (success: boolean) => {
    setShowRPractice(false);
    if (tempStars > 0) onAwardStars(tempStars);
    setShowActivity(false);
    advanceToNext();
  };

  const handleOldComplete = (earnedStars: number) => {
    if (earnedStars > 0) onAwardStars(earnedStars);
    setShowActivity(false);
    advanceToNext();
  };

  const startSession = () => {
    setShowActivity(true);
    speak(`¡Hola ${userName || "amigo"}! Vamos a practicar ${shuffledPhrases.length} frases.`, 0.8);
  };

  // Pantalla Inicial
  if (!showActivity && !sessionCompleted && shuffledPhrases.length > 0 && currentIndex === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={onExit} className="bg-white rounded-full p-3 shadow-md"><Home size={24} className="text-purple-600" /></button>
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-lg"><Star className="text-yellow-500 fill-yellow-500" size={24} /><span className="text-xl font-bold text-purple-600">{stars}</span></div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 text-center">
            <span className="text-8xl mb-4 block">{isYoung ? "🎤" : "📝"}</span>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">{isYoung ? "Repite la frase" : "Completa la frase"}</h3>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">{isYoung ? "Escucha y repite la frase en el micrófono" : "Escucha, mira las pistas y di la frase completa"}</p>
            <div className="bg-purple-50 rounded-2xl p-4 mb-8 inline-block px-10"><p className="text-xl font-bold text-purple-600">{shuffledPhrases.length} Ejercicios</p></div>
            <button onClick={startSession} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-10 py-5 text-2xl font-bold shadow-xl flex items-center gap-3 mx-auto"><ArrowRight size={28} /> Comenzar</button>
          </div>
        </div>
      </div>
    );
  }
// Pantalla de finalización
if (sessionCompleted) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-4"
          >
            <span className="text-7xl md:text-8xl">🏆</span>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
            ¡Felicidades!
          </h2>
          
          <p className="text-gray-500 text-sm md:text-base mb-6">
            Completaste todas las frases
          </p>
          
          <div className="flex justify-center items-center gap-2 bg-purple-50 rounded-2xl py-3 mb-6">
            <Star className="text-yellow-500 fill-yellow-500" size={28} />
            <span className="text-2xl md:text-3xl font-bold text-purple-700">
              {stars} estrellas
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onFinish}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all text-base md:text-lg shadow-md"
            >
              Volver al menú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

  // Renderizar actividad
  if (!currentPhrase) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onExit} className="bg-white rounded-full p-3 shadow-md"><Home size={24} className="text-purple-600" /></button>
          <div className="flex items-center gap-4">
            <div className="bg-white px-3 md:px-4 py-1 md:py-2 rounded-full border border-purple-200 shadow-sm font-bold text-purple-700 text-sm md:text-base">Progreso: {currentIndex + 1} / {shuffledPhrases.length}</div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 md:px-5 py-1 md:py-2 shadow-lg"><Star className="text-yellow-500 fill-yellow-500" size={20} /><span className="text-lg md:text-xl font-bold text-purple-600">{stars}</span></div>
          </div>
        </div>

        {showActivity && isYoung && (
          <YoungActivity key={currentIndex} phrase={currentPhrase.text} image={currentPhrase.image} hint={currentPhrase.hint} userName={userName} onComplete={handleYoungComplete} />
        )}
        {showActivity && !isYoung && (
          <OldActivity key={currentIndex} phrase={currentPhrase.text} image={currentPhrase.image} hint1={currentPhrase.hint1} hint2={currentPhrase.hint2} answer1={currentPhrase.answer1} answer2={currentPhrase.answer2} visual1={currentPhrase.visual1} visual2={currentPhrase.visual2} userName={userName} onComplete={handleOldComplete} />
        )}

        {showRPractice && pendingRPracticeWords.length > 0 && (
          <RPractice word={pendingRPracticeWords[0]} userName={userName} onComplete={handleRPracticeComplete} />
        )}
      </div>
    </div>
  );
};