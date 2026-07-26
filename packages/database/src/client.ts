import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// These should be provided by Vite env vars
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
