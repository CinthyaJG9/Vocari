// API gratuita de palabras en español (sin límites)
const WORD_API = 'https://random-word-api.herokuapp.com/word?lang=es';
const IMAGE_API = 'https://api.unsplash.com/search/photos?query=';

const UNSPLASH_KEY = 'htPVLwBbaM459ordcFmdNuCDyYLQcrpp9klt2J-8tNU'; 

// Cache de imágenes para no repetir peticiones
const imageCache: Record<string, string> = {};

// Obtener palabra aleatoria según edad
export const getRandomWord = async (age: number): Promise<string> => {
  try {
    const response = await fetch(WORD_API);
    const data = await response.json();
    let word = data[0];
    
    // Validar longitud según edad
    if (age <= 4 && word.length > 5) {
      return getRandomWord(age); // Reintentar
    }
    if (age <= 6 && word.length > 7) {
      return getRandomWord(age);
    }
    
    return word;
  } catch (error) {
    console.error("Error fetching word:", error);
    // Fallback palabras según edad
    const fallbacks = {
      young: ["gato", "perro", "sol", "luna", "casa", "flor"],
      medium: ["mariposa", "estrella", "montaña", "río"],
      old: ["helicóptero", "televisión", "computadora"]
    };
    
    if (age <= 4) return fallbacks.young[Math.floor(Math.random() * fallbacks.young.length)];
    if (age <= 7) return fallbacks.medium[Math.floor(Math.random() * fallbacks.medium.length)];
    return fallbacks.old[Math.floor(Math.random() * fallbacks.old.length)];
  }
};

// Obtener URL de imagen real desde Unsplash
export const getImageUrl = async (query: string): Promise<string> => {
  if (imageCache[query]) return imageCache[query];
  
  try {
    // Usar placeholder de Unsplash directo (gratis, sin key)
    const url = `https://source.unsplash.com/400x400/?${encodeURIComponent(query)}`;
    imageCache[query] = url;
    return url;
  } catch (error) {
    console.error("Error fetching image:", error);
    return `https://picsum.photos/400/400?random=${query}`;
  }
};

// Generar opciones falsas (para niños pequeños - solo imágenes)
export const generateImageOptions = async (correctWord: string): Promise<string[]> => {
  const otherWords = ["gato", "perro", "sol", "luna", "casa", "flor", "árbol", "pez"].filter(w => w !== correctWord);
  const shuffled = [...otherWords].sort(() => Math.random() - 0.5);
  return [correctWord, ...shuffled.slice(0, 2)];
};

// Generar opciones mixtas (para niños grandes - texto e imágenes)
export const generateMixedOptions = (correctWord: string): string[] => {
  const commonWords = ["animal", "cosa", "objeto", "elemento", "lugar", "persona"];
  const shuffled = [...commonWords].sort(() => Math.random() - 0.5);
  return [correctWord, ...shuffled.slice(0, 3)];
};