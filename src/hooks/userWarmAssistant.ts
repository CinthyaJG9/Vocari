import { useState, useCallback, useRef, useEffect } from 'react';
import { speak, speakWithQueue, cancelSpeak as cancelVoice, assistantPhrases } from "../services/warmVoiceService";

// Verificar si el navegador soporta voz
const isVoiceSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

export const useWarmAssistant = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceReady, setIsVoiceReady] = useState(false);
  const speechQueue = useRef<string[]>([]);

  useEffect(() => {
    setIsVoiceReady(isVoiceSupported());
    
    // Cargar voces al inicio
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      cancelVoice();
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text) return;
    
    setIsSpeaking(true);
    try {
      await speakWithQueue(text);
    } catch (error) {
      console.error("Error al hablar:", error);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  // Funciones predefinidas (cortas y cálidas)
  const sayWelcome = useCallback(() => speak(assistantPhrases.welcome), [speak]);
  const sayConfirmName = useCallback((name: string) => speak(assistantPhrases.confirmName(name)), [speak]);
  const sayConfirmAge = useCallback((age: number) => speak(assistantPhrases.confirmAge(age)), [speak]);
  const sayNameCorrect = useCallback(() => speak(assistantPhrases.nameCorrect), [speak]);
  const sayAgeCorrect = useCallback(() => speak(assistantPhrases.ageCorrect), [speak]);
  const sayNameAgain = useCallback(() => speak(assistantPhrases.nameAgain), [speak]);
  const sayAgeAgain = useCallback(() => speak(assistantPhrases.ageAgain), [speak]);
  const sayProfileSaved = useCallback(() => speak(assistantPhrases.profileSaved), [speak]);
  const sayProfileDeleted = useCallback(() => speak(assistantPhrases.profileDeleted), [speak]);
  const sayAvatarChanged = useCallback(() => speak(assistantPhrases.avatarChanged), [speak]);
  const sayHelp = useCallback(() => speak(assistantPhrases.help), [speak]);
  const sayReadingHelp = useCallback(() => speak(assistantPhrases.readingHelp), [speak]);

  return {
    speak,
    sayWelcome,
    sayConfirmName,
    sayConfirmAge,
    sayNameCorrect,
    sayAgeCorrect,
    sayNameAgain,
    sayAgeAgain,
    sayProfileSaved,
    sayProfileDeleted,
    sayAvatarChanged,
    sayHelp,
    sayReadingHelp,
    isSpeaking,
    isVoiceReady,
    cancelVoice,
  };
};