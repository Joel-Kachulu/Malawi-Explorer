// Setup script for analytics tables
// Run this in your Supabase SQL editor to create the analytics tables

const setupSQL = `
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

-- Enable Row Level Security (RLS) for analytics tables
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

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

-- Function to update visitor session on new page view
CREATE OR REPLACE FUNCTION public.update_visitor_session()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger for 'page_views' table to update visitor sessions
DROP TRIGGER IF EXISTS update_visitor_session_trigger ON public.page_views;
CREATE TRIGGER update_visitor_session_trigger
    AFTER INSERT ON public.page_views
    FOR EACH ROW
    EXECUTE FUNCTION public.update_visitor_session();
`;

console.log('Analytics setup SQL script:');
console.log('==========================');
console.log(setupSQL);
console.log('\nInstructions:');
console.log('1. Go to your Supabase dashboard');
console.log('2. Navigate to the SQL Editor');
console.log('3. Copy and paste the SQL above');
console.log('4. Run the script to create the analytics tables');
console.log('5. Your real-time analytics will start working immediately!'); 