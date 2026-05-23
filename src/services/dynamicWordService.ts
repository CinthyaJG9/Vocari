// API de palabras dinámica - SOLO ESPAÑOL
const PIXABAY_API_KEY = '55853181-518a1bfebb9d59fe630abdfc6';

// ============================================
// LISTAS DE PALABRAS PROHIBIDAS
// ============================================

const FORBIDDEN_WORDS = [
  'una', 'uno', 'unas', 'unos', 'el', 'la', 'los', 'las', 
  'de', 'con', 'para', 'por', 'que', 'esto', 'esta', 'ese', 'esa',
  'yo', 'tu', 'nosotros', 'ellos', 'ellas', 'mi', 'su'
];

const PLACES = [
  'madrid', 'barcelona', 'valencia', 'sevilla', 'bilbao', 'malaga',
  'paris', 'londres', 'berlin', 'roma', 'lisboa', 'mexico', 'argentina'
];

const INFINITIVE_VERBS = [
  'correr', 'saltar', 'comer', 'beber', 'dormir', 'jugar', 'leer',
  'escribir', 'pintar', 'bailar', 'cantar', 'hablar', 'escuchar'
];

const ADVERBS_MENTE = [
  'moralmente', 'físicamente', 'mentalmente', 'rápidamente', 'lentamente',
  'difícilmente', 'fácilmente', 'perfectamente', 'totalmente', 'absolutamente'
];

// ============================================
// BANCO DE PALABRAS POR EDAD 
// ============================================

// PARA NIÑOS PEQUEÑOS (3-6 años) 
const YOUNG_WORDS: string[] = [
  // Animales domésticos y de granja
  "gato", "perro", "pato", "pollo", "vaca", "cerdo", "oveja", "cabra", "conejo", "ratón",
  "pez", "lobo", "foca", "oso", "zorro", "ciervo", "rana", "tortuga", "caracol", "abeja",
  "mariposa", "araña", "hormiga", "mosca", "grillo", "saltamontes", "luciérnaga", "libélula",
  
  // Frutas
  "pera", "uva", "kiwi", "coco", "mora", "higo", "papa", "maiz", "manzana", "banana",
  "naranja", "fresa", "melón", "sandía", "cereza", "ciruela", "higo", "granada", "mango",
  
  // Objetos de casa
  "casa", "flor", "sol", "luna", "cama", "mesa", "silla", "luz", "muro", "ventana",
  "puerta", "techo", "piso", "pared", "espejo", "cuadro", "lámpara", "alfombra", "cortina",
  "juguete", "pelota", "muñeca", "coche", "tren", "globo", "burbuja", "rompecabezas", "bloque",
  
  // Colores
  "rojo", "azul", "verde", "rosa", "gris", "beige", "ocre", "vino", "amarillo", "morado",
  "naranja", "café", "negro", "blanco", "plateado", "dorado", "turquesa", "lila", "fucsia",
  
  // Naturaleza
  "río", "mar", "nube", "árbol", "hoja", "piedra", "arena", "cielo", "montaña", "valle",
  "colina", "campo", "bosque", "jardín", "huerta", "granja", "playa", "isla", "lago", "estanque",
  
  // Transporte
  "carro", "avión", "barco", "bicicleta", "tren", "bus", "moto", "camión", "helicóptero", "globo",
  
  // Familia
  "mamá", "papá", "hermano", "hermana", "abuelo", "abuela", "tío", "tía", "primo", "prima",
  "bebé", "niño", "niña", "amigo", "amiga", "vecino", "vecina", "maestro", "doctor",
  
  // Comida
  "pan", "leche", "queso", "huevo", "sopa", "arroz", "frijol", "galleta", "pastel", "helado",
  "chocolate", "caramelo", "dulce", "paleta", "bombón", "mermelada", "miel", "cereal",
  
  // Verbos básicos (en sustantivo)
  "salto", "brinco", "vuelo", "nado", "canto", "baile", "juego", "corro", "subo", "bajo",
  
  // Adjetivos básicos
  "feliz", "triste", "grande", "pequeño", "largo", "corto", "alto", "bajo", "gordo", "flaco",
  "rápido", "lento", "suave", "duro", "caliente", "frío", "dulce", "salado", "lindo", "feo"
];

// PARA NIÑOS GRANDES (7-12 años) 
const OLD_WORDS: string[] = [
  // Animales exóticos
  "jirafa", "cebra", "tigre", "león", "elefante", "rinoceronte", "hipopótamo", "cocodrilo",
  "delfín", "ballena", "orca", "tiburón", "pingüino", "canguro", "koala", "panda", "orangután",
  "chimpancé", "gorila", "camello", "llama", "alpaca", "f lamencos", "pelícano", "colibrí",
  
  // Profesiones
  "arquitecto", "profesor", "médico", "bombero", "jardinero", "carpintero", "electricista",
  "plomero", "policía", "abogado", "juez", "periodista", "escritor", "poeta", "artista",
  "músico", "bailarín", "actor", "director", "científico", "investigador", "astronauta",
  
  // Instrumentos musicales
  "guitarra", "piano", "violín", "violonchelo", "tambor", "batería", "flauta", "arpa",
  "acordeón", "armónica", "saxofón", "trompeta", "trombón", "clarinete", "oboe", "fagot",
  
  // Planetas y espacio
  "marte", "júpiter", "saturno", "neptuno", "venus", "mercurio", "urano", "tierra",
  "asteroide", "cometa", "galaxia", "nebulosa", "telescopio", "astronomía", "cosmonauta",
  
  // Naturaleza avanzada
  "mariposa", "estrella", "montaña", "volcán", "océano", "desierto", "selva", "jungla",
  "cascada", "glaciar", "fiordo", "acantilado", "caverna", "estalactita", "estalagmita",
  
  // Ciencia y tecnología
  "microscopio", "telescopio", "termómetro", "barómetro", "compás", "brújula", "reloj",
  "computadora", "televisión", "teléfono", "tableta", "robótica", "programación", "algoritmo",
  "química", "física", "biología", "geología", "astronomía", "matemáticas", "geometría",
  
  // Geografía
  "continente", "península", "istmo", "archipiélago", "cordillera", "meseta", "llanura",
  "delta", "estuario", "fiordo", "glaciar", "manglar", "sabana", "tundra", "taiga",
  
  // Historia y cultura
  "pirámide", "castillo", "catedral", "monumento", "escultura", "pintura", "mural",
  "literatura", "poesía", "leyenda", "mitología", "filosofía", "arqueología", "paleontología",
  
  // Deportes
  "fútbol", "baloncesto", "tenis", "natación", "atletismo", "gimnasia", "ciclismo",
  "montañismo", "escalada", "surf", "esquí", "patinaje", "boxeo", "karate", "judo",
  
  // Emociones avanzadas
  "alegría", "tristeza", "enojo", "miedo", "sorpresa", "nervios", "ansiedad", "emoción",
  "ilusión", "esperanza", "frustración", "satisfacción", "orgullo", "vergüenza", "culpa"
];

// ============================================
// HISTORIAL Y CACHE
// ============================================

let usedWords: string[] = [];
const imageCache = new Map<string, string>();

// ============================================
// FUNCIÓN PRINCIPAL 
// ============================================

export const getWordByAge = async (age: number): Promise<string> => {
  const wordPool = age < 7 ? YOUNG_WORDS : OLD_WORDS;
  
  // Crear copia dinámica (mezcla aleatoria cada vez)
  const shuffledPool = [...wordPool].sort(() => Math.random() - 0.5);
  
  // Filtrar palabras no usadas recientemente
  let availableWords = shuffledPool.filter(w => !usedWords.includes(w));
  
  // Si ya usamos muchas palabras, reiniciamos historial
  if (availableWords.length < 20) {
    usedWords = [];
    availableWords = [...shuffledPool];
  }
  
  // Selección aleatoria
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const selectedWord = availableWords[randomIndex];
  
  // Actualizar historial
  usedWords.push(selectedWord);
  if (usedWords.length > 50) usedWords.shift();
  
  return selectedWord;
};

// ============================================
// OPCIONES DISTRACTORAS
// ============================================

export const getRelatedWords = async (word: string, age: number): Promise<string[]> => {
  const wordPool = age < 7 ? YOUNG_WORDS : OLD_WORDS;
  
  // Mezclar y seleccionar distractores
  const shuffledPool = [...wordPool].sort(() => Math.random() - 0.5);
  
  let distractors = shuffledPool
    .filter(w => w !== word && !usedWords.includes(w))
    .slice(0, 5);
  
  // Mezclar nuevamente y tomar 3
  distractors = distractors.sort(() => Math.random() - 0.5).slice(0, 3);
  
  // Garantizar 3 distractores
  while (distractors.length < 3) {
    const fallbacks = age < 7 
      ? ["gato", "perro", "pato", "sol", "luna", "flor"]
      : ["planeta", "océano", "montaña", "estrella", "volcán"];
    const candidate = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    if (!distractors.includes(candidate) && candidate !== word) {
      distractors.push(candidate);
    }
  }
  
  // Retornar opciones mezcladas
  return [word, ...distractors].sort(() => Math.random() - 0.5);
};

// ============================================
// IMÁGENES
// ============================================

export const getRealImage = async (word: string): Promise<string> => {
  if (imageCache.has(word)) {
    return imageCache.get(word)!;
  }
  
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&safesearch=true&lang=es&per_page=20`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.hits && data.hits.length > 0) {
      // Aleatorio para no repetir siempre la misma
      const randomIndex = Math.floor(Math.random() * Math.min(data.hits.length, 10));
      const imageUrl = data.hits[randomIndex].webformatURL;
      imageCache.set(word, imageUrl);
      return imageUrl;
    }
    
    const fallbackUrl = `https://placehold.co/400x400/9b59b6/white?text=${encodeURIComponent(word)}`;
    imageCache.set(word, fallbackUrl);
    return fallbackUrl;
    
  } catch (error) {
    console.error("Error fetching image:", error);
    const fallbackUrl = `https://placehold.co/400x400/9b59b6/white?text=${encodeURIComponent(word)}`;
    imageCache.set(word, fallbackUrl);
    return fallbackUrl;
  }
};

// ============================================
// PRECARGA DE IMÁGENES
// ============================================

export const preloadImages = async (words: string[]): Promise<void> => {
  await Promise.all(words.map(word => getRealImage(word)));
};



// Normalizar texto (eliminar acentos, puntuación, espacios)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  
    .replace(/[^\w\s]/g, "")          
    .replace(/\s+/g, " ");            
};

export const evaluateSpeech = (spoken: string, expected: string, userName?: string) => {
  const cleanSpoken = normalizeText(spoken);
  const cleanExpected = normalizeText(expected);

  if (cleanSpoken === cleanExpected) {
    return {
      correct: true,
      stars: 2,
      isExactlyCorrect: true,  
      message: userName ? `¡Muy bien, ${userName}!` : "¡Muy bien!",
      spokenFeedback: spoken,
      expectedFeedback: expected
    };
  }
  
  // CASI CORRECTO: una letra de diferencia o plural

  if (cleanSpoken.includes(cleanExpected) || cleanExpected.includes(cleanSpoken)) {
    const isPlural = cleanSpoken === cleanExpected + 's' || cleanSpoken === cleanExpected + 'es';
    
    if (isPlural) {
      return {
        correct: true,
        stars: 1,
        isExactlyCorrect: false,
        message: userName ? `¡Muy bien, ${userName}! La palabra es "${expected}" (sin la 's')` : `¡Muy bien! La palabra es "${expected}"`,
        spokenFeedback: spoken,
        expectedFeedback: expected
      };
    }
    
    return {
      correct: true,
      stars: 1,
      isExactlyCorrect: false,
      message: `¡Casi! Dijiste "${spoken}". La palabra es "${expected}"`,
      spokenFeedback: spoken,
      expectedFeedback: expected
    };
  }
  
  // Calcular similitud fonética
  let matches = 0;
  const maxLength = Math.max(cleanSpoken.length, cleanExpected.length);
  for (let i = 0; i < Math.min(cleanSpoken.length, cleanExpected.length); i++) {
    if (cleanSpoken[i] === cleanExpected[i]) matches++;
  }
  const similarity = matches / maxLength;
  
  const tolerance = 0.4;
  
  if (similarity >= tolerance) {
    return {
      correct: false,
      stars: 0,
      isExactlyCorrect: false,
      message: `Dijiste "${spoken}". La palabra correcta es "${expected}". ¡Casi lo logras!`,
      spokenFeedback: spoken,
      expectedFeedback: expected
    };
  }
  
  // COMPLETAMENTE INCORRECTO
  return {
    correct: false,
    stars: 0,
    isExactlyCorrect: false,
    message: `Dijiste "${spoken}". La palabra correcta es "${expected}". Escucha con atención: ${expected}`,
    spokenFeedback: spoken,
    expectedFeedback: expected
  };
};

// ============================================
// REINICIAR HISTORIAL
// ============================================

export const resetWordHistory = () => {
  usedWords = [];
  imageCache.clear();
};

export const getWordDifficulty = (word: string, age: number): 'easy' | 'medium' | 'hard' => {
  const length = word.length;
  const hasComplexLetters = /[rr]/i.test(word) || /[aeiouáéíóú]{2}/i.test(word);
  const hasSyllableBridges = /[br|cr|dr|fr|gr|pr|tr]/i.test(word);
  
  if (age < 7) {
    if (length <= 4 && !hasComplexLetters) return 'easy';
    if (length <= 6) return 'medium';
    return 'hard';
  } else {
    if (length <= 6 && !hasSyllableBridges) return 'easy';
    if (length <= 8) return 'medium';
    return 'hard';
  }
};

// Separar palabra en sílabas para enseñanza
export const syllabify = (word: string): string[] => {
  const syllables: string[] = [];
  const wordLower = word.toLowerCase();
  
  // Reglas básicas de separación silábica en español
  const pattern = /([bcdfghjklmnñpqrstvwxyz]*[aeiouáéíóú](?:[bcdfghjklmnñpqrstvwxyz]*[aeiouáéíóú])*)/gi;
  const matches = wordLower.match(pattern);
  
  if (matches && matches.length > 0) {
    // Filtrar vacíos y limpiar
    for (const match of matches) {
      if (match.trim().length > 0) {
        syllables.push(match);
      }
    }
  }
  
  // Si no se pudo silabificar, dividir cada 2 letras
  if (syllables.length === 0) {
    for (let i = 0; i < word.length; i += 2) {
      syllables.push(word.slice(i, i + 2));
    }
  }
  
  return syllables;
};