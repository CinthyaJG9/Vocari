// API gratuita de palabras en español (sin límites)
const WORD_API_URL = 'https://random-word-api.herokuapp.com/word?lang=es';
const SYNONYM_API = 'https://api.datamuse.com/words?ml=';

// Banco de palabras inicial para niños (fallback si API falla)
const fallbackWords = [
  "gato", "perro", "sol", "luna", "casa", "árbol", "flor", "agua", 
  "pan", "leche", "manzana", "pelota", "coche", "avión", "pez", 
  "pájaro", "mariposa", "abeja", "estrella", "montaña", "río", "mar"
];

// Palabras prohibidas (difíciles para niños)
const forbiddenWords = ["sexo", "muerte", "violencia", "sangre", "guerra"];

// Obtener palabra aleatoria según edad
export const getRandomWordByAge = async (age: number): Promise<string> => {
  try {
    // Determinar dificultad según edad
    const minLength = age <= 4 ? 3 : age <= 6 ? 4 : 5;
    const maxLength = age <= 4 ? 5 : age <= 6 ? 7 : 9;
    
    let attempts = 0;
    let word = "";
    
    while (attempts < 5) {
      // Llamar a API de palabras aleatorias
      const response = await fetch(`${WORD_API_URL}&minLength=${minLength}&maxLength=${maxLength}`);
      const data = await response.json();
      word = data[0];
      
      // Verificar que no sea palabra prohibida
      if (!forbiddenWords.includes(word.toLowerCase())) {
        break;
      }
      attempts++;
    }
    
    return word || fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    
  } catch (error) {
    console.error("Error fetching word, using fallback:", error);
    // Fallback a palabras predefinidas
    const filtered = fallbackWords.filter(w => w.length <= (age <= 6 ? 5 : 8));
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
};

// Obtener palabras relacionadas (para las opciones de imagen)
export const getRelatedWords = async (targetWord: string): Promise<string[]> => {
  try {
    // Buscar palabras similares o relacionadas
    const response = await fetch(`${SYNONYM_API}${targetWord}&max=5`);
    const data = await response.json();
    
    const related = data.map((item: any) => item.word).filter((w: string) => w !== targetWord);
    const shuffled = [...related, targetWord].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, 4);
    
  } catch (error) {
    console.error("Error getting related words:", error);
    // Fallback: palabras genéricas
    const generic = ["animal", "cosa", "objeto", "elemento"];
    return [targetWord, ...generic.slice(0, 3)];
  }
};

// Obtener consejos de pronunciación dinámicos
export const getPronunciationTip = (word: string): string => {
  const syllables = word.match(/[aeiouáéíóú]/gi)?.length || 1;
  
  if (word.includes("rr")) {
    return `La palabra "${word}" tiene una 'r' fuerte. Vibra la lengua en el paladar`;
  } else if (word.includes("tr")) {
    return `"${word}" comienza con 'tr'. Junta la lengua con los dientes superiores`;
  } else if (syllables > 3) {
    return `"${word}" es larga. Sepárala en sílabas: ${word.split(/(?=[aeiouáéíóú])/gi).join('-')}`;
  } else if (word.startsWith("p") || word.startsWith("t") || word.startsWith("k")) {
    return `La palabra "${word}" empieza con sonido explosivo. Sopla un poco de aire`;
  } else if (word.includes("s")) {
    return `"${word}" tiene la letra 's'. Silba como una serpiente`;
  } else {
    return `Di "${word}" despacio, sílaba por sílaba`;
  }
};