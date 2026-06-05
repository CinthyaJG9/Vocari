// Servicio de voz unificado para toda la app - VOZ CÁLIDA Y CONSISTENTE
let isSpeaking = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let voiceQueue: string[] = [];

// Configuración de voz cálida y lenta (perfecta para niños)
const voiceConfig = {
  rate: 0.85,      // Más lento para que entiendan bien
  pitch: 1.2,      // Más agudo, cálido y amigable
  volume: 1,
};

// Cargar voz femenina en español
const getWarmVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  
  const preferredVoices = [
    'Google español femenino',
    'Google español',
    'es-ES',
    'es-MX',
    'Mónica',
    'Paulina',
    'Sabina',
    'Elena'
  ];
  
  for (const preferred of preferredVoices) {
    const found = voices.find(v => 
      (v.lang === 'es-ES' || v.lang === 'es-MX') && 
      (v.name.includes(preferred) || v.name.includes('es-ES'))
    );
    if (found) return found;
  }
  
  return voices.find(v => v.lang === 'es-ES' || v.lang === 'es-MX') || null;
};

// Función principal para hablar (SIN cola para respuestas rápidas)
export const speak = (text: string, rate?: number, onEnd?: () => void): void => {
  if (!text || text.length === 0) return;
  
  if (currentUtterance) {
    window.speechSynthesis.cancel();
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = rate || voiceConfig.rate;
  utterance.pitch = voiceConfig.pitch;
  utterance.volume = voiceConfig.volume;
  
  const warmVoice = getWarmVoice();
  if (warmVoice) utterance.voice = warmVoice;
  
  if (onEnd) utterance.onend = onEnd;
  
  utterance.onerror = () => {
    currentUtterance = null;
  };
  
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

// Hablar con cola (para no interrumpir mensajes importantes)
export const speakWithQueue = (text: string, rate?: number): Promise<void> => {
  return new Promise((resolve) => {
    voiceQueue.push(text);
    
    const processQueue = () => {
      if (isSpeaking || voiceQueue.length === 0) {
        if (voiceQueue.length === 0) resolve();
        return;
      }
      
      isSpeaking = true;
      const nextText = voiceQueue.shift()!;
      
      const utterance = new SpeechSynthesisUtterance(nextText);
      utterance.lang = 'es-ES';
      utterance.rate = rate || voiceConfig.rate;
      utterance.pitch = voiceConfig.pitch;
      utterance.volume = voiceConfig.volume;
      
      const warmVoice = getWarmVoice();
      if (warmVoice) utterance.voice = warmVoice;
      
      utterance.onend = () => {
        isSpeaking = false;
        processQueue();
      };
      
      utterance.onerror = () => {
        isSpeaking = false;
        processQueue();
      };
      
      window.speechSynthesis.speak(utterance);
    };
    
    processQueue();
  });
};

// Cancelar toda la voz
export const cancelSpeak = () => {
  window.speechSynthesis.cancel();
  voiceQueue = [];
  isSpeaking = false;
  currentUtterance = null;
};

// Alias para compatibilidad
export const cancelVoice = cancelSpeak;

// Frases del asistente (completas para el hook)
export const assistantPhrases = {
  welcome: "¡Hola! Soy tu asistente, vamos a aprender jugando",
  askName: "Dime tu nombre por favor",
  askAge: "¿Cuántos años tienes?",
  confirmName: (name: string) => `${name}, ¿es correcto tu nombre?`,
  confirmAge: (age: number) => `${age} años, ¿es correcta tu edad?`,
  nameCorrect: "¡Qué bonito nombre!",
  ageCorrect: "Excelente edad para aprender",
  nameAgain: "Dime tu nombre otra vez, por favor",
  ageAgain: "Dime tu edad con un número del 3 al 12, por favor",
  profileSaved: "Perfil guardado correctamente",
  profileDeleted: "Perfil eliminado",
  avatarChanged: "Avatar actualizado",
  help: "Presiona el micrófono y habla claro",
  readingHelp: "Si no sabes leer, solo escucha mi voz y repite",
  correct: "¡Muy bien!",
  excellent: "¡Excelente trabajo!",
  tryAgain: "Inténtalo otra vez, ¡tú puedes!",
  greatJob: "¡Lo estás haciendo genial!",
};