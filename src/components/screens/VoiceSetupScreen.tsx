import { useState } from "react";
import { motion } from "motion/react";
import { Mic, Check, RotateCcw } from "lucide-react";
import type { UserProfile, VoiceStep } from "../../types";

interface VoiceSetupScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export const VoiceSetupScreen = ({ onComplete }: VoiceSetupScreenProps) => {
  const [voiceStep, setVoiceStep] = useState<VoiceStep>("welcome");
  const [voiceInput, setVoiceInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    name: "",
    age: 0,
  });

  const avatars = ["cat", "dog", "bear", "rabbit", "fox"];

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      if (voiceStep === "name") {
        const names = ["María", "Juan", "Sofía", "Carlos", "Luna"];
        setVoiceInput(names[Math.floor(Math.random() * names.length)]);
      } else if (voiceStep === "age") {
        setVoiceInput(String(Math.floor(Math.random() * 6) + 4));
      }
      setIsListening(false);
    }, 2000);
  };

  const handleVoiceConfirm = () => {
    if (voiceStep === "name") {
      setNewProfileData({ ...newProfileData, name: voiceInput });
      setVoiceInput("");
      setVoiceStep("age");
    } else if (voiceStep === "age") {
      const age = parseInt(voiceInput);
      setNewProfileData({ ...newProfileData, age });
      setVoiceInput("");
      setVoiceStep("confirm");
    } else if (voiceStep === "confirm") {
      const newProfile: UserProfile = {
        id: Date.now().toString(),
        name: newProfileData.name,
        age: newProfileData.age,
        stars: 0,
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
      };
      onComplete(newProfile);
      setVoiceStep("welcome");
      setNewProfileData({ name: "", age: 0 });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-3xl w-full"
    >
      <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
        {voiceStep === "welcome" && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <p className="text-6xl">🎤</p>
            </div>
            <h2 className="text-6xl font-bold text-purple-600 mb-6">¡Hola!</h2>
            <p className="text-3xl text-gray-600 mb-12">Voy a hacerte unas preguntas</p>
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
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <p className="text-6xl">🎤</p>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-12">¿Cómo te llamas?</h2>

            {voiceInput && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-purple-100 rounded-3xl p-8 mb-8 inline-block"
              >
                <p className="text-4xl font-bold text-purple-600">{voiceInput}</p>
              </motion.div>
            )}

            <div className="flex gap-6 justify-center mt-12">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={simulateVoiceInput}
                disabled={isListening}
                className={`${
                  isListening ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-red-400 to-pink-400"
                } rounded-full p-10 shadow-xl`}
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
                  <Check size={72} className="text-white" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {voiceStep === "age" && (
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <p className="text-6xl">🎤</p>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-12">¿Cuántos años tienes?</h2>

            {voiceInput && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-purple-100 rounded-3xl p-8 mb-8 inline-block"
              >
                <p className="text-4xl font-bold text-purple-600">{voiceInput} años</p>
              </motion.div>
            )}

            <div className="flex gap-6 justify-center mt-12">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={simulateVoiceInput}
                disabled={isListening}
                className={`${
                  isListening ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-red-400 to-pink-400"
                } rounded-full p-10 shadow-xl`}
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
                  <Check size={72} className="text-white" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {voiceStep === "confirm" && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <p className="text-6xl">🎤</p>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-8">¿Todo correcto?</h2>
            <div className="bg-purple-50 rounded-3xl p-8 mb-12">
              <p className="text-3xl text-gray-600 mb-2">Tu nombre:</p>
              <p className="text-5xl font-bold text-purple-600 mb-6">{newProfileData.name}</p>
              <p className="text-3xl text-gray-600 mb-2">Tu edad:</p>
              <p className="text-5xl font-bold text-purple-600">{newProfileData.age} años</p>
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
  );
};