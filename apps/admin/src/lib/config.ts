// URL pública donde está desplegada la carta del cliente (apps/restaurant).
// En desarrollo apunta al servidor local; en producción se define
// VITE_PUBLIC_MENU_URL en las variables de entorno del hosting.
export const PUBLIC_MENU_BASE_URL: string =
  import.meta.env.VITE_PUBLIC_MENU_URL ?? 'http://localhost:3001';
