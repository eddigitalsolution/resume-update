-- ==========================================
-- CREATE GALLERY TABLE, HELPER FUNCTIONS & POLICIES
-- ==========================================

-- 1. Create is_admin helper function if it doesn't exist
-- Marking as SECURITY DEFINER bypasses RLS on user_roles and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE (user_id = auth.uid() OR email = auth.jwt() ->> 'email')
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  prompt TEXT,
  type TEXT NOT NULL DEFAULT 'AI Image', -- 'AI Image', 'Design', 'Video SS'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Read Access Policy
DROP POLICY IF EXISTS "Allow public read-only access to gallery" ON gallery;
CREATE POLICY "Allow public read-only access to gallery" ON gallery FOR SELECT USING (true);

-- 5. Create Admin Edit Access Policy using non-recursive is_admin() helper
DROP POLICY IF EXISTS "Allow all actions for authenticated users on gallery" ON gallery;
CREATE POLICY "Allow all actions for authenticated users on gallery" ON gallery FOR ALL USING (public.is_admin());
