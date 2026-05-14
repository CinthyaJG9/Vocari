import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWarmAssistant } from '../../hooks/userWarmAssistant';
import { Volume2, Mic, X, HelpCircle } from 'lucide-react';

interface FloatingAssistantProps {
  showHelp?: boolean;
  onHelpClick?: () => void;
}

export const FloatingAssistant = ({ showHelp = false, onHelpClick }: FloatingAssistantProps) => {
  const { isSpeaking, isVoiceReady, sayHelp, speak } = useWarmAssistant();
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // Mostrar tooltip al inicio por unos segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 1000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Tooltip de ayuda */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-16 right-0 bg-purple-600 text-white text-sm rounded-xl px-4 py-2 whitespace-nowrap shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Volume2 size={14} />
              <span>¡Haz clic si necesitas ayuda!</span>
            </div>
            <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-purple-600 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón del asistente */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isSpeaking ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
        onClick={() => {
          if (showHelp && onHelpClick) {
            onHelpClick();
          } else {
            sayHelp();
          }
        }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all"
      >
        {isSpeaking ? (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <Volume2 size={28} />
          </motion.div>
        ) : (
          <Volume2 size={28} />
        )}
      </motion.button>

      {/* Indicador de que está escuchando/ayuda para no lectores */}
      <div className="absolute -top-2 -right-2">
        <div className="relative">
          <HelpCircle size={16} className="text-yellow-400 fill-yellow-400" />
          <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-75"></div>
        </div>
      </div>
    </motion.div>
  );
};