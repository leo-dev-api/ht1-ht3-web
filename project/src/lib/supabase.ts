import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Pack = {
  id: string;
  name: string;
  creator_name: string;
  version: string;
  description: string;
  category: 'texture_packs' | 'overlays' | 'mods' | 'settings_packs';
  thumbnail_url: string;
  download_url: string;
  screenshots: string[];
  is_featured: boolean;
  view_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminKey = {
  id: string;
  key_value: string;
  created_by: string;
  usage_type: 'single' | 'multi';
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
};

export type PackRating = {
  id: string;
  pack_id: string;
  user_identifier: string;
  rating: number;
  created_at: string;
};
