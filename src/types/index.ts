export type PartKey = "laces" | "upper" | "insole" | "cushion" | "midsole" | "outsole";
export type ColorZone = "upper" | "laces" | "midsole" | "outsole" | "accent";
export type SneakerColors = Record<ColorZone, string>;

export interface ColorOption { id: string; name: string; hex: string }

export interface Product {
  id: string;
  name: string;
  category: string;
  gender: "men" | "women" | "unisex";
  price: number;
  image: string;
  colors: ColorOption[];
  blurb: string;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  qty: number;
  custom?: boolean;
}

export interface HeroSlide {
  id: string;
  name: string;
  tagline: string;
  colorName: string;
  body: string;
  colors: SneakerColors;
  light: string;
  bg: string;
}
