import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

interface EditNameModalProps {
  currentName: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

export const EditNameModal = ({ currentName, onSave, onClose }: EditNameModalProps) => {
  const [name, setName] = useState(currentName);

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
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-3xl max-w-sm w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-600">Editar nombre</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg mb-6"
            autoFocus
          />
          <button
            onClick={() => onSave(name)}
            className="w-full bg-green-500 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Guardar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};