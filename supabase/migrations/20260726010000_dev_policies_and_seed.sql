-- Modo desarrollo: todavía no hay login (Supabase Auth) construido en el admin,
-- así que las políticas RLS "Managers+ ..." de la migración inicial bloquean
-- cualquier escritura hecha con la anon key (no hay auth.uid() que las cumpla).
-- Estas políticas permisivas permiten que el panel admin funcione sin login
-- mientras se construye la autenticación real. SUSTITUIR antes de producción
-- por políticas que exijan auth.uid() + user_roles, igual que ya existe para dishes.

CREATE POLICY "Dev: anon full access to restaurants"
  ON restaurants FOR SELECT TO anon USING (true);

CREATE POLICY "Dev: anon full access to categories"
  ON categories FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Dev: anon full access to dishes"
  ON dishes FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Dev: anon full access to images"
  ON images FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Dev: anon full access to videos"
  ON videos FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Dev: anon full access to tables"
  ON tables FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Dev: anon full access to qr_codes"
  ON qr_codes FOR ALL TO anon USING (true) WITH CHECK (true);

-- Restaurante demo fijo: todavía no hay flujo de alta/login, así que el admin
-- trabaja siempre sobre este único restaurante hasta que exista multi-tenant real.
INSERT INTO restaurants (id, name, slug)
VALUES ('11111111-1111-1111-1111-111111111111', 'Mi Restaurante', 'mi-restaurante')
ON CONFLICT (id) DO NOTHING;

-- Las 4 categorías que ya existían como datos de ejemplo en el frontend,
-- ahora como filas reales para que el admin tenga algo con lo que empezar.
INSERT INTO categories (restaurant_id, slug, sort_order, translations)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'entrantes', 0, '{"es": {"name": "Entrantes"}}'),
  ('11111111-1111-1111-1111-111111111111', 'principales', 1, '{"es": {"name": "Principales"}}'),
  ('11111111-1111-1111-1111-111111111111', 'bebidas', 2, '{"es": {"name": "Bebidas"}}'),
  ('11111111-1111-1111-1111-111111111111', 'postres', 3, '{"es": {"name": "Postres"}}')
ON CONFLICT (restaurant_id, slug) DO NOTHING;

-------------------------------------------------------
-- STORAGE: bucket público para los videos de los platos
-------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-videos', 'dish-videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Dev: anon can upload dish videos"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'dish-videos');

CREATE POLICY "Dev: anon can update dish videos"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'dish-videos');

CREATE POLICY "Dev: anon can delete dish videos"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'dish-videos');

CREATE POLICY "Public can view dish videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'dish-videos');
