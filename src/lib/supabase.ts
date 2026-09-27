import { createClient } from '@supabase/supabase-js';

// Hanya NEXT_PUBLIC_* yang dipakai. Jangan tambahkan fallback VITE_* di
// sini: Next.js hanya meng-inline process.env.NEXT_PUBLIC_* ke bundel
// browser, jadi process.env.VITE_* bernilai undefined di client component
// tapi terbaca di server (app/layout.tsx). Akibatnya server yang bisa
// ambil data dari DB sementara semua client component dapat supabase
// null — gejalanya metadata terisi tapi halaman kosong, dan penyebabnya
// sulit dilacak.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Only create client if env vars are present
const isConfigured = supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url';

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = isConfigured;
