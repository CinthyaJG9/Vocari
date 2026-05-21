import type { WordActivity, SentenceActivity, SoundActivity, WordCompleteActivity } from "../types";

export const wordsActivityYoung: WordActivity[] = [
  { word: "gato", correctImage: "cat", options: ["cat", "dog", "mouse"] },
  { word: "sol", correctImage: "sun", options: ["sun", "moon", "star"] },
];

export const wordsActivityOlder: WordActivity[] = [
  { word: "perro", correctImage: "dog", options: ["dog", "cat", "rabbit", "mouse"] },
  { word: "mariposa", correctImage: "butterfly", options: ["butterfly", "bee", "bird", "ladybug"] },
];

export const sentencesActivityYoung: SentenceActivity[] = [
  { 
    images: ["dog", "ball"], 
    exampleSentence: "El perro juega pelota" 
  },

  { 
    images: ["sun", "house"], 
    exampleSentence: "El sol ilumina la casa" 
  },

  { 
    images: ["cat", "milk"], 
    exampleSentence: "El gato toma leche" 
  },

  { 
    images: ["bird", "tree"], 
    exampleSentence: "El pájaro está en el árbol" 
  }
];

export const sentencesActivityOlder: SentenceActivity[] = [
  { 
    images: ["dog", "run", "park"], 
    exampleSentence: "El perro corre rápido" 
  },

  { 
    images: ["rabbit", "carrot"], 
    exampleSentence: "El conejo come zanahoria" 
  },

  { 
    images: ["girl", "school"], 
    exampleSentence: "La niña va a la escuela" 
  },

  { 
    images: ["bird", "sky"], 
    exampleSentence: "El pájaro vuela alto" 
  }
];

export const soundActivityYoung: SoundActivity[] = [
  { sound: "guau guau", correctImage: "dog", options: ["dog", "cat", "bird"] },
  { sound: "miau miau", correctImage: "cat", options: ["cat", "dog", "cow"] },
];

export const wordCompleteActivityOlder: WordCompleteActivity[] = [
  { image: "dog", word: "perro", incomplete: "_erro", options: ["p", "b", "d", "t"], correctOption: "p" },
  { image: "cat", word: "gato", incomplete: "ga_o", options: ["t", "d", "r", "n"], correctOption: "t" },
];