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

type YoungPhrase = {
  text: string;
  image: string;
  hint: string;
};

type OldPhrase = {
  text: string;
  image: string;
  hint1: string;
  hint2: string;
  answer1: string;
  answer2: string;
  visual1: string;
  visual2: string;
};

type PracticePhrase = YoungPhrase | OldPhrase;

// ============================================
// FRASES POR EDAD
// ============================================

const youngPhrases: YoungPhrase[] = [
  { text: "El gato duerme", image: "🐱", hint: "😴" },
  { text: "El perro corre", image: "🐶", hint: "🏃" },
  { text: "La niña baila", image: "👧", hint: "💃" },
  { text: "El niño juega", image: "👦", hint: "⚽" },
  { text: "El sol brilla", image: "☀️", hint: "✨" },
  { text: "La luna sale", image: "🌙", hint: "🌃" },
  { text: "El pájaro vuela", image: "🐦", hint: "🕊️" },
  { text: "El pez nada", image: "🐟", hint: "💧" },
  { text: "La flor crece", image: "🌸", hint: "🌱" },
  { text: "El coche va rápido", image: "🚗", hint: "💨" },
  { text: "La mariposa es colorida", image: "🦋", hint: "🌈" },
  { text: "El árbol es alto", image: "🌳", hint: "🌲" },
  { text: "El libro tiene historias", image: "📚", hint: "📖" },
  { text: "El niño come manzana", image: "🍎", hint: "🍏" },
  { text: "La niña tiene muñeca", image: "👧", hint: "🪆" },
  { text: "El perro ladra fuerte", image: "🐶", hint: "🔊" },
  { text: "El gato maúlla", image: "🐱", hint: "😺" },
  { text: "El sol calienta la tierra", image: "☀️", hint: "🔥" },
  { text: "La luna ilumina la noche", image: "🌙", hint: "🌌" },
  { text: "El pájaro canta en la mañana", image: "🐦", hint: "🎶" },
  { text: "El pez nada en el agua", image: "🐟", hint: "🌊" },
  { text: "La flor huele bien", image: "🌸", hint: "👃" },
];

// Para niños grandes: frases con DOS palabras ocultas
const oldPhrases: OldPhrase[] = [
  { 
    text: "El astronauta viaja al espacio", 
    image: "👨‍🚀", 
    hint1: "Persona que viaja al espacio", 
    hint2: "Lugar fuera de la Tierra",
    answer1: "astronauta", 
    answer2: "espacio",
    visual1: "a _ _ _ _ _ _ _ a", 
    visual2: "e _ _ _ _ _ o" 
  },
  { 
    text: "La mariposa vuela entre las flores", 
    image: "🦋", 
    hint1: "Insecto con alas coloridas", 
    hint2: "Plantas que dan color al jardín",
    answer1: "mariposa", 
    answer2: "flores",
    visual1: "m _ _ _ _ _ _ a", 
    visual2: "f _ _ _ _ s" 
  },
  { 
    text: "El arquitecto diseña edificios", 
    image: "🏗️", 
    hint1: "Profesión que crea planos", 
    hint2: "Construcciones grandes donde vive la gente",
    answer1: "arquitecto", 
    answer2: "edificios",
    visual1: "a _ _ _ _ _ _ _ o", 
    visual2: "e _ _ _ _ _ _ s" 
  },
  { 
    text: "El telescopio ve las estrellas", 
    image: "🔭", 
    hint1: "Instrumento para ver el espacio", 
    hint2: "Puntos brillantes en el cielo nocturno",
    answer1: "telescopio", 
    answer2: "estrellas",
    visual1: "t _ _ _ _ _ _ _ o", 
    visual2: "e _ _ _ _ _ _ s" 
  },
  { 
    text: "El violinista toca el violín", 
    image: "🎻", 
    hint1: "Persona que toca un instrumento", 
    hint2: "Instrumento de cuerdas",
    answer1: "violinista", 
    answer2: "violín",
    visual1: "v _ _ _ _ _ _ _ a", 
    visual2: "v _ _ _ _ n" 
  },
  { 
    text: "El dinosaurio vivió en la prehistoria", 
    image: "🦕", 
    hint1: "Animal gigante que ya no existe", 
    hint2: "Período antes de los humanos",
    answer1: "dinosaurio", 
    answer2: "prehistoria",
    visual1: "d _ _ _ _ _ _ _ o", 
    visual2: "p _ _ _ _ _ _ _ a" 
  },
  { 
    text: "El detective resuelve misterios", 
    image: "🕵️", 
    hint1: "Persona que investiga casos", 
    hint2: "Problemas o enigmas por resolver",
    answer1: "detective", 
    answer2: "misterios",
    visual1: "d _ _ _ _ _ _ e", 
    visual2: "m _ _ _ _ _ _ s" 
  },
  { 
    text: "La niña juega en el parque", 
    image: "👧", 
    hint1: "Niño que disfruta del tiempo libre", 
    hint2: "Lugar donde los niños se divierten",
    answer1: "niña", 
    answer2: "parque",
    visual1: "n _ _ _ a", 
    visual2: "p _ _ _ _ e" 
  },
  {
    text: "El chef cocina platos deliciosos",
    image: "👨‍🍳",
    hint1: "Persona que prepara comida",
    hint2: "Comidas sabrosas y ricas",
    answer1: "chef",
    answer2: "platos",
    visual1: "c _ _ _ e",
    visual2: "p _ _ _ s"
  },
  {
    text: "El piloto vuela el avión",
    image: "✈️",
    hint1: "Persona que maneja un avión",
    hint2: "Medio de transporte que vuela",
    answer1: "piloto",
    answer2: "avión",
    visual1: "p _ _ _ _ o",
    visual2: "a _ _ _ n"
  },
  {
    text: "El mago hace trucos de magia",
    image: "🧙‍♂️",
    hint1: "Persona con poderes mágicos",
    hint2: "Actos sorprendentes y enigmáticos",
    answer1: "mago",
    answer2: "magia",
    visual1: "m _ _ _ o",
    visual2: "m _ _ _ _ a"
  },
  {
    text: "El perro juega en el parque",
    image: "🐕",
    hint1: "Mascota que vive con las personas",
    hint2: "Lugar donde los niños y sus mascotas se divierten",
    answer1: "perro",
    answer2: "parque",
    visual1: "p _ _ _ o",
    visual2: "p _ _ _ _ e"
  },
  {
    text: "La profesora enseña a los estudiantes",
    image: "👩‍🏫",
    hint1: "Persona que imparte conocimientos",
    hint2: "Personas que aprenden en la escuela",
    answer1: "profesora",
    answer2: "estudiantes",
    visual1: "p _ _ _ _ _ a",
    visual2: "e _ _ _ _ _ s"
  },
  {
    text: "El pintor crea obras de arte",
    image: "🎨",
    hint1: "Persona que pinta cuadros",
    hint2: "Creaciones visuales",
    answer1: "pintor",
    answer2: "obras",
    visual1: "p _ _ _ o",
    visual2: "o _ _ _ s"
  },
  {
    text: "El músico toca la guitarra",
    image: "🎸",
    hint1: "Persona que toca un instrumento",
    hint2: "Herramienta para hacer música",
    answer1: "músico",
    answer2: "guitarra",
    visual1: "m _ _ _ _ o",
    visual2: "g _ _ _ _ a"
  },
  {
    text: "El bombero apaga incendios",
    image: "🚒",
    hint1: "Persona que combate el fuego",
    hint2: "Lucha contra el fuego",
    answer1: "bombero",
    answer2: "incendios",
    visual1: "b _ _ _ _ o",
    visual2: "i _ _ _ _ s"
  },
  {
    text: "El jardinero cuida las plantas",
    image: "👨‍🌾",
    hint1: "Persona que trabaja en el jardín",
    hint2: "Cuida las plantas y las flores",
    answer1: "jardinero",
    answer2: "plantas",
    visual1: "j _ _ _ _ o",
    visual2: "p _ _ _ _ s"
  },
  {
    text: "El atleta corre en la pista",
    image: "🏃‍♂️",
    hint1: "Persona que practica deportes",
    hint2: "Lugar para correr y competir",
    answer1: "atleta",
    answer2: "pista",
    visual1: "a _ _ _ a",
    visual2: "p _ _ a"
  },
  {
    text: "El escritor escribe libros",
    image: "✍️",
    hint1: "Persona que crea historias",
    hint2: "Obras literarias",
    answer1: "escritor",
    answer2: "libros",
    visual1: "e _ _ _ o",
    visual2: "l _ _ _ s"
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
// COMPONENTE PARA NIÑOS GRANDES (≥8 años) - DOS PALABRAS
// ============================================

const OldActivity = ({ phrase, image, hint1, hint2, answer1, answer2, visual1, visual2, onComplete, userName }: { 
  phrase: string; 
  image: string; 
  hint1: string;
  hint2: string;
  answer1: string;
  answer2: string;
  visual1: string;
  visual2: string;
  userName?: string;
  onComplete: (stars: number) => void;
}) => {
  const [step, setStep] = useState<'listening' | 'speaking' | 'feedback'>('listening');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [answersFound, setAnswersFound] = useState<number[]>([]);
  const recognitionRef = useRef<any>(null);

  // Reemplazar ambas palabras ocultas en la frase
  const displayPhrase = phrase
    .replace(answer1, "_____")
    .replace(answer2, "_____");

  useEffect(() => {
    setFeedback("🔊 Escucha la frase incompleta...");
    const verbalPhrase = phrase
      .replace(answer1, "primera palabra oculta")
      .replace(answer2, "segunda palabra oculta");
    
    speak(`Observa la imagen. ${verbalPhrase}`, 0.75, () => {
      setFeedback("🎤 Di la frase completa con las dos palabras que faltan");
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

      const targetNorm1 = answer1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const targetNorm2 = answer2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const spokenNorm = spoken.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const found1 = spokenNorm.includes(targetNorm1) || targetNorm1.includes(spokenNorm);
      const found2 = spokenNorm.includes(targetNorm2) || targetNorm2.includes(spokenNorm);
      const bothFound = found1 && found2;

      let stars = 0;

      if (bothFound) {
        stars = 3;
        setFeedback(`¡Excelente! "${answer1}" y "${answer2}" son las palabras correctas 🎉`);
        setStep('feedback');
        speak(`¡Increíble, ${userName || "amigo"}! Las palabras correctas son "${answer1}" y "${answer2}".`, 0.8, () => onComplete(stars));
      } else if (attempts === 0) {
        setAttempts(1);
        let missing = [];
        if (!found1) missing.push(`"${answer1}"`);
        if (!found2) missing.push(`"${answer2}"`);
        setFeedback(`Dijiste "${spoken}". Te falta${missing.length > 1 ? 'n' : ''} ${missing.join(' y ')}. ¡Intenta de nuevo!`);
        setStep('listening');
        speak(`Mencionaste "${spoken}". Repito: ${!found1 ? hint1 : ''} ${!found2 ? hint2 : ''}.`, 0.75, () => {
          setStep('speaking');
          setFeedback("🎤 Di la frase completa con las dos palabras");
        });
      } else {
        stars = 1;
        setFeedback("¡Buen intento! 💡");
        setStep('feedback');
        speak(`Buen esfuerzo. Las respuestas eran "${answer1}" y "${answer2}". Sigamos adelante.`, 0.8, () => onComplete(stars));
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

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 text-center">
      <div className="bg-purple-50 rounded-2xl p-6 mb-6">
        <span className="text-7xl">{image}</span>
      </div>

      {/* Frase con espacios para dos palabras */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-5 mb-4">
        <p className="text-xl text-purple-900 font-semibold leading-relaxed">
          {displayPhrase.split("_____").map((part, i) => (
            <span key={i}>
              {part}
              {i < displayPhrase.split("_____").length - 1 && (
                <span className="inline-block px-4 py-2 mx-2 bg-white rounded-xl text-purple-700 tracking-widest font-mono font-black border-2 border-purple-300 shadow-sm min-w-[100px]">
                  {i === 0 ? visual1 : visual2}
                </span>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* Pistas */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <div className="bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
          <p className="text-yellow-700 text-sm font-bold">💡 Pista 1: {hint1}</p>
        </div>
        <div className="bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
          <p className="text-yellow-700 text-sm font-bold">💡 Pista 2: {hint2}</p>
        </div>
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
          {isRecording ? "Escuchando..." : "🎙️ Decir frase completa"}
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

  const [shuffledPhrases] = useState<PracticePhrase[]>(() => {
    const shuffled = [...phrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3) as PracticePhrase[];
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
    speak(`¡Hola ${userName || "amigo"}! Vamos a practicar ${shuffledPhrases.length} frases divertidas.`, 0.8);
  };

  // Pantalla Inicial
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
              {isYoung ? "Repite la frase" : "Completa la frase con dos palabras"}
            </h3>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              {isYoung 
                ? "Escucha atentamente el enunciado que te diga el asistente y repítelo usando el micrófono." 
                : "Escucha la oración, mira las pistas y las letras, y di la frase completa con las dos palabras que faltan."}
            </p>
            <div className="bg-purple-50 rounded-2xl p-4 mb-8 inline-block px-10">
              <p className="text-xl font-bold text-purple-600">{shuffledPhrases.length} Ejercicios</p>
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

  // Pantalla de finalización
  if (sessionCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <span className="text-8xl mb-4 block">🎉</span>
          <h3 className="text-4xl font-bold text-gray-800 mb-2">¡Completado!</h3>
          <p className="text-gray-500 mb-6">Has hecho un maravilloso trabajo.</p>
          <div className="flex justify-center items-center gap-2 bg-purple-50 rounded-2xl py-4 mb-8">
            <Star className="text-yellow-500 fill-yellow-500" size={32} />
            <span className="text-3xl font-bold text-purple-700">{stars} Estrellas</span>
          </div>
          <button 
            onClick={onFinish} 
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-10 py-4 text-xl font-bold shadow-xl transition-colors w-full"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // Renderizar actividad en curso
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
      <div className="max-w-3xl mx-auto">
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

        {showActivity && (
          isYoung ? (
            <YoungActivity
              key={currentIndex}
              phrase={currentPhrase.text}
              image={currentPhrase.image}
              hint={(currentPhrase as YoungPhrase).hint}
              userName={userName}
              onComplete={handleComplete}
            />
          ) : (
            <OldActivity
              key={currentIndex}
              phrase={currentPhrase.text}
              image={currentPhrase.image}
              hint1={(currentPhrase as OldPhrase).hint1}
              hint2={(currentPhrase as OldPhrase).hint2}
              answer1={(currentPhrase as OldPhrase).answer1}
              answer2={(currentPhrase as OldPhrase).answer2}
              visual1={(currentPhrase as OldPhrase).visual1}
              visual2={(currentPhrase as OldPhrase).visual2}
              userName={userName}
              onComplete={handleComplete}
            />
          )
        )}
      </div>
    </div>
  );
};