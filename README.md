# KnowRise Portfolio

Portfolio pribadi Rifaa, dibangun dengan Next.js (App Router) + Supabase
sebagai backend dan CMS. Seluruh konten dikelola dari panel admin
(`/admin`), jadi tidak perlu deploy ulang untuk mengubah isi situs.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **React 19**
- **Supabase** — Postgres + Auth + Storage
- **Tailwind CSS v4** — token warna lewat CSS variable, ada mode dark/light
- **marked** — render Markdown untuk bio dan isi artikel

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env   # lalu isi dengan kredensial Supabase kamu
npm run dev
```

Variabel yang dibutuhkan:

| Variabel                        | Keterangan                         |
| ------------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL project Supabase               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (publik, aman di browser) |

Kalau `.env` tidak diisi, aplikasi tetap jalan dengan data fallback statis
dan panel admin akan mengarahkan ke `/login`.

## Perintah

| Perintah                                | Fungsi                                                   |
| --------------------------------------- | -------------------------------------------------------- |
| `npm run dev`                           | Dev server                                               |
| `npm run build`                         | Production build                                         |
| `npm start`                             | Jalankan hasil build                                     |
| `npm run lint`                          | ESLint                                                   |
| `npx tsc --noEmit -p tsconfig.app.json` | Type check                                               |
| `npm run db:validate`                   | Validasi SQL migration (`supabase db lint`)              |
| `npm run db:migrate`                    | Terapkan migration yang belum jalan (`supabase db push`) |
| `npm run db:status`                     | Lihat migration mana yang sudah terpasang                |
| `npm run db:diff`                       | Deteksi drift: bandingkan DB live dengan migration       |

## Setup database

Skema Postgres dikelola dengan **Supabase CLI**. Sumber kebenaran ada di
`supabase/migrations/`. Tidak ada lagi SQL yang perlu ditempel di Supabase
SQL Editor.

Runtime aplikasi tetap memakai `@supabase/supabase-js` dengan anon key, jadi
semua policy RLS tetap ditegakkan di database. CLI di repo ini hanya untuk
skema dan migration, bukan untuk query runtime.

### Tabel

Terdapat 12 tabel konten + 1 tabel `admins`. Tabel `admins` tidak pernah
diakses kode aplikasi; hanya dibaca `is_admin()` lewat `SECURITY DEFINER`.

### Prasyarat

`.env` (lihat `.env.example`) harus memuat:

```
SUPABASE_PROJECT_ID=...
SUPABASE_ACCESS_TOKEN=...
SUPABASE_DB_PASSWORD=...
```

- `SUPABASE_ACCESS_TOKEN`: **Account Preferences** (avatar kanan atas) → Access Tokens.
- `SUPABASE_DB_PASSWORD`: **Settings → Database**, bukan password login Supabase.

URL koneksi Postgres tidak ditulis manual di `.env`. `scripts/db-url.sh`
membangunnya dari `SUPABASE_DB_PASSWORD` lalu mengekspor `PGURL`, dengan
password di-URL-encode. Jangan bikin `DIRECT_URL` sendiri: karakter seperti
`#`, `@`, `/`, dan `%` merusak URL kalau ditulis mentah, dan `#` bikin
password terpotong sehingga koneksi gagal dengan pesan yang menyesatkan.

```bash
source scripts/db-url.sh
psql "$PGURL" -f database/verify_schema.sql
```

`scripts/db-url.sh` memakai session pooler port `5432`. DDL (`CREATE TABLE`,
`ALTER TABLE`, `CREATE POLICY`) tidak bisa jalan di transaction pooler. Kalau
proyek dipindah ke region lain, set `SUPABASE_DB_REGION` di `.env`.

### Menghubungkan dan menerapkan migration

Sekali saja:

```bash
npx supabase link --project-ref $SUPABASE_PROJECT_ID
```

Lalu setiap kali ada perubahan:

```bash
npx supabase migration new nama_perubahan   # buat file migration baru
# ... edit file itu ...
npm run db:migrate                          # dry-run dulu dengan --dry-run
```

Untuk mencoba dari nol di mesin lokal (butuh Docker):

```bash
npx supabase start          # container lokal
npx supabase db reset       # jalankan ULANG semua migration dari nol
npx supabase stop
```

`db reset` adalah cara paling murah untuk membuktikan migration benar-benar
bisa di-replay, sebelum menyentuh produksi.

### Mendaftarkan admin

Tabel `admins` sengaja **tidak** di-seed oleh migration, supaya tidak ada
email di dalam repo publik. Isi sekali, setelah `npm run db:migrate`:

1. Buka Supabase → Dashboard → **Table Editor** → `public` → `admins`
2. Insert row, isi kolom `email` dengan email login admin
3. Email harus persis sama dengan yang terdaftar di
   **Authentication → Users** (case-sensitive)

Alternatifnya lewat psql, dengan `ADMIN_EMAIL` diisi di `.env`:

```bash
source scripts/db-url.sh
psql "$PGURL" -v ON_ERROR_STOP=1 -v ae="$ADMIN_EMAIL" <<'SQL'
INSERT INTO public.admins (email) VALUES (:'ae') ON CONFLICT (email) DO NOTHING;
SQL
```

Kalau tabel `admins` kosong, `is_admin()` selalu mengembalikan `false`:
panel admin masih bisa login, tapi semua operasi tulis ditolak
`42501 permission denied`.

### Menambah tabel atau kolom baru

Tidak ada generator skema. Skema ditulis manual sebagai migration SQL baru:

```bash
npx supabase migration new tambah_tabel_x
# edit supabase/migrations/<timestamp>_tambah_tabel_x.sql
npx supabase db push --dry-run   # lihat dulu apa yang akan terjadi
npm run db:migrate
```

### Deteksi drift

`supabase db diff` membandingkan DB live dengan hasil replay migration.
Output kosong berarti produksi identik dengan apa yang tertulis di repo:

```bash
npm run db:diff
```

Kalau tidak kosong, output itu adalah SQL yang akan menjadikannya sama
lagi. Jalankan sebagai migration baru — jangan mengedit migration yang
sudah pernah terpasang, karena `supabase_migrations` sudah mencatat
timestamp-nya.

### Verifikasi

`database/verify_schema.sql` adalah diagnostik **read-only** yang
membandingkan DB live dengan kode aplikasi. Setiap blok punya catatan
`-- HARAPAN` yang menyatakan hasil yang dianggap benar.

```bash
npm run db:verify
```

Setara manualnya:

```bash
source scripts/db-url.sh
psql "$PGURL" -v ON_ERROR_STOP=1 -f database/verify_schema.sql
```

Bisa juga ditempel per blok di Supabase SQL Editor.

### Catatan penting soal `GRANT`

Blok `Grants` di `supabase/migrations/20260927130311_init.sql` bukan
pelengkap. Setup SQL lama sama sekali tidak menulis `GRANT` dan tetap jalan
karena Supabase memasang `ALTER DEFAULT PRIVILEGES` untuk role `postgres` di
schema `public`. Default privileges itu tersimpan di `pg_default_acl` yang
terikat **per schema**, jadi `DROP SCHEMA public CASCADE` ikut menghapusnya.

Tanpa blok tersebut, setiap query PostgREST berakhir dengan
`permission denied for table` dan situs tampil kosong.

### Dua jebakan yang sudah pernah menimpa

1. **`anon` tidak boleh bisa membaca `admins`.** `GRANT SELECT ON ALL TABLES`
   ikut menyentuh tabel itu. RLS tanpa policy sebenarnya sudah menutupi,
   tapi grant-nya dicabut eksplisit — begitu ada satu policy yang salah
   tempat, daftar email admin jadi publik.

2. **storage-api menyuntik policy sendiri saat bucket dibuat.**
   `INSERT INTO storage.buckets` memicu storage-api membuat policy default
   berawalan nama bucket yang hanya mengecek `bucket_id` dan
   `auth.role() = 'authenticated'` — tanpa `is_admin()`. Akibatnya siapa pun
   yang punya akun login bisa meng-upload dan menghapus file. Karena policy
   RLS bersifat permissive (OR), policy permisif itu menang meski policy
   admin sudah ada. Diperbaiki di `20260927133815_lock_storage_policies.sql`.

Kalau muncul policy storage baru yang tidak menyebut `is_admin()`, itu
storage-api menyuntiknya lagi.

## Layout

```
app/            Route Next.js (App Router)
  admin/        Panel CMS — dilindungi client-side oleh AdminSidebar
  blog/[slug]/  Artikel, dilindungi menu guard
src/
  components/   Komponen UI bersama
  lib/          Klien Supabase, settings, storage, helper sort order
  views/        Halaman publik yang dirender client-side
  types/        Interface TypeScript per tabel
supabase/
  config.toml            Konfigurasi lokal Supabase CLI
  migrations/            Sumber kebenaran skema, diterapkan dengan db push
database/
  verify_schema.sql      Diagnostik read-only: cek kesesuaian DB vs kode
backups/              Dump data pra-migration (gitignored, jangan di-commit)
```

## Catatan keamanan

- Tabel dilindungi RLS. Penulisan hanya bisa dilakukan oleh akun yang
  email-nya terdaftar di `public.admins`, dicocokkan lewat claim `email`
  pada JWT oleh fungsi `is_admin()`.
- **Email admin tidak pernah ditulis di dalam repo.** Tabel `admins` dibuat
  migration tapi tidak di-seed, jadi isinya ditambahkan manual dari
  Supabase Dashboard.
- `is_admin()` memakai `SECURITY DEFINER` supaya bisa membaca
  `public.admins` yang RLS-nya aktif tanpa policy. Tabel itu tidak punya
  grant apa pun untuk `anon` maupun `authenticated`, jadi daftar email
  admin mustahil dibaca lewat PostgREST.
- Jangan pernah memindahkan pengecekan admin ke `user_metadata`. Field itu
  bisa diubah sendiri oleh user yang login lewat
  `supabase.auth.updateUser()`, jadi siapa pun bisa elevating dirinya jadi
  admin hanya dengan mengedit profil.
- **Matikan "Allow new users to sign up"** di Supabase → Authentication →
  Providers → Email. Jangan sampai "Allow email/password sign in" ikut
  dimatikan, itu cara kamu login.
- Anon key memang dirancang publik dan dikirim ke browser; itu aman selama
  RLS benar. Jaga agar `service_role` key tidak pernah masuk ke kode
  client.
- `next.config.mjs` hanya mengizinkan image dari Supabase Storage dan
  `raw.githubusercontent.com`. Gambar dari luar harus diunggah lewat
  FileUploader, bukan ditempel URL-nya.
- `backups/` berisi dump data termasuk `contact_messages`, jadi sudah
  masuk `.gitignore`. Jangan pernah di-commit.

## Deployment

Deploy lewat Vercel: repo ini connect ke project Vercel, setiap push ke `main`
memicu build ulang. Domain kustom diatur di dashboard Vercel, bukan lewat file
di repo.

### Environment variable di Vercel

Hanya dua, dan keduanya wajib:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Itu saja. `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID`,
dan `ADMIN_EMAIL` **jangan** diisi di Vercel — tidak ada satu pun kode yang
membacanya, jadi menambahkannya hanya memperbesar permukaan serang tanpa
menambah fungsi. build juga tidak menjalankan migration, karena tidak ada hook
`prebuild`/`postinstall`.

Dua hal yang mudah salah di sini:

1. **`NEXT_PUBLIC_*` di-inline saat build.** Menambah atau mengubahnya di
   dashboard Vercel wajib deploy ulang. Restart container tidak mengubah
   bundel yang sudah ter-build.
2. **Env yang salah tidak bikin situs crash, tapi bikin basi.** `src/lib/supabase.ts`
   mengembalikan `null` kalau env kosong, dan semua konsumen sudah punya
   fallback: `getSettings()` memakai `DEFAULT_SETTINGS` (semua menu terlihat),
   `app/layout.tsx` memakai nama/tagline hardcode plus `FALLBACK_PHOTO`. Gejalanya
   situs terlihat normal tapi tidak pernah berubah setelah diedit dari panel
   admin. Kalau itu terjadi, cek env Vercel dulu sebelum menuduh bug.

Soal `service_role`: kode ini memang tidak pernah memakainya. Operasi tulis
lewat API Read membawa JWT user, jadi `is_admin()` yang menentukan, bukan
service role. Karena itu tidak ada variabel server-side yang perlu disimpan
di Vercel.

### GitHub Pages

Situs ini **tidak** memakai GitHub Pages. Pages sudah dinonaktifkan di
Settings → Pages (Source = None), jadi tab Actions tidak lagi menampilkan
`pages build and deployment`.

Kalau tab Actions masih menampilkan run `pages-build-deployment` terakhir,
itu riwayat run lama, bukan workflow yang sedang jalan.

Branch `gh-pages` sendiri masih ada di remote karena penghapusannya
gagal (shell non-interaktif tidak punya SSH key). Hapus manual:

```bash
git push origin --delete gh-pages
```

Workflow `.github/workflows/keep-alive.yml` menjalankan ping harian ke domain
untuk mencegah Supabase project di-suspend, dan melakukan commit otomatis ke
`docs/keepalive.log` kalau repository sudah lebih dari 30 hari tanpa commit
(non-aktif = Massively Ignoring Inactivity di GitHub).
 