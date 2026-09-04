-- Migration: Add website_url to resume table
ALTER TABLE resume ADD COLUMN IF NOT EXISTS website_url TEXT;
