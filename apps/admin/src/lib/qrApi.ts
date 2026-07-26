import { supabase, DEMO_RESTAURANT_ID } from '@carta/database';
import { slugify } from '@carta/utils';
import type { RestaurantTable } from '../components/qr/types';
import { PUBLIC_MENU_BASE_URL } from './config';

interface TableRow {
  id: string;
  number: number;
  label: string | null;
}

function tableName(table: TableRow): string {
  return table.label ?? `Mesa ${table.number}`;
}

export async function fetchTables(): Promise<RestaurantTable[]> {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('id, url, table:tables(id, number, label)')
    .eq('restaurant_id', DEMO_RESTAURANT_ID)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? [])
    .filter((row): row is typeof row & { table: TableRow } => row.table !== null)
    .map((row) => ({
      id: row.table.id,
      qrCodeId: row.id,
      name: tableName(row.table),
      url: row.url,
    }));
}

export async function createTable(name: string): Promise<RestaurantTable> {
  const { data: existing, error: fetchError } = await supabase
    .from('tables')
    .select('number')
    .eq('restaurant_id', DEMO_RESTAURANT_ID)
    .order('number', { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const nextNumber = (existing?.[0]?.number ?? 0) + 1;

  const { data: table, error: tableError } = await supabase
    .from('tables')
    .insert({ restaurant_id: DEMO_RESTAURANT_ID, number: nextNumber, label: name })
    .select('id, number, label')
    .single();

  if (tableError) throw tableError;

  const { data: restaurant, error: restaurantError } = await supabase
    .from('restaurants')
    .select('slug')
    .eq('id', DEMO_RESTAURANT_ID)
    .single();

  if (restaurantError) throw restaurantError;

  const slug = slugify(name) || crypto.randomUUID().slice(0, 8);
  const url = `${PUBLIC_MENU_BASE_URL}/r/${restaurant.slug}/${slug}`;

  const { data: qrCode, error: qrError } = await supabase
    .from('qr_codes')
    .insert({ restaurant_id: DEMO_RESTAURANT_ID, table_id: table.id, url })
    .select('id, url')
    .single();

  if (qrError) throw qrError;

  return { id: table.id, qrCodeId: qrCode.id, name: tableName(table), url: qrCode.url };
}

export async function deleteTable(table: RestaurantTable): Promise<void> {
  const { error: qrError } = await supabase.from('qr_codes').delete().eq('id', table.qrCodeId);
  if (qrError) throw qrError;

  const { error: tableError } = await supabase.from('tables').delete().eq('id', table.id);
  if (tableError) throw tableError;
}
