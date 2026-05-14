import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star, RotateCcw, Settings } from "lucide-react";
import { RealImage } from "../common/RealImage";

interface Props {
  profileName: string;
  stars: number;
  games: Array<{ name: string; color: string; image: string }>;
  onSelectGame: (index: number) => void;
  onChangeProfile: () => void;
  onEditProfile: () => void;  
  onScrollLeft: () => void;
  onScrollRight: () => void;
  carouselRef: React.RefObject<HTMLDivElement | null>;
}

export const MenuScreen = ({
  profileName,
  stars,
  games,
  onSelectGame,
  onChangeProfile,
  onEditProfile,
  onScrollLeft,
  onScrollRight,
  carouselRef,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl w-full"
    >
      {/* Header con botón de editar */}
      <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
        <div className="bg-white rounded-full px-8 py-4 shadow-lg flex items-center gap-4">
          <p className="text-4xl font-bold text-purple-600">Hola, {profileName}</p>
          <button
            onClick={onEditProfile}
            className="p-2 hover:bg-purple-100 rounded-full transition-colors"
            title="Editar perfil"
          >
            <Settings size={28} className="text-purple-500" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white rounded-full px-8 py-4 shadow-lg">
            <Star className="text-yellow-500 fill-yellow-500" size={40} />
            <span className="text-4xl font-bold text-purple-600">{stars}</span>
          </div>
          <button
            onClick={onChangeProfile}
            className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl"
          >
            <RotateCcw size={32} className="text-purple-600" />
          </button>
        </div>
      </div>

      <h2 className="text-6xl font-bold text-purple-600 text-center mb-12">
        Elige un juego
      </h2>

      <div className="relative">
        <button
          onClick={onScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-6 shadow-xl -translate-x-4"
        >
          <ChevronLeft size={48} className="text-purple-600" />
        </button>

        <div
          ref={carouselRef}
          className="flex gap-8 overflow-x-auto scroll-smooth pb-8 px-16 hide-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {games.map((game, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectGame(index)}
              className="flex-shrink-0 w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className={`h-64 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                <div className="w-48 h-48">
                  <RealImage type={game.image} />
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-4xl font-bold text-gray-800">{game.name}</h3>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={onScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-6 shadow-xl translate-x-4"
        >
          <ChevronRight size={48} className="text-purple-600" />
        </button>
      </div>
    </motion.div>
  );
};