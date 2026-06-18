import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Home, Star, Mic, Loader2, ArrowRight, Volume2 } from "lucide-react";
import { createPhrase } from "../../utils/wordVisuals";
import { speak, speakWithQueue, cancelSpeak, assistantPhrases } from "../../services/warmVoiceService";
import { triggerEquippedEffect } from "../../services/effectsServices";

interface Activity2Props {
  age: number;
  stars: number;
  userName?: string;
  onAwardStars: (amount: number) => void;
  onFinish: () => void;
  onExit: () => void;
  themeClass?: string;
  onUpdateStats?: (updates: Partial<{
    totalWords: number;
    totalSounds: number;
    perfectStreak: number;
    activitiesCompleted: number;
    totalStars: number;
  }>) => void;
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
  { text: "La nube llueve", image: "☁️", hint: "🌧️" },
  { text: "El pez nada en el mar", image: "🐟", hint: "🌊" },
  { text: "La estrella brilla en el cielo", image: "⭐", hint: "🌌" },
  { text: "El oso hiberna en invierno", image: "🐻", hint: "❄️" },
  { text: "La mariposa revolotea entre las flores", image: "🦋", hint: "🌸" },
  { text: "El conejo come zanahorias", image: "🐇", hint: "🥕" },
  { text: "La vaca da leche", image: "🐄", hint: "🥛" },
  { text: "El perro ladra fuerte", image: "🐕", hint: "🔊" },
  { text: "La abeja zumba alrededor de las flores", image: "🐝", hint: "🌼" },
  { text: "El elefante tiene una trompa larga", image: "🐘", hint: "👃" },
  { text: "La mariposa tiene alas coloridas", image: "🦋", hint: "🎨" },
  { text: "El pez tiene aletas para nadar", image: "🐠", hint: "🏊" },
];

// ============================================
// FRASES PARA NIÑOS GRANDES (con visuales automáticos)
// ============================================

const oldPhrases = [
  createPhrase(
    "El astronauta viaja al espacio",
    "astronauta",
    "espacio",
    "👨‍🚀",
    "Persona que viaja al espacio",
    "Lugar fuera de la Tierra"
  ),
  createPhrase(
    "La mariposa vuela entre las flores",
    "mariposa",
    "flores",
    "🦋",
    "Insecto con alas coloridas",
    "Plantas que dan color al jardín"
  ),
  createPhrase(
    "El arquitecto diseña edificios",
    "arquitecto",
    "edificios",
    "🏗️",
    "Profesión que crea planos",
    "Construcciones grandes"
  ),
  createPhrase(
    "La guitarra suena con melodía",
    "guitarra",
    "melodía",
    "🎸",
    "Instrumento musical de cuerdas",
    "Combinación de sonidos agradables"
  ),
  createPhrase(
    "El científico investiga nuevos descubrimientos",
    "científico",
    "descubrimientos",
    "🔬",
    "Persona que estudia la naturaleza",
    "Hallazgos importantes"
  ),
  createPhrase(
    "La biblioteca tiene muchos libros interesantes",
    "biblioteca",
    "libros",
    "📚",
    "Lugar donde se guardan libros",
    "Objetos con páginas para leer"
  ),
  createPhrase(
    "El pintor crea obras de arte con colores",
    "pintor",
    "arte",
    "🎨",
    "Persona que pinta cuadros",
    "Resultados visuales de la creatividad"
  ),
  createPhrase(
    "La computadora procesa información rápidamente",
    "computadora",
    "información",
    "💻",
    "Máquina electrónica para trabajar o jugar",
    "Datos que se manejan en la tecnología"
  ),
  createPhrase(
    "El chef cocina platos deliciosos en el restaurante",
    "chef",
    "restaurante",
    "👨‍🍳",
    "Persona que prepara comida",
    "Lugar donde se sirven comidas"
  ),
  createPhrase(
    "La música clásica es apreciada por su belleza",
    "música",
    "belleza",
    "🎵",
    "Tipo de música considerada elegante",
    "Calidad estética de la música"
  ),
  createPhrase(
    "El volcán erupciona con fuerza y lava",
    "volcán",
    "lava",
    "🌋",
    "Estructura geológica que lanza material fundido",
    "Líquido caliente que sale del interior de la Tierra"
  ),
  createPhrase(
    "La astronomía estudia los cuerpos celestes",
    "astronomía",
    "cuerpos",
    "🔭",
    "Ciencia que estudia los objetos en el espacio",
    "Entidades que existen fuera de la Tierra"
  ),
  createPhrase(
    "El reloj marca la hora con precisión",
    "reloj",
    "hora",
    "⏰",
    "Objeto que muestra el tiempo",
    "Instrumento para medir el tiempo"
  ),
  createPhrase(
    "La fotografía captura momentos especiales",
    "fotografía",
    "momentos",
    "📸",
    "Imagen tomada con una cámara",
    "Instante que se conserva en la memoria"
  ),
  createPhrase(
    "El deporte es importante para la salud física y mental",
    "deporte",
    "salud",
    "⚽",
    "Actividad que mejora el estado de ánimo",
    "Práctica que fortalece el cuerpo"
  ),
  createPhrase(
    "La poesía expresa emociones con palabras",
    "poesía",
    "emociones",
    "📖",
    "Forma de arte literaria que utiliza el lenguaje de manera creativa",
    "Sentimientos que se transmiten a través de la poesía"
  ),
  createPhrase(
    "El ingeniero construye puentes resistentes",
    "ingeniero",
    "puentes",
    "🏗️",
    "Profesión que diseña estructuras",
    "Elementos que conectan dos puntos"
  ),
  createPhrase(
    "La televisión muestra programas interesantes",
    "televisión",
    "programas",
    "📺",
    "Dispositivo que emite imágenes y sonido",
    "Contenido que se presenta en la pantalla"
  ),
  createPhrase(
    "El zoológico alberga animales de todo el mundo",
    "zoológico",
    "animales",
    "🦁",
    "Lugar donde se mantienen animales en cautiverio",
    "Espacio dedicado a la conservación y exhibición de fauna"
  ),
  createPhrase(
    "La filosofía reflexiona sobre la existencia y el conocimiento",
    "filosofía",
    "existencia",
    "💭",
    "Ciencia que estudia la naturaleza de la realidad y el conocimiento",
    "Pensamiento profundo sobre el sentido de la vida"
  ),
  createPhrase(
    "El teatro presenta obras dramáticas en el escenario",
    "teatro",
    "obras",
    "🎭",
    "Lugar donde se representan piezas teatrales",
    "Espacio para la expresión artística"
  ), 
  createPhrase(
    "La medicina ayuda a curar enfermedades y salvar vidas",
    "medicina",
    "enfermedades",
    "💊",
    "Ciencia que estudia el tratamiento de las enfermedades",
    "Acción de ayudar a las personas a recuperarse de una enfermedad"
  ), 
  createPhrase(
    "El medio ambiente es importante para la vida en la Tierra",
    "medio ambiente",
    "vida",
    "🌍",
    "El entorno natural que nos rodea",
    "Condiciones necesarias para la supervivencia de los seres vivos"
  ),
  createPhrase(
    "El reloj marca la hora con precisión",
    "reloj",
    "hora",
    "⏰",
    "Objeto que muestra el tiempo",
    "Instrumento para medir el tiempo"
  ),
  createPhrase(
    "La fotografía captura momentos especiales",
    "fotografía",
    "momentos",
    "📸",
    "Imagen tomada con una cámara",
    "Instante que se conserva en la memoria"
  ),
  createPhrase(
    "El deporte es importante para la salud física y mental",
    "deporte",
    "salud",
    "⚽",
    "Actividad que mejora el estado de ánimo",
    "Práctica que fortalece el cuerpo"
  ),
  createPhrase(
    "La poesía expresa emociones con palabras",
    "poesía",
    "emociones",
    "📖",
    "Forma de arte literaria que utiliza el lenguaje de manera creativa",
    "Sentimientos que se transmiten a través de la poesía"
  ),
];

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
    speakWithQueue(`Escucha con atención: ${word}`, 0.7).then(() => {
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
        speakWithQueue(`¡Muy bien, ${userName || "amigo"}! La R te quedó genial.`, 0.8).then(() => {
          setTimeout(() => onComplete(true), 1000);
        });
        triggerEquippedEffect();
      } else if (attempts === 0) {
        setAttempts(1);
        setFeedback(`Dijiste "${spoken}". ¡Intenta de nuevo! La R se pronuncia fuerte`);
        speakWithQueue(`Escucha cómo se dice: ${word}. La R vibra en la lengua.`, 0.65).then(() => {
          setStep('speaking');
        });
      } else {
        setFeedback(`Dijiste "${spoken}". La palabra correcta es "${word}". ¡Sigue practicando!`);
        speakWithQueue(`La palabra correcta es "${word}". ¡Sigue practicando la R!`, 0.8).then(() => {
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
    speakWithQueue(`Mira la imagen. Escucha con atención: ${phrase}`, 0.75).then(() => {
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
        speakWithQueue(`¡Muy bien, ${userName || "amigo"}!`, 0.8).then(() => onComplete(stars, rWords));
        triggerEquippedEffect();
      } else if (attempts === 0) {
        setAttempts(1);
        setFeedback(`Escuché "${spoken}". ¡Intentémoslo una vez más!`);
        setStep('listening');
        speakWithQueue(`Escucha de nuevo: ${phrase}`, 0.75).then(() => { setStep('speaking'); setFeedback("🎤 Repite la frase"); });
      } else {
        stars = 1;
        setFeedback("¡Bien intentado! ✨");
        setStep('feedback');
        speakWithQueue(`Buen intento. La frase era "${phrase}"`, 0.8).then(() => onComplete(stars, rWords));
        triggerEquippedEffect();
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
// COMPONENTE PARA NIÑOS GRANDES (≥8 años) - CON PAUSAS Y VISUALES AUTOMÁTICOS
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
    speak("Observa la imagen.", 0.8, () => {
      setTimeout(() => {
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
        speakWithQueue(`¡Increíble, ${userName || "amigo"}! Las palabras son "${answer1}" y "${answer2}".`, 0.8).then(() => onComplete(stars));
        triggerEquippedEffect();
      } else if (attempts === 0) {
        setAttempts(1);
        let missing = []; if (!found1) missing.push(answer1); if (!found2) missing.push(answer2);
        setFeedback(`Te falta${missing.length > 1 ? 'n' : ''} ${missing.join(' y ')}. ¡Intenta de nuevo!`);
        setStep('listening');
        speakWithQueue(`Pista: ${!found1 ? hint1 : ''} ${!found2 ? hint2 : ''}`, 0.75).then(() => { setStep('speaking'); setFeedback("🎤 Di la frase completa"); });
      } else {
        stars = 1;
        setFeedback("¡Buen intento! 💡");
        setStep('feedback');
        speakWithQueue(`Buen esfuerzo. Las palabras eran "${answer1}" y "${answer2}"`, 0.8).then(() => onComplete(stars));
        triggerEquippedEffect();
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

export const Activity2 = ({ age, stars, userName, onAwardStars, onFinish, onExit, themeClass = "from-purple-100 via-blue-100 to-pink-100", onUpdateStats }: Activity2Props) => {
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
      if (earnedStars > 0) {
        onAwardStars(earnedStars);
        triggerEquippedEffect();
      }
      setShowActivity(false);
      advanceToNext();
    }
  };

  const handleRPracticeComplete = (success: boolean) => {
    setShowRPractice(false);
    if (tempStars > 0) {
      onAwardStars(tempStars);
      triggerEquippedEffect();
    }
    setShowActivity(false);
    advanceToNext();
  };

  const handleOldComplete = (earnedStars: number) => {
    if (earnedStars > 0) {
      onAwardStars(earnedStars);
      triggerEquippedEffect();
    }
    setShowActivity(false);
    advanceToNext();
  };

  const startSession = () => {
    setShowActivity(true);
    speakWithQueue(`¡Hola ${userName || "amigo"}! Vamos a practicar ${shuffledPhrases.length} frases.`, 0.8);
  };

  // Pantalla Inicial
  if (!showActivity && !sessionCompleted && shuffledPhrases.length > 0 && currentIndex === 0) {
    return (
      <div className={`min-h-screen w-full bg-gradient-to-br ${themeClass} p-4`}>
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
      <div className={`min-h-screen w-full bg-gradient-to-br ${themeClass} flex items-center justify-center p-4`}>
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
            <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">¡Felicidades!</h2>
            <p className="text-gray-500 text-sm md:text-base mb-6">Completaste todas las frases</p>
            <div className="flex justify-center items-center gap-2 bg-purple-50 rounded-2xl py-3 mb-6">
              <Star className="text-yellow-500 fill-yellow-500" size={28} />
              <span className="text-2xl md:text-3xl font-bold text-purple-700">{stars} estrellas</span>
            </div>
            <button onClick={onFinish} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all w-full">Volver al menú</button>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar actividad
  if (!currentPhrase) return null;

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${themeClass} p-4`}>
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
          <OldActivity 
            key={currentIndex} 
            phrase={currentPhrase.text} 
            image={currentPhrase.image} 
            hint1={currentPhrase.hint1} 
            hint2={currentPhrase.hint2} 
            answer1={currentPhrase.answer1} 
            answer2={currentPhrase.answer2} 
            visual1={currentPhrase.visual1} 
            visual2={currentPhrase.visual2} 
            userName={userName} 
            onComplete={handleOldComplete} 
          />
        )}

        {showRPractice && pendingRPracticeWords.length > 0 && (
          <RPractice word={pendingRPracticeWords[0]} userName={userName} onComplete={handleRPracticeComplete} />
        )}
      </div>
    </div>
  );
};