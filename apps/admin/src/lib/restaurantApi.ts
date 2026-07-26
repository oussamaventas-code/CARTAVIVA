import { supabase, DEMO_RESTAURANT_ID } from '@carta/database';
import { PUBLIC_MENU_BASE_URL } from './config';

export interface RestaurantSettings {
  id: string;
  name: string;
  slug: string;
}

export async function fetchRestaurant(): Promise<RestaurantSettings> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, slug')
    .eq('id', DEMO_RESTAURANT_ID)
    .single();

  if (error) throw error;
  return data;
}

export async function updateRestaurant(input: { name: string; slug: string }): Promise<RestaurantSettings> {
  const { data, error } = await supabase
    .from('restaurants')
    .update({ name: input.name, slug: input.slug })
    .eq('id', DEMO_RESTAURANT_ID)
    .select('id, name, slug')
    .single();

  if (error) throw error;

  // Los QR guardan la URL completa con el slug dentro. Si cambia el slug hay que
  // regenerarlas para que las descargas futuras apunten bien. Los QR ya IMPRESOS
  // seguirán apuntando a la URL vieja — de ahí el aviso en la interfaz.
  const { data: qrCodes } = await supabase
    .from('qr_codes')
    .select('id, url')
    .eq('restaurant_id', DEMO_RESTAURANT_ID);

  await Promise.all(
    (qrCodes ?? []).map((qr) => {
      const tableSlug = qr.url.split('/').pop() ?? '';
      const newUrl = `${PUBLIC_MENU_BASE_URL}/r/${input.slug}/${tableSlug}`;
      return supabase.from('qr_codes').update({ url: newUrl }).eq('id', qr.id);
    })
  );

  return data;
}
