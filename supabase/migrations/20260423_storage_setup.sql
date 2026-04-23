-- Migration: Storage Buckets and Media Policies
-- Created: 2026-04-23

-- 1. Create the portfolio bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to view files in the portfolio bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

-- 3. Allow authenticated users (admin) to upload files
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' AND
  (auth.role() = 'authenticated')
);

-- 4. Allow authenticated users (admin) to update/delete their files
CREATE POLICY "Admin Update Delete"
ON storage.objects FOR ALL
USING (
  bucket_id = 'portfolio' AND
  (auth.role() = 'authenticated')
);
