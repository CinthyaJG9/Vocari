// Servicio de voz completo
let isSpeaking = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export const messages = {
  // Para el niño
  welcome: "¡Hola! Soy tu amigo para aprender jugando",
  askName: "Dime, ¿cómo te llamas?",
  askNameAgain: "No escuché bien tu nombre. ¿Puedes repetirlo?",
  askAge: "Ahora dime, ¿cuántos años tienes?",
  askAgeAgain: "No entendí tu edad. Dime un número, como cinco o seis",
  
  // Para pedir ayuda a los padres
  needHelp: "¿Necesitas ayuda de mamá o papá? Ellos pueden ayudarte",
  askParentHelp: "Mamá o papá, ¿pueden ayudar a tu hijo o hija a confirmar esta información?",
  confirmWithParent: "Voy a leer la información. Si está bien, di ¡Sí! Si algo está mal, di ¡No! y podemos corregirlo",
  
  // Confirmaciones
  confirmName: (name: string) => `${name}, ¿es correcto tu nombre?`,
  confirmAge: (age: number) => `${age} años, ¿es correcto?`,
  
  // Respuestas
  correct: "¡Excelente!",
  incorrect: "No te preocupes, podemos corregirlo",
  askAgain: "Dime otra vez",
  
  // Final
  selectAvatar: "Ahora elige tu avatar favorito",
  saved: "¡Listo! Tu perfil está guardado. ¡Vamos a jugar!",
  helpGuide: "Recuerda: puedes pedir ayuda a mamá o papá cuando quieras",
};

export const speak = (text: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!text) {
      resolve();
      return;
    }
    
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang === 'es-ES' && (v.name.includes('Google') || v.name.includes('Mónica')));
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.onend = () => {
      isSpeaking = false;
      currentUtterance = null;
      resolve();
    };
    
    utterance.onerror = () => {
      isSpeaking = false;
      currentUtterance = null;
      resolve();
    };
    
    isSpeaking = true;
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
};

export const listen = (onResult: (text: string) => void, onEnd?: () => void) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    alert("Tu navegador no soporta reconocimiento de voz");
    return null;
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  let timeoutId: ReturnType<typeof setTimeout>;
  
  recognition.onstart = () => {
    console.log(" Escuchando...");
    timeoutId = setTimeout(() => {
      recognition.stop();
      speak("No escuché nada. Presiona el micrófono y habla claro");
    }, 10000) as unknown as ReturnType<typeof setTimeout>;
  };
  
  recognition.onresult = (event: any) => {
    clearTimeout(timeoutId);
    const text = event.results[0][0].transcript;
    console.log(" Dijiste:", text);
    onResult(text);
  };
  
  recognition.onerror = (event: any) => {
    clearTimeout(timeoutId);
    console.error("Error:", event.error);
    if (event.error === 'no-speech') {
      speak("No escuché nada. ¿Puedes hablar más fuerte?");
    }
  };
  
  recognition.onend = () => {
    clearTimeout(timeoutId);
    console.log(" Micrófono apagado");
    onEnd?.();
  };
  
  recognition.start();
  return recognition;
};