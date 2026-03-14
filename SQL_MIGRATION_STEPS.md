# Supabase Schema Migration Steps

To execute the database changes we just discussed without losing your existing table structures entirely, please copy and paste the following SQL blocks one-by-one into your Supabase SQL Editor (`https://supabase.com/dashboard/project/_/sql/new`).

### 1. Update Profile Bio
This will combine your existing 2 paragraphs into 1 markdown column, and remove the old columns.
```sql
ALTER TABLE profile ADD COLUMN bio TEXT;
UPDATE profile SET bio = bio_paragraph_1 || '

' || bio_paragraph_2;
ALTER TABLE profile DROP COLUMN bio_paragraph_1;
ALTER TABLE profile DROP COLUMN bio_paragraph_2;
```

### 2. Add URL columns to Experiences
This allows you to add optional clickable links for your experience list.
```sql
ALTER TABLE work_experiences ADD COLUMN company_url TEXT;
ALTER TABLE education_history ADD COLUMN institution_url TEXT;
```

### 3. Build the Skill_Categories Matrix
This will drop your current flat `skills` table (data will be reset), and create the Parent-Child relation tables so you can organize skills properly by category with an optional URL link for each skill.
```sql
-- Drop the flat skills table
DROP TABLE IF EXISTS skills CASCADE;

-- Create Skill Category Parent Table
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Recreate Skills Table as Child
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Enable Security
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Reading Policies
CREATE POLICY "Public skill categories viewable by everyone" 
  ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Public skills viewable by everyone" 
  ON skills FOR SELECT USING (true);

-- Admin Modify Policies
CREATE POLICY "Admins can manage skill_categories" 
  ON skill_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage skills" 
  ON skills FOR ALL USING (auth.role() = 'authenticated');
```
