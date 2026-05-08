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
  { images: ["cat", "sleep"], exampleSentence: "El gato duerme" },
  { images: ["sun", "smile"], exampleSentence: "El sol brilla" },
];

export const sentencesActivityOlder: SentenceActivity[] = [
  { images: ["dog", "run", "tree"], exampleSentence: "El perro corre al árbol" },
  { images: ["girl", "read", "school"], exampleSentence: "La niña lee en la escuela" },
];

export const soundActivityYoung: SoundActivity[] = [
  { sound: "guau guau", correctImage: "dog", options: ["dog", "cat", "bird"] },
  { sound: "miau miau", correctImage: "cat", options: ["cat", "dog", "cow"] },
];

export const wordCompleteActivityOlder: WordCompleteActivity[] = [
  { image: "dog", word: "perro", incomplete: "_erro", options: ["p", "b", "d", "t"], correctOption: "p" },
  { image: "cat", word: "gato", incomplete: "ga_o", options: ["t", "d", "r", "n"], correctOption: "t" },
];