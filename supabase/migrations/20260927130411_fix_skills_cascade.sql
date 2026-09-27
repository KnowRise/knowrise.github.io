-- Restore ON DELETE CASCADE di FK skills.category_id
--
-- Gejalanya: dump schema menunjukkan constraint polos, tanpa clause ON DELETE:
--
--   CONSTRAINT skills_category_id_fkey
--     FOREIGN KEY (category_id) REFERENCES public.skill_categories(id)
--
-- Padahal dump itu tidak konsisten dengan konfigurasi lama yang pernah
-- ada di repo. Migration init sengaja mengikuti dump apa adanya, jadi
-- perbedaan ini ditangani di sini.
--
-- Dampaknya ke aplikasi: hapus kategori skill di panel admin
-- (app/admin/skills/page.tsx, deleteCategory + handleBulkDeleteCategories)
-- ditolak Postgres dengan
--
--   23503 insert or update on table "skills" violates foreign key
--
-- selama kategori itu masih punya skill. Tidak ada data yang hilang, tapi
-- fiturnya tidak bisa dipakai. Hapus skill individual tetap jalan, yang gagal
-- adalah hapus kategori.
--
-- Alasan dipisah jadi migration sendiri: 20260927130311_init.sql sengaja
-- merepresentasikan kondisi tabel apa adanya, lalu perbaikan masuk sebagai
-- perubahan tersendiri supaya jejaknya terbaca di supabase/migrations/.
--
-- Verifikasi (har mengembalikan 'c'):
--
--   SELECT conname, confdeltype
--   FROM pg_constraint
--   WHERE conrelid = 'public.skills'::regclass AND contype = 'f';
--
-- confdeltype: a = NO ACTION, r = RESTRICT, c = CASCADE,
--              n = SET NULL, d = SET DEFAULT

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_category_id_fkey";

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "skill_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
