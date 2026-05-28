import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Star, Mic, Volume2 } from "lucide-react";

interface Activity2Props {
  age: number;
  stars: number;
  onAwardStars: (amount: number) => void;
  onFinish: () => void;
  onExit: () => void;
}

// =========================
// SILABIFICACIÓN
// =========================

const syllableMap: Record<string, string[]> = {
  "parque":    ["par", "que"],
  "perro":     ["pe", "rro"],
  "zanahoria": ["za", "na", "ho", "ria"],
  "conejo":    ["co", "ne", "jo"],
  "barco":     ["bar", "co"],
  "mar":       ["mar"],
  "árbol":     ["ár", "bol"],
};

const hasRSound = (word: string) => /r/i.test(word);

const getSyllables = (word: string): string[] | null =>
  syllableMap[word.toLowerCase()] ?? null;

const renderSyllables = (word: string) => {
  const syllables = getSyllables(word);
  if (!syllables) return <span className="text-purple-700 font-bold">{word}</span>;
  return (
    <>
      {syllables.map((syl, i) => {
        const isR = /r/i.test(syl);
        return (
          <span key={i}>
            <span className={isR ? "text-red-500 font-extrabold" : "text-purple-700 font-bold"}>
              {syl}
            </span>
            {i < syllables.length - 1 && (
              <span className="text-gray-400 font-light">-</span>
            )}
          </span>
        );
      })}
    </>
  );
};

// =========================
// TEXTO A VOZ
// =========================

const speakWord = (word: string) => {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(word);
  utter.lang = "es-MX";
  utter.rate = 0.6;
  utter.pitch = 1.1;
  window.speechSynthesis.speak(utter);
};

// =========================
// HOOK: GRABACIÓN DE UNA PALABRA
// =========================

type PracticeState = "idle" | "listening" | "success" | "retry" | "done";

interface WordPracticeCardProps {
  keyword: string;
  emoji?: string;
  showSyllables?: boolean;
  onPracticed: () => void;
}

const WordPracticeCard = ({
  keyword,
  emoji,
  showSyllables = false,
  onPracticed,
}: WordPracticeCardProps) => {

  const [state, setState] = useState<PracticeState>("idle");
  const [attempt, setAttempt] = useState(0);
  const [isSpeakingWord, setIsSpeakingWord] = useState(false);

  const handleSpeak = () => {
    if (isSpeakingWord) return;
    setIsSpeakingWord(true);
    speakWord(keyword);
    // Tiempo estimado: palabra lenta ~1.5s, más margen
    setTimeout(() => setIsSpeakingWord(false), 2200);
  };

  const handleRecord = () => {
    if (isSpeakingWord) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-MX";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    setState("listening");
    recognition.start();

    recognition.onresult = (event: any) => {

      const alternatives: string[] = [];
      for (let i = 0; i < event.results[0].length; i++) {
        alternatives.push(event.results[0][i].transcript.toLowerCase());
      }

      const heard = alternatives.join(" ");

      // Para palabras con sílabas: buscar la palabra completa en lo que se oyó
      // También aceptar si suena parecido (incluye al menos la mitad de la palabra)
      const wordLower = keyword.toLowerCase();
      const matched =
        heard.includes(wordLower) ||
        // Tolerancia: la palabra está contenida fonéticamente
        wordLower.split("").filter(c => heard.includes(c)).length >= Math.ceil(wordLower.length * 0.6);

      if (matched) {

        setState("success");
        setTimeout(() => {
          setState("done");
          onPracticed();
        }, 1500);

      } else if (attempt === 0) {

        setState("retry");
        setAttempt(1);

      } else {

        // Segundo intento fallido → igual celebrar y pasar
        setState("success");
        setTimeout(() => {
          setState("done");
          onPracticed();
        }, 1500);

      }
    };

    recognition.onerror = () => {
      setState("idle");
    };

  };

  const isDone = state === "done";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`rounded-3xl p-6 flex flex-col items-center gap-3 shadow-lg transition-colors ${
        showSyllables ? "bg-red-50" : "bg-purple-50"
      } ${isDone ? "ring-4 ring-green-400" : ""}`}
    >

      {/* Emoji (solo en sección de palabras fallidas) */}
      {emoji && (
        <span className="text-7xl">{emoji}</span>
      )}

      {/* Palabra o sílabas */}
      {showSyllables ? (

        <button
          onClick={handleSpeak}
          disabled={isSpeakingWord}
          className={`flex flex-col items-center gap-1 group transition-opacity ${isSpeakingWord ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="text-2xl font-bold text-gray-600 group-hover:text-gray-800 transition-colors">
            {keyword}
          </span>
          <div className="flex items-center gap-1 text-5xl font-extrabold tracking-widest">
            {renderSyllables(keyword)}
          </div>
          <div className="flex items-center gap-2 text-red-400 text-base font-semibold mt-1">
            {isSpeakingWord
              ? <><Volume2 size={18} className="animate-pulse" /><span>Escucha...</span></>
              : <><Volume2 size={18} /><span>Toca para escuchar</span></>
            }
          </div>
        </button>

      ) : (

        <span className="text-4xl font-extrabold text-purple-700 tracking-wide">
          {keyword}
        </span>

      )}

      {/* Estado del micrófono */}
      <AnimatePresence mode="wait">

        {state === "idle" && (
          <motion.div key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex flex-col items-center gap-2">
            {isSpeakingWord && (
              <p className="text-purple-400 text-base font-semibold">
                Espera a que termine... 
              </p>
            )}
            <motion.button
              whileHover={isSpeakingWord ? {} : { scale: 1.08 }}
              whileTap={isSpeakingWord ? {} : { scale: 0.92 }}
              onClick={handleRecord}
              disabled={isSpeakingWord}
              className={`mt-2 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg transition-opacity ${
                isSpeakingWord
                  ? "bg-gray-300 opacity-50 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-400 to-pink-400"
              }`}
            >
              <Mic size={28} className="text-white" />
              <span className="text-white font-bold text-xl">Repetir</span>
            </motion.button>
          </motion.div>
        )}

        {state === "listening" && (
          <motion.div
            key="listening"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="mt-2 flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-4 shadow-lg"
            >
              <Mic size={28} className="text-white" />
            </motion.div>
            <span className="text-purple-600 font-semibold text-lg">
              Escuchando...
            </span>
          </motion.div>
        )}

        {state === "retry" && (
          <motion.div
            key="retry"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="mt-2 flex flex-col items-center gap-3"
          >
            <p className="text-orange-500 font-bold text-xl text-center">
              ¡Casi! Inténtalo una vez más 
            </p>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleRecord}
              className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg"
            >
              <Mic size={28} className="text-white" />
              <span className="text-white font-bold text-xl">Otra vez</span>
            </motion.button>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            key="success"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            exit={{ scale: 0 }}
            className="mt-2 flex flex-col items-center gap-1"
          >
            <span className="text-5xl">🌟</span>
            <span className="text-green-600 font-bold text-xl">¡Muy bien!</span>
          </motion.div>
        )}

        {state === "done" && (
          <motion.div
            key="done"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-2"
          >
            <span className="text-4xl">✅</span>
          </motion.div>
        )}

      </AnimatePresence>

    </motion.div>
  );
};

// =========================
// ESCENARIOS (fuera del componente para evitar re-renders)
// =========================

const scenarios = [
  {
    hint: "El n---- juega con la p------ en el p------",
    keywords: ["niño", "pelota", "parque"],
    emojis: ["👦", "⚽", "🌳"]
  },
  {
    hint: "El c------ come z--------- en el c-----",
    keywords: ["conejo", "zanahoria", "campo"],
    emojis: ["🐰", "🥕", "🌾"]
  },
  {
    hint: "La n---- lee un l----- en la e-------",
    keywords: ["niña", "libro", "escuela"],
    emojis: ["👧", "📖", "🏫"]
  },
  {
    hint: "El p------ juega con la p------ en el p------",
    keywords: ["perro", "pelota", "parque"],
    emojis: ["🐶", "⚽", "🌳"]
  },
  {
    hint: "El p--- nada cerca del b----- en el m---",
    keywords: ["pez", "barco", "mar"],
    emojis: ["🐟", "⛵", "🌊"]
  }
];

// =========================
// COMPONENTE PRINCIPAL
// =========================

export const Activity2 = ({
  age,
  stars,
  onAwardStars,
  onFinish,
  onExit,
}: Activity2Props) => {

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<{ correct: boolean; stars: number; message: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scenario, setScenario] = useState<any>(null);
  const [missedWords, setMissedWords] = useState<{ keyword: string; emoji: string }[]>([]);
  const [rWords, setRWords] = useState<string[]>([]);
  const [phase, setPhase] = useState<"game" | "reinforcement">("game");

  // Cuántas tarjetas ya fueron practicadas
  const [practicedCount, setPracticedCount] = useState(0);
  const totalCardsRef = useRef(0);

  // Orden aleatorio de escenarios (se genera una vez)
  const [shuffledIndices] = useState(() => {
    const arr = [0, 1, 2, 3, 4];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  // =========================
  // CARGAR ESCENARIO
  // =========================

  useEffect(() => {
    const idx = shuffledIndices[currentActivityIndex];
    setScenario(scenarios[idx]);
    setPhase("game");
    setMissedWords([]);
    setRWords([]);
    setPracticedCount(0);
    setFeedbackResult(null);
    totalCardsRef.current = 0;
  }, [currentActivityIndex]);

  // =========================
  // AVANZAR TRAS REFUERZO
  // =========================

  const advanceToNext = () => {
    setPhase("game");
    setMissedWords([]);
    setRWords([]);
    setPracticedCount(0);
    totalCardsRef.current = 0;
    if (currentActivityIndex < 4) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    } else {
      onFinish();
    }
  };

  const handleCardPracticed = () => {
    setPracticedCount(prev => prev + 1);
  };

  // =========================
  // MICRÓFONO (JUEGO)
  // =========================

  const handleMicClick = () => {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-MX";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsSpeaking(true);
    recognition.start();

    recognition.onresult = (event: any) => {

      const transcript = event.results[0][0].transcript.toLowerCase();
      setIsSpeaking(false);

      const spokenWords = transcript.split(" ");
      const matchedKeywords = scenario.keywords.filter(
        (word: string) => spokenWords.includes(word.toLowerCase())
      );
      const matchedCount = matchedKeywords.length;

      const missed = scenario.keywords
        .map((kw: string, i: number) => ({ keyword: kw, emoji: scenario.emojis[i] }))
        .filter(({ keyword }: { keyword: string }) =>
          !spokenWords.includes(keyword.toLowerCase())
        );

      const withR = scenario.keywords.filter(hasRSound);

      // Calcular total de tarjetas para el refuerzo
      const uniqueRWords = withR.filter(
        (w: string) => !missed.find((m: { keyword: string }) => m.keyword === w)
      );
      totalCardsRef.current = missed.length + uniqueRWords.length;

      const goToReinforcement = () => {
        if (missed.length > 0 || withR.length > 0) {
          setMissedWords(missed);
          setRWords(withR);
          setPhase("reinforcement");
        } else {
          advanceToNext();
        }
      };

      if (matchedCount === 3) {

        onAwardStars(3);
        setFeedbackResult({ correct: true, stars: 3, message: "¡Excelente!  Dijiste toda la frase muy bien" });
        setShowFeedback(true);
        setTimeout(() => { setShowFeedback(false); goToReinforcement(); }, 3000);

      } else if (matchedCount === 2) {

        onAwardStars(2);
        setFeedbackResult({ correct: true, stars: 2, message: "¡Muy bien!  Solo te faltó una palabra" });
        setShowFeedback(true);
        setTimeout(() => { setShowFeedback(false); goToReinforcement(); }, 3000);

      } else {

        setFeedbackResult({ correct: false, stars: 0, message: "¡Buen intento!  Vamos a practicar" });
        setShowFeedback(true);
        setTimeout(() => { setShowFeedback(false); goToReinforcement(); }, 2000);

      }

    };

    recognition.onerror = () => {
      setIsSpeaking(false);
      alert("No se pudo reconocer la voz ");
    };

  };

  // =========================
  // RENDER — FASE REFUERZO
  // =========================

  if (phase === "reinforcement") {

    // Palabras con R que NO estén ya en missedWords
    const rOnlyWords = rWords.filter(
      w => !missedWords.find(m => m.keyword === w)
    );

    const allPracticed = practicedCount >= totalCardsRef.current && totalCardsRef.current > 0;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-6xl w-full"
      >

        {/* HEADER */}
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

        <div className="bg-white rounded-3xl p-12 shadow-2xl space-y-10">

          {/* SECCIÓN: PALABRAS FALLIDAS */}
          {missedWords.length > 0 && (
            <div>
              <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
                ¡Practiquemos estas palabras! 
              </h2>
              <p className="text-center text-xl text-purple-500 mb-8">
                Lee cada palabra y presiona el micrófono para repetirla 
              </p>
              <div className={`grid gap-6 max-w-3xl mx-auto ${missedWords.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {missedWords.map(({ keyword, emoji }, i) => (
                  <WordPracticeCard
                    key={`missed-${i}`}
                    keyword={keyword}
                    emoji={emoji}
                    showSyllables={false}
                    onPracticed={handleCardPracticed}
                  />
                ))}
              </div>
            </div>
          )}

          {/* DIVISOR */}
          {missedWords.length > 0 && rWords.length > 0 && (
            <hr className="border-purple-100" />
          )}

          {/* SECCIÓN: PALABRAS CON R */}
          {rWords.length > 0 && (
            <div>
              <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
                ¡Atención a la <span className="text-red-500">R</span>! 👂
              </h2>
              <p className="text-center text-xl text-purple-500 mb-8">
                Toca la palabra para escucharla, luego repítela con el micrófono 
              </p>
              <div className={`grid gap-6 max-w-3xl mx-auto ${rWords.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                {rWords.map((word, i) => (
                  <WordPracticeCard
                    key={`r-${i}`}
                    keyword={word}
                    showSyllables={true}
                    onPracticed={handleCardPracticed}
                  />
                ))}
              </div>
            </div>
          )}

          {/* BOTÓN CONTINUAR */}
          <div className="flex flex-col items-center gap-3 pt-4">
            <AnimatePresence>
              {allPracticed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl text-green-600 font-bold"
                >
                  ¡Excelente práctica! 
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={advanceToNext}
              className={`text-white text-3xl font-bold px-16 py-6 rounded-full shadow-2xl transition-all ${
                allPracticed
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : "bg-gradient-to-r from-purple-400 to-pink-400"
              }`}
            >
              {allPracticed ? "¡Continuar! " : "Saltar →"}
            </motion.button>
            {!allPracticed && (
              <p className="text-gray-400 text-lg">
                Practica todas las palabras para continuar 
              </p>
            )}
          </div>

        </div>
      </motion.div>
    );
  }

  // =========================
  // RENDER — FASE JUEGO
  // =========================

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl w-full"
    >

      {/* HEADER */}
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

      {/* CONTENIDO */}
      <motion.div
        key={currentActivityIndex}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-12 shadow-2xl"
      >

        <h2 className="text-5xl font-bold text-center text-gray-800 mb-4">
          ¡Completa la frase!
        </h2>
        <p className="text-center text-2xl text-purple-600 mb-12">
          Observa las imágenes y di la frase 
        </p>

        {/* IMÁGENES */}
        {scenario && (
          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            {scenario.emojis.map((emoji: string, index: number) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                className="aspect-square rounded-3xl shadow-xl bg-white p-6 flex items-center justify-center"
              >
                <span className="text-9xl select-none">{emoji}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* PISTA */}
        {scenario && (
          <div className="bg-purple-100 rounded-3xl p-8 mb-10 max-w-4xl mx-auto">
            <p className="text-3xl text-center font-semibold text-purple-700">
              "{scenario.hint}"
            </p>
          </div>
        )}

        {/* BOTÓN MIC */}
        {!isSpeaking && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-6">
            <p className="text-3xl font-semibold text-purple-600">Presiona para hablar </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMicClick}
              className="bg-gradient-to-r from-red-400 to-pink-400 rounded-full p-12 shadow-2xl"
            >
              <Mic size={80} className="text-white" />
            </motion.button>
          </motion.div>
        )}

        {/* ESCUCHANDO */}
        {isSpeaking && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-6">
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

      </motion.div>

      {/* FEEDBACK */}
      {showFeedback && feedbackResult && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className={`rounded-3xl px-16 py-10 shadow-2xl flex flex-col items-center gap-4 ${
            feedbackResult.correct
              ? "bg-green-400"
              : "bg-purple-500"
          }`}>

            {feedbackResult.stars > 0 && (
              <div className="flex gap-3">
                {Array.from({ length: feedbackResult.stars }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="text-6xl"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            )}

            <p className="text-4xl font-extrabold text-white text-center">
              {feedbackResult.message}
            </p>

          </div>
        </motion.div>
      )}

    </motion.div>
  );
};