import { supabase, DEMO_RESTAURANT_ID } from '@carta/database';
import { slugify } from '@carta/utils';
import type { Category } from '../components/menu/types';
import type { Dish } from '../components/menu/types';
import type { ParsedCategory } from './menuOcr';

function categoryName(translations: unknown, fallback: string): string {
  const es = (translations as { es?: { name?: string } } | null)?.es;
  return es?.name ?? fallback;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, translations')
    .eq('restaurant_id', DEMO_RESTAURANT_ID)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: categoryName(row.translations, row.slug),
  }));
}

export async function fetchDishes(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('id, category_id, slug, price, translations, videos(id, url)')
    .eq('restaurant_id', DEMO_RESTAURANT_ID)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const videos = row.videos as { id: string; url: string }[] | null;
    return {
      id: row.id,
      categoryId: row.category_id,
      name: categoryName(row.translations, row.slug),
      price: Number(row.price),
      videoUrl: videos?.[0]?.url ?? '',
    };
  });
}

export async function createCategory(name: string): Promise<Category> {
  const { data: existing, error: fetchError } = await supabase
    .from('categories')
    .select('sort_order')
    .eq('restaurant_id', DEMO_RESTAURANT_ID)
    .order('sort_order', { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('categories')
    .insert({
      restaurant_id: DEMO_RESTAURANT_ID,
      slug: `${slugify(name) || 'categoria'}-${crypto.randomUUID().slice(0, 8)}`,
      sort_order: (existing?.[0]?.sort_order ?? -1) + 1,
      translations: { es: { name } },
    })
    .select('id, slug, translations')
    .single();

  if (error) throw error;

  return { id: data.id, name: categoryName(data.translations, data.slug) };
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({ translations: { es: { name } } })
    .eq('id', id)
    .select('id, slug, translations')
    .single();

  if (error) throw error;

  return { id: data.id, name: categoryName(data.translations, data.slug) };
}

export async function deleteCategory(id: string): Promise<void> {
  // Los platos de la categoría se borran en cascada, pero sus videos solo quedan
  // con dish_id a NULL — hay que limpiarlos a mano para no dejar basura en Storage.
  const { data: dishesInCategory } = await supabase
    .from('dishes')
    .select('id')
    .eq('category_id', id);

  const dishIds = (dishesInCategory ?? []).map((d) => d.id);

  let videoRows: { id: string; url: string }[] = [];
  if (dishIds.length > 0) {
    const { data } = await supabase.from('videos').select('id, url').in('dish_id', dishIds);
    videoRows = data ?? [];
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;

  if (videoRows.length > 0) {
    await supabase.from('videos').delete().in('id', videoRows.map((v) => v.id));

    const paths = videoRows
      .map((v) => storagePathFromPublicUrl(v.url))
      .filter((p): p is string => p !== null);
    if (paths.length > 0) {
      await supabase.storage.from('dish-videos').remove(paths);
    }
  }
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('categories').update({ sort_order: index }).eq('id', id)
    )
  );
}

function storagePathFromPublicUrl(url: string): string | null {
  const marker = '/dish-videos/';
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}

async function uploadDishVideo(dishId: string, file: File): Promise<string> {
  const extension = file.name.split('.').pop() || 'mp4';
  const path = `${DEMO_RESTAURANT_ID}/${dishId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('dish-videos')
    .upload(path, file, { contentType: file.type });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('dish-videos').getPublicUrl(path);
  return data.publicUrl;
}

async function replaceDishVideo(dishId: string, file: File): Promise<string> {
  const { data: existing } = await supabase
    .from('videos')
    .select('id, url')
    .eq('dish_id', dishId);

  const url = await uploadDishVideo(dishId, file);

  await supabase.from('videos').insert({
    restaurant_id: DEMO_RESTAURANT_ID,
    dish_id: dishId,
    url,
    mime_type: file.type,
  });

  if (existing && existing.length > 0) {
    await supabase
      .from('videos')
      .delete()
      .in('id', existing.map((v) => v.id));

    const paths = existing
      .map((v) => storagePathFromPublicUrl(v.url))
      .filter((p): p is string => p !== null);
    if (paths.length > 0) {
      await supabase.storage.from('dish-videos').remove(paths);
    }
  }

  return url;
}

export async function createDish(input: {
  categoryId: string;
  name: string;
  price: number;
  videoFile: File;
}): Promise<Dish> {
  const { data: dish, error } = await supabase
    .from('dishes')
    .insert({
      restaurant_id: DEMO_RESTAURANT_ID,
      category_id: input.categoryId,
      slug: `${slugify(input.name)}-${crypto.randomUUID().slice(0, 8)}`,
      price: input.price,
      translations: { es: { name: input.name } },
    })
    .select('id, category_id, slug, price, translations')
    .single();

  if (error) throw error;

  const videoUrl = await uploadDishVideo(dish.id, input.videoFile);
  await supabase.from('videos').insert({
    restaurant_id: DEMO_RESTAURANT_ID,
    dish_id: dish.id,
    url: videoUrl,
    mime_type: input.videoFile.type,
  });

  return {
    id: dish.id,
    categoryId: dish.category_id,
    name: categoryName(dish.translations, dish.slug),
    price: Number(dish.price),
    videoUrl,
  };
}

export async function updateDish(input: {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  videoFile: File | null;
  currentVideoUrl: string;
}): Promise<Dish> {
  const { error } = await supabase
    .from('dishes')
    .update({
      price: input.price,
      translations: { es: { name: input.name } },
    })
    .eq('id', input.id);

  if (error) throw error;

  const videoUrl = input.videoFile
    ? await replaceDishVideo(input.id, input.videoFile)
    : input.currentVideoUrl;

  return {
    id: input.id,
    categoryId: input.categoryId,
    name: input.name,
    price: input.price,
    videoUrl,
  };
}

export interface ImportSummary {
  categories: { name: string; dishCount: number }[];
  dishesCreated: number;
}

export async function bulkImportMenu(parsedCategories: ParsedCategory[]): Promise<ImportSummary> {
  const { data: existingCategories, error: fetchError } = await supabase
    .from('categories')
    .select('id, slug, sort_order, translations')
    .eq('restaurant_id', DEMO_RESTAURANT_ID);

  if (fetchError) throw fetchError;

  let nextSortOrder = (existingCategories ?? []).reduce((max, c) => Math.max(max, c.sort_order), -1) + 1;

  const summary: ImportSummary = { categories: [], dishesCreated: 0 };

  for (const parsedCategory of parsedCategories) {
    const targetSlug = slugify(parsedCategory.name);
    let categoryId = (existingCategories ?? []).find((c) => c.slug === targetSlug)?.id;

    if (!categoryId) {
      const { data: newCategory, error: categoryError } = await supabase
        .from('categories')
        .insert({
          restaurant_id: DEMO_RESTAURANT_ID,
          slug: targetSlug || crypto.randomUUID().slice(0, 8),
          sort_order: nextSortOrder,
          translations: { es: { name: parsedCategory.name } },
        })
        .select('id')
        .single();

      if (categoryError) throw categoryError;
      categoryId = newCategory.id;
      nextSortOrder += 1;
    }

    const dishRows = parsedCategory.dishes.map((dish) => ({
      restaurant_id: DEMO_RESTAURANT_ID,
      category_id: categoryId as string,
      slug: `${slugify(dish.name) || crypto.randomUUID().slice(0, 8)}-${crypto.randomUUID().slice(0, 8)}`,
      price: dish.price,
      translations: { es: { name: dish.name } },
    }));

    if (dishRows.length > 0) {
      const { error: dishError } = await supabase.from('dishes').insert(dishRows);
      if (dishError) throw dishError;
    }

    summary.categories.push({ name: parsedCategory.name, dishCount: dishRows.length });
    summary.dishesCreated += dishRows.length;
  }

  return summary;
}

export async function deleteDish(id: string): Promise<void> {
  const { data: videos } = await supabase.from('videos').select('url').eq('dish_id', id);

  const { error } = await supabase.from('dishes').delete().eq('id', id);
  if (error) throw error;

  const paths = (videos ?? [])
    .map((v) => storagePathFromPublicUrl(v.url))
    .filter((p): p is string => p !== null);
  if (paths.length > 0) {
    await supabase.storage.from('dish-videos').remove(paths);
  }
}
