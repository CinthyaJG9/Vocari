import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Trash2, UserMinus, Star } from 'lucide-react';
import { RealImage } from './RealImage';
import type { UserProfile } from '../../types';
import { speakWithQueue } from '../../services/warmVoiceService';
import { avatars } from '../../data/avatar';

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (avatar: string) => void;
  onDelete: () => void;
  unlockedAvatars: string[]; // NUEVO: avatares desbloqueados por este perfil
}

export const EditProfileModal = ({ profile, onClose, onSave, onDelete, unlockedAvatars }: EditProfileModalProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filtrar SOLO avatares desbloqueados (por defecto + comprados)
  const availableAvatars = avatars.filter(a => unlockedAvatars.includes(a.id));

  const handleSave = async () => {
    onSave(selectedAvatar);
    await speakWithQueue(`¡Listo! ${profile.name} ahora tiene un avatar nuevo`, 0.85);
    onClose();
  };

  const handleDelete = async () => {
    await speakWithQueue(`Adiós ${profile.name}. Esperamos verte pronto`, 0.85);
    onDelete();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    speakWithQueue("Eliminación cancelada", 0.85);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-600">
              {showDeleteConfirm ? "⚠️ Eliminar perfil" : "✏️ Editar perfil"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {!showDeleteConfirm ? (
            <>
              {/* Información del perfil */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden shadow-lg">
                  <RealImage type={profile.avatar} className="w-full h-full" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{profile.name}</p>
                <p className="text-gray-500">{profile.age} años</p>
                <div className="flex justify-center items-center gap-1 mt-1">
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  <span className="text-purple-600 font-semibold">{profile.stars} estrellas</span>
                </div>
              </div>

              {/* Selector de avatar - SOLO AVATARES DESBLOQUEADOS */}
              <p className="text-lg font-semibold text-gray-700 mb-3 text-center">
                Elige tu avatar
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-8 max-h-60 overflow-y-auto p-2">
                {availableAvatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`w-16 h-16 rounded-xl overflow-hidden transition-all
                      ${selectedAvatar === avatar.id
                        ? "ring-4 ring-purple-500 scale-110 shadow-xl"
                        : "opacity-80 hover:opacity-100 hover:scale-105"}
                    `}
                  >
                    <RealImage type={avatar.image} className="w-full h-full" />
                  </button>
                ))}
              </div>

              {/* Botones */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Check size={20} /> Guardar cambios
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 text-white rounded-xl px-6 py-3 font-bold flex items-center gap-2 hover:bg-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </>
          ) : (
            // Modo confirmación de eliminación
            <div className="text-center">
              <div className="bg-red-50 rounded-2xl p-6 mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <UserMinus size={40} className="text-red-500" />
                </div>
                <p className="text-red-600 font-bold text-lg mb-2">¿Eliminar a {profile.name}?</p>
                <p className="text-red-500 text-sm">Esta acción no se puede deshacer.<br />Se perderán todas las {profile.stars} estrellas.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDelete} className="flex-1 bg-red-500 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-red-600">
                  <Trash2 size={20} /> Sí, eliminar
                </button>
                <button onClick={cancelDelete} className="flex-1 bg-gray-300 text-gray-700 rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-gray-400">
                  <X size={20} /> Cancelar
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};