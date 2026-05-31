import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Home, Star, Mic, Loader2, ArrowRight } from "lucide-react";

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
];

const oldPhrases = [
  { text: "El astronauta viaja al espacio", image: "👨‍🚀", hint: "Empieza con A", answer: "astronauta" },
  { text: "La mariposa vuela entre flores", image: "🦋", hint: "Empieza con M", answer: "mariposa" },
  { text: "El arquitecto diseña edificios", image: "🏗️", hint: "Empieza con A", answer: "arquitecto" },
  { text: "El telescopio ve las estrellas", image: "🔭", hint: "Empieza con T", answer: "telescopio" },
  { text: "El violinista toca el violín", image: "🎻", hint: "Empieza con V", answer: "violinista" },
  { text: "El dinosaurio vivió en la prehistoria", image: "🦕", hint: "Empieza con D", answer: "dinosaurio" },
];

// ============================================
// FUNCIONES DE VOZ
// ============================================

const speak = (text: string, rate: number = 0.75, onEnd?: () => void) => {
  window.speechSynthesis.cancel(); // Detiene cualquier audio previo colgado
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
// COMPONENTE PARA NIÑOS PEQUEÑOS (≤7 años)
// ============================================

const YoungActivity = ({ phrase, image, hint, onComplete, userName }: { 
  phrase: string; 
  image: string; 
  hint: string;
  userName?: string;
  onComplete: (stars: number) => void;
}) => {
  const [step, setStep] = useState<'listening' | 'speaking' | 'feedback'>('listening');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setFeedback("🎧 Escucha la frase...");
    speak(`Mira la imagen. Escucha con atención: ${phrase}`, 0.75, () => {
      setFeedback("🎤 ¡Ahora es tu turno! Repite la frase");
      setStep('speaking');
    });

    return () => {
      cancelSpeak();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [phrase]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      setIsRecording(false);

      const targetNorm = phrase.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const spokenNorm = spoken.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      let stars = 0;

      if (spokenNorm === targetNorm || targetNorm.includes(spokenNorm) || spokenNorm.includes(targetNorm)) {
        stars = 3;
        setFeedback("¡Excelente! 🎉");
        setStep('feedback');
        speak(`¡Muy bien, ${userName || "amigo"}! Lo dijiste perfecto.`, 0.8, () => onComplete(stars));
      } else if (attempts === 0) {
        setAttempts(1);
        setFeedback(`Escuché "${spoken}". ¡Intentémoslo una vez más!`);
        setStep('listening');
        speak(`Casi, escuché "${spoken}". Vamos a repetir. Escucha: ${phrase}`, 0.75, () => {
          setStep('speaking');
          setFeedback("🎤 Repite la frase");
        });
      } else {
        stars = 1;
        setFeedback("¡Bien intentado! ✨");
        setStep('feedback');
        speak(`Buen intento. La frase era "${phrase}". ¡Vamos a la siguiente!`, 0.8, () => onComplete(stars));
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setFeedback("No logré escucharte. ¡Inténtalo de nuevo! 🎤");
      setStep('speaking');
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 text-center">
      <div className="bg-purple-50 rounded-2xl p-8 mb-6 flex justify-center items-center gap-4">
        <span className="text-8xl">{image}</span>
        <span className="text-5xl">{hint}</span>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-5 mb-6">
        <p className="text-2xl text-purple-800 font-bold">{phrase}</p>
      </div>

      <div className="mb-6 min-h-[30px]">
        <p className="text-lg text-gray-600 font-medium">{feedback}</p>
      </div>

      {step === 'speaking' && (
        <button
          onClick={startListening}
          disabled={isRecording}
          className={`${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'} text-white rounded-full px-10 py-5 text-xl font-bold shadow-xl flex items-center gap-3 mx-auto transition-all`}
        >
          <Mic size={24} />
          {isRecording ? "Escuchando..." : "🎙️ Hablar ahora"}
        </button>
      )}

      {step === 'listening' && (
        <div className="flex justify-center items-center gap-2 text-purple-600 font-medium">
          <Loader2 className="animate-spin" size={24} />
          <span>El asistente está hablando...</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE PARA NIÑOS GRANDES (≥8 años)
// ============================================

const OldActivity = ({ phrase, image, hint, answer, onComplete, userName }: { 
  phrase: string; 
  image: string; 
  hint: string;
  answer: string;
  userName?: string;
  onComplete: (stars: number) => void;
}) => {
  const [step, setStep] = useState<'listening' | 'speaking' | 'feedback'>('listening');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const recognitionRef = useRef<any>(null);

  // Genera pistas visuales limpias: Ej: "a _ _ _ _ _ _ _ _ a" para astronauta
  const getVisualHint = () => {
    if (answer.length <= 2) return answer;
    const middle = " _ ".repeat(answer.length - 2);
    return `${answer[0]}${middle}${answer[answer.length - 1]}`;
  };

  useEffect(() => {
    setFeedback("🔊 Escucha la frase incompleta...");
    // FIX: Reemplaza la respuesta por "una palabra misteriosa" en la voz para evitar que diga "barra baja"
    const verbalPhrase = phrase.replace(answer, "una palabra oculta");
    
    speak(`Observa la imagen y completa la oración. Escucha: ${verbalPhrase}. ¿Qué palabra falta?`, 0.75, () => {
      setFeedback("🎤 Di únicamente la palabra que falta");
      setStep('speaking');
    });

    return () => {
      cancelSpeak();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [phrase]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      setIsRecording(false);

      const targetNorm = answer.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const spokenNorm = spoken.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      let stars = 0;

      if (spokenNorm === targetNorm || targetNorm.includes(spokenNorm) || spokenNorm.includes(targetNorm)) {
        stars = 3;
        setFeedback("¡Excelente respuesta! ✨");
        setStep('feedback');
        speak(`¡Increíble, ${userName || "amigo"}! La palabra es exactamenta "${answer}".`, 0.8, () => onComplete(stars));
      } else if (attempts === 0) {
        setAttempts(1);
        setFeedback(`Dijiste "${spoken}". ¡Inténtalo de nuevo!`);
        setStep('listening');
        speak(`Mencionaste "${spoken}". Una pista extra: ${hint}. Di la palabra.`, 0.75, () => {
          setStep('speaking');
          setFeedback("🎤 Di la palabra correcta");
        });
      } else {
        stars = 1;
        setFeedback("¡Buen intento! 💡");
        setStep('feedback');
        speak(`Buen esfuerzo. La respuesta correcta era "${answer}". Sigamos adelante.`, 0.8, () => onComplete(stars));
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setFeedback("No capturé el audio. Intenta hablar claro hacia tu micrófono. 🎤");
      setStep('speaking');
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Reemplazamos la palabra misteriosa en la pantalla con el formato dinámico de letras
  const displayPhrase = phrase.replace(answer, "_____");

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 text-center">
      <div className="bg-purple-50 rounded-2xl p-6 mb-6">
        <span className="text-7xl">{image}</span>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-5 mb-4">
        <p className="text-2xl text-purple-900 font-semibold leading-relaxed">
          {displayPhrase.split("_____").map((part, i) => (
            <span key={i}>
              {part}
              {i < displayPhrase.split("_____").length - 1 && (
                <span className="inline-block px-3 py-1 mx-2 bg-white rounded-xl text-purple-700 tracking-widest font-mono font-black border-2 border-purple-300 shadow-sm animate-pulse">
                  {getVisualHint()}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>

      <div className="mb-4 bg-yellow-50 inline-block px-4 py-2 rounded-full border border-yellow-200">
        <p className="text-yellow-700 text-sm font-bold">💡 Pista: {hint}</p>
      </div>

      <div className="mb-6 min-h-[24px]">
        <p className="text-gray-700 font-medium">{feedback}</p>
      </div>

      {step === 'speaking' && (
        <button
          onClick={startListening}
          disabled={isRecording}
          className={`${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'} text-white rounded-full px-10 py-5 text-xl font-bold shadow-xl flex items-center gap-3 mx-auto transition-all`}
        >
          <Mic size={24} />
          {isRecording ? "Escuchando..." : "🎙️ Decir palabra"}
        </button>
      )}

      {step === 'listening' && (
        <div className="flex justify-center items-center gap-2 text-purple-600 font-medium">
          <Loader2 className="animate-spin" size={24} />
          <span>Preparando el ejercicio...</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL (Activity2)
// ============================================

export const Activity2 = ({ age, stars, userName, onAwardStars, onFinish, onExit }: Activity2Props) => {
  const isYoung = age <= 7;
  const phrases = isYoung ? youngPhrases : oldPhrases;

  const [shuffledPhrases] = useState(() => {
    const shuffled = [...phrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3); // Cambiado a un filtro estándar rápido
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const currentPhrase = shuffledPhrases[currentIndex];

  const advanceToNext = () => {
    if (currentIndex + 1 < shuffledPhrases.length) {
      setCurrentIndex(prev => prev + 1);
      setShowActivity(true);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleComplete = (starsEarned: number) => {
    setShowActivity(false);
    if (starsEarned > 0) onAwardStars(starsEarned);
    advanceToNext();
  };

  const startSession = () => {
    setShowActivity(true);
    speak(`¡Hola ${userName || "amigo"}! Vamos a practicar ${shuffledPhrases.length} divertidas frases.`, 0.8);
  };

  // Pantalla Inicial de Introducción
  if (!showActivity && !sessionCompleted && currentIndex === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={onExit} className="bg-white rounded-full p-3 shadow-md hover:bg-gray-50">
              <Home size={24} className="text-purple-600" />
            </button>
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-lg">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
              <span className="text-xl font-bold text-purple-600">{stars}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 text-center">
            <span className="text-8xl mb-4 block">{isYoung ? "🎤" : "📝"}</span>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              {isYoung ? "Repite la frase" : "Completa la frase"}
            </h3>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              {isYoung 
                ? "Escucha atentamente el enunciado que te diga el asistente y repítelo usando el micrófono." 
                : "Escucha la oración completa, mira la palabra misteriosa y descubre cuál falta guiándote de la primera y última letra."}
            </p>
            <div className="bg-purple-50 rounded-2xl p-4 mb-8 inline-block px-10">
              <p className="text-xl font-bold text-purple-600">{shuffledPhrases.length} Ejercicios en esta ronda</p>
            </div>
            <button 
              onClick={startSession} 
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-10 py-5 text-2xl font-bold shadow-xl flex items-center gap-3 mx-auto hover:opacity-95 transition-opacity"
            >
              <ArrowRight size={28} /> Comenzar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Felicitaciones y Cierre
  if (sessionCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <span className="text-8xl mb-4 block">🎉</span>
          <h3 className="text-4xl font-bold text-gray-800 mb-2">¡Completado!</h3>
          <p className="text-gray-500 mb-6">Has hecho un maravilloso trabajo de lectura y habla.</p>
          <div className="flex justify-center items-center gap-2 bg-purple-50 rounded-2xl py-4 mb-8">
            <Star className="text-yellow-500 fill-yellow-500" size={32} />
            <span className="text-3xl font-bold text-purple-700">{stars} Estrellas Totales</span>
          </div>
          <button 
            onClick={onFinish} 
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-10 py-4 text-xl font-bold shadow-xl transition-colors w-full"
          >
            Continuar al Menú
          </button>
        </div>
      </div>
    );
  }

  // Renderizar la actividad en ejecución
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Subheader interno */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onExit} className="bg-white rounded-full p-3 shadow-md hover:bg-gray-50">
            <Home size={24} className="text-purple-600" />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm font-bold text-purple-700">
              Progreso: {currentIndex + 1} / {shuffledPhrases.length}
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-lg">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
              <span className="text-xl font-bold text-purple-600">{stars}</span>
            </div>
          </div>
        </div>

        {/* 
          Añadir el atributo key={currentIndex} es el secreto crítico:
          Fuerza a React a desmontar y montar el juego de forma nativa por ronda.
          Elimina bugs de estados heredados de la ronda anterior por completo.
        */}
        {showActivity && (
          isYoung ? (
            <YoungActivity
              key={currentIndex}
              phrase={currentPhrase.text}
              image={currentPhrase.image}
              hint={currentPhrase.hint}
              userName={userName}
              onComplete={handleComplete}
            />
          ) : (
            <OldActivity
              key={currentIndex}
              phrase={currentPhrase.text}
              image={currentPhrase.image}
              hint={currentPhrase.hint}
              answer={currentPhrase.answer}
              userName={userName}
              onComplete={handleComplete}
            />
          )
        )}
      </div>
    </div>
  );
};