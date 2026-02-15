import { supabase, Pack } from './supabase';

export async function getPacks(filters?: {
  category?: string;
  sortBy?: 'newest' | 'downloads' | 'rating';
  search?: string;
}) {
  let query = supabase.from('packs').select('*');

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,creator_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.sortBy === 'downloads') {
    query = query.order('download_count', { ascending: false });
  } else if (filters?.sortBy === 'rating') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Pack[];
}

export async function getPackById(id: string) {
  const { data, error } = await supabase
    .from('packs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Pack | null;
}

export async function incrementViewCount(packId: string) {
  const { data: pack } = await supabase
    .from('packs')
    .select('view_count')
    .eq('id', packId)
    .maybeSingle();

  if (pack) {
    await supabase
      .from('packs')
      .update({ view_count: pack.view_count + 1 })
      .eq('id', packId);
  }
}

export async function incrementDownloadCount(packId: string) {
  const { data: pack } = await supabase
    .from('packs')
    .select('download_count')
    .eq('id', packId)
    .maybeSingle();

  if (pack) {
    await supabase
      .from('packs')
      .update({ download_count: pack.download_count + 1 })
      .eq('id', packId);
  }
}

export async function getPackRatings(packId: string) {
  const { data, error } = await supabase
    .from('pack_ratings')
    .select('rating')
    .eq('pack_id', packId);

  if (error) throw error;

  if (!data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
  const average = sum / data.length;

  return { average, count: data.length };
}

export async function submitRating(packId: string, rating: number, userIdentifier: string) {
  const { error } = await supabase
    .from('pack_ratings')
    .upsert({
      pack_id: packId,
      user_identifier: userIdentifier,
      rating: rating,
    });

  if (error) throw error;
}

export function getUserIdentifier(): string {
  let identifier = localStorage.getItem('user_identifier');
  if (!identifier) {
    identifier = crypto.randomUUID();
    localStorage.setItem('user_identifier', identifier);
  }
  return identifier;
}

export async function createPack(pack: Omit<Pack, 'id' | 'view_count' | 'download_count' | 'created_at' | 'updated_at'>, adminToken: string) {
  const { data, error } = await supabase
    .from('packs')
    .insert(pack)
    .select()
    .single();

  if (error) throw error;
  return data as Pack;
}

export async function updatePack(id: string, updates: Partial<Pack>, adminToken: string) {
  const { data, error } = await supabase
    .from('packs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Pack;
}

export async function deletePack(id: string, adminToken: string) {
  const { error } = await supabase
    .from('packs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
