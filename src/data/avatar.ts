export interface Avatar {
  id: string;
  name: string;
  image: string;
  price: number;
  default: boolean;  // si es gratis por defecto
  category: 'basic' | 'special' | 'legendary';
}

export const avatars: Avatar[] = [
  // AVATARES BÁSICOS (gratis por defecto)
  { id: "avatar1", name: "Ana", image: "avatar1", price: 0, default: true, category: "basic" },
  { id: "avatar2", name: "Luis", image: "avatar2", price: 0, default: true, category: "basic" },
  { id: "avatar3", name: "Sofía", image: "avatar3", price: 0, default: true, category: "basic" },
  { id: "cat", name: "Gato", image: "cat", price: 0, default: true, category: "basic" },
  { id: "dog", name: "Perro", image: "dog", price: 0, default: true, category: "basic" },
  
  // AVATARES ESPECIALES (se compran con estrellas)
  { id: "fox", name: "Zorro", image: "fox", price: 50, default: false, category: "special" },
  { id: "bear", name: "Oso", image: "bear", price: 50, default: false, category: "special" },
  { id: "rabbit", name: "Conejo", image: "rabbit", price: 50, default: false, category: "special" },
  { id: "penguin", name: "Pingüino", image: "penguin", price: 80, default: false, category: "special" },
  
  // AVATARES LEGENDARIOS (más caros)
  { id: "dragon", name: "Dragón", image: "dragon", price: 150, default: false, category: "legendary" },
  { id: "unicorn", name: "Unicornio", image: "unicorn", price: 200, default: false, category: "legendary" },
];