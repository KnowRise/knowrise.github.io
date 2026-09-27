import { supabase } from './supabase';
import type { MenuKey, MenuVisibility, Settings } from '../types';

export const MENU_KEYS: MenuKey[] = [
  'home',
  'experience',
  'projects',
  'skills',
  'blog',
  'hki',
  'publikasi',
  'sertifikasi',
  'contact',
];

const ALL_VISIBLE = MENU_KEYS.reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<MenuKey, boolean>);

export const DEFAULT_SETTINGS: Settings['data'] = {
  menu_visibility: ALL_VISIBLE,
};

function mergeSettings(raw?: Settings['data'] | null): Settings['data'] {
  const rawVis = (raw?.menu_visibility as Record<string, boolean> | undefined) || {};
  // 'work' -> 'projects' (DB masih menyimpan preferensi versi lama).
  // Hanya dipakai kalau 'projects' belum pernah ada, supaya preferensi
  // 'projects' yang sudah disimpan admin tidak tertimpa nilai lama.
  const { work: legacyWork, ...rest } = rawVis;
  const migrated: Record<string, boolean> = {};
  if (typeof legacyWork === 'boolean' && !('projects' in rest)) {
    migrated.projects = legacyWork;
  }
  // 'work' sengaja dibuang di sini, bukan dimasukkan ke hasil merge,
  // supaya tidak ikut ter-upsert balik ke DB setiap kali setting disimpan.
  const visibility = {
    ...ALL_VISIBLE,
    ...migrated,
    ...rest,
  } as MenuVisibility;
  return {
    ...DEFAULT_SETTINGS,
    ...(raw || {}),
    menu_visibility: visibility,
  };
}

export async function getSettings(): Promise<Settings['data']> {
  if (!supabase) return DEFAULT_SETTINGS;
  // maybeSingle() + .eq('id','primary'), bukan .single() polos: baris ini
  // wajib ada, tapi .single() melempar PGRST116 kalau tabel kosong atau
  // isinya dobel, dan supabase-js tidak melempar error (dia resolve di
  // field `error`), jadi try/catch tidak akan menangkap apa pun. Karena
  // itu error-nya harus dicek eksplisit — kalau tidak, kegagalan diam-diam
  // jadi DEFAULT_SETTINGS yang membuat semua menu terlihat.
  const { data, error } = await supabase
    .from('settings')
    .select('data')
    .eq('id', 'primary')
    .maybeSingle();
  if (error) {
    console.error('[settings] gagal memuat settings:', error.message);
    return DEFAULT_SETTINGS;
  }
  if (!data) {
    console.error("[settings] tidak ada baris settings dengan id 'primary'");
    return DEFAULT_SETTINGS;
  }
  return mergeSettings(data.data);
}

export function isMenuVisible(settings: Settings['data'], key: MenuKey): boolean {
  return settings.menu_visibility?.[key] ?? true;
}

export async function updateSettings(patch: Record<string, unknown>): Promise<{ error?: unknown }> {
  if (!supabase) return { error: new Error('Supabase not configured') };
  const current = await getSettings();
  const data = { ...current, ...patch };
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 'primary', data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  return { error };
}

export function menuLabel(key: MenuKey): string {
  switch (key) {
    case 'home': return 'Home';
    case 'experience': return 'Experience';
    case 'projects': return 'Projects';
    case 'skills': return 'Skills';
    case 'blog': return 'Blog';
    case 'hki': return 'HKI';
    case 'publikasi': return 'Publikasi';
    case 'sertifikasi': return 'Sertifikasi';
    case 'contact': return 'Contact';
    default: return key;
  }
}

export function menuLabelFull(key: MenuKey): string {
  switch (key) {
    case 'hki': return 'Hak Kekayaan Intelektual';
    case 'publikasi': return 'Publikasi Ilmiah';
    case 'sertifikasi': return 'Sertifikasi';
    default: return menuLabel(key);
  }
}