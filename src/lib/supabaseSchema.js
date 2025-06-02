
export const supabaseSchema = `
-- Users table (managed by Supabase Auth)
-- public.users

-- Categories for articles
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT, -- For longer content, perhaps markdown or HTML
  publish_date DATE NOT NULL,
  tags TEXT[], -- Array of tags
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to Supabase Auth user
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INT DEFAULT 0
);

-- Media table for images, videos, audio associated with articles
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE, -- Path in Supabase Storage
  mime_type TEXT,
  size_bytes BIGINT,
  type TEXT NOT NULL, -- 'image', 'video_url', 'audio'
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL -- Added author_id
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policies for 'categories'
-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);
-- Allow authenticated users (admins) full access
DROP POLICY IF EXISTS "Allow admin full access to categories" ON categories;
CREATE POLICY "Allow admin full access to categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policies for 'articles'
-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access to articles" ON articles;
CREATE POLICY "Allow public read access to articles" ON articles
  FOR SELECT USING (true);
-- Allow authenticated users (admins) to manage their own articles
DROP POLICY IF EXISTS "Allow admin full access to own articles" ON articles;
CREATE POLICY "Allow admin full access to own articles" ON articles
  FOR ALL USING (auth.role() = 'authenticated' AND author_id = auth.uid())
  WITH CHECK (auth.role() = 'authenticated' AND author_id = auth.uid());

-- Policies for 'media'
-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access to media" ON media;
CREATE POLICY "Allow public read access to media" ON media
  FOR SELECT USING (true);

-- Allow authenticated users (admins) to insert media if they are the author of the article
DROP POLICY IF EXISTS "Allow admin insert access to media for own articles" ON media;
CREATE POLICY "Allow admin insert access to media for own articles" ON media
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND
    author_id = auth.uid() AND -- Check if the media's author_id matches the current user
    EXISTS (SELECT 1 FROM articles WHERE id = article_id AND articles.author_id = auth.uid()) -- Check if user owns the article
  );

-- Allow authenticated users (admins) to update/delete media if they are the author
DROP POLICY IF EXISTS "Allow admin update/delete access to own media" ON media;
CREATE POLICY "Allow admin update/delete access to own media" ON media
  FOR UPDATE, DELETE 
  USING (
    auth.role() = 'authenticated' AND 
    author_id = auth.uid() AND
    EXISTS (SELECT 1 FROM articles WHERE id = article_id AND articles.author_id = auth.uid())
  );


-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger for 'articles' table
DROP TRIGGER IF EXISTS update_articles_modtime ON public.articles;
CREATE TRIGGER update_articles_modtime
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_modified_column();

-- Supabase Storage Buckets
-- Create 'article-media' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'article-media', 'article-media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'article-media');

-- RLS policies for storage bucket 'article-media':
-- Allow public read access for files:
DROP POLICY IF EXISTS "Allow public read access to article-media" ON storage.objects;
CREATE POLICY "Allow public read access to article-media"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'article-media' );

-- Allow authenticated users (admins) to upload/manage files:
DROP POLICY IF EXISTS "Allow admin CRUD access to article-media" ON storage.objects;
CREATE POLICY "Allow admin CRUD access to article-media"
  ON storage.objects FOR ALL
  USING ( bucket_id = 'article-media' AND auth.role() = 'authenticated' ) 
  WITH CHECK ( bucket_id = 'article-media' AND auth.role() = 'authenticated' );

-- Seed some initial categories if the table is empty
INSERT INTO categories (name, description)
SELECT 'Early History', 'Content related to the early periods of Malawi.'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Early History');

INSERT INTO categories (name, description)
SELECT 'Colonial Era', 'Content related to the colonial period in Malawi.'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Colonial Era');

INSERT INTO categories (name, description)
SELECT 'Independence & Modern Malawi', 'Content from independence to present day.'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Independence & Modern Malawi');

INSERT INTO categories (name, description)
SELECT 'Cultural Heritage', 'Malawian culture, traditions, and arts.'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Cultural Heritage');

INSERT INTO categories (name, description)
SELECT 'Natural Wonders', 'Significant natural sites and geography of Malawi.'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Natural Wonders');
`;
