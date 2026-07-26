import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Loader2,
  UtensilsCrossed,
  Video,
  LayoutGrid,
  QrCode,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { supabase, DEMO_RESTAURANT_ID } from '@carta/database';
import { getErrorMessage } from '../lib/errors';
import { PUBLIC_MENU_BASE_URL } from '../lib/config';

interface Stats {
  restaurantName: string;
  restaurantSlug: string;
  categories: number;
  dishes: number;
  dishesWithVideo: number;
  tables: number;
}

async function fetchStats(): Promise<Stats> {
  const countOf = (table: 'categories' | 'dishes' | 'tables') =>
    supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('restaurant_id', DEMO_RESTAURANT_ID);

  const [restaurant, categories, dishes, tables, videos] = await Promise.all([
    supabase.from('restaurants').select('name, slug').eq('id', DEMO_RESTAURANT_ID).single(),
    countOf('categories'),
    countOf('dishes'),
    countOf('tables'),
    supabase
      .from('videos')
      .select('dish_id')
      .eq('restaurant_id', DEMO_RESTAURANT_ID)
      .not('dish_id', 'is', null),
  ]);

  if (restaurant.error) throw restaurant.error;

  const uniqueDishesWithVideo = new Set((videos.data ?? []).map((v) => v.dish_id));

  return {
    restaurantName: restaurant.data.name,
    restaurantSlug: restaurant.data.slug,
    categories: categories.count ?? 0,
    dishes: dishes.count ?? 0,
    dishesWithVideo: uniqueDishesWithVideo.size,
    tables: tables.count ?? 0,
  };
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof UtensilsCrossed;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setStats(await fetchStats());
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudieron cargar los datos.'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return <div className="p-8 text-sm text-red-600">{error}</div>;
  }

  const dishesWithoutVideo = stats.dishes - stats.dishesWithVideo;
  const publicUrl = `${PUBLIC_MENU_BASE_URL}/r/${stats.restaurantSlug}`;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Resumen de <strong>{stats.restaurantName}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard icon={LayoutGrid} label="Categorías" value={stats.categories} />
        <StatCard icon={UtensilsCrossed} label="Platos" value={stats.dishes} />
        <StatCard
          icon={Video}
          label="Platos con video"
          value={stats.dishesWithVideo}
          hint={
            stats.dishes > 0
              ? `${Math.round((stats.dishesWithVideo / stats.dishes) * 100)}% de la carta`
              : undefined
          }
        />
        <StatCard icon={QrCode} label="Mesas con QR" value={stats.tables} />
      </div>

      {dishesWithoutVideo > 0 && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {dishesWithoutVideo} {dishesWithoutVideo === 1 ? 'plato' : 'platos'} sin video
            </p>
            <p className="mt-0.5 text-amber-800">
              El video es lo que diferencia tu carta.{' '}
              <Link to="/menu" className="font-medium underline">
                Añádelos desde Mi Carta
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Tu carta pública</h2>
        <p className="mt-1 text-sm text-slate-500">
          Es lo que ven tus clientes al escanear el QR.
        </p>
        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          {publicUrl}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
