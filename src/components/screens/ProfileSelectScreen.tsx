import { motion } from "motion/react";
import { Plus, Star } from "lucide-react";
import type { UserProfile } from "../../types";
import { RealImage } from "../common/RealImage";  

interface ProfileSelectScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onNewProfile: () => void;
}

export const ProfileSelectScreen = ({
  profiles,
  onSelectProfile,
  onNewProfile,
}: ProfileSelectScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl w-full"
    >
      <h1 className="text-7xl font-bold text-purple-600 text-center mb-16">
        ¿Quién va a jugar?
      </h1>

      <div className="grid grid-cols-3 gap-8 mb-12">
        {profiles.map((profile) => (
          <motion.button
            key={profile.id}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectProfile(profile)}
            className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-40 h-40 mx-auto mb-6">
              <RealImage type={profile.avatar} />  {/* ← CAMBIADO */}
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-3">{profile.name}</h3>
            <div className="flex items-center justify-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={28} />
              <span className="text-3xl font-semibold text-purple-600">{profile.stars}</span>
            </div>
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05, y: -10 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewProfile}
          className="bg-gradient-to-br from-purple-400 to-blue-400 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center"
        >
          <Plus size={80} className="text-white mb-4" />
          <p className="text-3xl font-bold text-white">Nuevo jugador</p>
        </motion.button>
      </div>
    </motion.div>
  );
};