import { useState } from "react";
import { motion } from "motion/react";
import { Home, Star, Palette, RefreshCw, CheckCircle, Edit2, Sparkles, Trophy } from "lucide-react";
import { RealImage } from "../common/RealImage";
import { EditNameModal } from "../common/EditNameModal";
import { speakWithQueue } from "../../services/warmVoiceService";
import { shopItems } from "../../data/shopItems";
import { avatars } from "../../data/avatar";
import {
  equipEffect,
  unequipEffect,
  triggerEquippedEffect,
  checkBadgeConditions,
  isBadgeClaimed,
  claimBadge,
} from "../../services/effectsServices";

// Items de efectos para mostrar en configuración
const effectItems = [
  { id: 'effect_confetti', name: 'Confeti Mágico', emoji: '🎊' },
  { id: 'effect_fireworks', name: 'Fuegos Artificiales', emoji: '🎆' },
  { id: 'effect_sparkles', name: 'Destellos Mágicos', emoji: '✨' },
  { id: 'effect_rainbow', name: 'Arcoíris', emoji: '🌈' },
  { id: 'effect_stars', name: 'Lluvia de Estrellas', emoji: '⭐' },
];

// Items de logros/insignias
const badgeItems = [
  { id: 'badge_word_master', name: 'Maestro de Palabras', emoji: '📚', requirement: 'Completa 50 palabras' },
  { id: 'badge_sound_master', name: 'Maestro de Sonidos', emoji: '🎵', requirement: 'Completa 30 sonidos' },
  { id: 'badge_perfect', name: 'Perfecto', emoji: '🏆', requirement: '10 respuestas correctas seguidas' },
  { id: 'badge_explorer', name: 'Explorador', emoji: '🧭', requirement: 'Completa todas las actividades' },
  { id: 'badge_star_collector', name: 'Coleccionista de Estrellas', emoji: '🌟', requirement: 'Acumula 100 estrellas' },
];

interface SettingsScreenProps {
  profile: {
    id: string;
    name: string;
    age: number;
    stars: number;
    avatar: string;
  };
  currentTheme: string;
  themeClass?: string;
  unlockedAvatars: string[];
  unlockedThemes: string[];
  unlockedEffects?: string[];
  equippedEffect?: string | null;
  claimedBadges?: string[];
  stats?: {
    totalWords: number;
    totalSounds: number;
    perfectStreak: number;
    activitiesCompleted: number;
    totalStars: number;
  };
  onSaveAvatar: (avatarId: string) => void;
  onEquipTheme: (themeClass: string) => void;
  onResetTheme: () => void;
  onEquipEffect: (effectId: string) => void;
  onUnequipEffect: () => void;
  onBack: () => void;
}

export const SettingsScreen = ({
  profile,
  currentTheme,
  themeClass = "from-purple-100 via-blue-100 to-pink-100",
  unlockedAvatars = [],
  unlockedThemes = [],
  unlockedEffects = [],
  equippedEffect = null,
  claimedBadges = [],
  stats = { totalWords: 0, totalSounds: 0, perfectStreak: 0, activitiesCompleted: 0, totalStars: 0 },
  onSaveAvatar,
  onEquipTheme,
  onResetTheme,
  onEquipEffect,
  onUnequipEffect,
  onBack,
}: SettingsScreenProps) => {
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [isSaving, setIsSaving] = useState(false);

  // Temas disponibles (el original + los desbloqueados de la tienda)
  const allThemes = [
    { id: "default", name: "Tema Original", themeClass: "from-purple-100 via-blue-100 to-pink-100", price: 0 },
    ...shopItems.filter(item => item.category === "theme" && unlockedThemes.includes(item.id)).map(item => ({
      id: item.id,
      name: item.name,
      themeClass: item.themeClass || "",
      price: item.price,
    }))
  ];

  const isOriginalTheme = currentTheme === "default";

  const handleSaveAvatar = async () => {
    setIsSaving(true);
    onSaveAvatar(selectedAvatar);
    await speakWithQueue(`Avatar cambiado`, 0.85);
    setIsSaving(false);
  };

  const handleEquipTheme = async (themeId: string, themeClassValue: string) => {
    if (themeId === "default") {
      onResetTheme();
    } else {
      onEquipTheme(themeClassValue);
    }
    await speakWithQueue(`Tema equipado`, 0.85);
  };

  const handleEquipEffect = async (effectId: string) => {
    onEquipEffect(effectId);
    await speakWithQueue(`¡Efecto equipado!`, 0.85);
    setTimeout(() => triggerEquippedEffect(), 500);
  };

  const handleUnequipEffect = async () => {
    onUnequipEffect();
    await speakWithQueue(`Efecto desequipado`, 0.85);
  };

  const handleClaimBadge = async (badgeId: string) => {
    if (!isBadgeClaimed(badgeId) && checkBadgeConditions(badgeId, stats)) {
      claimBadge(badgeId);
      await speakWithQueue(`¡Logro desbloqueado!`, 0.85);
      setTimeout(() => triggerEquippedEffect(), 500);
    }
  };

  const availableAvatars = avatars.filter(a => unlockedAvatars.includes(a.id));

  return (
    <div className={`min-h-screen w-full transition-all duration-500 bg-gradient-to-br ${themeClass} p-4`}>
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all">
            <Home size={24} className="text-purple-600" />
          </button>
          <div className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-lg">
            <Star className="text-yellow-500 fill-yellow-500" size={24} />
            <span className="text-xl font-bold text-purple-600">{profile.stars}</span>
          </div>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
            ⚙️ Configuración
          </h2>
          <p className="text-gray-500">Personaliza tu perfil y la apariencia</p>
        </div>

        {/* ========== SECCIÓN PERFIL ========== */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Edit2 size={20} /> Mi Perfil
            </h3>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg bg-purple-50">
                <RealImage type={profile.avatar} className="w-full h-full" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-800">{profile.name}</p>
                  <button
                    onClick={() => setShowEditNameModal(true)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit2 size={16} className="text-purple-500" />
                  </button>
                </div>
                <p className="text-gray-500">{profile.age} años</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-purple-600 font-semibold">{profile.stars} estrellas</span>
                </div>
              </div>
            </div>

            <p className="font-semibold text-gray-700 mb-3">Elige tu avatar</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-4">
              {availableAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                    ${selectedAvatar === avatar.id
                      ? "bg-purple-100 ring-2 ring-purple-500"
                      : "hover:bg-gray-50"}
                  `}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-purple-50">
                    <RealImage type={avatar.image} className="w-full h-full" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{avatar.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveAvatar}
              disabled={isSaving || selectedAvatar === profile.avatar}
              className={`w-full py-3 rounded-xl font-bold transition-all
                ${selectedAvatar === profile.avatar
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"}
              `}
            >
              {isSaving ? "Guardando..." : "Guardar avatar"}
            </button>
          </div>
        </div>

        {/* ========== SECCIÓN TEMAS ========== */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Palette size={20} /> Apariencia
            </h3>
          </div>
          
          <div className="p-6">
            <p className="font-semibold text-gray-700 mb-3">Temas disponibles</p>
            <div className="space-y-3">
              {allThemes.map((theme) => {
                const isActive = currentTheme === theme.themeClass || (theme.id === "default" && isOriginalTheme);
                
                return (
                  <div
                    key={theme.id}
                    className={`rounded-xl overflow-hidden border-2 transition-all
                      ${isActive ? "border-purple-500 shadow-md" : "border-gray-100"}
                    `}
                  >
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-16 h-10 rounded-lg bg-gradient-to-br ${theme.themeClass || "from-purple-100 via-blue-100 to-pink-100"}`} />
                        <div>
                          <p className="font-bold text-gray-800">{theme.name}</p>
                          {theme.price > 0 && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Star size={10} className="text-yellow-500" /> {theme.price} estrellas
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {isActive ? (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle size={14} /> Activo
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEquipTheme(theme.id, theme.themeClass)}
                          className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-purple-600 transition-all"
                        >
                          Equipar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========== SECCIÓN EFECTOS ========== */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Sparkles size={20} /> Efectos
            </h3>
          </div>
          
          <div className="p-6">
            <p className="font-semibold text-gray-700 mb-3">Efectos desbloqueados</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {effectItems.map((effect) => {
                const isUnlocked = unlockedEffects.includes(effect.id);
                const isEquipped = equippedEffect === effect.id;
                
                return (
                  <div
                    key={effect.id}
                    className={`p-3 rounded-xl text-center border-2 transition-all
                      ${isUnlocked 
                        ? isEquipped 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-purple-300'
                        : 'border-gray-100 opacity-50'}
                    `}
                  >
                    <span className="text-4xl block mb-1">{effect.emoji}</span>
                    <p className="text-xs font-medium text-gray-700">{effect.name}</p>
                    {isUnlocked ? (
                      <div className="flex gap-1 justify-center mt-2">
                        {isEquipped ? (
                          <button
                            onClick={handleUnequipEffect}
                            className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-red-600 transition-all"
                          >
                            Desequipar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEquipEffect(effect.id)}
                            className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-purple-600 transition-all"
                          >
                            Equipar
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 mt-2">🔒 Compra en tienda</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========== SECCIÓN LOGROS ========== */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Trophy size={20} /> Logros
            </h3>
          </div>
          
          <div className="p-6">
            <p className="font-semibold text-gray-700 mb-3">Insignias</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badgeItems.map((badge) => {
                const isClaimed = claimedBadges.includes(badge.id);
                const canClaim = checkBadgeConditions(badge.id, stats);
                
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl text-center border-2 transition-all
                      ${isClaimed 
                        ? 'border-green-500 bg-green-50' 
                        : canClaim
                          ? 'border-yellow-400 bg-yellow-50 animate-pulse'
                          : 'border-gray-200 opacity-60'}
                    `}
                  >
                    <span className="text-4xl block mb-1">{badge.emoji}</span>
                    <p className="text-xs font-medium text-gray-700">{badge.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{badge.requirement}</p>
                    {isClaimed ? (
                      <span className="text-green-500 text-xs font-bold flex items-center justify-center gap-1 mt-2">
                        <CheckCircle size={14} /> Desbloqueado
                      </span>
                    ) : canClaim ? (
                      <button
                        onClick={() => handleClaimBadge(badge.id)}
                        className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-600 transition-all"
                      >
                        ¡Reclamar!
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 mt-2">🔒 Bloqueado</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-blue-600 text-sm">
            💡 Compra nuevos temas y efectos en la tienda para personalizar tu experiencia
          </p>
        </div>
      </div>

      {showEditNameModal && (
        <EditNameModal
          currentName={profile.name}
          onSave={(newName) => {
            speakWithQueue(`Nombre cambiado a ${newName}`, 0.85);
            setShowEditNameModal(false);
          }}
          onClose={() => setShowEditNameModal(false)}
        />
      )}
    </div>
  );
};