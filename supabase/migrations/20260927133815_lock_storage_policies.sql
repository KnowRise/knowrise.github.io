-- Kunci ulang policy bucket media: hanya admin yang boleh mutate
--
-- MASALAH YANG DIPERBAIKI
--
-- Bucket `media` dibuat di 20260927130311_init.sql lewat
-- `INSERT INTO storage.buckets`. storage-api Supabase bereaksi atas pembuatan
-- bucket itu dan otomatis menyuntikkan policy default miliknya sendiri dengan
-- nama berawalan bucket:
--
--   media authenticated select / insert / update / delete
--   media admin         insert / update / delete
--
-- Policy-policy itu HANYA mengecek `bucket_id = 'media'` (dan
-- `auth.role() = 'authenticated'` untuk varian "admin"). Tidak ada satu pun
-- yang memanggil public.is_admin(). Akibatnya setiap user yang punya akun
-- login, tanpa perlu admin, bisa:
--
--   - meng-upload file ke bucket media
--   - menimpa file yang sudah ada (mis. foto profil, cover blog, CV)
--   - MENGHAPUS file milik orang lain
--
-- Nama "media admin *" menyesatkan: role-nya `{public}` dan ekspresinya cuma
-- `auth.role() = 'authenticated'`, yang true untuk semua user login, bukan
-- hanya admin.
--
-- Policy yang benar sudah dibuat di init ("Admins can ..." + is_admin()) dan
-- TIDAK ikut dihapus di sini, tapi menumpuknya dengan policy permisif di atas
-- berarti policy permisif yang menang, karena policy RLS bersifat permissive
-- (OR).
--
-- Yang dilakukan file ini:
--   1. Buang seluruh policy storage.objects yang bukan admin-gated
--   2. Pasang ulang 4 policy admin-gated (idempoten: drop dulu, baru create)
--
-- Menghapus policy di sini BUKAN sekadar bersih-bersih. Ini yang menutup
-- celah upload/hapus file tanpa hak akses.
--
-- Catatan: untuk membaca file, bucket `media` ber-public=true, jadi URL
-- publik tetap bisa diakses tanpa policy SELECT. Policy SELECT di bawah
-- hanya mengatur listing/peek dari panel admin, jadi tidak memutus
-- FileUploader.

-- Buang policy auto-generate storage-api.
DROP POLICY IF EXISTS "media authenticated select" ON storage.objects;
DROP POLICY IF EXISTS "media authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "media authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "media authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "media admin select" ON storage.objects;
DROP POLICY IF EXISTS "media admin insert" ON storage.objects;
DROP POLICY IF EXISTS "media admin update" ON storage.objects;
DROP POLICY IF EXISTS "media admin delete" ON storage.objects;

-- Buang juga nama default lain yang mungkin(storage-api / Dashboard lama)
-- pernah dibuat, supaya file ini aman dipakai di environment mana pun.
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update to bucket media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from bucket media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to bucket media" ON storage.objects;
DROP POLICY IF EXISTS "media public select" ON storage.objects;
DROP POLICY IF EXISTS "media public insert" ON storage.objects;
DROP POLICY IF EXISTS "media public update" ON storage.objects;
DROP POLICY IF EXISTS "media public delete" ON storage.objects;

-- Pasang ulang empat policy yang benar (dari init), secara eksplisit supaya
-- file ini berdiri sendiri dan tidak bergantung pada urutan.
DROP POLICY IF EXISTS "Admins can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read storage files" ON storage.objects;

CREATE POLICY "Admins can upload files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can update files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can delete files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can read storage files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

-- Verifikasi: policy storage.objects untuk bucket media harus CUMA 4,
-- semuanya memakai is_admin(). Kalau muncul policy tanpa is_admin(),
-- storage-api menyuntik policy lagi dan file ini perlu diulang.
--
--   SELECT policyname, cmd, roles::text,
--          coalesce(qual,'') || coalesce(with_check,'') AS expr
--   FROM pg_policies
--   WHERE schemaname = 'storage'
--   ORDER BY policyname;
