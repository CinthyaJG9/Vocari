/**
 * Genera automáticamente el visual de una palabra con guiones
 * Ejemplo: "astronauta" -> "a_________a"
 * 
 * @param word - La palabra a convertir en visual
 * @returns String con la primera letra, guiones y última letra
 */
export const generateVisual = (word: string): string => {
  if (!word || word.length <= 2) return word;
  const firstLetter = word[0];
  const lastLetter = word[word.length - 1];
  const underscores = "_".repeat(word.length - 2);
  return `${firstLetter}${underscores}${lastLetter}`;
};

/**
 * Verifica que el visual tenga la misma longitud que la palabra
 * (solo para debug, no se usa en producción)
 */
export const validateVisual = (word: string, visual: string): boolean => {
  return word.length === visual.length;
};

/**
 * Crea una frase completa con visuales automáticos
 * 
 * @param phraseText - Frase completa (ej: "El astronauta viaja al espacio")
 * @param answer1 - Primera palabra oculta (ej: "astronauta")
 * @param answer2 - Segunda palabra oculta (ej: "espacio")
 * @param image - Emoji o nombre de imagen (ej: "👨‍🚀")
 * @param hint1 - Pista para la primera palabra
 * @param hint2 - Pista para la segunda palabra
 * @returns Objeto con todos los datos de la frase
 */
export const createPhrase = (
  phraseText: string,
  answer1: string,
  answer2: string,
  image: string,
  hint1: string,
  hint2: string
) => {
  const visual1 = generateVisual(answer1);
  const visual2 = generateVisual(answer2);
  
  // Validación silenciosa (solo console.warn en desarrollo si está disponible)
  if (typeof window !== 'undefined' && (window as any).__DEV__) {
    if (!validateVisual(answer1, visual1)) {
      console.warn(`[WordVisuals] Visual incorrecto para "${answer1}": ${visual1} (longitud ${visual1.length} vs ${answer1.length})`);
    }
    if (!validateVisual(answer2, visual2)) {
      console.warn(`[WordVisuals] Visual incorrecto para "${answer2}": ${visual2} (longitud ${visual2.length} vs ${answer2.length})`);
    }
  }
  
  return {
    text: phraseText,
    image,
    hint1,
    hint2,
    answer1,
    answer2,
    visual1,
    visual2,
  };
};