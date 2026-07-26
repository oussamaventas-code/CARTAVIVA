-- Ejecuta esto UNA VEZ en el SQL Editor de Supabase antes de volver a correr
-- 20260726000000_initial_schema.sql, para limpiar lo que se creó a medias
-- por el error de "permission denied for schema auth".
-- Seguro de ejecutar: este proyecto todavía no tiene datos reales.

DROP TABLE IF EXISTS orders_future CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS qr_codes CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS pairings CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS dish_allergens CASCADE;
DROP TABLE IF EXISTS allergens CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS themes CASCADE;

DROP FUNCTION IF EXISTS public.user_restaurant_ids();
DROP FUNCTION IF EXISTS public.user_role(UUID);
DROP FUNCTION IF EXISTS auth.user_restaurant_ids();
DROP FUNCTION IF EXISTS auth.user_role(UUID);
