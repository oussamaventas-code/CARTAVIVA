// Los errores de Supabase (PostgrestError, StorageError) son objetos planos, no
// instancias de Error, así que un `err instanceof Error` los descarta y acaba
// mostrando un mensaje genérico que oculta la causa real.
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;

  if (typeof err === 'object' && err !== null) {
    const { message, hint, details, code } = err as {
      message?: unknown;
      hint?: unknown;
      details?: unknown;
      code?: unknown;
    };
    if (typeof message === 'string' && message) {
      const extra = [hint, details, code].filter(
        (v): v is string => typeof v === 'string' && v.length > 0
      );
      return extra.length > 0 ? `${message} (${extra.join(' · ')})` : message;
    }
  }

  return fallback;
}
