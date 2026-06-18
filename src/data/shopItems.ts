import { RewardItem } from "../types/rewards";

export const shopItems: RewardItem[] = [
  // ============================================
  // AVATARES ESPECIALES
  // ============================================
  { 
    id: "fox", 
    name: "Zorro", 
    description: "Un zorro astuto y divertido", 
    price: 50, 
    category: "avatar", 
    image: "fox",
    unlocked: false 
  },
  { 
    id: "bear", 
    name: "Oso", 
    description: "Un oso cariñoso y fuerte", 
    price: 50, 
    category: "avatar", 
    image: "bear",
    unlocked: false 
  },
  { 
    id: "rabbit", 
    name: "Conejo", 
    description: "Un conejo rápido y saltarín", 
    price: 50, 
    category: "avatar", 
    image: "rabbit",
    unlocked: false 
  },
  { 
    id: "penguin", 
    name: "Pingüino", 
    description: "Un pingüino elegante", 
    price: 80, 
    category: "avatar", 
    image: "penguin",
    unlocked: false 
  },
  { 
    id: "dragon", 
    name: "Dragón", 
    description: "¡Un dragón legendario!", 
    price: 150, 
    category: "avatar", 
    image: "dragon",
    unlocked: false 
  },
  {
    id: "unicorn",
    name: "Unicornio",
    description: "Un unicornio mágico y brillante",
    price: 200,
    category: "avatar",
    image: "unicorn",
    unlocked: false
  },
  
  // ============================================
  // TEMAS
  // ============================================
  {
    id: "theme_night", 
    name: "Tema Nocturno", 
    description: "Fondo de noche estrellada", 
    price: 100, 
    category: "theme", 
    image: "theme_night",
    unlocked: false,
    themeClass: "from-indigo-900 via-purple-900 to-black"
  },
  { 
    id: "theme_ocean", 
    name: "Tema Oceánico", 
    description: "Fondo de mar y peces", 
    price: 100, 
    category: "theme", 
    image: "theme_ocean",
    unlocked: false,
    themeClass: "from-blue-900 via-cyan-800 to-teal-900"
  },
  { 
    id: "theme_forest", 
    name: "Tema Selva", 
    description: "Fondo de jungla exótica", 
    price: 100, 
    category: "theme", 
    image: "theme_forest",
    unlocked: false,
    themeClass: "from-green-900 via-emerald-800 to-lime-900"
  },
  { 
    id: "theme_space", 
    name: "Tema Espacial", 
    description: "Fondo con planetas y estrellas", 
    price: 120, 
    category: "theme", 
    image: "theme_space",
    unlocked: false,
    themeClass: "from-purple-900 via-blue-900 to-black"
  },
  { 
    id: "theme_sunset", 
    name: "Tema Atardecer", 
    description: "Fondo de atardecer colorido", 
    price: 80, 
    category: "theme", 
    image: "theme_sunset",
    unlocked: false,
    themeClass: "from-orange-500 via-pink-500 to-purple-500"
  },
  
  // ============================================
  // EFECTOS (con EMOJIS en lugar de imágenes)
  // ============================================
  { 
    id: "effect_confetti", 
    name: "Confeti Mágico", 
    description: "Lluvia de confeti al ganar", 
    price: 80, 
    category: "effect", 
    image: "🎊",
    unlocked: false 
  },
  { 
    id: "effect_fireworks", 
    name: "Fuegos Artificiales", 
    description: "Espectáculo de fuegos al ganar", 
    price: 150, 
    category: "effect", 
    image: "🎆",
    unlocked: false 
  },
  { 
    id: "effect_sparkles", 
    name: "Destellos Mágicos", 
    description: "Destellos de luz al acertar", 
    price: 60, 
    category: "effect", 
    image: "✨",
    unlocked: false 
  },
  { 
    id: "effect_rainbow", 
    name: "Arcoíris", 
    description: "Un arcoíris al completar", 
    price: 90, 
    category: "effect", 
    image: "🌈",
    unlocked: false 
  },
  { 
    id: "effect_stars", 
    name: "Lluvia de Estrellas", 
    description: "Estrellas brillantes al ganar", 
    price: 120, 
    category: "effect", 
    image: "⭐",
    unlocked: false 
  },
  
  // ============================================
  // INSIGNIAS 
 // ============================================
  { 
    id: "badge_word_master", 
    name: "Maestro de Palabras", 
    description: "Completa 50 palabras", 
    price: 0, 
    category: "badge", 
    image: "📚",
    unlocked: false 
  },
  { 
    id: "badge_sound_master", 
    name: "Maestro de Sonidos", 
    description: "Completa 30 sonidos", 
    price: 0, 
    category: "badge", 
    image: "🎵",
    unlocked: false 
  },
  { 
    id: "badge_perfect", 
    name: "Perfecto", 
    description: "10 respuestas correctas seguidas", 
    price: 0, 
    category: "badge", 
    image: "🏆",
    unlocked: false 
  },
  { 
    id: "badge_explorer", 
    name: "Explorador", 
    description: "Completa todas las actividades", 
    price: 0, 
    category: "badge", 
    image: "🧭",
    unlocked: false 
  },
  { 
    id: "badge_star_collector", 
    name: "Coleccionista de Estrellas", 
    description: "Acumula 100 estrellas", 
    price: 0, 
    category: "badge", 
    image: "🌟",
    unlocked: false 
  },
];