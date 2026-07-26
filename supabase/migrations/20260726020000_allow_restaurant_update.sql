-- La migración de políticas de desarrollo dejó "restaurants" solo en modo lectura,
-- así que editar el nombre o la dirección web desde Configuración fallaba en
-- silencio (RLS descartaba el UPDATE y devolvía 0 filas).
-- Igual que el resto de políticas "Dev:", esto es temporal: SUSTITUIR por una
-- política basada en auth.uid() + user_roles antes de producción.

CREATE POLICY "Dev: anon can update restaurants"
  ON restaurants FOR UPDATE TO anon
  USING (true) WITH CHECK (true);
