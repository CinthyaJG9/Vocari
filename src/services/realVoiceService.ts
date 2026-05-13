export const startRealVoiceRecognition = (
  onResult: (text: string) => void,
  onError?: (error: string) => void,
  onListeningChange?: (isListening: boolean) => void
) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("Tu navegador no soporta reconocimiento de voz");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    onListeningChange?.(true);
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = () => {
    onError?.("Error al reconocer voz");
  };

  recognition.onend = () => {
    onListeningChange?.(false);
  };

  recognition.start();
  return recognition;
};

// Conversión de números escritos a número
export const parseAgeFromText = (text: string): number | null => {
  const numberWords: { [key: string]: number } = {
    uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5,
    seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
  };

  let cleanedInput = text.toLowerCase()
    .replace("años", "")
    .replace("año", "")
    .trim();

  let age = parseInt(cleanedInput);
  
  if (isNaN(age)) {
    age = numberWords[cleanedInput];
  }
  
  return age || null;
};