import { useState, useEffect } from "react";
import { getImage } from "../../services/imageService";

interface RealImageProps {
  type: string;
  className?: string;
}

// Imágenes locales
const localImages: Record<string, string> = {
  avatar1: "/src/assets/images/avatar1.jpg",
  avatar2: "/src/assets/images/avatar2.jpg",
  avatar3: "/src/assets/images/avatar3.jpg",
  cat: "/src/assets/images/cat.jpg",
  dog: "/src/assets/images/dog.jpg",
  rabbit: "/src/assets/images/rabbit.jpg",
  game1: "/src/assets/images/game1.jpg",
  game2: "/src/assets/images/game2.jpg",
  game3: "/src/assets/images/game3.jpg",
  mouse: "/src/assets/images/mouse.jpg",
  sun: "/src/assets/images/sun.jpg",
  moon: "/src/assets/images/moon.jpg",
  star: "/src/assets/images/star.jpg",
  fox: "/src/assets/images/fox.jpg",
  bear: "/src/assets/images/bear.png",
  penguin: "/src/assets/images/penguin.png",
  dragon: "/src/assets/images/dragon.png",
  unicorn: "/src/assets/images/unicorn.png",
};

export const RealImage = ({ type, className = "" }: RealImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);
      
      if (localImages[type]) {
        setImageUrl(localImages[type]);
        setLoading(false);
      } else {
        const url = await getImage(type);
        setImageUrl(url);
        setLoading(false);
      }
    };
    
    loadImage();
  }, [type]);

  if (loading) {
    return (
      <div className={`bg-purple-100 animate-pulse rounded-xl flex items-center justify-center ${className}`}>
        <span className="text-2xl text-purple-400">🖼️</span>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <img 
        src={imageUrl} 
        alt={type}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
      />
    </div>
  );
};