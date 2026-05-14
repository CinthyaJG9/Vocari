// Lista de palabras que NO queremos (artículos, preposiciones, etc.)
const FORBIDDEN_WORDS = ['una', 'uno', 'unas', 'unos', 'el', 'la', 'los', 'las', 'de', 'con', 'para', 'por', 'que', 'esto', 'esta'];

// Historial de palabras usadas para evitar repeticiones
let usedWords: string[] = [];

const PIXABAY_API_KEY = '55853181-518a1bfebb9d59fe630abdfc6'; 

/**
 * Obtiene una palabra aleatoria filtrada por edad y evita repeticiones.
 */
export const getWordByAge = async (age: number): Promise<string> => {
  try {
    const temas = age < 7 
      ? ['animal', 'fruta', 'juguete', 'mueble', 'vehiculo', 'prenda', 'color'] 
      : ['herramienta', 'electrodomestico', 'profesion', 'instrumento', 'edificio', 'deporte', 'planeta'];
    
    const tema = temas[Math.floor(Math.random() * temas.length)];
    // Pedimos 100 resultados para tener una "bolsa" grande de donde elegir al azar
    const url = `https://api.datamuse.com/words?rel_jjb=${tema}&v=es&max=100`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const validWords = data
      .map((item: any) => item.word.toLowerCase())
      .filter((word: string) => {
        const esValida = /^[a-zñáéíóú]+$/.test(word);
        const noEsArticulo = !FORBIDDEN_WORDS.includes(word);
        const noRepetida = !usedWords.includes(word);
        const largoOk = word.length > 3; 
        return esValida && noEsArticulo && noRepetida && largoOk;
      });

    if (validWords.length === 0) {
      // Si ya usamos todas las palabras posibles del tema, vaciamos el historial para no trabar el juego
      usedWords = [];
      return getWordByAge(age);
    }

    // ALEATORIEDAD: No tomamos la primera, sino una posición al azar del array filtrado
    const randomIndex = Math.floor(Math.random() * validWords.length);
    const selectedWord = validWords[randomIndex];
    
    // Guardamos en el historial (memoria de las últimas 50 palabras)
    usedWords.push(selectedWord);
    if (usedWords.length > 50) usedWords.shift(); 

    return selectedWord;
  } catch (error) {
    console.error("Error en getWordByAge:", error);
    const fallbacks = age < 7 ? ["gato", "mesa", "sol", "pera"] : ["computadora", "arquitecto", "universo"];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

/**
 * Obtiene palabras distractoras para las opciones del juego.
 */
export const getRelatedWords = async (word: string, age: number): Promise<string[]> => {
  try {
    const temasDistractores = ['objeto', 'naturaleza', 'lugar'];
    const tema = temasDistractores[Math.floor(Math.random() * temasDistractores.length)];
    
    const response = await fetch(`https://api.datamuse.com/words?rel_jjb=${tema}&v=es&max=30`);
    const data = await response.json();
    
    let distractors = data
      .map((item: any) => item.word.toLowerCase())
      .filter((w: string) => 
        w !== word && 
        !FORBIDDEN_WORDS.includes(w) && 
        /^[a-zñáéíóú]+$/.test(w) && 
        w.length > 3
      )
      .sort(() => Math.random() - 0.5) // Mezclamos los distractores
      .slice(0, 3);

    // Si la API falla o no devuelve suficientes, usamos una lista segura
    while (distractors.length < 3) {
      const extra = ['nube', 'reloj', 'llave', 'lámpara', 'taza', 'bosque', 'piedra'];
      const pick = extra[Math.floor(Math.random() * extra.length)];
      if (!distractors.includes(pick) && pick !== word) distractors.push(pick);
    }

    // Retornamos las 4 opciones (correcta + 3 distractores) barajadas
    return [...distractors, word].sort(() => Math.random() - 0.5);
  } catch {
    return [word, "bosque", "silla", "avion"].sort(() => Math.random() - 0.5);
  }
};

/**
 * Busca imágenes en Pixabay con filtros de seguridad y lenguaje.
 */
export const getRealImage = async (word: string): Promise<string> => {
  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&safesearch=true&lang=es&per_page=5`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Elegimos una imagen al azar de las primeras encontradas para variar visualmente
      const randomIndex = Math.floor(Math.random() * Math.min(data.hits.length, 3));
      return data.hits[randomIndex].webformatURL;
    }
    
    // Fallback: Si no hay foto, usamos un placeholder con estilo infantil/limpio
    return `https://loremflickr.com/400/400/toy,object?lock=${word.length}`;
  } catch {
    return `https://placehold.co/400x400?text=${word}`;
  }
};

/**
 * Evalúa la pronunciación del usuario.
 */
export const evaluateSpeech = (spoken: string, expected: string, age: number) => {
  const cleanSpoken = spoken.toLowerCase().trim();
  const cleanExpected = expected.toLowerCase().trim();

  // Es correcto si la palabra esperada está contenida en lo que se habló
  const isCorrect = cleanSpoken.includes(cleanExpected);

  if (isCorrect) {
    return {
      correct: true,
      stars: 2, 
      message: age < 7 ? "¡Increíble! ¡Lo dijiste muy bien! 🌟" : "Pronunciación correcta. ¡Sigue así! ✨"
    };
  } else {
    const message = cleanSpoken === "" 
      ? "No logré escucharte, ¿puedes repetirlo? 🎤" 
      : `Escuché "${spoken}", ¡intenta decir "${expected}"!`;
      
    return {
      correct: false,
      stars: 0,
      message: message
    };
  }
};