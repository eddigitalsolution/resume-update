-- Migration: Add missing columns to projects table
-- Created: 2026-04-23

-- 1. Add missing columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Freelance';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE resume ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '[]'::JSONB;

-- 2. Update any existing NULL values to defaults
UPDATE projects SET type = 'Freelance' WHERE type IS NULL;
UPDATE projects SET is_featured = false WHERE is_featured IS NULL;
