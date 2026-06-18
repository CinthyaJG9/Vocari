import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import type { Screen } from "../types";
import { useProfiles } from "../hooks/userProfile";
import { useWarmAssistant } from "../hooks/userWarmAssistant";
import { VoiceSetupScreen } from "../components/screens/VoiceSetupScreen";
import { ProfileSelectScreen } from "../components/screens/ProfileSelectScreen";
import { MenuScreen } from "../components/screens/MenuScreen";
import { RewardsScreen } from "../components/screens/RewardsScreen";
import { ShopScreen } from "../components/screens/ShopScreen";
import { SettingsScreen } from "../components/screens/SettingScreen";
import { Activity1 } from "../components/activities/Activity1";
import { Activity2 } from "../components/activities/Activity2";
import { Activity3 } from "../components/activities/Activity3";
import { FloatingAssistant } from "../components/assistant/FloatingAssistant";
import { shopItems } from "../data/shopItems";
import { speakWithQueue } from "../services/warmVoiceService";
import { 
  triggerEquippedEffect, 
  unlockEffect, 
  getUnlockedEffects, 
  getEquippedEffect, 
  equipEffect,
  unequipEffect,
  getClaimedBadges,
  claimBadge,
  isBadgeClaimed,
  checkBadgeConditions,
  getBadgeName,
  getBadgeEmoji
} from "../services/effectsServices";

export default function App() {
  // ========== TODOS LOS HOOKS AL INICIO ==========
  const [currentScreen, setCurrentScreen] = useState<Screen>("profile-select");
  const [starsEarned, setStarsEarned] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Estado para efectos
  const [unlockedEffects, setUnlockedEffects] = useState<string[]>(() => {
    try {
      return getUnlockedEffects();
    } catch (e) {
      return [];
    }
  });
  const [equippedEffect, setEquippedEffect] = useState<string | null>(() => {
    try {
      return getEquippedEffect();
    } catch (e) {
      return null;
    }
  });
  
  // Estado para logros reclamados
  const [claimedBadges, setClaimedBadges] = useState<string[]>(() => {
    try {
      return getClaimedBadges();
    } catch (e) {
      return [];
    }
  });
  
  // Estado para estadísticas de logros
  const [stats, setStats] = useState({
    totalWords: 0,
    totalSounds: 0,
    perfectStreak: 0,
    activitiesCompleted: 0,
    totalStars: 0,
  });
  
  const { 
    profiles, 
    currentProfile, 
    setCurrentProfile, 
    addProfile, 
    updateStars, 
    deleteProfile, 
    updateAvatar,
    unlockAvatarForProfile,
    unlockThemeForProfile,
    getUnlockedAvatars,
    getUnlockedThemes,
    getProfileTheme,
    updateProfileTheme,
  } = useProfiles();
  
  const { sayProfileSaved, sayProfileDeleted, sayAvatarChanged } = useWarmAssistant();

  // Cargar estadísticas y logros al iniciar
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('vocari_stats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
      // Verificar logros al cargar
      checkAllBadges();
    } catch (e) {
      console.error('Error loading stats:', e);
    }
  }, []);

  // Guardar estadísticas
  useEffect(() => {
    try {
      localStorage.setItem('vocari_stats', JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats:', e);
    }
  }, [stats]);

  // Guardar logros reclamados
  useEffect(() => {
    try {
      localStorage.setItem('vocari_claimed_badges', JSON.stringify(claimedBadges));
    } catch (e) {
      console.error('Error saving claimed badges:', e);
    }
  }, [claimedBadges]);

  // Cargar tema del perfil actual al iniciar o al cambiar de perfil
  useEffect(() => {
    if (currentProfile) {
      const savedProfileTheme = getProfileTheme(currentProfile.id);
      if (savedProfileTheme && savedProfileTheme !== "default") {
        setCurrentTheme(savedProfileTheme);
      } else {
        setCurrentTheme("default");
      }
    }
  }, [currentProfile, getProfileTheme]);

  // Guardar efectos al cambiar
  useEffect(() => {
    try {
      localStorage.setItem('vocari_unlocked_effects', JSON.stringify(unlockedEffects));
    } catch (e) {
      console.error('Error saving unlocked effects:', e);
    }
  }, [unlockedEffects]);

  // Guardar efecto equipado al cambiar
  useEffect(() => {
    try {
      if (equippedEffect) {
        localStorage.setItem('vocari_equipped_effect', equippedEffect);
      }
    } catch (e) {
      console.error('Error saving equipped effect:', e);
    }
  }, [equippedEffect]);

  // Verificar y reclamar logros automáticamente
  const checkAllBadges = (currentStats = stats) => {
    const allBadges = [
      'badge_word_master', 
      'badge_sound_master', 
      'badge_perfect', 
      'badge_explorer', 
      'badge_star_collector'
    ];
    
    allBadges.forEach(badgeId => {
      try {
        if (!isBadgeClaimed(badgeId) && checkBadgeConditions(badgeId, currentStats)) {
          claimBadge(badgeId);
          setClaimedBadges(prev => [...prev, badgeId]);
          const badgeName = getBadgeName(badgeId);
          const badgeEmoji = getBadgeEmoji(badgeId);
          speakWithQueue(`¡Logro desbloqueado! ${badgeEmoji} ${badgeName}`, 0.85);
          setTimeout(() => triggerEquippedEffect(), 500);
        }
      } catch (e) {
        console.error('Error checking badge:', badgeId, e);
      }
    });
  };

  // Función para actualizar estadísticas desde actividades
  const updateStats = (updates: Partial<typeof stats>) => {
    setStats(prev => {
      const newStats = { ...prev, ...updates };
      // Verificar logros automáticamente
      setTimeout(() => checkAllBadges(newStats), 100);
      return newStats;
    });
  };

  const isYoungUser = currentProfile ? currentProfile.age <= 6 : false;

  const games = [
    { name: "Escucha y Elige", color: "from-green-400 to-emerald-500", image: "game1" },
    { name: "Crea tu Frase", color: "from-pink-400 to-rose-500", image: "game2" },
    {
      name: isYoungUser ? "Encuentra el Sonido" : "Completa la Palabra",
      color: "from-blue-400 to-purple-500",
      image: "game3",
    },
  ];

  // ========== FUNCIONES ==========
  const handleAddProfile = async (profile: any) => {
    addProfile(profile);
    setCurrentScreen("menu");
    await sayProfileSaved();
  };

  const handleUpdateStars = (amount: number) => {
    if (currentProfile) {
      updateStars(currentProfile.id, amount);
      setStarsEarned((prev) => prev + amount);
      
      // Actualizar estadísticas
      updateStats({ totalStars: stats.totalStars + amount });
      
      // Activar efecto al ganar estrellas
      if (amount > 0) {
        setTimeout(() => triggerEquippedEffect(), 300);
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (currentProfile) {
      const remaining = deleteProfile(currentProfile.id);
      await sayProfileDeleted();
      if (remaining.length === 0) {
        setCurrentScreen("voice-setup");
      } else {
        setCurrentScreen("profile-select");
        setCurrentProfile(null);
      }
    }
  };

  const handleUpdateAvatar = async (newAvatar: string) => {
    if (currentProfile) {
      updateAvatar(currentProfile.id, newAvatar);
      await sayAvatarChanged();
    }
  };

  const handlePurchase = async (itemId: string, price: number): Promise<boolean> => {
    if (!currentProfile || currentProfile.stars < price) {
      return false;
    }
    
    updateStars(currentProfile.id, -price);
    
    const purchasedItem = shopItems.find(item => item.id === itemId);
    const isAvatar = purchasedItem?.category === "avatar";
    const isTheme = purchasedItem?.category === "theme";
    const isEffect = purchasedItem?.category === "effect";
    
    if (isAvatar) {
      unlockAvatarForProfile(currentProfile.id, itemId);
    } else if (isTheme) {
      unlockThemeForProfile(currentProfile.id, itemId);
    } else if (isEffect) {
      unlockEffect(itemId);
      setUnlockedEffects(prev => [...prev, itemId]);
      // Mostrar el efecto recién comprado
      setTimeout(() => triggerEquippedEffect(), 500);
    }
    
    return true;
  };

  // Función para equipar efecto
  const handleEquipEffect = (effectId: string) => {
    const success = equipEffect(effectId);
    if (success) {
      setEquippedEffect(effectId);
      speakWithQueue(`¡Efecto equipado!`, 0.85);
      setTimeout(() => triggerEquippedEffect(), 500);
    }
  };

  // Función para desequipar efecto
  const handleUnequipEffect = () => {
    unequipEffect();
    setEquippedEffect(null);
    speakWithQueue(`Efecto desequipado`, 0.85);
  };

  // Función para guardar avatar desde configuración
  const handleSaveAvatar = (avatarId: string) => {
    if (currentProfile) {
      updateAvatar(currentProfile.id, avatarId);
      speakWithQueue("Avatar cambiado", 0.85);
    }
  };

  // Función para equipar tema (guarda en el perfil actual)
  const handleEquipTheme = (themeClass: string) => {
    setCurrentTheme(themeClass);
    
    if (currentProfile) {
      updateProfileTheme(currentProfile.id, themeClass);
    }
    
    speakWithQueue("¡Tema aplicado!", 0.85);
  };

  // Función para resetear tema del perfil actual
  const handleResetTheme = () => {
    setCurrentTheme("default");
    
    if (currentProfile) {
      updateProfileTheme(currentProfile.id, "default");
    }
    
    speakWithQueue("Tema restablecido al original", 0.85);
  };

  const resetToMenu = () => {
    setCurrentScreen("menu");
    setStarsEarned(0);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleOpenShop = () => {
    setShowShop(true);
  };

  const handleCloseShop = () => {
    setShowShop(false);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  // Obtener la clase del tema actual (gradiente)
  const getThemeClass = () => {
    if (currentTheme === "default") {
      return "from-purple-100 via-blue-100 to-pink-100";
    }
    return currentTheme;
  };

  // Obtener items desbloqueados del perfil actual
  const unlockedAvatars = currentProfile ? getUnlockedAvatars(currentProfile.id) : [];
  const unlockedThemes = currentProfile ? getUnlockedThemes(currentProfile.id) : [];
  
  // Combinar todos los items desbloqueados (avatares + temas + efectos)
  const allUnlockedItems = [...unlockedAvatars, ...unlockedThemes, ...unlockedEffects];

  // ========== RENDER ==========
  
  // Si la configuración está abierta
  if (showSettings && currentProfile) {
    return (
      <SettingsScreen
        profile={{
          id: currentProfile.id,
          name: currentProfile.name,
          age: currentProfile.age,
          stars: currentProfile.stars,
          avatar: currentProfile.avatar,
        }}
        currentTheme={currentTheme}
        themeClass={getThemeClass()}
        unlockedAvatars={unlockedAvatars}
        unlockedThemes={unlockedThemes}
        unlockedEffects={unlockedEffects}
        equippedEffect={equippedEffect}
        claimedBadges={claimedBadges}
        stats={stats}
        onSaveAvatar={handleSaveAvatar}
        onEquipTheme={handleEquipTheme}
        onResetTheme={handleResetTheme}
        onEquipEffect={handleEquipEffect}
        onUnequipEffect={handleUnequipEffect}
        onBack={handleCloseSettings}
      />
    );
  }
  
  // Si la tienda está abierta
  if (showShop && currentProfile) {
    return (
      <ShopScreen
        stars={currentProfile.stars}
        onBack={handleCloseShop}
        onPurchase={handlePurchase}
        unlockedItems={allUnlockedItems}
        onEquipAvatar={handleUpdateAvatar}
        onEquipTheme={handleEquipTheme}
        onEquipEffect={handleEquipEffect}
        equippedEffect={equippedEffect}
        themeClass={getThemeClass()}
        stats={stats}
        onClaimBadge={() => {
          // Actualizar badges reclamados
          setClaimedBadges(getClaimedBadges());
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen w-full transition-all duration-500 bg-gradient-to-br ${getThemeClass()} relative`}>
      <div className="max-w-7xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {currentScreen === "voice-setup" && (
            <VoiceSetupScreen 
              key="voice-setup"
              onComplete={handleAddProfile}
              onBack={() => setCurrentScreen("profile-select")}
            />
          )}

          {currentScreen === "profile-select" && (
            <ProfileSelectScreen
              key="profile-select"
              profiles={profiles}
              onSelectProfile={(profile) => {
                setCurrentProfile(profile);
                setCurrentScreen("menu");
              }}
              onNewProfile={() => setCurrentScreen("voice-setup")}
              themeClass={getThemeClass()}
            />
          )}

          {currentScreen === "menu" && currentProfile && (
            <MenuScreen
              key="menu"
              profileName={currentProfile.name}
              stars={currentProfile.stars}
              games={games}
              carouselRef={carouselRef}
              onSelectGame={(index) => setCurrentScreen(`activity${index + 1}` as Screen)}
              onChangeProfile={() => setCurrentScreen("profile-select")}
              onOpenSettings={handleOpenSettings}
              onOpenShop={handleOpenShop}
              onScrollLeft={() => scrollCarousel("left")}
              onScrollRight={() => scrollCarousel("right")}
              themeClass={getThemeClass()}
            />
          )}

          {currentScreen === "activity1" && currentProfile && (
            <Activity1
              key="activity1"
              age={currentProfile.age}
              stars={currentProfile.stars}
              userName={currentProfile.name}
              onAwardStars={handleUpdateStars}
              onFinish={() => setCurrentScreen("rewards")}
              onExit={resetToMenu}
              themeClass={getThemeClass()}
              onUpdateStats={updateStats}
            />
          )}

          {currentScreen === "activity2" && currentProfile && (
            <Activity2
              key="activity2"
              age={currentProfile.age}
              stars={currentProfile.stars}
              userName={currentProfile.name}
              onAwardStars={handleUpdateStars}
              onFinish={() => setCurrentScreen("rewards")}
              onExit={resetToMenu}
              themeClass={getThemeClass()}
              onUpdateStats={updateStats}
            />
          )}

          {currentScreen === "activity3" && currentProfile && (
            <Activity3
              key="activity3"
              age={currentProfile.age}
              stars={currentProfile.stars}
              userName={currentProfile.name}
              onAwardStars={handleUpdateStars}
              onFinish={() => setCurrentScreen("rewards")}
              onExit={resetToMenu}
              themeClass={getThemeClass()}
              onUpdateStats={updateStats}
            />
          )}

          {currentScreen === "rewards" && currentProfile && (
            <RewardsScreen
              key="rewards"
              starsEarned={starsEarned}
              totalStars={currentProfile.stars}
              onBackToMenu={resetToMenu}
              themeClass={getThemeClass()}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Asistente flotante */}
      {currentScreen !== "rewards" && currentScreen !== "voice-setup" && (
        <FloatingAssistant 
          showHelp={currentScreen === "menu"}
        />
      )}
    </div>
  );
}