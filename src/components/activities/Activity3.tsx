import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Home, Star, Volume2, RefreshCw, ArrowRight, Shuffle, Loader2 } from "lucide-react";
import { getImage } from "../../services/imageService";
import { speak, speakWithQueue, cancelSpeak } from "../../services/warmVoiceService";
import { playSoundByQuery, soundActivities } from "../../services/freesoundService";

interface Activity3Props {
  age: number;
  stars: number;
  userName?: string;
  onAwardStars: (amount: number) => void;
  onFinish: () => void;
  onExit: () => void;
}

// ============================================
// FUNCIÓN PARA GENERAR GUIONES EXACTOS
// ============================================

const generateUnderscores = (word: string): string => {
  return "_".repeat(word.length);
};

// ============================================
// PALABRAS PARA NIÑOS GRANDES
// ============================================

const oldActivities = [
  { word: "astronauta", image: "astronaut", hint: "Persona que viaja al espacio", underscores: "__________" },
  { word: "mariposa", image: "butterfly", hint: "Insecto con alas coloridas", underscores: "________" },
  { word: "telescopio", image: "telescope", hint: "Instrumento para ver estrellas", underscores: "__________" },
  { word: "violinista", image: "violin", hint: "Persona que toca el violín", underscores: "__________" },
  { word: "arquitecto", image: "architect", hint: "Profesión que diseña edificios", underscores: "__________" },
  { word: "biblioteca", image: "library", hint: "Lugar lleno de libros", underscores: "__________" },
  { word: "chocolate", image: "chocolate", hint: "Dulce que comen muchos niños", underscores: "_________" },
  { word: "computadora", image: "computer", hint: "Máquina para trabajar y jugar", underscores: "___________" },
  { word: "elefante", image: "elephant", hint: "El animal terrestre más grande", underscores: "________" },
  { word: "guitarrista", image: "guitar", hint: "Persona que toca la guitarra", underscores: "___________" },
  { word: "pirámide", image: "pyramid", hint: "Construcción antigua en Egipto", underscores: "________" },
  { word: "tigre", image: "tiger", hint: "Animal salvaje con rayas", underscores: "_____" },
  { word: "caballo", image: "horse", hint: "Animal que se monta y corre rápido", underscores: "_______" },
  { word: "bibliotecario", image: "librarian", hint: "Persona que trabaja en la biblioteca", underscores: "____________" },
  { word: "científico", image: "scientist", hint: "Persona que hace experimentos", underscores: "__________" },
  { word: "dentista", image: "dentist", hint: "Persona que cuida los dientes", underscores: "________" },
  { word: "fotógrafo", image: "camera", hint: "Persona que toma fotos", underscores: "_________" },
  { word: "jardinero", image: "gardener", hint: "Persona que cuida las plantas", underscores: "_________" },
  { word: "mago", image: "wizard", hint: "Persona que hace trucos y magia", underscores: "____" },
  { word: "payaso", image: "clown", hint: "Persona que hace reír en fiestas", underscores: "______" },
  { word: "pirata", image: "pirate", hint: "Persona que navega y busca tesoros", underscores: "______" },
  { word: "robot", image: "robot", hint: "Máquina que puede hacer tareas", underscores: "_____" },
  { word: "vampiro", image: "vampire", hint: "Ser que se alimenta de sangre", underscores: "_______" },
  { word: "zombi", image: "zombie", hint: "Ser que vuelve a la vida después de muerto", underscores: "_____" },
  { word: "dragón", image: "dragon", hint: "Criatura mítica que escupe fuego", underscores: "______" },
  { word: "héroe", image: "hero", hint: "Persona valiente que ayuda a otros", underscores: "_____" },
];

// ============================================
// COMPONENTE PARA NIÑOS PEQUEÑOS (SONIDOS)
// ============================================

const YoungActivity = ({ activity, onComplete, userName }: { 
  activity: { soundQuery: string; image: string; text: string };
  userName?: string;
  onComplete: (stars: number) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState(true);
  const [options, setOptions] = useState<Array<{ image: string; text: string; isCorrect: boolean; id: string }>>([]);
  
  const getAnimalName = (imageKey: string): string => {
    const names: Record<string, string> = {
      cat: "Gato", dog: "Perro", bird: "Pájaro", frog: "Rana",
      cow: "Vaca", sheep: "Oveja", monkey: "Mono", lion: "León",
      horse: "Caballo", duck: "Pato", bee: "Abeja", elephant: "Elefante",
      zebra: "Cebra", tiger: "Tigre", bear: "Oso", snake: "Serpiente",
      pirate: "Pirata", robot: "Robot", vampire: "Vampiro", zombie: "Zombi",
      dragon: "Dragón", hero: "Héroe"
    };
    return names[imageKey] || imageKey;
  };
  
  useEffect(() => {
    const generateOptions = async () => {
      setLoadingImages(true);
      const correctOption = { image: activity.image, text: activity.text, isCorrect: true, id: 'correct' };
      const incorrectImages = ["cat", "dog", "bird", "frog", "cow", "sheep", "monkey", "lion"];
      const available = incorrectImages.filter(img => img !== activity.image);
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      const incorrect1 = { image: shuffled[0], text: getAnimalName(shuffled[0]), isCorrect: false, id: 'inc1' };
      const incorrect2 = { image: shuffled[1], text: getAnimalName(shuffled[1]), isCorrect: false, id: 'inc2' };
      const opts = [correctOption, incorrect1, incorrect2].sort(() => Math.random() - 0.5);
      setOptions(opts);
      
      const urls: Record<string, string> = {};
      for (const opt of opts) {
        const url = await getImage(opt.image);
        urls[opt.image] = url;
      }
      setImageUrls(urls);
      setLoadingImages(false);
    };
    generateOptions();
  }, [activity]);
  
  const playSoundEffect = async () => {
    if (isPlaying || isLoading) return;
    setIsLoading(true);
    setIsPlaying(true);
    const success = await playSoundByQuery(activity.soundQuery);
    if (!success) {
      const utterance = new SpeechSynthesisUtterance(activity.text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
    setIsLoading(false);
    setTimeout(() => setIsPlaying(false), 100);
  };
  
  const handleSelect = async (selected: typeof options[0]) => {
    if (selected.isCorrect) {
      setFeedback("🎉 ¡Excelente! +3 estrellas");
      await speakWithQueue(`¡Muy bien, ${userName || "amigo"}! El sonido es de ${activity.text}`, 0.8);
      setTimeout(() => onComplete(3), 2000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setFeedback(`El sonido es de ${activity.text}. ¡Sigue practicando! +1 estrella`);
        await speakWithQueue(`El sonido es de ${activity.text}.`, 0.7);
        setTimeout(() => onComplete(1), 2000);
      } else {
        setFeedback(`No es ${selected.text}. ¡Intenta de nuevo!`);
        await speakWithQueue(`No es ${selected.text}. Escucha de nuevo:`, 0.7);
        playSoundEffect();
      }
    }
    setSelectedOption(selected.image);
  };
  
  if (loadingImages) {
    return (
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-10 text-center">
        <Loader2 size={48} className="animate-spin text-purple-600 mx-auto" />
        <p className="text-purple-600 mt-4">Cargando imágenes...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 text-center">
      <div className="bg-purple-50 rounded-2xl p-8 mb-6">
        <span className="text-8xl">🎵</span>
        <p className="text-purple-500 mt-2">¿Qué animal u objeto hace este sonido?</p>
      </div>
      
      <div className="flex justify-center mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={playSoundEffect}
          disabled={isPlaying || isLoading}
          className={`${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-orange-400 to-red-400'} text-white rounded-full p-8 md:p-10 shadow-xl disabled:opacity-50`}
        >
          {isLoading ? <Loader2 size={64} className="animate-spin" /> : <Volume2 size={64} />}
        </motion.button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {options.map((opt, idx) => (
          <motion.button
            key={`${opt.id}-${idx}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(opt)}
            className={`aspect-square rounded-2xl overflow-hidden shadow-lg transition-all
              ${selectedOption === opt.image ? 'ring-4 ring-green-500' : ''}
            `}
          >
            {imageUrls[opt.image] ? (
              <img src={imageUrls[opt.image]} alt={opt.text} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            )}
            <p className="py-2 text-center font-bold bg-white/90">{opt.text}</p>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-6 min-h-[60px]">
        <p className="text-lg text-gray-600">{feedback}</p>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PARA NIÑOS GRANDES (SOLO GUIONES)
// ============================================

const OldActivity = ({ activity, onComplete, userName }: { 
  activity: { word: string; image: string; hint: string; underscores: string };
  userName?: string;
  onComplete: (stars: number) => void;
}) => {
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState(true);
  
  useEffect(() => {
    const shuffled = activity.word.split('').sort(() => Math.random() - 0.5);
    setLetters(shuffled);
    setSelectedLetters([]);
    setMessage("");
    
    const loadImage = async () => {
      setLoadingImage(true);
      const url = await getImage(activity.image);
      setImageUrl(url);
      setLoadingImage(false);
    };
    loadImage();
  }, [activity]);
  
  // Mostrar SOLO guiones (como en Actividad 2)
  const displayUnderscores = () => {
    if (selectedLetters.length === 0) {
      return activity.underscores;
    }
    // Mostrar letras seleccionadas + guiones restantes
    const progress = selectedLetters.join('').toUpperCase();
    const remaining = activity.word.length - selectedLetters.length;
    const underscores = "_".repeat(remaining);
    return `${progress}${underscores}`;
  };
  
  const handleLetterClick = (letter: string, index: number) => {
    const newLetters = [...letters];
    newLetters.splice(index, 1);
    setLetters(newLetters);
    setSelectedLetters([...selectedLetters, letter]);
  };
  
  const handleUndo = () => {
    if (selectedLetters.length === 0) return;
    const lastLetter = selectedLetters[selectedLetters.length - 1];
    setSelectedLetters(selectedLetters.slice(0, -1));
    setLetters([...letters, lastLetter].sort(() => Math.random() - 0.5));
  };
  
  const handleCheck = async () => {
    const formedWord = selectedLetters.join('');
    if (formedWord === activity.word) {
      setMessage("🎉 ¡Excelente! +3 estrellas");
      await speakWithQueue(`¡Muy bien, ${userName || "amigo"}! Formaste la palabra ${activity.word}`, 0.8);
      setTimeout(() => onComplete(3), 2000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setMessage(`La palabra era "${activity.word}". ¡Sigue practicando! +1 estrella`);
        await speakWithQueue(`La palabra correcta era ${activity.word}.`, 0.7);
        setTimeout(() => onComplete(1), 2000);
      } else {
        setMessage(`"${formedWord}" no es correcta. ¡Intenta de nuevo!`);
        await speakWithQueue(`"${formedWord}" no es correcta. Sigue intentando`, 0.7);
      }
    }
  };
  
  const handleReset = () => {
    const shuffled = activity.word.split('').sort(() => Math.random() - 0.5);
    setLetters(shuffled);
    setSelectedLetters([]);
    setMessage("");
  };
  
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 text-center">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="bg-purple-50 rounded-2xl p-4 flex-1 flex items-center justify-center min-h-[150px]">
          {loadingImage ? (
            <Loader2 size={40} className="animate-spin text-purple-500" />
          ) : (
            <img src={imageUrl} alt={activity.word} className="w-40 h-40 object-cover rounded-xl" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="text-purple-600 font-bold mb-2">💡 Pista:</p>
          <p className="text-gray-700">{activity.hint}</p>
        </div>
      </div>
      
      {/* SOLO GUIONES (como en Actividad 2) */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 mb-6">
        <p className="text-3xl md:text-4xl font-bold text-purple-700 tracking-wider font-mono">
          {displayUnderscores()}
        </p>
        <p className="text-sm text-purple-500 mt-2">{activity.word.length} letras</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {letters.map((letter, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLetterClick(letter, idx)}
            className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-400 to-purple-400 text-white text-3xl md:text-4xl font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            {letter.toUpperCase()}
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleUndo}
          disabled={selectedLetters.length === 0}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            selectedLetters.length === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-yellow-500 text-white hover:bg-yellow-600'
          }`}
        >
          <ArrowRight className="rotate-180" size={20} /> Deshacer
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600 transition-all flex items-center gap-2"
        >
          <RefreshCw size={20} /> Reiniciar
        </button>
        <button
          onClick={handleCheck}
          disabled={selectedLetters.length !== activity.word.length}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            selectedLetters.length !== activity.word.length
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          <Shuffle size={20} /> Comprobar
        </button>
      </div>
      
      <div className="min-h-[60px]">
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const Activity3 = ({ age, stars, userName, onAwardStars, onFinish, onExit }: Activity3Props) => {
  const isYoung = age <= 7;
  const activities = isYoung ? soundActivities : oldActivities;
  
  const [shuffledActivities, setShuffledActivities] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  useEffect(() => {
    const shuffled = [...activities].sort(() => Math.random() - 0.5);
    setShuffledActivities(shuffled.slice(0, 3));
  }, []);
  
  const currentActivity = shuffledActivities[currentIndex];
  
  const advanceToNext = () => {
    if (currentIndex + 1 < shuffledActivities.length) {
      setCurrentIndex(prev => prev + 1);
      setShowActivity(true);
    } else {
      setSessionCompleted(true);
      speakWithQueue(`¡Felicidades ${userName || "amigo"}! Completaste todos los ejercicios`, 0.8);
    }
  };
  
  const handleComplete = (earnedStars: number) => {
    if (earnedStars > 0) onAwardStars(earnedStars);
    setShowActivity(false);
    advanceToNext();
  };
  
  const startSession = () => {
    setShowActivity(true);
    speakWithQueue(`¡Hola ${userName || "amigo"}! Vamos a practicar ${shuffledActivities.length} ejercicios.`, 0.8);
  };
  
  const handleFinish = () => onFinish();
  
  // Pantalla Inicial
  if (!showActivity && !sessionCompleted && shuffledActivities.length > 0 && currentIndex === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={onExit} className="bg-white rounded-full p-3 shadow-md"><Home size={24} className="text-purple-600" /></button>
            <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-lg"><Star className="text-yellow-500 fill-yellow-500" size={24} /><span className="text-xl font-bold text-purple-600">{stars}</span></div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 text-center">
            <span className="text-8xl mb-4 block">{isYoung ? "🎵" : "📝"}</span>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">{isYoung ? "Escucha el sonido" : "Ordena las letras"}</h3>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">{isYoung ? "Escucha el sonido real y elige la imagen correcta" : "Forma la palabra ordenando las letras"}</p>
            <div className="bg-purple-50 rounded-2xl p-4 mb-8 inline-block px-10"><p className="text-xl font-bold text-purple-600">{shuffledActivities.length} Ejercicios</p></div>
            <button onClick={startSession} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-10 py-5 text-2xl font-bold shadow-xl flex items-center gap-3 mx-auto"><ArrowRight size={28} /> Comenzar</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Pantalla final
  if (sessionCompleted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-4">
              <span className="text-7xl md:text-8xl">🏆</span>
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">¡Felicidades!</h2>
            <p className="text-gray-500 mb-6">Completaste todos los ejercicios</p>
            <div className="flex justify-center items-center gap-2 bg-purple-50 rounded-2xl py-3 mb-6">
              <Star className="text-yellow-500 fill-yellow-500" size={28} />
              <span className="text-2xl md:text-3xl font-bold text-purple-700">{stars} estrellas</span>
            </div>
            <button onClick={handleFinish} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all w-full">Volver al menú</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Renderizar actividad en curso
  if (!currentActivity) return null;
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onExit} className="bg-white rounded-full p-3 shadow-md"><Home size={24} className="text-purple-600" /></button>
          <div className="flex items-center gap-4">
            <div className="bg-white px-3 md:px-4 py-1 rounded-full border border-purple-200 font-bold text-purple-700 text-sm">Progreso: {currentIndex + 1} / {shuffledActivities.length}</div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1 shadow-lg"><Star className="text-yellow-500 fill-yellow-500" size={20} /><span className="text-lg font-bold text-purple-600">{stars}</span></div>
          </div>
        </div>
        
        {showActivity && isYoung && (
          <YoungActivity key={currentIndex} activity={currentActivity} userName={userName} onComplete={handleComplete} />
        )}
        {showActivity && !isYoung && (
          <OldActivity key={currentIndex} activity={currentActivity} userName={userName} onComplete={handleComplete} />
        )}
      </div>
    </div>
  );
};