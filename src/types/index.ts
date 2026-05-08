export type Screen =
  | "voice-setup"
  | "profile-select"
  | "menu"
  | "activity1"
  | "activity2"
  | "activity3"
  | "rewards";

export type VoiceStep = "welcome" | "name" | "age" | "confirm";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  stars: number;
  avatar: string;
}

export interface WordActivity {
  word: string;
  correctImage: string;
  options: string[];
}

export interface SentenceActivity {
  images: string[];
  exampleSentence: string;
}

export interface SoundActivity {
  sound: string;
  correctImage: string;
  options: string[];
}

export interface WordCompleteActivity {
  image: string;
  word: string;
  incomplete: string;
  options: string[];
  correctOption: string;
}