interface ImagePlaceholderProps {
  type: string;
  size?: "small" | "normal" | "large";
}

const images: Record<string, string> = {
  cat: "🐱",
  dog: "🐶",
  mouse: "🐭",
  sun: "☀️",
  moon: "🌙",
  star: "⭐",
  house: "🏠",
  tree: "🌳",
  car: "🚗",
  rabbit: "🐰",
  butterfly: "🦋",
  bee: "🐝",
  bird: "🐦",
  ladybug: "🐞",
  sleep: "😴",
  run: "🏃",
  cow: "🐮",
  smile: "😊",
  girl: "👧",
  read: "📖",
  school: "🏫",
  game1: "🎧",
  game2: "🎤",
  game3: "🔊",
  bear: "🐻",
  fox: "🦊",
  ball: "⚽",
  milk: "🥛",
  park: "🌳",
  carrot: "🥕",
  sky: "☁️",
};

const sizeClasses = {
  small: "text-2xl",
  normal: "text-4xl",
  large: "text-6xl",
};

export const ImagePlaceholder = ({ type, size = "normal" }: ImagePlaceholderProps) => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-dashed border-purple-300">
      <p className={`${sizeClasses[size]} text-purple-600 font-medium text-center px-4`}>
        {images[type] || "🖼️"}
      </p>
    </div>
  );
};