-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "admins" (
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL DEFAULT 'primary',
    "full_name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "photo_url" TEXT,
    "instagram_url" TEXT,
    "github_url" TEXT,
    "cv_url" TEXT,
    "bio" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experiences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "period" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "company_url" TEXT,

    CONSTRAINT "work_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "period" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "institution_url" TEXT,

    CONSTRAINT "education_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "project_url" TEXT NOT NULL,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "cover_url" TEXT,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skill_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "year" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'journal',
    "index_type" TEXT,
    "doi_url" TEXT,
    "url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hki" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'copyright_creator',
    "registration_number" TEXT,
    "status" TEXT DEFAULT 'terdaftar',
    "holder" TEXT,
    "grant_date" DATE,
    "description" TEXT,
    "document_url" TEXT,
    "url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issue_date" DATE,
    "expiration_date" DATE,
    "credential_id" TEXT,
    "credential_url" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL DEFAULT 'primary',
    "data" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "skill_categories"("id");


-- ============================================================================
-- BAGIAN DI BAWAH INI TULISAN MANUAL, BUKAN HASIL GENERATOR.
-- Blok CreateTable di atas mencerminkan dump schema apa adanya; sisanya
-- (RLS / policy / trigger / grant / storage object) tidak bisa dimodelkan
-- oleh generator mana pun dan wajib ditulis eksplisit di migration.
-- Jangan dihapus hanya karena tidak terlihat di tabel hasil \d.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Entitas admin
-- ----------------------------------------------------------------------------
-- Tabel `admins` dibuat di migration ini (lihat blok CreateTable di atas)
-- TAPI TIDAK PERNAH di-seed. Isinya ditambahkan manual satu kali lewat
-- Supabase Dashboard -> Table Editor, atau lewat psql.
--
-- RLS aktif TANPA policy => default deny. Tidak ada grant SELECT ke anon /
-- authenticated, jadi tabel ini mustahil dibaca lewat PostgREST, bahkan oleh
-- admin yang sedang login. Yang bisa membaca tetap Postgres (service_role).
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins AS a
    WHERE a.email = coalesce((SELECT auth.jwt()) ->> 'email', '')
  )
$$;

-- Postgres memberi EXECUTE ke PUBLIC secara default pada setiap fungsi baru.
-- Tanpa REVOKE di sini, role yang tidak kita sengaja beri izin tetap bisa
-- memanggil is_admin().
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;


-- ----------------------------------------------------------------------------
-- 2. Row Level Security
-- ----------------------------------------------------------------------------
-- Matriks akses:
--   anon (pengunjung, belum login)  -> SELECT semua tabel publik
--                                   -> INSERT contact_messages saja
--   authenticated + is_admin()     -> SELECT / INSERT / UPDATE / DELETE semua
--   anon / authenticated            -> tidak boleh menulis apa pun selain di atas
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hki ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public work experiences are viewable by everyone."
  ON public.work_experiences FOR SELECT USING (true);
CREATE POLICY "Public education history is viewable by everyone."
  ON public.education_history FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone."
  ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public skill categories are viewable by everyone."
  ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone."
  ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public publications are viewable by everyone."
  ON public.publications FOR SELECT USING (true);
CREATE POLICY "Public hki are viewable by everyone."
  ON public.hki FOR SELECT USING (true);
CREATE POLICY "Public certifications are viewable by everyone."
  ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Public settings are viewable by everyone."
  ON public.settings FOR SELECT USING (true);

-- Draft blog tidak boleh bocor ke publik. Admin tetap bisa melihat draft-nya
-- sendiri supaya panel admin bisa menampilkan artikel yang belum dipublish.
CREATE POLICY "Public blogs are viewable by everyone if published."
  ON public.blogs FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Form kontak di src/views/Contact.tsx memakai anon key tanpa session,
-- jadi role-nya `anon` dan butuh INSERT.
CREATE POLICY "Anyone can submit a contact message."
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Admins can read contact messages."
  ON public.contact_messages FOR SELECT
  USING (public.is_admin());

-- Admin full access
CREATE POLICY "Admins can manage profile."
  ON public.profile FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage work_experiences."
  ON public.work_experiences FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage education_history."
  ON public.education_history FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage projects."
  ON public.projects FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage skill_categories."
  ON public.skill_categories FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage skills."
  ON public.skills FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage blogs."
  ON public.blogs FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage contact_messages."
  ON public.contact_messages FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage publications."
  ON public.publications FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage hki."
  ON public.hki FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage certifications."
  ON public.certifications FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can manage settings."
  ON public.settings FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());


-- ----------------------------------------------------------------------------
-- 3. Trigger updated_at untuk blogs
-- ----------------------------------------------------------------------------
-- src/app/admin/blog membalik flag is_published dari daftar artikel tanpa
-- menyentuh updated_at, jadi timestamp harus diurus di database.
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.tg_set_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.tg_set_updated_at() TO anon, authenticated, service_role;

DROP TRIGGER IF EXISTS blogs_set_updated_at ON public.blogs;
CREATE TRIGGER blogs_set_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();


-- ----------------------------------------------------------------------------
-- 4. Storage bucket "media"
-- ----------------------------------------------------------------------------
-- Bucket public: file dibaca lewat public URL CDN, bukan lewat listing.
-- INSERT idempotent karena schema `storage` TIDAK ikut terhapus saat public di-wipe.
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, 5242880)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- Schema storage tidak di-reset, jadi policy lama (yang dilacak dengan nama
-- "Authenticated users can ...") masih ada dan harus dibuang satu per satu.
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read storage files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read storage files" ON storage.objects;

CREATE POLICY "Admins can upload files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can update files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can delete files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admins can read storage files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());


-- ----------------------------------------------------------------------------
-- 5. Grants
-- ----------------------------------------------------------------------------
-- PENTING. Setup lama sama sekali tidak menulis GRANT dan tetap jalan karena
-- Supabase memasang ALTER DEFAULT PRIVILEGES untuk role postgres di schema
-- public. Default privileges itu disimpan di pg_default_acl yang TERIKAT PER
-- SCHEMA, jadi `DROP SCHEMA public CASCADE` ikut menghapusnya. Tanpa blok di
-- bawah ini, setiap query PostgREST akan berakhir dengan
-- "permission denied for table" dan RLS jadi tidak relevan.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Pengunjung (anon) hanya boleh membaca, plus menulis contact_messages.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT ON public.contact_messages TO anon;

-- Admin menulis lewat role authenticated; RLS yang membatasi lebih jauh.
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated, service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- admins adalah allowlist admin dan hanya dibaca function SECURITY DEFINER
-- is_admin(). Grant SELECT di atas ikut menyentuh tabel ini karena sifatnya
-- "ALL TABLES", jadi cabut eksplisit. RLS tanpa policy sudah menutupi hari ini
-- (0 baris terbaca), tapi membiarkan grant-nya berarti satu policy yang salah
-- tempat akan membuat daftar admin email jadi publik. service_role tetap diberi
-- akses karena dipanggil dari server dan memang melewati RLS.
REVOKE ALL ON TABLE public.admins FROM anon, authenticated;

-- Supaya tabel yang dibuat migration berikutnya langsung dapat grant
-- tanpa perlu blok GRANT tambahan di setiap migration.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT INSERT, UPDATE, DELETE ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated, service_role;
