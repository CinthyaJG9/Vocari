import { motion } from "motion/react";
import { Plus, Star } from "lucide-react";
import type { UserProfile } from "../../types";
import { RealImage } from "../common/RealImage";

interface ProfileSelectScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onNewProfile: () => void;
  themeClass?: string; 
}

export const ProfileSelectScreen = ({
  profiles,
  onSelectProfile,
  onNewProfile,
  themeClass = "from-purple-100 via-blue-100 to-pink-100", 
}: ProfileSelectScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full max-w-6xl mx-auto p-4 bg-gradient-to-br ${themeClass} min-h-screen`}
    >
      <h1 className="text-4xl md:text-7xl font-bold text-purple-600 text-center mb-8 md:mb-16">
        ¿Quién va a jugar?
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
        {profiles.map((profile) => (
          <motion.button
            key={profile.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectProfile(profile)}
            className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-3 md:mb-6 rounded-2xl overflow-hidden bg-purple-50">
              <RealImage type={profile.avatar} className="w-full h-full" />
            </div>
            <h3 className="text-xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-3">
              {profile.name}
            </h3>
            <div className="flex items-center justify-center gap-1 md:gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={20} />
              <span className="text-xl md:text-3xl font-semibold text-purple-600">
                {profile.stars}
              </span>
            </div>
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewProfile}
          className="bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center justify-center min-h-[200px]"
        >
          <Plus size={48} className="text-white mb-2 md:mb-4" />
          <p className="text-xl md:text-3xl font-bold text-white">Nuevo jugador</p>
        </motion.button>
      </div>
    </motion.div>
  );
};