export interface RewardItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'avatar' | 'theme' | 'effect' | 'badge';
  image: string;
  unlocked: boolean;
  themeClass?: string; // Para temas (gradiente CSS)
}

export interface AvatarItem {
  id: string;
  name: string;
  image: string;
  price: number;
  unlocked: boolean;
}