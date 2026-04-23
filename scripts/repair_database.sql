-- 1. FIX RESUME TABLE: Add missing projects column and ensure JSONB structure
ALTER TABLE resume ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::JSONB;

-- 2. ENSURE ALL TABLES EXIST WITH CORRECT COLUMNS (IF RUNNING FOR FIRST TIME)

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT,
    tech_stack JSONB DEFAULT '[]'::JSONB,
    status TEXT DEFAULT 'Draft',
    progress INTEGER DEFAULT 0,
    live_url TEXT,
    github_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    level INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Updates Table
CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    note TEXT,
    progress INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Resume Table Structure check
-- Ensures columns exist if the table was created manually without them
ALTER TABLE resume ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::JSONB;
ALTER TABLE resume ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::JSONB;
ALTER TABLE resume ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::JSONB;

-- 3. INITIAL SEED (Only if table is empty)
INSERT INTO resume (full_name, role, email, phone, location, summary)
SELECT 'Your Name', 'Software Engineer', 'you@example.com', '123-456-7890', 'San Francisco, CA', 'Professional summary here.'
WHERE NOT EXISTS (SELECT 1 FROM resume LIMIT 1);
