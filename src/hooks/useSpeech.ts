export const useSpeech = () => {
  const playWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "es-ES";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return { playWord };
};