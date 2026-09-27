import { supabase } from './supabase';

type SortOrderTable =
  | 'projects'
  | 'hki'
  | 'certifications'
  | 'publications'
  | 'work_experiences'
  | 'education_history'
  | 'skill_categories'
  | 'skills';

/**
 * Mengembalikan sort_order berikutnya untuk sebuah tabel.
 *
 * Query dilakukan terhadap SELURUH baris, bukan hanya baris yang sedang
 * tampil di halaman admin. Sebelumnya admin menghitung MAX dari state
 * lokal yang hanya berisi satu halaman (12 baris), sehingga menambah
 * item dari halaman 2+ bisa menghasilkan sort_order duplikat.
 */
export async function nextSortOrder(
  table: SortOrderTable,
  filters?: Record<string, string>
): Promise<number> {
  if (!supabase) return 1;

  let query = supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  if (filters) {
    for (const [column, value] of Object.entries(filters)) {
      query = query.eq(column, value);
    }
  }

  const { data, error } = await query.maybeSingle();
  if (error) return 1;

  return (data?.sort_order ?? 0) + 1;
}
