import { supabase } from './supabase';
import type { MenuKey, Settings } from '../types';

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
  // Migrasi kunci lama 'work' -> 'projects' (DB masih menyimpan preferensi versi lama)
  const migrated: Record<string, boolean> = {};
  if ('work' in rawVis) {
    migrated.projects = rawVis.work;
    migrated.work = true;
  }
  const visibility = {
    ...ALL_VISIBLE,
    ...migrated,
    ...rawVis,
  } as Record<MenuKey, boolean>;
  return {
    ...DEFAULT_SETTINGS,
    ...(raw || {}),
    menu_visibility: visibility,
  };
}

export async function getSettings(): Promise<Settings['data']> {
  if (!supabase) return DEFAULT_SETTINGS;
  try {
    const { data } = await supabase.from('settings').select('data').single();
    return mergeSettings(data?.data);
  } catch {
    return DEFAULT_SETTINGS;
  }
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