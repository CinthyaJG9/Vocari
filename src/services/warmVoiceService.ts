// Servicio de voz con voz femenina cálida para niños
let speechQueue: string[] = [];
let isSpeaking = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let voicesLoaded = false;

// Configuración de voz cálida
const voiceConfig = {
  rate: 0.88,      
  pitch: 1.3,      
  volume: 1,
};

// Frases cortas del asistente
export const assistantPhrases = {
  welcome: "¡Hola! Soy tu asistente, vamos a aprender jugando",
  confirmName: (name: string) => `Dijiste ${name}, ¿es correcto? Di sí o no`,
  confirmAge: (age: number) => `${age} años, ¿correcto?`,
  nameCorrect: "¡Qué bonito nombre!",
  ageCorrect: "Excelente edad",
  nameAgain: "Dime tu nombre otra vez",
  ageAgain: "Dime tu edad otra vez",
  sayYes: "Sí",
  sayNo: "No",
  profileSaved: "Perfil guardado",
  profileDeleted: "Perfil eliminado",
  avatarChanged: "Avatar actualizado",
  help: "Presiona el micrófono y habla claro",
  readingHelp: "Si no sabes leer, escúchame y repite",
};

// Lista de voces femeninas en español
const getWarmVoice = (): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  
  // Priorizar voces femeninas específicas (orden de preferencia)
  const femaleVoices = [
    // Google voces (mejores)
    'Google español femenino',
    'Google español',
    // macOS voces
    'Mónica',
    'Paulina',
    'Martha',
    'Sofia',
    // Windows voces
    'Microsoft Sabina',
    'Microsoft Elena',
    'Microsoft Zira',
  ];
  
  // Buscar por nombre específico
  for (const voiceName of femaleVoices) {
    const found = voices.find(v => 
      (v.lang === 'es-ES' || v.lang === 'es-MX') && 
      v.name.includes(voiceName)
    );
    if (found) return found;
  }
  
  // Buscar cualquier voz femenina en español
  const spanishFemale = voices.find(v => 
    (v.lang === 'es-ES' || v.lang === 'es-MX') && 
    (v.name.toLowerCase().includes('female') || 
     v.name.toLowerCase().includes('mujer') ||
     v.name.toLowerCase().includes('google'))
  );
  
  if (spanishFemale) return spanishFemale;
  
  // Fallback: cualquier voz en español
  return voices.find(v => v.lang === 'es-ES') || null;
};

// Cargar voces y seleccionar la mejor
export const initWarmVoice = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && !voicesLoaded) {
        voicesLoaded = true;
        const warmVoice = getWarmVoice();
        console.log('Voz seleccionada:', warmVoice?.name || 'Voz por defecto');
        resolve(true);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Timeout por si nunca cargan
    setTimeout(() => {
      if (!voicesLoaded) {
        console.log('Usando voz por defecto');
        voicesLoaded = true;
        resolve(true);
      }
    }, 2000);
  });
};

// Hablar con voz cálida
export const speakWarm = async (text: string): Promise<void> => {
  if (!text || text.length === 0) return;
  
  // Asegurar que las voces están cargadas
  if (!voicesLoaded) {
    await initWarmVoice();
  }
  
  return new Promise((resolve) => {
    speechQueue.push(text);
    
    const processQueue = () => {
      if (isSpeaking || speechQueue.length === 0) return;
      
      isSpeaking = true;
      const nextText = speechQueue.shift()!;
      
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(nextText);
      utterance.lang = 'es-ES';
      utterance.rate = voiceConfig.rate;
      utterance.pitch = voiceConfig.pitch;
      utterance.volume = voiceConfig.volume;
      
      const warmVoice = getWarmVoice();
      if (warmVoice) {
        utterance.voice = warmVoice;
        console.log('Usando voz:', warmVoice.name);
      }
      
      utterance.onend = () => {
        isSpeaking = false;
        currentUtterance = null;
        resolve();
        setTimeout(processQueue, 150);
      };
      
      utterance.onerror = (e) => {
        console.error('Error en voz:', e);
        isSpeaking = false;
        currentUtterance = null;
        resolve();
        setTimeout(processQueue, 150);
      };
      
      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };
    
    processQueue();
  });
};

export const cancelVoice = () => {
  window.speechSynthesis.cancel();
  speechQueue = [];
  isSpeaking = false;
  currentUtterance = null;
};

export const isVoiceSupported = (): boolean => {
  return 'speechSynthesis' in window;
};