import type { SupabaseClient } from '@supabase/supabase-js';

export async function bulkDeleteByIds(
  client: SupabaseClient<any> | null,
  table: string,
  ids: string[]
): Promise<{ error: { message: string } | null }> {
  if (!client || ids.length === 0) return { error: null };

  const CHUNK = 100;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const { error } = await client.from(table).delete().in('id', ids.slice(i, i + CHUNK));
    if (error) return { error };
  }
  return { error: null };
}