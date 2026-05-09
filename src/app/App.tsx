import { useState, useRef, useEffect } from "react";
import {
  Volume2,
  Star,
  Mic,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

import dogImg from "../assets/images/dog.jpg";
import catImg from "../assets/images/cat.jpg";
import rabbitImg from "../assets/images/rabbit.jpg";
import mouseImg from "../assets/images/mouse.jpg";
import sunImg from "../assets/images/sun.jpg";
import moonImg from "../assets/images/moon.jpg";
import starImg from "../assets/images/star.jpg";
import game1Img from "../assets/images/game1.jpg";
import game2Img from "../assets/images/game2.jpg";
import game3Img from "../assets/images/game3.jpg";

import avatar1Img from "../assets/images/avatar1.jpg";
import avatar2Img from "../assets/images/avatar2.jpg";
import avatar3Img from "../assets/images/avatar3.jpg";

type Screen =
  | "voice-setup"
  | "profile-select"
  | "menu"
  | "activity1"
  | "activity2"
  | "activity3"
  | "rewards";
type VoiceStep = "welcome" | "name" | "age" | "confirm";

interface UserProfile {
  id: string;
  name: string;
  age: number;
  stars: number;
  avatar: string;
}

interface WordActivity {
  word: string;
  correctImage: string;
  options: string[];
}

interface SentenceActivity {
  images: string[];
  exampleSentence: string;
}

interface SoundActivity {
  sound: string;
  correctImage: string;
  options: string[];
}

interface WordCompleteActivity {
  image: string;
  word: string;
  incomplete: string;
  options: string[];
  correctOption: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("profile-select");
  const [voiceStep, setVoiceStep] =
    useState<VoiceStep>("welcome");

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const savedProfiles = localStorage.getItem("vocari_profiles");

    if (savedProfiles) {
      return JSON.parse(savedProfiles);
    }

    return [
      { id: "1", name: "Ana", age: 5, stars: 12, avatar: "cat" },
      {
        id: "2",
        name: "Pedro",
        age: 8,
        stars: 25,
        avatar: "dog",
      },
    ];
  });
  const [currentProfile, setCurrentProfile] =
    useState<UserProfile | null>(null);
  const [newProfileData, setNewProfileData] = useState({
    name: "",
    age: 0,
    avatar: "avatar1",
  });
  const [voiceInput, setVoiceInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const [currentActivityIndex, setCurrentActivityIndex] =
    useState(0);
  const [selectedOption, setSelectedOption] = useState<
    number | null
  >(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sentenceBuilder, setSentenceBuilder] = useState<
    number[]
  >([]);
  const [showMicAnimation, setShowMicAnimation] =
    useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    localStorage.setItem(
      "vocari_profiles",
      JSON.stringify(profiles),
    );
  }, [profiles]);

  const isYoungUser = currentProfile
    ? currentProfile.age <= 6
    : false;

  // Avatar icons
  const avatars: { [key: string]: string } = {
    cat: "(imagen de gato)",
    dog: "(imagen de perro)",
    bear: "(imagen de oso)",
    rabbit: "(imagen de conejo)",
    fox: "(imagen de zorro)",
  };

  // Actividades
  const wordsActivityYoung: WordActivity[] = [
    {
      word: "gato",
      correctImage: "cat",
      options: ["cat", "dog", "mouse"],
    },
    {
      word: "sol",
      correctImage: "sun",
      options: ["sun", "moon", "star"],
    },
  ];

  const wordsActivityOlder: WordActivity[] = [
    {
      word: "perro",
      correctImage: "dog",
      options: ["dog", "cat", "rabbit", "mouse"],
    },
    {
      word: "mariposa",
      correctImage: "butterfly",
      options: ["butterfly", "bee", "bird", "ladybug"],
    },
  ];

  const sentencesActivityYoung: SentenceActivity[] = [
    {
      images: ["cat", "sleep"],
      exampleSentence: "El gato duerme",
    },
    {
      images: ["sun", "smile"],
      exampleSentence: "El sol brilla",
    },
  ];

  const sentencesActivityOlder: SentenceActivity[] = [
    {
      images: ["dog", "run", "tree"],
      exampleSentence: "El perro corre al árbol",
    },
    {
      images: ["girl", "read", "school"],
      exampleSentence: "La niña lee en la escuela",
    },
  ];

  // Nuevo juego 3
  const soundActivityYoung: SoundActivity[] = [
    {
      sound: "guau guau",
      correctImage: "dog",
      options: ["dog", "cat", "bird"],
    },
    {
      sound: "miau miau",
      correctImage: "cat",
      options: ["cat", "dog", "cow"],
    },
  ];

  const wordCompleteActivityOlder: WordCompleteActivity[] = [
    {
      image: "dog",
      word: "perro",
      incomplete: "_erro",
      options: ["p", "b", "d", "t"],
      correctOption: "p",
    },
    {
      image: "cat",
      word: "gato",
      incomplete: "ga_o",
      options: ["t", "d", "r", "n"],
      correctOption: "t",
    },
  ];

  const currentWords = isYoungUser
    ? wordsActivityYoung
    : wordsActivityOlder;
  const currentSentences = isYoungUser
    ? sentencesActivityYoung
    : sentencesActivityOlder;
  const currentSounds = soundActivityYoung;
  const currentWordComplete = wordCompleteActivityOlder;

  const ImagePlaceholder = ({
    type,
    size = "normal",
  }: {
    type: string;
    size?: "small" | "normal" | "large";
  }) => {
    const images: { [key: string]: string } = {
      dog: dogImg,
      cat: catImg,
      rabbit: rabbitImg,
      mouse: mouseImg,
      sun: sunImg,
      moon: moonImg,
      star: starImg,

      avatar1: avatar1Img,
      avatar2: avatar2Img,
      avatar3: avatar3Img,

      game1: game1Img,
      game2: game2Img,
      game3: game3Img,
      
    };

    const sizeClasses = {
      small: "text-sm",
      normal: "text-base",
      large: "text-lg",
    };

    return (
      <div className="w-full h-full overflow-hidden rounded-2xl shadow-lg">
        <img
          src={images[type]}
          alt={type}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
    </div>
  );
  };

  const playWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "es-ES";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };
  const simulateVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript =
        event.results[0][0].transcript;

      setVoiceInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert("Error al reconocer voz");
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };


  const handleVoiceConfirm = () => {
    if (voiceStep === "name") {
      setNewProfileData({
        ...newProfileData,
        name: voiceInput,
      });
      setVoiceInput("");
      setVoiceStep("age");
    } else if (voiceStep === "age") {

      const numberWords: { [key: string]: number } = {
        uno: 1,
        dos: 2,
        tres: 3,
        cuatro: 4,
        cinco: 5,
        seis: 6,
        siete: 7,
        ocho: 8,
        nueve: 9,
        diez: 10,
      };

      let cleanedInput = voiceInput
        .toLowerCase()
        .replace("años", "")
        .replace("año", "")
        .trim();

      let age = parseInt(cleanedInput);

      if (isNaN(age)) {
        age = numberWords[cleanedInput];
      }

      setNewProfileData({
        ...newProfileData,
      age,
      });

      setVoiceInput("");
      setVoiceStep("confirm");

    } else if (voiceStep === "confirm") {
      const newProfile: UserProfile = {
        id: Date.now().toString(),
        name: newProfileData.name,
        age: newProfileData.age,
        stars: 0,
        avatar: newProfileData.avatar,
      };
      setProfiles([...profiles, newProfile]);
      setCurrentProfile(newProfile);
      setCurrentScreen("menu");
      setVoiceStep("welcome");
      setNewProfileData({ name: "", age: 0 });
    }
  };

  const handleProfileSelect = (profile: UserProfile) => {
    setCurrentProfile(profile);
    setCurrentScreen("menu");
  };

  const handleNewProfile = () => {
    setCurrentScreen("voice-setup");
    setVoiceStep("welcome");
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left:
          direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleActivitySelect = (
    activity: "activity1" | "activity2" | "activity3",
    index: number,
  ) => {
    setCurrentScreen(activity);
    setCurrentGameIndex(index);
    setCurrentActivityIndex(0);
    setSelectedOption(null);
    setSentenceBuilder([]);
    setStarsEarned(0);
    setHasSpoken(false);
    setIsSpeaking(false);
  };

  const awardStars = (amount: number) => {
    setStarsEarned((prev) => prev + amount);
    if (currentProfile) {
      const updated = profiles.map((p) =>
        p.id === currentProfile.id
          ? { ...p, stars: p.stars + amount }
          : p,
      );
      setProfiles(updated);
      setCurrentProfile({
        ...currentProfile,
        stars: currentProfile.stars + amount,
      });
    }
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    const currentActivity = currentWords[currentActivityIndex];
    const isAnswerCorrect =
      currentActivity.options[index] ===
      currentActivity.correctImage;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      awardStars(1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        setShowMicAnimation(true);
        playWord(currentActivity.word);
      }, 800);
      setTimeout(() => setShowMicAnimation(false), 3000);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect) {
        if (currentActivityIndex < currentWords.length - 1) {
          setCurrentActivityIndex(currentActivityIndex + 1);
          setSelectedOption(null);
        } else {
          setCurrentScreen("rewards");
        }
      }
    }, 3500);
  };

  const handleMicClick = () => {
    setIsSpeaking(true);

    setTimeout(() => {
      setIsSpeaking(false);
      setHasSpoken(true);

      const randomSuccess = Math.random() > 0.2;
      setIsCorrect(randomSuccess);
      setShowFeedback(true);

      if (randomSuccess) {
        awardStars(1);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setTimeout(() => {
        setShowFeedback(false);
        if (randomSuccess) {
          if (
            currentActivityIndex <
            currentSentences.length - 1
          ) {
            setCurrentActivityIndex(currentActivityIndex + 1);
            setHasSpoken(false);
          } else {
            setCurrentScreen("rewards");
          }
        } else {
          setHasSpoken(false);
        }
      }, 3000);
    }, 2500);
  };

  const handleSoundSelect = (index: number) => {
    setSelectedOption(index);
    const currentActivity = currentSounds[currentActivityIndex];
    const isAnswerCorrect =
      currentActivity.options[index] ===
      currentActivity.correctImage;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      awardStars(1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect) {
        if (currentActivityIndex < currentSounds.length - 1) {
          setCurrentActivityIndex(currentActivityIndex + 1);
          setSelectedOption(null);
        } else {
          setCurrentScreen("rewards");
        }
      }
    }, 2000);
  };

  const handleLetterSelect = (letter: string) => {
    const currentActivity =
      currentWordComplete[currentActivityIndex];
    const isAnswerCorrect =
      letter === currentActivity.correctOption;

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      awardStars(1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => playWord(currentActivity.word), 500);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (isAnswerCorrect) {
        if (
          currentActivityIndex <
          currentWordComplete.length - 1
        ) {
          setCurrentActivityIndex(currentActivityIndex + 1);
        } else {
          setCurrentScreen("rewards");
        }
      }
    }, 2500);
  };

  const resetToMenu = () => {
    setCurrentScreen("menu");
    setCurrentActivityIndex(0);
    setSelectedOption(null);
    setSentenceBuilder([]);
    setHasSpoken(false);
    setIsSpeaking(false);
  };

  const games = [
    {
      name: "Escucha y Elige",
      color: "from-green-400 to-emerald-500",
      icon: Volume2,
      image: "game1",
    },
    {
      name: "Crea tu Frase",
      color: "from-pink-400 to-rose-500",
      icon: Mic,
      image: "game2",
    },
    {
      name: isYoungUser
        ? "Encuentra el Sonido"
        : "Completa la Palabra",
      color: "from-blue-400 to-purple-500",
      icon: Star,
      image: "game3",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4 overflow-auto">
      <AnimatePresence mode="wait">
        {/* Registro por voz */}
        {currentScreen === "voice-setup" && (
          <motion.div
            key="voice-setup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-3xl w-full"
          >


            <div className="flex justify-start mb-6">
              <button
                onClick={() => setCurrentScreen("profile-select")}
                className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
              >
                <Home size={36} className="text-purple-600" />
              </button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
              {voiceStep === "welcome" && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <p className="text-6xl">(asistente)</p>
                  </div>
                  <h2 className="text-6xl font-bold text-purple-600 mb-6">
                    ¡Hola!
                  </h2>
                  <p className="text-3xl text-gray-600 mb-12">
                    Voy a hacerte unas preguntas
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setVoiceStep("name")}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-16 py-8 text-4xl font-bold shadow-xl"
                  >
                    Empezar
                  </motion.button>
                </motion.div>
              )}

              {voiceStep === "name" && (
                <motion.div
                  key="name"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <p className="text-6xl">(asistente)</p>
                  </div>
                  <h2 className="text-5xl font-bold text-gray-800 mb-12">
                    ¿Cómo te llamas?
                  </h2>

                  {voiceInput && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-purple-100 rounded-3xl p-8 mb-8 inline-block"
                    >
                      <p className="text-4xl font-bold text-purple-600">
                        {voiceInput}
                      </p>
                    </motion.div>
                  )}

                  <div className="flex gap-6 justify-center mt-12">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={simulateVoiceInput}
                      disabled={isListening}
                      className={`${isListening ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-red-400 to-pink-400"} rounded-full p-10 shadow-xl`}
                    >
                      <Mic size={72} className="text-white" />
                    </motion.button>

                    {voiceInput && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleVoiceConfirm}
                        className="bg-green-500 rounded-full p-10 shadow-xl"
                      >
                        <Check
                          size={72}
                          className="text-white"
                        />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              {voiceStep === "age" && (
                <motion.div
                  key="age"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <p className="text-6xl">(asistente)</p>
                  </div>
                  <h2 className="text-5xl font-bold text-gray-800 mb-12">
                    ¿Cuántos años tienes?
                  </h2>

                  {voiceInput && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-purple-100 rounded-3xl p-8 mb-8 inline-block"
                    >
                      <p className="text-4xl font-bold text-purple-600">
                        {voiceInput} años
                      </p>
                    </motion.div>
                  )}

                  <div className="flex gap-6 justify-center mt-12">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={simulateVoiceInput}
                      disabled={isListening}
                      className={`${isListening ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-red-400 to-pink-400"} rounded-full p-10 shadow-xl`}
                    >
                      <Mic size={72} className="text-white" />
                    </motion.button>

                    {voiceInput && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleVoiceConfirm}
                        className="bg-green-500 rounded-full p-10 shadow-xl"
                      >
                        <Check
                          size={72}
                          className="text-white"
                        />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              {voiceStep === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <p className="text-6xl">(asistente)</p>
                  </div>
                  <h2 className="text-5xl font-bold text-gray-800 mb-8">
                    ¿Todo correcto?
                  </h2>
                  <div className="bg-purple-50 rounded-3xl p-8 mb-12">
                    <p className="text-3xl text-gray-600 mb-2">
                      Tu nombre:
                    </p>
                    <p className="text-5xl font-bold text-purple-600 mb-6">
                      {newProfileData.name}
                    </p>
                    <p className="text-3xl text-gray-600 mb-2">
                      Tu edad:
                    </p>
                    <p className="text-5xl font-bold text-purple-600">
                      {newProfileData.age} años
                    </p>
                    <p className="text-2xl text-gray-600 mt-6 mb-4">
                      Elige tu avatar
                    </p>

                    <div className="flex justify-center gap-6 mb-8">
                      {["avatar1", "avatar2", "avatar3"].map(
                        (avatar) => (
                          <button
                            key={avatar}
                            onClick={() =>
                              setNewProfileData({
                                ...newProfileData,
                                avatar,
                              })
                            }
                            className={`w-24 h-24 rounded-2xl overflow-hidden transition-all ${
                              newProfileData.avatar === avatar
                                ? "ring-4 ring-purple-500 scale-110"
                                : ""
                            }`}
                          >
                            <ImagePlaceholder type={avatar} />
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="flex gap-6 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setVoiceStep("name")}
                      className="bg-gray-300 text-gray-700 rounded-full px-12 py-6 text-3xl font-bold shadow-xl flex items-center gap-3"
                    >
                      <RotateCcw size={32} />
                      Repetir
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleVoiceConfirm}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-16 py-6 text-3xl font-bold shadow-xl flex items-center gap-3"
                    >
                      <Check size={32} />
                      ¡Sí, jugar!
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Selección de perfil */}
        {currentScreen === "profile-select" && (
          <motion.div
            key="profile-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl w-full"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-purple-600 text-center mb-16">
              ¿Quién va a jugar?
            </h1>

            <div className="grid grid-cols-3 gap-8 mb-12">
              {profiles.map((profile) => (
                <motion.button
                  key={profile.id}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleProfileSelect(profile)}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="w-40 h-40 mx-auto mb-6">
                    <ImagePlaceholder
                      type={profile.avatar}
                      size="large"
                    />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-800 mb-3">
                    {profile.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <Star
                      className="text-yellow-500 fill-yellow-500"
                      size={28}
                    />
                    <span className="text-3xl font-semibold text-purple-600">
                      {profile.stars}
                    </span>
                  </div>
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewProfile}
                className="bg-gradient-to-br from-purple-400 to-blue-400 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center"
              >
                <Plus size={80} className="text-white mb-4" />
                <p className="text-3xl font-bold text-white">
                  Nuevo jugador
                </p>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Menú principal - Carrusel */}
        {currentScreen === "menu" && currentProfile && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl w-full"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="bg-white rounded-full px-8 py-4 shadow-lg">
                <p className="text-4xl font-bold text-purple-600">
                  Hola, {currentProfile.name}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white rounded-full px-8 py-4 shadow-lg">
                  <Star
                    className="text-yellow-500 fill-yellow-500"
                    size={40}
                  />
                  <span className="text-4xl font-bold text-purple-600">
                    {currentProfile.stars}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setCurrentScreen("profile-select")
                  }
                  className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <RotateCcw
                    size={32}
                    className="text-purple-600"
                  />
                </button>
              </div>
            </div>

            <h2 className="text-6xl font-bold text-purple-600 text-center mb-12">
              Elige un juego
            </h2>

            <div className="relative">
              <button
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-6 shadow-xl hover:shadow-2xl transition-all -translate-x-4"
              >
                <ChevronLeft
                  size={48}
                  className="text-purple-600"
                />
              </button>

              <div
                ref={carouselRef}
                className="flex gap-8 overflow-x-auto scroll-smooth pb-8 px-16 hide-scrollbar"
                style={{ scrollbarWidth: "none" }}
              >
                {games.map((game, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleActivitySelect(
                        `activity${index + 1}` as any,
                        index,
                      )
                    }
                    className="flex-shrink-0 w-[500px] bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all overflow-hidden"
                  >
                    <div
                      className={`h-64 bg-gradient-to-br ${game.color} flex items-center justify-center`}
                    >
                      <div className="w-48 h-48">
                        <ImagePlaceholder
                          type={game.image}
                          size="large"
                        />
                      </div>
                    </div>
                    <div className="p-10">
                      <h3 className="text-4xl font-bold text-gray-800">
                        {game.name}
                      </h3>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-6 shadow-xl hover:shadow-2xl transition-all translate-x-4"
              >
                <ChevronRight
                  size={48}
                  className="text-purple-600"
                />
              </button>
            </div>
          </motion.div>
        )}

        {/* Actividad 1 */}
        {currentScreen === "activity1" && (
          <motion.div
            key="activity1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl w-full"
          >
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={resetToMenu}
                className="bg-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
              >
                <Home size={32} className="text-purple-600" />
                <span className="text-2xl font-semibold text-purple-600">
                  Menú
                </span>
              </button>
              <div className="flex items-center gap-3 bg-white rounded-full px-6 py-4 shadow-lg">
                <Star
                  className="text-yellow-500 fill-yellow-500"
                  size={36}
                />
                <span className="text-3xl font-bold text-purple-600">
                  {currentProfile?.stars}
                </span>
              </div>
            </div>

            <motion.div
              key={currentActivityIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-12 shadow-2xl"
            >
              <h3 className="text-5xl font-bold text-gray-800 text-center mb-8">
                Escucha y elige la imagen
              </h3>

              <div className="flex justify-center mb-12">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    playWord(
                      currentWords[currentActivityIndex].word,
                    )
                  }
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-10 shadow-xl"
                >
                  <Volume2 size={72} />
                </motion.button>
              </div>

              <div
                className={`grid gap-6 ${isYoungUser ? "grid-cols-3" : "grid-cols-4"} max-w-5xl mx-auto mb-8`}
              >
                {currentWords[currentActivityIndex].options.map(
                  (option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionSelect(index)}
                      disabled={showFeedback}
                      className={`aspect-square rounded-3xl transition-all shadow-xl hover:shadow-2xl
                      ${selectedOption === index ? (isCorrect ? "ring-8 ring-green-500" : "ring-8 ring-red-500") : ""}
                    `}
                    >
                      <ImagePlaceholder type={option} />
                    </motion.button>
                  ),
                )}
              </div>

              {showMicAnimation && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <p className="text-3xl font-semibold text-purple-600">
                    Ahora repite:
                  </p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                    }}
                    className="bg-gradient-to-r from-red-400 to-pink-400 rounded-full p-8"
                  >
                    <Mic size={64} className="text-white" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className={`${isCorrect ? "bg-green-400" : "bg-orange-400"} rounded-3xl p-16 shadow-2xl`}
                >
                  <p className="text-5xl md:text-7xl font-bold text-white text-center">
                    {isCorrect
                      ? "¡Muy bien!"
                      : "¡Intenta otra vez!"}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Actividad 2 */}
        {currentScreen === "activity2" && (
          <motion.div
            key="activity2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl w-full"
          >
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={resetToMenu}
                className="bg-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
              >
                <Home size={32} className="text-purple-600" />
                <span className="text-2xl font-semibold text-purple-600">
                  Menú
                </span>
              </button>
              <div className="flex items-center gap-3 bg-white rounded-full px-6 py-4 shadow-lg">
                <Star
                  className="text-yellow-500 fill-yellow-500"
                  size={36}
                />
                <span className="text-3xl font-bold text-purple-600">
                  {currentProfile?.stars}
                </span>
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

              {/* Imágenes relacionadas */}
              <div
                className={`grid ${isYoungUser ? "grid-cols-2" : currentSentences[currentActivityIndex].images.length === 3 ? "grid-cols-3" : "grid-cols-4"} gap-8 max-w-5xl mx-auto mb-12`}
              >
                {currentSentences[
                  currentActivityIndex
                ].images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-square rounded-3xl shadow-xl"
                  >
                    <ImagePlaceholder
                      type={image}
                      size="large"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Botón de micrófono grande */}
              {!hasSpoken && !isSpeaking && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <p className="text-3xl font-semibold text-purple-600">
                    Presiona para hablar
                  </p>
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

              {/* Animación mientras "escucha" */}
              {isSpeaking && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <p className="text-4xl font-semibold text-purple-600">
                    Te estoy escuchando...
                  </p>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                    }}
                    className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-12 shadow-2xl"
                  >
                    <Mic size={80} className="text-white" />
                  </motion.div>
                </motion.div>
              )}

              {/* Ejemplo sugerido (solo visible después de responder) */}
              {hasSpoken && !showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <p className="text-2xl text-gray-500 italic">
                    Ejemplo:{" "}
                    {
                      currentSentences[currentActivityIndex]
                        .exampleSentence
                    }
                  </p>
                </motion.div>
              )}
            </motion.div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
              >
                <motion.div
                  initial={{ scale: 0.5, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  className={`${isCorrect ? "bg-green-400" : "bg-orange-400"} rounded-3xl p-16 shadow-2xl text-center max-w-2xl`}
                >
                  <p className="text-8xl mb-4">
                    {isCorrect ? "⭐" : "😊"}
                  </p>
                  <p className="text-7xl font-bold text-white mb-4">
                    {isCorrect
                      ? "¡Muy bien!"
                      : "¡Inténtalo otra vez!"}
                  </p>
                  {!isCorrect && (
                    <p className="text-3xl text-white opacity-90">
                      Piensa en las imágenes
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Actividad 3 */}
        {currentScreen === "activity3" && (
          <motion.div
            key="activity3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl w-full"
          >
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={resetToMenu}
                className="bg-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
              >
                <Home size={32} className="text-purple-600" />
                <span className="text-2xl font-semibold text-purple-600">
                  Menú
                </span>
              </button>
              <div className="flex items-center gap-3 bg-white rounded-full px-6 py-4 shadow-lg">
                <Star
                  className="text-yellow-500 fill-yellow-500"
                  size={36}
                />
                <span className="text-3xl font-bold text-purple-600">
                  {currentProfile?.stars}
                </span>
              </div>
            </div>

            <motion.div
              key={currentActivityIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-12 shadow-2xl"
            >
              {isYoungUser ? (
                <>
                  <h3 className="text-5xl font-bold text-gray-800 text-center mb-8">
                    Encuentra el sonido
                  </h3>

                  <div className="flex justify-center mb-12">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        playWord(
                          currentSounds[currentActivityIndex]
                            .sound,
                        )
                      }
                      className="bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full p-10 shadow-xl"
                    >
                      <Volume2 size={72} />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {currentSounds[
                      currentActivityIndex
                    ].options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSoundSelect(index)}
                        disabled={showFeedback}
                        className={`aspect-square rounded-3xl transition-all shadow-xl hover:shadow-2xl
                          ${selectedOption === index ? (isCorrect ? "ring-8 ring-green-500" : "ring-8 ring-red-500") : ""}
                        `}
                      >
                        <ImagePlaceholder type={option} />
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-5xl font-bold text-gray-800 text-center mb-8">
                    Completa la palabra
                  </h3>

                  <div className="flex justify-center mb-8">
                    <div className="w-64 h-64">
                      <ImagePlaceholder
                        type={
                          currentWordComplete[
                            currentActivityIndex
                          ].image
                        }
                        size="large"
                      />
                    </div>
                  </div>

                  <div className="text-center mb-12">
                    <p className="text-7xl font-bold text-purple-600 tracking-wider">
                      {
                        currentWordComplete[
                          currentActivityIndex
                        ].incomplete
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {currentWordComplete[
                      currentActivityIndex
                    ].options.map((letter, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleLetterSelect(letter)
                        }
                        disabled={showFeedback}
                        className="aspect-square rounded-3xl bg-gradient-to-br from-blue-400 to-purple-400 text-white text-6xl font-bold shadow-xl hover:shadow-2xl transition-all"
                      >
                        {letter}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className={`${isCorrect ? "bg-green-400" : "bg-orange-400"} rounded-3xl p-16 shadow-2xl`}
                >
                  <p className="text-7xl font-bold text-white text-center">
                    {isCorrect
                      ? "¡Excelente!"
                      : "¡Intenta otra vez!"}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Recompensas */}
        {currentScreen === "rewards" && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center max-w-4xl w-full"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <Star className="text-yellow-400 fill-yellow-400 w-48 h-48 mx-auto drop-shadow-2xl" />
            </motion.div>

            <h2 className="text-7xl font-bold text-purple-600 mb-12">
              ¡Excelente trabajo!
            </h2>

            <div className="bg-white rounded-3xl p-16 shadow-2xl mb-12">
              <p className="text-5xl font-bold text-green-600 mb-8">
                Ganaste +{starsEarned}{" "}
                {starsEarned === 1 ? "estrella" : "estrellas"}
              </p>

              <div className="flex items-center justify-center gap-4 mb-8">
                {[...Array(Math.min(starsEarned, 5))].map(
                  (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.15 }}
                    >
                      <Star className="text-yellow-500 fill-yellow-500 w-16 h-16" />
                    </motion.div>
                  ),
                )}
              </div>

              <div className="h-px bg-gray-200 my-8"></div>

              <p className="text-3xl text-gray-600">
                Total acumulado:{" "}
                <span className="font-bold text-purple-600">
                  {currentProfile?.stars} estrellas
                </span>
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetToMenu}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-20 py-8 text-4xl font-bold shadow-2xl"
            >
              Volver al Menú
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}