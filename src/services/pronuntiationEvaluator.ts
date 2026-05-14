// Evaluador de pronunciación gratuito (sin API externa)

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  encouragement: string;
}

// Mapeo de errores comunes de dislalia
const commonErrors: Record<string, string[]> = {
  "perro": ["pero", "pedo", "pelo", "perlo"],
  "gato": ["dato", "ato", "gato"],
  "sol": ["tol", "ol"],
  "luna": ["una", "runa"],
  "tren": ["ten", "tlen"],
  "plátano": ["pátano", "latano"],
  "mariposa": ["maliposa", "marilosa"],
  "cuchara": ["cujara", "cucara"],
  "estrella": ["etrella", "estreya"],
  "computadora": ["computadora", "combutadora"]
};

// Calcular similitud fonética
const calculateSimilarity = (spoken: string, target: string): number => {
  const s1 = spoken.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const s2 = target.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  let matches = 0;
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) matches++;
  }
  
  return matches / Math.max(s1.length, s2.length);
};

// Evaluar pronunciación según edad
export const evaluatePronunciation = (
  spoken: string,
  target: string,
  age: number
): EvaluationResult => {
  const spokenNorm = spoken.toLowerCase().trim();
  const targetNorm = target.toLowerCase().trim();
  
  // Exacto
  if (spokenNorm === targetNorm) {
    return {
      isCorrect: true,
      score: 100,
      feedback: "¡Perfecto! Lo dijiste excelente",
      encouragement: "🎉 ¡Eres un campeón!"
    };
  }
  
  // Error común conocido
  if (commonErrors[targetNorm]?.includes(spokenNorm)) {
    return {
      isCorrect: true,
      score: 85,
      feedback: `¡Muy bien! Dijiste "${spoken}". La palabra es "${target}"`,
      encouragement: "🌟 ¡Sigue así!"
    };
  }
  
  // Calcular similitud
  const similarity = calculateSimilarity(spokenNorm, targetNorm);
  
  // Umbral según edad (más tolerante para niños pequeños)
  const threshold = age <= 5 ? 0.6 : age <= 8 ? 0.7 : 0.8;
  
  if (similarity >= threshold) {
    return {
      isCorrect: true,
      score: Math.round(similarity * 90),
      feedback: `¡Bien! Dijiste "${spoken}". La palabra es "${target}"`,
      encouragement: "⭐ ¡Sigue practicando!"
    };
  }
  
  return {
    isCorrect: false,
    score: Math.round(similarity * 50),
    feedback: `Dijiste "${spoken}". Intenta decir "${target}"`,
    encouragement: "💪 ¡Tú puedes! Inténtalo de nuevo"
  };
};