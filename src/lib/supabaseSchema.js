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

-- Page views tracking table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor sessions table for unique visitor tracking
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  first_visit_at TIMESTAMPTZ DEFAULT NOW(),
  last_visit_at TIMESTAMPTZ DEFAULT NOW(),
  total_visits INT DEFAULT 1,
  total_page_views INT DEFAULT 1,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  is_returning_visitor BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

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

-- Policies for analytics tables
-- Allow public insert for page views (for tracking)
DROP POLICY IF EXISTS "Allow public insert page views" ON page_views;
CREATE POLICY "Allow public insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admins) to read analytics data
DROP POLICY IF EXISTS "Allow admin read access to analytics" ON page_views;
CREATE POLICY "Allow admin read access to analytics" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow public insert for visitor sessions
DROP POLICY IF EXISTS "Allow public insert visitor sessions" ON visitor_sessions;
CREATE POLICY "Allow public insert visitor sessions" ON visitor_sessions
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admins) to read visitor sessions
DROP POLICY IF EXISTS "Allow admin read access to visitor sessions" ON visitor_sessions;
CREATE POLICY "Allow admin read access to visitor sessions" ON visitor_sessions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to update visitor sessions
DROP POLICY IF EXISTS "Allow admin update access to visitor sessions" ON visitor_sessions;
CREATE POLICY "Allow admin update access to visitor sessions" ON visitor_sessions
  FOR UPDATE USING (auth.role() = 'authenticated');

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

-- Function to update visitor session on new page view
CREATE OR REPLACE FUNCTION public.update_visitor_session()
RETURNS TRIGGER AS $
BEGIN
    -- Update or insert visitor session
    INSERT INTO visitor_sessions (session_id, last_visit_at, total_visits, total_page_views, country, city, device_type, browser, os)
    VALUES (NEW.session_id, NOW(), 1, 1, NEW.country, NEW.city, NEW.device_type, NEW.browser, NEW.os)
    ON CONFLICT (session_id) DO UPDATE SET
        last_visit_at = NOW(),
        total_page_views = visitor_sessions.total_page_views + 1,
        country = COALESCE(NEW.country, visitor_sessions.country),
        city = COALESCE(NEW.city, visitor_sessions.city),
        device_type = COALESCE(NEW.device_type, visitor_sessions.device_type),
        browser = COALESCE(NEW.browser, visitor_sessions.browser),
        os = COALESCE(NEW.os, visitor_sessions.os);
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger for 'page_views' table to update visitor sessions
DROP TRIGGER IF EXISTS update_visitor_session_trigger ON public.page_views;
CREATE TRIGGER update_visitor_session_trigger
    AFTER INSERT ON public.page_views
    FOR EACH ROW
    EXECUTE FUNCTION public.update_visitor_session();

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
