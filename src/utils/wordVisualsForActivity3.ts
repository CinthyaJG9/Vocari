/**
 * Genera automáticamente el visual de una palabra con guiones
 * Ejemplo: "astronauta" -> "a_________a"
 */
export const generateWordVisual = (word: string): string => {
  if (!word || word.length <= 2) return word;
  const firstLetter = word[0];
  const lastLetter = word[word.length - 1];
  const underscores = "_".repeat(word.length - 2);
  return `${firstLetter}${underscores}${lastLetter}`;
};

/**
 * Crea una palabra para la actividad 3 con visual automático
 */
export const createActivity3Word = (
  word: string,
  image: string,
  hint: string
) => {
  return {
    word,
    image,
    hint,
    visual: generateWordVisual(word),
  };
};