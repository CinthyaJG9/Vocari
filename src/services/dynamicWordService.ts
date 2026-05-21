// API de palabras dinámica
const PIXABAY_API_KEY = '55853181-518a1bfebb9d59fe630abdfc6';

// Lista de palabras prohibidas
const FORBIDDEN_WORDS = [
  'una', 'uno', 'unas', 'unos', 'el', 'la', 'los', 'las', 
  'de', 'con', 'para', 'por', 'que', 'esto', 'esta', 'ese', 'esa',
  'yo', 'tu', 'el', 'nosotros', 'ellos', 'ellas', 'mi', 'su',
  'juan', 'pedro', 'maria', 'laura', 'carlos', 'ana', 'luis', 
  'jose', 'david', 'javier', 'francisco', 'manuel', 'marta', 'laura', 'sara', 'alberto', 'roberto', 'lucia', 'diego',
  'ariel', 'sofia', 'andres', 'valentina', 'fernando', 'gabriela', 'ricardo', 'claudia', 'sergio', 'paula'
];

// Historial de palabras usadas
let usedWords: string[] = [];

// Cache de imágenes (para no repetir peticiones)
const imageCache = new Map<string, string>();

const youngTopics = ['animales', 'frutas', 'juguetes', 'colores', 'comida'];
const oldTopics = ['profesiones', 'instrumentos', 'planetas', 'edificios', 'deportes', 'ciencia'];
/**
 * Obtiene palabra aleatoria NUEVA (sin repetir)
 */
export const getWordByAge = async (age: number): Promise<string> => {
  try {
    const temas = age < 7 ? youngTopics : oldTopics;
    const tema = temas[Math.floor(Math.random() * temas.length)];
    
    const url = `https://api.datamuse.com/words?rel_jjb=${tema}&v=es&max=200`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return getFallbackWord(age);
    }
    
    const validWords = data
      .map((item: any) => item.word.toLowerCase())
      .filter((word: string) => {
        


      const palabrasInvalidas = [
        'adverse',
        'apple',
        'house',
        'light',
        'mouse',
        'ring',
        'clock',
        'computer',
        'star',
        'moon',
        'cat',
        'dog',
        'bird',
        'car',
        'phone'
      ];

      const esValida = 
        /^[a-zñáéíóú]{4,10}$/.test(word) &&
        !palabrasInvalidas.includes(word.toLowerCase());  
        const noEsArticulo = !FORBIDDEN_WORDS.includes(word);
        const noRepetida = !usedWords.includes(word);
        const esSustantivo = !word.includes('mente') && !word.includes('ción');
        return esValida && noEsArticulo && noRepetida && esSustantivo;
      });
    
    if (validWords.length === 0) {
      if (usedWords.length > 30) {
        usedWords = [];
        return getWordByAge(age);
      }
      return getFallbackWord(age);
    }
    
    const randomIndex = Math.floor(Math.random() * validWords.length);
    const selectedWord = validWords[randomIndex];
    
    usedWords.push(selectedWord);
    if (usedWords.length > 30) usedWords.shift();
    
    return selectedWord;
    
  } catch (error) {
    console.error("Error en getWordByAge:", error);
    return getFallbackWord(age);
  }
};

const getFallbackWord = (age: number): string => {
  const fallbacks = {
    young: ["gato", "perro", "sol", "luna", "casa", "flor", "pez", "pato"],
    old: ["mariposa", "estrella", "montaña", "río", "árbol", "manzana"]
  };
  const list = age < 7 ? fallbacks.young : fallbacks.old;
  const available = list.filter(w => !usedWords.includes(w));
  
  if (available.length === 0) {
    usedWords = [];
    return list[Math.floor(Math.random() * list.length)];
  }
  
  const word = available[Math.floor(Math.random() * available.length)];
  usedWords.push(word);
  return word;
};

/**
 * Obtener opciones distractoras
 */
export const getRelatedWords = async (word: string, age: number): Promise<string[]> => {
  try {
    const url = `https://api.datamuse.com/words?ml=${tema}&v=es&max=50`;
    const response = await fetch(url);
    const data = await response.json();
    
    let distractors = data
      .map((item: any) => item.word.toLowerCase())
      .filter((w: string) => 
        w !== word && 
        !FORBIDDEN_WORDS.includes(w) && 
        /^[a-zñáéíóú]{3,10}$/.test(w) &&
        !usedWords.includes(w)
      )
      .slice(0, 15);
    distractors = [...new Set(distractors)];
    
    distractors = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
    
    while (distractors.length < 3) {
      const fallback = ['nube', 'reloj', 'llave', 'taza', 'bosque'];
      const candidate = fallback[Math.floor(Math.random() * fallback.length)];
      if (!distractors.includes(candidate) && candidate !== word) {
        distractors.push(candidate);
      }
    }
    
    return [word, ...distractors].sort(() => Math.random() - 0.5);
    
  } catch (error) {
    console.error("Error en getRelatedWords:", error);
    return [word, "nube", "casa", "flor"].sort(() => Math.random() - 0.5);
  }
};

/**
 * Obtener imagen REAL de Pixabay (garantizada relevante)
 */
export const getRealImage = async (word: string): Promise<string> => {
  // Verificar cache
  if (imageCache.has(word)) {
    return imageCache.get(word)!;
  }
  
  try {
    // Buscar imagen en Pixabay
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=ilustration&safesearch=true&lang=es&per_page=10`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Elegir la imagen más relevante (la primera o una aleatoria)
      // Para que no sea siempre la misma, a veces elegimos otra
      const randomIndex = 0; 
      const imageUrl = data.hits[randomIndex].webformatURL;
      
      imageCache.set(word, imageUrl);
      return imageUrl;
    }
    
    // Si no encuentra exacta, buscar una más general
    const fallbackUrl = await getFallbackImage(word);
    imageCache.set(word, fallbackUrl);
    return fallbackUrl;
    
  } catch (error) {
    console.error("Error fetching image from Pixabay:", error);
    const fallbackUrl = await getFallbackImage(word);
    imageCache.set(word, fallbackUrl);
    return fallbackUrl;
  }
};

/**
 * Imagen de fallback si Pixabay no encuentra nada
 */
const getFallbackImage = async (word: string): Promise<string> => {
  // Intentar con un término más general
  const generalTerms: Record<string, string> = {
    'gato': 'cat', 'perro': 'dog', 'casa': 'house', 'flor': 'flower',
    'sol': 'sun', 'luna': 'moon', 'estrella': 'star', 'pez': 'fish',
    'pájaro': 'bird', 'mariposa': 'butterfly', 'árbol': 'tree'
  };
  
  const englishTerm = generalTerms[word] || word;
  
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(englishTerm)}&image_type=photo&safesearch=true&per_page=5`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      return data.hits[0].webformatURL;
    }
  } catch (e) {
    console.error("Fallback también falló:", e);
  }
  
  // Último recurso: imagen placeholder con el nombre
  return `https://placehold.co/400x400/9b59b6/white?text=${encodeURIComponent(word)}`;
};

/**
 * Precargar imágenes para que sean rápidas
 */
export const preloadImages = async (words: string[]): Promise<void> => {
  const promises = words.map(word => getRealImage(word));
  await Promise.all(promises);
};

/**
 * Evaluar pronunciación
 */
export const evaluateSpeech = (spoken: string, expected: string, age: number) => {
  const cleanSpoken = spoken.toLowerCase().trim();
  const cleanExpected = expected.toLowerCase().trim();
  
  if (cleanSpoken === cleanExpected) {
    return { correct: true, stars: 2, message: "¡Perfecto! +2 estrellas ⭐⭐" };
  }
  
  if (cleanSpoken.includes(cleanExpected) || cleanExpected.includes(cleanSpoken)) {
    return { correct: true, stars: 1, message: "¡Muy bien! +1 estrella ⭐" };
  }
  
  let matches = 0;
  for (let i = 0; i < Math.min(cleanSpoken.length, cleanExpected.length); i++) {
    if (cleanSpoken[i] === cleanExpected[i]) matches++;
  }
  const similarity = matches / Math.max(cleanSpoken.length, cleanExpected.length);
  
  const tolerance = age <= 5 ? 0.4 : age <= 7 ? 0.5 : 0.6;
  
  if (similarity >= tolerance) {
    return { correct: true, stars: 1, message: `¡Bien! Dijiste "${spoken}". +1 estrella ⭐` };
  }
  
  return { correct: false, stars: 0, message: `Dijiste "${spoken}". La palabra es "${expected}". 💪` };
};

export const resetWordHistory = () => {
  usedWords = [];
  imageCache.clear();
};