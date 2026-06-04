
// If TypeScript cannot find module declarations for images, declare them as any.
// This avoids the need for separate .d.ts files.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dogImg from "../../assets/images/dog.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import catImg from "../../assets/images/cat.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rabbitImg from "../../assets/images/rabbit.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mouseImg from "../../assets/images/mouse.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sunImg from "../../assets/images/sun.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import moonImg from "../../assets/images/moon.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import starImg from "../../assets/images/star.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import game1Img from "../../assets/images/game1.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import game2Img from "../../assets/images/game2.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import game3Img from "../../assets/images/game3.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import avatar1Img from "../../assets/images/avatar1.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import avatar2Img from "../../assets/images/avatar2.jpg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import avatar3Img from "../../assets/images/avatar3.jpg";


const images: Record<string, string> = {
  dog: dogImg,
  cat: catImg,
  rabbit: rabbitImg,
  mouse: mouseImg,
  sun: sunImg,
  moon: moonImg,
  star: starImg,
  game1: game1Img,
  game2: game2Img,
  game3: game3Img,
  avatar1: avatar1Img,
  avatar2: avatar2Img,
  avatar3: avatar3Img,
};

interface RealImageProps {
  type: string;
  size?: "small" | "normal" | "large";
  className?: string;
}

export const RealImage = ({ type, className = "" }: RealImageProps) => {
  return (
    <div className={`w-full h-full overflow-hidden rounded-2xl shadow-lg ${className}`}>
      <img
        src={images[type]}
        alt={type}
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
      />
    </div>
  );
};