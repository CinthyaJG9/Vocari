import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Settings, LogOut, ShoppingBag } from "lucide-react";
import { RealImage } from "../common/RealImage";

interface Props {
  profileName: string;
  stars: number;
  games: Array<{ name: string; color: string; image: string }>;
  onSelectGame: (index: number) => void;
  onChangeProfile: () => void;
  onOpenSettings: () => void;
  onOpenShop: () => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  carouselRef: React.RefObject<HTMLDivElement | null>;
  themeClass?: string; 
}

export const MenuScreen = ({
  profileName,
  stars,
  games,
  onSelectGame,
  onChangeProfile,
  onOpenSettings,
  onOpenShop,
  onScrollLeft,
  onScrollRight,
  carouselRef,
  themeClass = "from-purple-100 via-blue-100 to-pink-100",
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl mx-auto px-4 md:px-6"
    >
      {/* Header - Aplicando el tema al fondo */}
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 md:mb-12 bg-gradient-to-r ${themeClass} rounded-full px-5 md:px-8 py-2 md:py-4 shadow-lg`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 md:px-6 py-1 md:py-2 flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-center sm:justify-start">
          <p className="text-xl sm:text-2xl md:text-4xl font-bold text-purple-600 truncate max-w-[200px] sm:max-w-none">
            Hola, {profileName}
          </p>
          <button
            onClick={onOpenSettings}
            className="p-1 md:p-2 hover:bg-purple-100 rounded-full transition-colors"
            title="Configuración"
          >
            <Settings size={20} className="text-purple-500" />
          </button>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          {/* Estrellas */}
          <div className="flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 md:px-8 py-1 md:py-3 shadow-lg">
            <Star className="text-yellow-500 fill-yellow-500" size={24} />
            <span className="text-xl md:text-4xl font-bold text-purple-600">{stars}</span>
          </div>
          
          {/* Botón Tienda */}
          <button
            onClick={onOpenShop}
            className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-4 shadow-lg hover:shadow-xl transition-all"
            title="Tienda de recompensas"
          >
            <ShoppingBag size={24} className="text-purple-600" />
          </button>
          
          {/* Botón Cambiar perfil */}
          <button
            onClick={onChangeProfile}
            className="bg-white/80 backdrop-blur-sm rounded-full p-2 md:p-4 shadow-lg hover:shadow-xl transition-all"
            title="Cambiar de perfil"
          >
            <LogOut size={24} className="text-purple-600" />
          </button>
        </div>
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-purple-600 text-center mb-6 md:mb-12">
        Elige un juego
      </h2>

      {/* Carrusel */}
      <div className="relative">
        <button
          onClick={onScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 md:p-5 shadow-xl -translate-x-3 md:-translate-x-5 hover:scale-110 transition-all"
          aria-label="Desplazar izquierda"
        >
          <ChevronLeft size={28} className="text-purple-600" />
        </button>

        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-8 overflow-x-auto scroll-smooth pb-4 md:pb-8 px-8 md:px-16 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {games.map((game, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectGame(index)}
              className="flex-shrink-0 w-[280px] sm:w-[350px] md:w-[500px] bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden snap-start"
            >
              <div className={`h-40 sm:h-52 md:h-64 bg-gradient-to-br ${game.color} flex items-center justify-center p-4`}>
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
                  <RealImage type={game.image} />
                </div>
              </div>
              <div className="p-4 md:p-10">
                <h3 className="text-lg sm:text-xl md:text-4xl font-bold text-gray-800 text-center">
                  {game.name}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={onScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3 md:p-5 shadow-xl translate-x-3 md:translate-x-5 hover:scale-110 transition-all"
          aria-label="Desplazar derecha"
        >
          <ChevronRight size={28} className="text-purple-600" />
        </button>
      </div>

      {/* Estilo para ocultar scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
};