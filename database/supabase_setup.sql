-- ==========================================
-- SUPABASE COMPLETE SETUP SCRIPT
-- ==========================================
-- Warning: This script drops existing tables 
-- and recreates them from scratch.
-- ==========================================

-- 1. Drop existing tables if they exist
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS education_history CASCADE;
DROP TABLE IF EXISTS work_experiences CASCADE;
DROP TABLE IF EXISTS profile CASCADE;

-- 2. Create Profile Table (Single Row)
CREATE TABLE profile (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  full_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT,
  cv_url TEXT,
  instagram_url TEXT,
  github_url TEXT
);

-- 3. Create Work Experiences Table
CREATE TABLE work_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_url TEXT,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Education History Table
CREATE TABLE education_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  institution_url TEXT,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Projects Table (For /work page)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  project_url TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Skill Categories
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 6.1 Create Skills Table (Child of Category)
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 7. Create Blogs Table
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create Contact Messages Table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Goal: 
-- Public: Can SELECT (read) almost all tables
-- Admin (Authenticated users): Can INSERT, UPDATE, DELETE all tables

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public profiles are viewable by everyone." 
  ON profile FOR SELECT USING (true);
CREATE POLICY "Public work experiences are viewable by everyone." 
  ON work_experiences FOR SELECT USING (true);
CREATE POLICY "Public education history is viewable by everyone." 
  ON education_history FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone." 
  ON projects FOR SELECT USING (true);
CREATE POLICY "Public skill categories are viewable by everyone." 
  ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone." 
  ON skills FOR SELECT USING (true);
CREATE POLICY "Public blogs are viewable by everyone if published." 
  ON blogs FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
  
-- CONTACT MESSAGES (Public Insert, Authenticated Read)
CREATE POLICY "Anyone can submit a contact message."
  ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated users can view messages." 
  ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

-- AUTHENTICATED ADMIN POLICIES (Full Access)
CREATE POLICY "Admins can manage profile." 
  ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage work_experiences." 
  ON work_experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage education_history." 
  ON education_history FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage projects." 
  ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage skill_categories." 
  ON skill_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage skills." 
  ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage blogs." 
  ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage contact_messages." 
  ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- INSERT DEFAULT PROFILE
-- ==========================================
INSERT INTO profile (id, full_name, tagline, bio, photo_url, cv_url, instagram_url, github_url)
VALUES (
  'primary',
  'Muhammad Rifaa Siraajuddin Sugandi',
  'Backend Developer',
  'A 2025 graduate from SMKN 2 Sukabumi with a specialization in Software Engineering. As a Junior Backend Developer at a local startup, I''m actively involved in building and maintaining efficient and reliable backend systems.

I am a curious and persistent individual who is genuinely passionate about problem-solving...',
  '/img/MyFoto.png',
  '/cv.pdf',
  'https://www.instagram.com/rifaa_srjdn/',
  'https://github.com/KnowRise'
);
