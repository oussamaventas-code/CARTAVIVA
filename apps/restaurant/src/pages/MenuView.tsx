import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Loader2, UtensilsCrossed } from 'lucide-react';
import { fetchRestaurantBySlug, fetchMenu } from '../lib/menuData';
import type { MenuCategory, RestaurantInfo } from '../lib/menuData';
import { getErrorMessage } from '../lib/errors';
import { DishCard } from '../components/DishCard';

export default function MenuView() {
  const { restaurantSlug } = useParams<{ restaurantSlug: string; tableSlug?: string }>();
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    (async () => {
      if (!restaurantSlug) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const restaurantData = await fetchRestaurantBySlug(restaurantSlug);
        if (!restaurantData) {
          setNotFound(true);
          return;
        }
        setRestaurant(restaurantData);

        const menu = await fetchMenu(restaurantData.id);
        setCategories(menu);
        setActiveCategoryId(menu[0]?.id ?? null);
      } catch (err) {
        setError(getErrorMessage(err, 'No se pudo cargar la carta.'));
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantSlug]);

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (notFound || error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white p-8 text-center">
        <UtensilsCrossed className="h-10 w-10 text-slate-300" />
        <p className="font-medium text-slate-700">
          {error ?? 'No hemos encontrado esta carta.'}
        </p>
        <p className="text-sm text-slate-400">Comprueba que el código QR sea correcto.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
        <h1 className="text-lg font-bold text-slate-900">{restaurant?.name}</h1>

        {categories.length > 0 && (
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeCategoryId === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-lg space-y-10 px-5 py-6">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <UtensilsCrossed className="h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-500">Esta carta todavía no tiene platos publicados.</p>
          </div>
        ) : (
          categories.map((category) => (
            <section
              key={category.id}
              ref={(el) => {
                sectionRefs.current[category.id] = el;
              }}
            >
              <h2 className="mb-3 text-base font-semibold text-slate-900">{category.name}</h2>
              <div className="space-y-4">
                {category.dishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/90 py-2 text-center text-xs text-slate-400 backdrop-blur">
        Creado con CartaViva
      </footer>
    </div>
  );
}
