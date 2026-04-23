-- ==========================================
-- MASTER SUPABASE SCHEMA (COMBINED)
-- Generated on 2026-04-23
-- ==========================================

-- ------------------------------------------
-- SECTION 1: BASE SCHEMA
-- ------------------------------------------

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Draft', -- Draft, Live, In Progress
  progress INTEGER DEFAULT 0,
  live_url TEXT,
  github_url TEXT,
  type TEXT DEFAULT 'Freelance', -- Freelance, Portfolio
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Project updates / logs
CREATE TABLE IF NOT EXISTS updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  progress INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume table
CREATE TABLE IF NOT EXISTS resume (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  role TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  summary TEXT,
  experience JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  stats JSONB DEFAULT '[]',
  photo_url TEXT,
  homepage_config JSONB DEFAULT '{}'::JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table for RBAC
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff', -- 'admin', 'staff'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policies for public read
DO $$ BEGIN
    CREATE POLICY "Allow public read-only access to projects" ON projects FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public read-only access to skills" ON skills FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public read-only access to updates" ON updates FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow public read-only access to resume" ON resume FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies for authenticated admin
DO $$ BEGIN
    CREATE POLICY "Allow all actions for authenticated users on projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all actions for authenticated users on skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all actions for authenticated users on updates" ON updates FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Allow all actions for authenticated users on resume" ON resume FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policies for user_roles
DO $$ BEGIN
    CREATE POLICY "Users can read their own role" ON user_roles FOR SELECT USING (auth.jwt() ->> 'email' = email);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Admins can manage all roles" ON user_roles FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Initial admin seed
INSERT INTO user_roles (email, role)
VALUES ('idhamyazim1234@yahoo.com', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- ------------------------------------------
-- SECTION 2: DATA SYNC & SEEDING
-- ------------------------------------------

-- Ensure JSONB columns use correct defaults
ALTER TABLE projects ALTER COLUMN tech_stack SET DEFAULT '[]'::JSONB;

-- Initial Resume Seed
INSERT INTO resume (full_name, role, email, phone, location, summary)
SELECT 'Your Name', 'Software Engineer', 'you@example.com', '123-456-7890', 'San Francisco, CA', 'Professional summary here.'
WHERE NOT EXISTS (SELECT 1 FROM resume LIMIT 1);

-- ------------------------------------------
-- SECTION 3: MIGRATIONS (latest)
-- ------------------------------------------

-- Add dynamic contact options seed
UPDATE resume 
SET homepage_config = jsonb_set(
  COALESCE(homepage_config, '{}'::jsonb), 
  '{contact_options}', 
  '[
    {"label": "Create Website", "message": "Hi! I''m interested in building a new website with you."},
    {"label": "Need Help Run Ads", "message": "Hi! I need expert help with running and optimizing my digital ads."},
    {"label": "Need AI Automation", "message": "Hi! I''m looking to implement AI automation in my business."},
    {"label": "Business Consultation", "message": "Hi! I''d like to book a consultation to discuss a project."}
  ]'::jsonb
)
WHERE homepage_config->'contact_options' IS NULL;
