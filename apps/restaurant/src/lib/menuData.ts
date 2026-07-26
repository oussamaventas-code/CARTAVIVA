import { supabase } from '@carta/database';

export interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
}

export interface MenuDish {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  videoUrl: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  dishes: MenuDish[];
}

function localizedName(translations: unknown, fallback: string): string {
  const es = (translations as { es?: { name?: string } } | null)?.es;
  return es?.name ?? fallback;
}

export async function fetchRestaurantBySlug(slug: string): Promise<RestaurantInfo | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, slug')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchMenu(restaurantId: string): Promise<MenuCategory[]> {
  const [{ data: categories, error: categoriesError }, { data: dishes, error: dishesError }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, slug, translations')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('dishes')
      .select('id, category_id, slug, price, translations, videos(id, url)')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ]);

  if (categoriesError) throw categoriesError;
  if (dishesError) throw dishesError;

  const dishesByCategory = new Map<string, MenuDish[]>();
  for (const row of dishes ?? []) {
    const videos = row.videos as { id: string; url: string }[] | null;
    const dish: MenuDish = {
      id: row.id,
      categoryId: row.category_id,
      name: localizedName(row.translations, row.slug),
      price: Number(row.price),
      videoUrl: videos?.[0]?.url ?? '',
    };
    const list = dishesByCategory.get(row.category_id) ?? [];
    list.push(dish);
    dishesByCategory.set(row.category_id, list);
  }

  return (categories ?? [])
    .map((c) => ({
      id: c.id,
      name: localizedName(c.translations, c.slug),
      dishes: dishesByCategory.get(c.id) ?? [],
    }))
    .filter((c) => c.dishes.length > 0);
}
