import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Mic, Home, Volume2, HelpCircle, Users, Edit2 } from "lucide-react";
import { RealImage } from "../common/RealImage";
import { EditNameModal } from "../common/EditNameModal";
import { speak, listen } from "../../services/voiceService";
import type { UserProfile } from "../../types";

interface VoiceSetupScreenProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

export const VoiceSetupScreen = ({ onComplete, onBack }: VoiceSetupScreenProps) => {
  const [step, setStep] = useState<"welcome" | "name" | "confirmName" | "age" | "confirmAge" | "avatar">("welcome");
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar1");
  const [isListening, setIsListening] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [parentHelpActive, setParentHelpActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  const avatarOptions = [
    { id: "avatar1", name: "Niña" },
    { id: "avatar2", name: "Niño" },
    { id: "avatar3", name: "Amiga" },
    { id: "cat", name: "Gato" },
    { id: "dog", name: "Perro" },
  ];

  // Iniciar bienvenida
  useEffect(() => {
    const init = async () => {
      if (step === "welcome") {
        await speak("¡Hola! Soy tu asistente. Vamos a crear tu perfil");
        await new Promise(r => setTimeout(r, 500));
        await speak("Dime, ¿cómo te llamas?");
        setStep("name");
      }
    };
    init();
  }, []);

  // Hablar según el paso
  useEffect(() => {
    const say = async () => {
      if (step === "confirmName" && name && !parentHelpActive) {
        await speak(`${name}, ¿es correcto tu nombre?`);
      } else if (step === "confirmAge" && age && !parentHelpActive) {
        await speak(`${age} años, ¿es correcta tu edad?`);
      } else if (step === "age" && !parentHelpActive) {
        await speak("¿Cuántos años tienes? Dime un número, como cinco o seis");
      } else if (step === "avatar" && !parentHelpActive) {
        await speak("Elige tu avatar favorito tocando la imagen");
      }
    };
    const timer = setTimeout(say, 300);
    return () => clearTimeout(timer);
  }, [step, name, age, parentHelpActive]);

  const startListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    
    setIsListening(true);
    
    recognitionRef.current = listen(
      (text) => {
        setIsListening(false);
        processInput(text);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const processInput = async (text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // PASO 1: Nombre
    if (step === "name") {
      if (text.length > 1) {
        setName(text);
        setStep("confirmName");
      } else {
        await speak("No escuché bien tu nombre. Dímelo otra vez");
        startListening();
      }
    }
    // PASO 2: Confirmar nombre
    else if (step === "confirmName") {
      if (lowerText.includes("sí") || lowerText.includes("si")) {
        await speak("¡Muy bien!");
        setStep("age");
      } 
      else if (lowerText.includes("no")) {
        await speak("Dime tu nombre otra vez");
        setStep("name");
        startListening();
      }
      else if (lowerText.includes("ayuda") || lowerText.includes("mamá") || lowerText.includes("papá")) {
        activateParentHelp();
      }
      else {
        await speak("No entendí. Di sí si está bien, o no si quieres cambiarlo");
        startListening();
      }
    }
    // PASO 3: Edad
    else if (step === "age") {
      const numbers = text.match(/\d+/);
      let edad = numbers ? parseInt(numbers[0]) : null;
      
      const wordNumbers: Record<string, number> = { 
        uno:1, dos:2, tres:3, cuatro:4, cinco:5, 
        seis:6, siete:7, ocho:8, nueve:9, diez:10
      };
      
      if (!edad) {
        for (const [word, num] of Object.entries(wordNumbers)) {
          if (lowerText.includes(word)) {
            edad = num;
            break;
          }
        }
      }
      
      if (edad && edad >= 3 && edad <= 12) {
        setAge(edad);
        setStep("confirmAge");
      } else {
        await speak("No entendí tu edad. Dime un número del 3 al 12, como cinco o seis");
        startListening();
      }
    }
    // PASO 4: Confirmar edad
    else if (step === "confirmAge") {
      if (lowerText.includes("sí") || lowerText.includes("si")) {
        await speak("¡Excelente!");
        setStep("avatar");
      }
      else if (lowerText.includes("no")) {
        await speak("Dime tu edad otra vez");
        setStep("age");
        startListening();
      }
      else if (lowerText.includes("ayuda") || lowerText.includes("mamá") || lowerText.includes("papá")) {
        activateParentHelp();
      }
      else {
        await speak("No entendí. Di sí si está bien, o no si quieres cambiarlo");
        startListening();
      }
    }
  };

  const activateParentHelp = async () => {
    // Detener cualquier escucha actual
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    setIsListening(false);
    setParentHelpActive(true);
    
    await speak("Voy a leer la información para que mamá o papá me ayuden");
    await new Promise(r => setTimeout(r, 500));
    
    if (step === "confirmName") {
      await speak(`El nombre es ${name}`);
    } else if (step === "confirmAge") {
      await speak(`La edad es ${age} años`);
    }
    
    await speak("¿Está todo correcto? Di sí o no");
    
    // Escuchar respuesta del adulto
    setIsListening(true);
    recognitionRef.current = listen(
      async (response) => {
        setIsListening(false);
        const lowerResponse = response.toLowerCase();
        
        if (lowerResponse.includes("sí") || lowerResponse.includes("si")) {
          await speak("¡Perfecto! Gracias por ayudar");
          setParentHelpActive(false);
          if (step === "confirmName") {
            setStep("age");
          } else if (step === "confirmAge") {
            setStep("avatar");
          }
        } 
        else if (lowerResponse.includes("no")) {
          await speak("¿Qué necesitamos corregir? ¿El nombre o la edad?");
          
          // Escuchar qué corregir
          setIsListening(true);
          recognitionRef.current = listen(
            async (correction) => {
              setIsListening(false);
              const lowerCorrection = correction.toLowerCase();
              
              if (lowerCorrection.includes("nombre")) {
                await speak("Dime el nombre correcto");
                setStep("name");
              } else if (lowerCorrection.includes("edad")) {
                await speak("Dime la edad correcta");
                setStep("age");
              } else {
                await speak("No entendí. Puedes editar el perfil después desde el menú");
                setStep("avatar");
              }
              setParentHelpActive(false);
            },
            () => {
              setIsListening(false);
              setParentHelpActive(false);
            }
          );
        }
        else {
          await speak("No entendí. Si está bien, di sí. Si no, di no");
          activateParentHelp();
        }
      },
      () => {
        setIsListening(false);
        setParentHelpActive(false);
      }
    );
  };

  const cancelParentHelp = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    setIsListening(false);
    setParentHelpActive(false);
    speak("Cancelando ayuda. Continuemos con el registro");
  };

  const handleEditName = (newName: string) => {
    setName(newName);
    speak(`Nombre cambiado a ${newName}`);
    setStep("age");
  };

  const handleComplete = async () => {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: name,
      age: age,
      stars: 0,
      avatar: selectedAvatar,
    };
    await speak("¡Perfil guardado! Vamos a jugar");
    onComplete(newProfile);
  };

  const repeatQuestion = () => {
    if (step === "name") {
      speak("Dime tu nombre");
      startListening();
    } else if (step === "age") {
      speak("Dime tu edad");
      startListening();
    } else if (step === "confirmName") {
      speak(`${name}, ¿es correcto?`);
    } else if (step === "confirmAge") {
      speak(`${age} años, ¿es correcto?`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="bg-white rounded-full p-3 shadow-lg">
            <Home size={28} className="text-purple-600" />
          </button>
          
          {!parentHelpActive && (
            <button onClick={activateParentHelp} className="bg-white rounded-full p-3 shadow-lg">
              <Users size={28} className="text-purple-600" />
            </button>
          )}
          
          {parentHelpActive && (
            <button onClick={cancelParentHelp} className="bg-red-500 rounded-full p-3 shadow-lg">
              <span className="text-white text-sm font-bold">✕</span>
            </button>
          )}
          
          {(step === "name" || step === "age" || step === "confirmName" || step === "confirmAge") && !parentHelpActive && (
            <button onClick={repeatQuestion} className="bg-white rounded-full p-3 shadow-lg">
              <Volume2 size={28} className="text-purple-600" />
            </button>
          )}

          {step === "confirmName" && !parentHelpActive && (
            <button onClick={() => setShowEditModal(true)} className="bg-white rounded-full p-3 shadow-lg">
              <Edit2 size={28} className="text-purple-600" />
            </button>
          )}
        </div>

        {/* Tarjeta principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 text-center">
          
          {/* Avatar animado */}
          <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-xl transition-all ${isListening ? 'animate-pulse ring-4 ring-red-400' : ''}`}>
            <span className="text-5xl">{isListening ? "🎧" : parentHelpActive ? "👨‍👩‍👧" : "🎤"}</span>
          </div>

          {/* Indicador de ayuda parental */}
          {parentHelpActive && (
            <div className="mb-4 p-3 bg-purple-100 rounded-xl">
              <p className="text-purple-700 font-bold flex items-center justify-center gap-2">
                <HelpCircle size={20} />
                Modo ayuda: Hablando con mamá o papá
              </p>
              <p className="text-purple-600 text-sm mt-1">Estoy escuchando a los adultos</p>
            </div>
          )}

          {/* Paso: Nombre */}
          {step === "name" && !parentHelpActive && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">¿Cómo te llamas?</h2>
              <p className="text-gray-500 mb-6 text-sm">Presiona el micrófono y habla claro</p>
              <button
                onClick={startListening}
                disabled={isListening}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-8 py-4 text-xl font-bold shadow-xl disabled:opacity-50"
              >
                <Mic className="inline mr-2" size={24} />
                {isListening ? "Escuchando..." : "Hablar ahora"}
              </button>
            </>
          )}

          {/* Paso: Confirmar nombre */}
          {step === "confirmName" && !parentHelpActive && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">"{name}"</h2>
              <p className="text-gray-600 mb-4">¿Es correcto tu nombre?</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => { setStep("age"); speak("Muy bien"); }} className="bg-green-500 text-white rounded-full px-6 py-3 text-lg font-bold">
                  Sí ✅
                </button>
                <button onClick={() => { setStep("name"); speak("Dime tu nombre otra vez"); }} className="bg-red-500 text-white rounded-full px-6 py-3 text-lg font-bold">
                  No ❌
                </button>
              </div>
            </>
          )}

          {/* Paso: Edad */}
          {step === "age" && !parentHelpActive && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">¿Cuántos años tienes?</h2>
              <p className="text-gray-500 mb-6 text-sm">Dime un número, como cinco o seis</p>
              <button
                onClick={startListening}
                disabled={isListening}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-8 py-4 text-xl font-bold shadow-xl disabled:opacity-50"
              >
                <Mic className="inline mr-2" size={24} />
                {isListening ? "Escuchando..." : "Decir mi edad"}
              </button>
            </>
          )}

          {/* Paso: Confirmar edad */}
          {step === "confirmAge" && !parentHelpActive && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{age} años</h2>
              <p className="text-gray-600 mb-4">¿Es correcta tu edad?</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => setStep("avatar")} className="bg-green-500 text-white rounded-full px-6 py-3 text-lg font-bold">
                  Sí ✅
                </button>
                <button onClick={() => { setStep("age"); speak("Dime tu edad otra vez"); }} className="bg-red-500 text-white rounded-full px-6 py-3 text-lg font-bold">
                  No ❌
                </button>
              </div>
            </>
          )}

          {/* Paso: Avatar */}
          {step === "avatar" && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Elige tu avatar</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden transition-all ${
                      selectedAvatar === avatar.id
                        ? "ring-4 ring-purple-500 scale-110 shadow-xl"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <RealImage type={avatar.id} />
                    <p className="text-xs text-gray-600 mt-1">{avatar.name}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full px-8 py-4 text-xl font-bold shadow-xl hover:scale-105 transition-all"
              >
                ¡Empezar a jugar!
              </button>
            </>
          )}

          {/* Indicador de escucha */}
          {isListening && !parentHelpActive && (
            <div className="mt-6 text-center">
              <div className="flex justify-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Estoy escuchando... habla claro</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición de nombre */}
      {showEditModal && (
        <EditNameModal
          currentName={name}
          onSave={handleEditName}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};