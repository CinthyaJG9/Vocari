import { getRealImage as getPixabayImage } from "./dynamicWordService";

// Obtener imagen desde Pixabay (siempre API)
export const getImage = async (query: string): Promise<string> => {
  try {
    // Mapeo de términos para mejor búsqueda
    const searchTerms: Record<string, string> = {
      dog: "perro",
      cat: "gato",
      cow: "vaca",
      bird: "pájaro",
      frog: "rana",
      sheep: "oveja",
      monkey: "mono",
      lion: "león",
      rain: "lluvia",
      thunder: "trueno",
      firetruck: "camión de bomberos",
      car: "coche",
      butterfly: "mariposa",
      telescope: "telescopio",
      architect: "arquitecto",
      library: "biblioteca",
      computer: "computadora",
      astronaut: "astronauta",
      violin: "violín",
      chocolate: "chocolate",
      horse: "caballo",
      duck: "pato",
      bee: "abeja",
      elephant: "elefante",
      giraffe: "jirafa",
      zebra: "cebra",
      tiger: "tigre",
      bear: "oso",
      snake: "serpiente",
      whale: "ballena", 
        dolphin: "delfín",
        shark: "tiburón",
        octopus: "pulpo",
        castle: "castillo",
        robot: "robot",
        pizza: "pizza",
        icecream: "helado",
        balloon: "globo",
        rainbow: "arcoíris",
    };
    
    const searchTerm = searchTerms[query] || query;
    const imageUrl = await getPixabayImage(searchTerm);
    return imageUrl;
  } catch (error) {
    console.error("Error obteniendo imagen:", error);
    // Fallback a placeholder con el texto
    return `https://placehold.co/400x400/9b59b6/white?text=${encodeURIComponent(query)}`;
  }
};

// Obtener imagen para una opción (puede ser un animal aleatorio para distractores)
export const getRandomContextImage = async (exclude: string[] = []): Promise<{ query: string; url: string }> => {
  const commonAnimals = ["dog", "cat", "bird", "fish", "rabbit", "mouse", "frog"];
  const available = commonAnimals.filter(a => !exclude.includes(a));
  const randomQuery = available[Math.floor(Math.random() * available.length)];
  const url = await getImage(randomQuery);
  return { query: randomQuery, url };
};

// Precargar imágenes
export const preloadImages = async (queries: string[]): Promise<void> => {
  const promises = queries.map(q => getImage(q));
  await Promise.all(promises);
};