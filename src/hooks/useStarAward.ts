import { useState } from "react";
import confetti from "canvas-confetti";

export const useStarAward = (onAward?: (stars: number) => void) => {
  const [starsEarned, setStarsEarned] = useState(0);

  const awardStars = (amount: number) => {
    setStarsEarned((prev) => prev + amount);
    onAward?.(amount);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return { starsEarned, awardStars, resetStars: () => setStarsEarned(0) };
};