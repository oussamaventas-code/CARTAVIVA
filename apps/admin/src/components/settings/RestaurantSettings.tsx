import { useEffect, useState } from 'react';
import { Loader2, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { slugify } from '@carta/utils';
import { fetchRestaurant, updateRestaurant } from '../../lib/restaurantApi';
import { PUBLIC_MENU_BASE_URL } from '../../lib/config';
import { getErrorMessage } from '../../lib/errors';

export function RestaurantSettings() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [originalSlug, setOriginalSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const restaurant = await fetchRestaurant();
        setName(restaurant.name);
        setSlug(restaurant.slug);
        setOriginalSlug(restaurant.slug);
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudieron cargar los datos.'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const slugChanged = slug !== originalSlug;
  const publicUrl = `${PUBLIC_MENU_BASE_URL}/r/${slug}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El restaurante necesita un nombre.');
      return;
    }

    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      setError('La dirección web no es válida.');
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateRestaurant({ name: name.trim(), slug: cleanSlug });
      setName(updated.name);
      setSlug(updated.slug);
      setOriginalSlug(updated.slug);
      setSaved(true);
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo guardar.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Datos del restaurante</h2>
      <p className="mt-1 text-sm text-slate-500">
        Es lo que verán tus clientes al escanear el código QR.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            placeholder="Ej. La Buena Mesa"
            className="mt-1 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Dirección web de tu carta</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSaved(false);
            }}
            placeholder="la-buena-mesa"
            className="mt-1 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="truncate">{publicUrl}</span>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-shrink-0 text-blue-600 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </p>
        </div>

        {slugChanged && (
          <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p>
              Si cambias la dirección web, los códigos QR que ya tengas{' '}
              <strong>impresos dejarán de funcionar</strong>. Tendrás que
              descargarlos e imprimirlos de nuevo.
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar cambios
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <Check className="h-4 w-4" />
              Guardado
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
