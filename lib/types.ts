export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  material?: string;
  dimensions?: string;
  colorway: string; // CSS gradient or color string for placeholder visual
  designerId: string;
  featured?: boolean;
  tags?: string[];
}

export interface DesignerTheme {
  bg: string;
  fg: string;
  accent: string;
  accentText: string; // "#fff" or "#000" — legible on accent background
  accentSecondary?: string;
  fontDisplay: string;
  fontBody: string;
  fontMono?: string;
  mood: "brutalist" | "futuristic" | "earthy" | "minimal" | "romantic" | "vibrant";
  motionSpeed: "slow" | "medium" | "fast";
  // CSS custom property overrides applied as inline style vars
  cssVars: Record<string, string>;
}

export interface LookbookImage {
  id: string;
  alt: string;
  gradient: string; // CSS gradient for placeholder
  span?: "wide" | "tall" | "normal";
}

export interface Designer {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortBio: string;
  story: string[];
  location: string;
  founded: string;
  theme: DesignerTheme;
  products: Product[];
  lookbook: LookbookImage[];
  logoMark: string; // SVG path or text treatment description
  featuredGradient: string; // Card preview gradient
}

export interface Measurements {
  chest: string;
  waist: string;
  hips: string;
  height: string;
  notes?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  designerName: string;
  designerSlug: string;
  price: number;
  quantity: number;
  colorway: string;
  size?: string;
  measurements?: Measurements;
}
