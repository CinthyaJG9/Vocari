import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Trash2 } from 'lucide-react';
import { RealImage } from './RealImage';
import type { UserProfile } from '../../types';

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (avatar: string) => void;
  onDelete: () => void;
}

const avatarOptions = [
  { id: "avatar1", name: "Ana" },
  { id: "avatar2", name: "Luis" },
  { id: "avatar3", name: "Sofía" },
  { id: "cat", name: "Gato" },
  { id: "dog", name: "Perro" },
];

export const EditProfileModal = ({ profile, onClose, onSave, onDelete }: EditProfileModalProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onSave(selectedAvatar);
    onClose();
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
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-purple-600">Editar perfil</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Información del perfil */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-3 rounded-2xl overflow-hidden shadow-lg">
              <RealImage type={profile.avatar} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{profile.name}</p>
            <p className="text-gray-500">{profile.age} años</p>
            <p className="text-purple-600 mt-1">⭐ {profile.stars} estrellas</p>
          </div>

          {/* Selector de avatar */}
          <p className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Elige tu avatar
          </p>
          <div className="flex justify-center gap-4 mb-8">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`w-20 h-20 rounded-2xl overflow-hidden transition-all ${
                  selectedAvatar === avatar.id
                    ? "ring-4 ring-purple-500 scale-110 shadow-xl"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <RealImage type={avatar.id} />
                <p className="text-xs text-gray-600 mt-1">{avatar.name}</p>
              </button>
            ))}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Guardar
            </button>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white rounded-xl px-6 py-3 font-bold flex items-center gap-2"
              >
                <Trash2 size={20} />
              </button>
            ) : (
              <button
                onClick={onDelete}
                className="bg-red-700 text-white rounded-xl px-6 py-3 font-bold flex items-center gap-2 animate-pulse"
              >
                <Trash2 size={20} />
                Confirmar
              </button>
            )}
          </div>
          
          {showDeleteConfirm && (
            <p className="text-xs text-red-500 text-center mt-2">
              Haz clic en Confirmar para eliminar este perfil
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};