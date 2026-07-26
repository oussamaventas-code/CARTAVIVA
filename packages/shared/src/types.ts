export type SupportedLanguage = 'es' | 'en' | 'fr' | 'it' | 'de' | 'ca' | 'pt';
export type UserRole = 'admin' | 'manager' | 'employee' | 'readonly';
export type Currency = 'EUR' | 'GBP' | 'USD';
export type AllergenType = 'gluten' | 'crustaceans' | 'eggs' | 'fish' | 'peanuts' | 'soy' | 'dairy' | 'nuts' | 'celery' | 'mustard' | 'sesame' | 'sulphites' | 'lupin' | 'molluscs';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
}

export interface BusinessHours {
  [day: string]: { open: string; close: string }[];
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  theme_id: string | null;
  default_language: SupportedLanguage;
  supported_languages: SupportedLanguage[];
  currency: Currency;
  timezone: string;
  vat_rate: number;
  whatsapp: string | null;
  social_links: SocialLinks;
  business_hours: BusinessHours;
  custom_domain: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DishTranslation {
  name: string;
  description: string;
  short_description: string;
}

export interface DishTag {
  id: string;
  label: string;
}

export interface Pairing {
  id: string;
  dish_id: string;
  paired_dish_id: string;
  pairing_type: 'recommended' | 'wine' | 'dessert' | 'complement';
}

export interface Dish {
  id: string;
  restaurant_id: string;
  category_id: string;
  slug: string;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  allergen_ids: string[];
  tags: DishTag[];
  translations: Record<SupportedLanguage, DishTranslation>;
  video_url: string | null;
  video_poster_url: string | null;
  image_url: string | null;
  pairings: Pairing[];
  created_at: string;
  updated_at: string;
}
