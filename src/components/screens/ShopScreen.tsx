import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Star, ShoppingBag, Check, Gift, Sparkles } from "lucide-react";
import { RealImage } from "../common/RealImage";
import { shopItems } from "../../data/shopItems";
import { speakWithQueue } from "../../services/warmVoiceService";
import confetti from "canvas-confetti";
import { avatars } from "../../data/avatar";

interface ShopScreenProps {
  stars: number;
  onBack: () => void;
  onPurchase: (itemId: string, price: number) => Promise<boolean>;
  unlockedItems: string[];
  onEquipAvatar?: (avatarId: string) => void;
  onEquipTheme?: (themeClass: string) => void;
}

export const ShopScreen = ({ stars, onBack, onPurchase, unlockedItems, onEquipAvatar, onEquipTheme }: ShopScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successItem, setSuccessItem] = useState<string>("");
  
  // Avatares bloqueados (no desbloqueados y no default)
  const lockedAvatars = avatars.filter(a => !unlockedItems.includes(a.id) && !a.default);
  
  // Items de otras categorías (no avatares) - incluye temas, efectos, insignias
  const otherItems = shopItems.filter(item => item.category !== "avatar");

  const categories = [
    { id: "all", name: "Todos", icon: "🎁" },
    { id: "avatar", name: "Avatares", icon: "👤" },
    { id: "theme", name: "Temas", icon: "🎨" },
    { id: "effect", name: "Efectos", icon: "✨" },
    { id: "badge", name: "Insignias", icon: "🏅" },
  ];

  const getFilteredItems = () => {
    if (selectedCategory === "all") {
      return [...otherItems, ...lockedAvatars.map(a => ({ ...a, category: "avatar" as const }))];
    }
    if (selectedCategory === "avatar") {
      return lockedAvatars.map(a => ({ ...a, category: "avatar" as const }));
    }
    return otherItems.filter(item => item.category === selectedCategory);
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

  const handleEquip = (item: any) => {
    if (item.category === "avatar" && onEquipAvatar) {
      onEquipAvatar(item.image);
      speakWithQueue(`Has equipado el avatar ${item.name}`, 0.85);
    } else if (item.category === "theme" && onEquipTheme && item.themeClass) {
      onEquipTheme(item.themeClass);
      speakWithQueue(`Has equipado el tema ${item.name}. ¡Disfruta tu nueva apariencia!`, 0.85);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all">
            <Home size={24} className="text-purple-600" />
          </button>
          
          <div className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={28} />
              <span className="text-2xl font-bold text-purple-600">{stars}</span>
            </div>
            <ShoppingBag size={24} className="text-purple-400" />
          </div>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
            🛒 Tienda de Recompensas
          </h2>
          <p className="text-gray-500">¡Usa tus estrellas para conseguir cosas increíbles!</p>
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-bold transition-all flex items-center gap-2
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

        {/* Grid de items */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
{filteredItems.map((item) => {
  const isUnlocked = unlockedItems.includes(item.id);
  const canAfford = stars >= item.price;
  
  return (
    <motion.div
      key={item.id}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all
        ${isUnlocked ? "ring-2 ring-green-400" : ""}
      `}
    >
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-center">
        {/* Para temas: mostrar el degradado real */}
        {item.category === "theme" && item.themeClass ? (
          <div className={`w-24 h-24 mx-auto rounded-xl bg-gradient-to-br ${item.themeClass} shadow-inner`} />
        ) : (
          <div className="w-24 h-24 mx-auto">
            <RealImage type={item.image} />
          </div>
        )}
        {/* Vista previa pequeña del degradado (solo para temas) */}
        {item.category === "theme" && item.themeClass && (
          <div className={`mt-2 h-2 w-full rounded-full bg-gradient-to-r ${item.themeClass.split(' ').slice(1).join(' ')}`} />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
        {"description" in item && item.description ? (
          <p className="text-gray-500 text-xs mt-1 line-clamp-2">
            {item.description}
          </p>
        ) : null}
        
        <div className="flex justify-between items-center mt-4">
          {item.price > 0 ? (
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-yellow-700 text-sm">{item.price}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full">
              <Gift size={14} className="text-purple-500" />
              <span className="font-bold text-purple-600 text-sm">Logro</span>
            </div>
          )}
          
          {isUnlocked ? (
            <div className="flex gap-2">
              {(item.category === "avatar" || item.category === "theme") && (
                <button
                  onClick={() => handleEquip(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-green-600 transition-all"
                >
                  <Check size={12} /> Equipar
                </button>
              )}
              <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                <Check size={14} /> Desbloqueado
              </span>
            </div>
          ) : (
            <button
              onClick={() => handlePurchase(item)}
              disabled={purchasing === item.id || (!canAfford && item.price > 0)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all
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

        {/* Mensaje motivacional */}
        <div className="mt-10 text-center">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-4 inline-block">
            <p className="text-purple-700 font-medium flex items-center gap-2">
              <Sparkles size={20} />
              ¡Sigue jugando para ganar más estrellas!
              <Sparkles size={20} />
            </p>
          </div>
        </div>

        {/* Modal de éxito */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="bg-green-500 rounded-3xl p-8 text-center max-w-sm mx-4"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Compra exitosa!</h3>
                <p className="text-white">Has obtenido {successItem}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};  