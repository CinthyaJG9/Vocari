import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Star, ShoppingBag, Check, Gift, Sparkles, Trophy } from "lucide-react";
import { RealImage } from "../common/RealImage";
import { shopItems } from "../../data/shopItems";
import { speakWithQueue } from "../../services/warmVoiceService";
import confetti from "canvas-confetti";
import { avatars } from "../../data/avatar";
import { 
  getClaimedBadges,
  claimBadge,
  isBadgeClaimed,
  checkBadgeConditions,
  getBadgeName,
  getBadgeEmoji,
  getBadgeRequirement
} from "../../services/effectsServices";

interface ShopScreenProps {
  stars: number;
  onBack: () => void;
  onPurchase: (itemId: string, price: number) => Promise<boolean>;
  unlockedItems: string[];
  onEquipAvatar?: (avatarId: string) => void;
  onEquipTheme?: (themeClass: string) => void;
  onEquipEffect?: (effectId: string) => void;
  equippedEffect?: string | null;
  themeClass?: string;
  stats?: {
    totalWords: number;
    totalSounds: number;
    perfectStreak: number;
    activitiesCompleted: number;
    totalStars: number;
  };
  onClaimBadge?: (badgeId: string) => void;
}

// Items de logros/insignias para la tienda
const badgeShopItems = [
  { id: 'badge_word_master', name: 'Maestro de Palabras', emoji: '📚', requirement: 'Completa 50 palabras', category: 'badge' as const },
  { id: 'badge_sound_master', name: 'Maestro de Sonidos', emoji: '🎵', requirement: 'Completa 30 sonidos', category: 'badge' as const },
  { id: 'badge_perfect', name: 'Perfecto', emoji: '🏆', requirement: '10 respuestas correctas seguidas', category: 'badge' as const },
  { id: 'badge_explorer', name: 'Explorador', emoji: '🧭', requirement: 'Completa todas las actividades', category: 'badge' as const },
  { id: 'badge_star_collector', name: 'Coleccionista de Estrellas', emoji: '🌟', requirement: 'Acumula 100 estrellas', category: 'badge' as const },
];

export const ShopScreen = ({ 
  stars, 
  onBack, 
  onPurchase, 
  unlockedItems, 
  onEquipAvatar, 
  onEquipTheme,
  onEquipEffect,
  equippedEffect = null,
  themeClass = "from-purple-100 via-blue-100 to-pink-100",
  stats = { totalWords: 0, totalSounds: 0, perfectStreak: 0, activitiesCompleted: 0, totalStars: 0 },
  onClaimBadge,
}: ShopScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successItem, setSuccessItem] = useState<string>("");
  const [claimedBadges, setClaimedBadges] = useState<string[]>(() => {
    try {
      return getClaimedBadges();
    } catch (e) {
      return [];
    }
  });

  // Recargar estado de badges cuando cambian
  useEffect(() => {
    try {
      setClaimedBadges(getClaimedBadges());
    } catch (e) {
      console.error('Error loading claimed badges:', e);
    }
  }, [unlockedItems]);

  const lockedAvatars = avatars.filter(a => !unlockedItems.includes(a.id) && !a.default);
  
  // Separar items por categoría
  const avatarItems = lockedAvatars.map(a => ({ ...a, category: "avatar" as const }));
  const themeItems = shopItems.filter(item => item.category === "theme" && !unlockedItems.includes(item.id));
  const effectItems = shopItems.filter(item => item.category === "effect" && !unlockedItems.includes(item.id));
  const badgeItems = badgeShopItems.filter(item => !claimedBadges.includes(item.id));

  const categories = [
    { id: "all", name: "Todos", icon: "🎁" },
    { id: "avatar", name: "Avatares", icon: "👤" },
    { id: "theme", name: "Temas", icon: "🎨" },
    { id: "effect", name: "Efectos", icon: "✨" },
    { id: "badge", name: "Insignias", icon: "🏅" },
  ];

  const getFilteredItems = () => {
    if (selectedCategory === "all") {
      return [...avatarItems, ...themeItems, ...effectItems, ...badgeItems];
    }
    if (selectedCategory === "avatar") return avatarItems;
    if (selectedCategory === "theme") return themeItems;
    if (selectedCategory === "effect") return effectItems;
    if (selectedCategory === "badge") return badgeItems;
    return [];
  };

  const filteredItems = getFilteredItems();

  const handlePurchase = async (item: any) => {
    if (unlockedItems.includes(item.id)) {
      await speakWithQueue(`Ya tienes ${item.name}`, 0.85);
      return;
    }
    
    if (stars < item.price) {
      await speakWithQueue(`Necesitas ${item.price} estrellas para comprar ${item.name}`, 0.85);
      return;
    }
    
    setPurchasing(item.id);
    
    const success = await onPurchase(item.id, item.price);
    
    if (success) {
      setSuccessItem(item.name);
      setShowSuccess(true);
      await speakWithQueue(`¡Felicidades! Compraste ${item.name}`, 0.9);
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => setShowSuccess(false), 2500);
    }
    
    setPurchasing(null);
  };

  const handleClaimBadge = async (badgeId: string) => {
    try {
      // Verificar si ya fue reclamada
      if (isBadgeClaimed(badgeId)) {
        await speakWithQueue(`Ya reclamaste esta insignia`, 0.85);
        return;
      }
      
      // Verificar condiciones
      if (!checkBadgeConditions(badgeId, stats)) {
        await speakWithQueue(`Aún no cumples las condiciones para esta insignia`, 0.85);
        return;
      }
      
      // Reclamar
      const success = claimBadge(badgeId);
      if (success) {
        setClaimedBadges(prev => [...prev, badgeId]);
        setSuccessItem(getBadgeName(badgeId));
        setShowSuccess(true);
        await speakWithQueue(`¡Insignia reclamada!`, 0.9);
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        setTimeout(() => setShowSuccess(false), 2500);
        
        // Notificar al padre
        if (onClaimBadge) {
          onClaimBadge(badgeId);
        }
      }
    } catch (error) {
      console.error('Error claiming badge:', error);
      await speakWithQueue(`Error al reclamar la insignia`, 0.85);
    }
  };

  const handleEquip = (item: any) => {
    if (item.category === "avatar" && onEquipAvatar) {
      onEquipAvatar(item.image);
      speakWithQueue(`Has equipado el avatar ${item.name}`, 0.85);
    } else if (item.category === "theme" && onEquipTheme && item.themeClass) {
      onEquipTheme(item.themeClass);
      speakWithQueue(`Has equipado el tema ${item.name}. ¡Disfruta tu nueva apariencia!`, 0.85);
    } else if (item.category === "effect" && onEquipEffect) {
      onEquipEffect(item.id);
      speakWithQueue(`Has equipado el efecto ${item.name}. ¡Mira el espectáculo!`, 0.85);
    }
  };

  const isEffectEquipped = (item: any) => {
    return item.category === "effect" && equippedEffect === item.id;
  };

  // Verificar si un item está desbloqueado (para avatares, temas, efectos)
  const isItemUnlocked = (item: any) => {
    if (item.category === "badge") {
      return claimedBadges.includes(item.id);
    }
    return unlockedItems.includes(item.id);
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${themeClass} p-4`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Responsive */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <button onClick={onBack} className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all">
            <Home size={24} className="text-purple-600" />
          </button>
          
          <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
              <span className="text-xl font-bold text-purple-600">{stars}</span>
            </div>
            <ShoppingBag size={20} className="text-purple-400" />
          </div>
        </div>

        {/* Título - Responsive */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-bold text-purple-600 mb-2">
            🛒 Tienda de Recompensas
          </h2>
          <p className="text-gray-500 text-sm md:text-base">¡Usa tus estrellas para conseguir cosas increíbles!</p>
        </div>

        {/* Categorías - Responsive */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1 text-sm md:text-base
                ${selectedCategory === cat.id 
                  ? "bg-purple-500 text-white shadow-lg" 
                  : "bg-white text-purple-600 hover:bg-purple-100"}
              `}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid de items - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isUnlocked = isItemUnlocked(item);
            const isBadge = item.category === "badge";
            const canAfford = stars >= (isBadge ? 0 : item.price);
            const isEquipped = isEffectEquipped(item);
            const canClaim = isBadge && !isUnlocked && checkBadgeConditions(item.id, stats);
            
            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all
                  ${isUnlocked ? "ring-2 ring-green-400" : ""}
                  ${isEquipped ? "ring-2 ring-purple-500" : ""}
                `}
              >
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-3 text-center h-28 flex items-center justify-center">
                  {item.category === "theme" && item.themeClass ? (
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.themeClass} shadow-inner`} />
                  ) : (
                    (item.category === "effect" || item.category === "badge") ? (
                      <span className="text-5xl">{item.category === "badge" ? getBadgeEmoji(item.id) : item.image}</span>
                    ) : (
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-purple-50">
                        <RealImage type={item.image} className="w-full h-full" />
                      </div>
                    )
                  )}
                </div>
                
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.name}</h3>
                  {'description' in item && item.description && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                  )}
                  {isBadge && (
                    <p className="text-purple-500 text-xs mt-1">{getBadgeRequirement(item.id)}</p>
                  )}
                  
                  <div className="flex flex-wrap justify-between items-center mt-3 gap-2">
                    {isBadge ? (
                      <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                        <Trophy size={12} className="text-purple-500" />
                        <span className="font-bold text-purple-600 text-xs">Logro</span>
                      </div>
                    ) : item.price > 0 ? (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-yellow-700 text-xs">{item.price}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full">
                        <Gift size={12} className="text-purple-500" />
                        <span className="font-bold text-purple-600 text-xs">Logro</span>
                      </div>
                    )}
                    
                    {isUnlocked ? (
                      <div className="flex flex-wrap gap-1">
                        {(item.category === "avatar" || item.category === "theme" || item.category === "effect") && (
                          <button
                            onClick={() => handleEquip(item)}
                            className={`${isEquipped ? 'bg-purple-600' : 'bg-green-500'} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-green-600 transition-all`}
                          >
                            <Check size={10} /> {isEquipped ? 'Equipado ✓' : 'Equipar'}
                          </button>
                        )}
                        <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                          <Check size={12} /> Desbloqueado
                        </span>
                      </div>
                    ) : isBadge ? (
                      <button
                        onClick={() => handleClaimBadge(item.id)}
                        disabled={!canClaim}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all
                          ${canClaim
                            ? "bg-yellow-500 text-white hover:bg-yellow-600" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                        `}
                      >
                        {canClaim ? "¡Reclamar!" : "🔒 Bloqueado"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={purchasing === item.id || (!canAfford && item.price > 0)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all
                          ${canAfford || item.price === 0
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                        `}
                      >
                        {purchasing === item.id ? (
                          <div className="animate-spin">⏳</div>
                        ) : item.price === 0 ? (
                          "Reclamar"
                        ) : (
                          "Comprar"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mensaje motivacional - Responsive */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-3 inline-block">
            <p className="text-purple-700 font-medium text-sm md:text-base flex items-center gap-2">
              <Sparkles size={16} />
              ¡Sigue jugando para ganar más estrellas!
              <Sparkles size={16} />
            </p>
          </div>
        </div>

        {/* Modal de éxito - Responsive */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="bg-green-500 rounded-3xl p-6 text-center max-w-xs w-full mx-4"
              >
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-white mb-2">¡Compra exitosa!</h3>
                <p className="text-white text-sm">Has obtenido {successItem}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};