// Los errores de Supabase (PostgrestError, StorageError) son objetos planos, no
// instancias de Error, así que un `err instanceof Error` los descarta y acaba
// mostrando un mensaje genérico que oculta la causa real.
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;

  if (typeof err === 'object' && err !== null) {
    const { message, hint } = err as { message?: unknown; hint?: unknown };
    if (typeof message === 'string' && message) {
      return typeof hint === 'string' && hint ? `${message} (${hint})` : message;
    }
  }

  return fallback;
}
