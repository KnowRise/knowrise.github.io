-- Normalisasi grant: samakan hak akses produksi dengan yang ditulis migration
--
-- MASALAH
--
-- `DROP SCHEMA public CASCADE` + `CREATE SCHEMA public` membuat Supabase
-- memasang ulang default privilege-nya di schema public, sehingga setiap
-- tabel baru dibuat dengan grant LEBIH LEBAR dari yang dibutuhkan aplikasi:
--
--   anon = arwdDxtm  (INSERT, SELECT, UPDATE, DELETE, TRUNCATE,
--                     REFERENCES, TRIGGER, MAINTAIN)
--
-- Aplikasi ini hanya memakai SELECT / INSERT / UPDATE / DELETE lewat
-- PostgREST. TRUNCATE, REFERENCES, dan TRIGGER tidak pernah dipakai.
--
-- Kebetulan ini BELUM jadi lubang: RLS tetap menyaring baris dan perintah
-- apa pun yang boleh. Tapi RLS adalah satu-satunya penahan, dan
-- least-privilege berarti tabel yang RLS-nya someday tidak sengaja mati
-- tidak langsung terbuka.
--
-- Isi file ini adalah hasil `supabase db diff --linked`, yaitu SQL yang
-- membuat produksi sama persis dengan hasil replay migration. Dipakai
-- supaya `db diff` selanjutnya bersih dan bisa dipakai sebagai detektor drift.
--
-- Tidak ada satupun DROP/TRUNCATE di sini; hanya REVOKE + GRANT.


ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT EXECUTE ON FUNCTIONS TO PUBLIC;

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "service_role";

REVOKE ALL ON SCHEMA "public" FROM PUBLIC;

REVOKE ALL ON SCHEMA "public" FROM "pg_database_owner";

COMMENT ON SCHEMA "public" IS NULL;

REVOKE ALL ON SCHEMA "public" FROM "postgres";

GRANT CREATE, USAGE ON SCHEMA "public" TO "postgres";

REVOKE ALL ON TABLE "public"."admins" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."admins" TO "service_role";

REVOKE ALL ON TABLE "public"."blogs" FROM "anon";

GRANT SELECT ON TABLE "public"."blogs" TO "anon";

REVOKE ALL ON TABLE "public"."blogs" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."blogs" TO "authenticated";

REVOKE ALL ON TABLE "public"."blogs" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."blogs" TO "service_role";

REVOKE ALL ON TABLE "public"."certifications" FROM "anon";

GRANT SELECT ON TABLE "public"."certifications" TO "anon";

REVOKE ALL ON TABLE "public"."certifications" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."certifications" TO "authenticated";

REVOKE ALL ON TABLE "public"."certifications" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."certifications" TO "service_role";

REVOKE ALL ON TABLE "public"."contact_messages" FROM "anon";

GRANT INSERT, SELECT ON TABLE "public"."contact_messages" TO "anon";

REVOKE ALL ON TABLE "public"."contact_messages" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."contact_messages" TO "authenticated";

REVOKE ALL ON TABLE "public"."contact_messages" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."contact_messages" TO "service_role";

REVOKE ALL ON TABLE "public"."education_history" FROM "anon";

GRANT SELECT ON TABLE "public"."education_history" TO "anon";

REVOKE ALL ON TABLE "public"."education_history" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."education_history" TO "authenticated";

REVOKE ALL ON TABLE "public"."education_history" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."education_history" TO "service_role";

REVOKE ALL ON TABLE "public"."hki" FROM "anon";

GRANT SELECT ON TABLE "public"."hki" TO "anon";

REVOKE ALL ON TABLE "public"."hki" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."hki" TO "authenticated";

REVOKE ALL ON TABLE "public"."hki" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."hki" TO "service_role";

REVOKE ALL ON TABLE "public"."profile" FROM "anon";

GRANT SELECT ON TABLE "public"."profile" TO "anon";

REVOKE ALL ON TABLE "public"."profile" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."profile" TO "authenticated";

REVOKE ALL ON TABLE "public"."profile" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."profile" TO "service_role";

REVOKE ALL ON TABLE "public"."projects" FROM "anon";

GRANT SELECT ON TABLE "public"."projects" TO "anon";

REVOKE ALL ON TABLE "public"."projects" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."projects" TO "authenticated";

REVOKE ALL ON TABLE "public"."projects" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."projects" TO "service_role";

REVOKE ALL ON TABLE "public"."publications" FROM "anon";

GRANT SELECT ON TABLE "public"."publications" TO "anon";

REVOKE ALL ON TABLE "public"."publications" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."publications" TO "authenticated";

REVOKE ALL ON TABLE "public"."publications" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."publications" TO "service_role";

REVOKE ALL ON TABLE "public"."settings" FROM "anon";

GRANT SELECT ON TABLE "public"."settings" TO "anon";

REVOKE ALL ON TABLE "public"."settings" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."settings" TO "authenticated";

REVOKE ALL ON TABLE "public"."settings" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."settings" TO "service_role";

REVOKE ALL ON TABLE "public"."skill_categories" FROM "anon";

GRANT SELECT ON TABLE "public"."skill_categories" TO "anon";

REVOKE ALL ON TABLE "public"."skill_categories" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."skill_categories" TO "authenticated";

REVOKE ALL ON TABLE "public"."skill_categories" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."skill_categories" TO "service_role";

REVOKE ALL ON TABLE "public"."skills" FROM "anon";

GRANT SELECT ON TABLE "public"."skills" TO "anon";

REVOKE ALL ON TABLE "public"."skills" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."skills" TO "authenticated";

REVOKE ALL ON TABLE "public"."skills" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."skills" TO "service_role";

REVOKE ALL ON TABLE "public"."work_experiences" FROM "anon";

GRANT SELECT ON TABLE "public"."work_experiences" TO "anon";

REVOKE ALL ON TABLE "public"."work_experiences" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."work_experiences" TO "authenticated";

REVOKE ALL ON TABLE "public"."work_experiences" FROM "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."work_experiences" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT, USAGE ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT, USAGE ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT, USAGE ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO "service_role";

