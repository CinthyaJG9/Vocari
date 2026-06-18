// Servicio de efectos visuales
import confetti from "canvas-confetti";

export type EffectType = 'confetti' | 'fireworks' | 'sparkles' | 'rainbow' | 'stars';

// Configuración de cada efecto
const effectsConfig = {
  confetti: {
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  },
  fireworks: {
    particleCount: 200,
    spread: 100,
    origin: { y: 0.5 },
    startVelocity: 30,
    gravity: 0.5,
    colors: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff']
  },
  sparkles: {
    particleCount: 80,
    spread: 50,
    origin: { y: 0.7 },
    colors: ['#ffffff', '#ffdd00', '#ff8800']
  },
  rainbow: {
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff']
  },
  stars: {
    particleCount: 100,
    spread: 60,
    origin: { y: 0.5 },
    colors: ['#ffffff', '#ffdd00', '#ffaa00']
  }
};

// ============================================
// ESTADO DE EFECTOS (persistente)
// ============================================

let unlockedEffects: string[] = [];
let equippedEffect: string | null = null;
let claimedBadges: string[] = [];

// Inicializar desde localStorage
const loadState = () => {
  try {
    const savedUnlocked = localStorage.getItem('vocari_unlocked_effects');
    unlockedEffects = savedUnlocked ? JSON.parse(savedUnlocked) : [];
    
    const savedEquipped = localStorage.getItem('vocari_equipped_effect');
    equippedEffect = savedEquipped || null;
    
    const savedClaimed = localStorage.getItem('vocari_claimed_badges');
    claimedBadges = savedClaimed ? JSON.parse(savedClaimed) : [];
  } catch (e) {
    console.error('Error loading effects state:', e);
    unlockedEffects = [];
    equippedEffect = null;
    claimedBadges = [];
  }
};

// Guardar estado
const saveState = () => {
  try {
    localStorage.setItem('vocari_unlocked_effects', JSON.stringify(unlockedEffects));
    if (equippedEffect) {
      localStorage.setItem('vocari_equipped_effect', equippedEffect);
    } else {
      localStorage.removeItem('vocari_equipped_effect');
    }
    localStorage.setItem('vocari_claimed_badges', JSON.stringify(claimedBadges));
  } catch (e) {
    console.error('Error saving effects state:', e);
  }
};

// Cargar estado al iniciar
loadState();

// ============================================
// FUNCIONES DE EFECTOS
// ============================================

export const triggerEffect = (effectType: EffectType | string) => {
  const config = effectsConfig[effectType as keyof typeof effectsConfig];
  if (!config) {
    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.6 }
    });
    return;
  }
  confetti(config);
};

export const triggerEquippedEffect = () => {
  if (equippedEffect && unlockedEffects.includes(equippedEffect)) {
    triggerEffect(equippedEffect);
  } else {
    // Efecto por defecto (confeti básico)
    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.6 }
    });
  }
};

export const equipEffect = (effectId: string) => {
  if (unlockedEffects.includes(effectId)) {
    equippedEffect = effectId;
    saveState();
    return true;
  }
  return false;
};

export const unequipEffect = () => {
  equippedEffect = null;
  saveState();
  return true;
};

export const unlockEffect = (effectId: string) => {
  if (!unlockedEffects.includes(effectId)) {
    unlockedEffects.push(effectId);
    saveState();
    return true;
  }
  return false;
};

export const isEffectUnlocked = (effectId: string): boolean => {
  return unlockedEffects.includes(effectId);
};

export const getUnlockedEffects = (): string[] => {
  return [...unlockedEffects];
};

export const getEquippedEffect = (): string | null => {
  return equippedEffect;
};

export const getEffectName = (effectId: string): string => {
  const names: Record<string, string> = {
    'effect_confetti': 'Confeti Mágico',
    'effect_fireworks': 'Fuegos Artificiales',
    'effect_sparkles': 'Destellos Mágicos',
    'effect_rainbow': 'Arcoíris',
    'effect_stars': 'Lluvia de Estrellas'
  };
  return names[effectId] || effectId;
};

export const getEffectEmoji = (effectId: string): string => {
  const emojis: Record<string, string> = {
    'effect_confetti': '🎊',
    'effect_fireworks': '🎆',
    'effect_sparkles': '✨',
    'effect_rainbow': '🌈',
    'effect_stars': '⭐'
  };
  return emojis[effectId] || '🎉';
};

// ============================================
// FUNCIONES DE LOGROS/INSIGNIAS
// ============================================

export const claimBadge = (badgeId: string) => {
  if (!claimedBadges.includes(badgeId)) {
    claimedBadges.push(badgeId);
    saveState();
    return true;
  }
  return false;
};

export const isBadgeClaimed = (badgeId: string): boolean => {
  return claimedBadges.includes(badgeId);
};

export const getClaimedBadges = (): string[] => {
  return [...claimedBadges];
};

export const canClaimBadge = (badgeId: string, condition: () => boolean): boolean => {
  return !isBadgeClaimed(badgeId) && condition();
};

export const getBadgeName = (badgeId: string): string => {
  const names: Record<string, string> = {
    'badge_word_master': 'Maestro de Palabras',
    'badge_sound_master': 'Maestro de Sonidos',
    'badge_perfect': 'Perfecto',
    'badge_explorer': 'Explorador',
    'badge_star_collector': 'Coleccionista de Estrellas'
  };
  return names[badgeId] || badgeId;
};

export const getBadgeEmoji = (badgeId: string): string => {
  const emojis: Record<string, string> = {
    'badge_word_master': '📚',
    'badge_sound_master': '🎵',
    'badge_perfect': '🏆',
    'badge_explorer': '🧭',
    'badge_star_collector': '🌟'
  };
  return emojis[badgeId] || '🏅';
};

export const getBadgeRequirement = (badgeId: string): string => {
  const requirements: Record<string, string> = {
    'badge_word_master': 'Completa 50 palabras en la Actividad 1',
    'badge_sound_master': 'Completa 30 sonidos en la Actividad 3',
    'badge_perfect': 'Obtén 10 respuestas correctas seguidas',
    'badge_explorer': 'Completa todas las actividades',
    'badge_star_collector': 'Acumula 100 estrellas'
  };
  return requirements[badgeId] || 'Completa el logro';
};

// ============================================
// CONDICIONES DE LOGROS
// ============================================

export const checkBadgeConditions = (
  badgeId: string,
  stats: {
    totalWords: number;
    totalSounds: number;
    perfectStreak: number;
    activitiesCompleted: number;
    totalStars: number;
  }
): boolean => {
  switch (badgeId) {
    case 'badge_word_master':
      return stats.totalWords >= 50;
    case 'badge_sound_master':
      return stats.totalSounds >= 30;
    case 'badge_perfect':
      return stats.perfectStreak >= 10;
    case 'badge_explorer':
      return stats.activitiesCompleted >= 3;
    case 'badge_star_collector':
      return stats.totalStars >= 100;
    default:
      return false;
  }
};

// Inicializar
export const initEffects = () => {
  loadState();
};