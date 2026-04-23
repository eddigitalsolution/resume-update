-- Migration: Database Polish and Performance
-- Created: 2026-04-23

-- 1. Ensure the resume table only has one row (Singleton Pattern)
-- This prevents multiple profiles from being created by accident
ALTER TABLE resume ADD COLUMN IF NOT EXISTS is_singleton BOOLEAN DEFAULT TRUE UNIQUE CHECK (is_singleton);

-- 2. Add performance indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_updates_project_id ON updates(project_id);

-- 3. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Attach triggers to tables
DROP TRIGGER IF EXISTS update_resume_modtime ON resume;
CREATE TRIGGER update_resume_modtime BEFORE UPDATE ON resume FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_projects_modtime ON projects;
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
