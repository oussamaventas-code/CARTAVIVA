-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: themes (needs to exist before restaurants if referenced)
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  colors JSONB NOT NULL DEFAULT '{}',
  typography JSONB NOT NULL DEFAULT '{}',
  borders JSONB NOT NULL DEFAULT '{}',
  spacing JSONB NOT NULL DEFAULT '{}',
  animations JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: restaurants
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  theme_id UUID REFERENCES themes(id),
  default_language TEXT NOT NULL DEFAULT 'es',
  supported_languages TEXT[] NOT NULL DEFAULT ARRAY['es'],
  currency TEXT NOT NULL DEFAULT 'EUR',
  timezone TEXT NOT NULL DEFAULT 'Europe/Madrid',
  vat_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  whatsapp TEXT,
  social_links JSONB DEFAULT '{}',
  business_hours JSONB DEFAULT '{}',
  custom_domain TEXT UNIQUE,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fix circular reference on themes to restaurants by adding restaurant_id
ALTER TABLE themes ADD COLUMN restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE;

-- Table: user_roles links Supabase Auth users to restaurants with roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'employee', 'readonly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Table: categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  translations JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, slug)
);

-- Table: dishes
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  compare_price NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  translations JSONB NOT NULL DEFAULT '{}',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, slug)
);

-- Table: allergens
CREATE TABLE allergens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  translations JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Table: dish_allergens (junction)
CREATE TABLE dish_allergens (
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  allergen_id UUID NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
  PRIMARY KEY (dish_id, allergen_id)
);

-- Table: images
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  size_bytes BIGINT,
  mime_type TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: videos
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  poster_url TEXT,
  duration_seconds NUMERIC(6,2),
  width INTEGER,
  height INTEGER,
  size_bytes BIGINT,
  mime_type TEXT DEFAULT 'video/mp4',
  is_processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: pairings
CREATE TABLE pairings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  paired_dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  pairing_type TEXT NOT NULL DEFAULT 'recommended',
  sort_order INTEGER NOT NULL DEFAULT 0,
  translations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(dish_id, paired_dish_id)
);

-- Table: tables
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, number)
);

-- Table: qr_codes
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  params JSONB DEFAULT '{}',
  svg_data TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  scans_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: analytics_events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  session_id TEXT,
  language TEXT,
  device_type TEXT,
  duration_ms INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_restaurant_date ON analytics_events (restaurant_id, created_at DESC);
CREATE INDEX idx_analytics_event_type ON analytics_events (event_type);
CREATE INDEX idx_analytics_dish ON analytics_events (dish_id) WHERE dish_id IS NOT NULL;

-- Table: languages
CREATE TABLE languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  flag_emoji TEXT,
  is_rtl BOOLEAN NOT NULL DEFAULT false
);

-- Table: orders_future
CREATE TABLE orders_future (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id UUID REFERENCES tables(id),
  status TEXT NOT NULL DEFAULT 'draft',
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-------------------------------------------------------
-- HELPER FUNCTIONS FOR RLS
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.user_restaurant_ids()
RETURNS SETOF UUID AS $$
  SELECT restaurant_id FROM user_roles
  WHERE user_id = auth.uid() AND is_active = true
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.user_role(rest_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM user_roles
  WHERE user_id = auth.uid() AND restaurant_id = rest_id AND is_active = true
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
-------------------------------------------------------
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------
-- EXAMPLE POLICIES (Dishes)
-------------------------------------------------------
CREATE POLICY "Public can view active dishes"
  ON dishes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view dishes of their restaurants"
  ON dishes FOR SELECT
  USING (restaurant_id IN (SELECT public.user_restaurant_ids()));

CREATE POLICY "Managers+ can insert dishes"
  ON dishes FOR INSERT
  WITH CHECK (
    restaurant_id IN (SELECT public.user_restaurant_ids())
    AND public.user_role(restaurant_id) IN ('admin', 'manager')
  );

CREATE POLICY "Managers+ can update dishes"
  ON dishes FOR UPDATE
  USING (
    restaurant_id IN (SELECT public.user_restaurant_ids())
    AND public.user_role(restaurant_id) IN ('admin', 'manager')
  );
