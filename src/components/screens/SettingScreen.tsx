import { useState } from "react";
import { motion } from "motion/react";
import { Home, Star, Palette, RefreshCw, CheckCircle, Edit2, ChevronRight } from "lucide-react";
import { RealImage } from "../common/RealImage";
import { EditNameModal } from "../common/EditNameModal";
import { speakWithQueue } from "../../services/warmVoiceService";
import { shopItems } from "../../data/shopItems";
import { avatars } from "../../data/avatar";

interface SettingsScreenProps {
  profile: {
    id: string;
    name: string;
    age: number;
    stars: number;
    avatar: string;
  };
  currentTheme: string;
  unlockedAvatars: string[];
  unlockedThemes: string[];
  onSaveAvatar: (avatarId: string) => void;
  onEquipTheme: (themeClass: string, themeId: string) => void;
  onResetTheme: () => void;
  onBack: () => void;
}

export const SettingsScreen = ({
  profile,
  currentTheme,
  unlockedAvatars,
  unlockedThemes,
  onSaveAvatar,
  onEquipTheme,
  onResetTheme,
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

  const handleEquipTheme = async (themeId: string, themeClass: string) => {
    if (themeId === "default") {
      onResetTheme();
    } else {
      onEquipTheme(themeClass, themeId);
    }
    await speakWithQueue(`Tema equipado`, 0.85);
  };

  // Avatares disponibles (desbloqueados)
  const availableAvatars = avatars.filter(a => unlockedAvatars.includes(a.id));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4">
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
            {/* Información del perfil */}
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

            {/* Selector de avatar */}
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
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
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

        {/* Información adicional */}
        <div className="mt-6 bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-blue-600 text-sm">
            💡 Compra nuevos temas en la tienda para personalizar tu experiencia
          </p>
        </div>
      </div>

      {/* Modal de edición de nombre */}
      {showEditNameModal && (
        <EditNameModal
          currentName={profile.name}
          onSave={(newName) => {
            // Aquí actualizar el nombre del perfil
            speakWithQueue(`Nombre cambiado a ${newName}`, 0.85);
            setShowEditNameModal(false);
          }}
          onClose={() => setShowEditNameModal(false)}
        />
      )}
    </div>
  );
};