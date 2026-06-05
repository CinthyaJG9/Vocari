import { speak, speakWithQueue, cancelSpeak } from "../services/warmVoiceService";

export const useSpeech = () => {
  const playWord = (word: string, rate: number = 0.85) => {
    speak(word, rate);
  };

  const playPhrase = async (phrase: string) => {
    await speakWithQueue(phrase);
  };

  const stopSpeaking = () => {
    cancelSpeak();
  };

  return { playWord, playPhrase, stopSpeaking };
};