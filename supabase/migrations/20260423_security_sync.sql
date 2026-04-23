-- Migration: Security and RBAC Synchronization
-- Created: 2026-04-23

-- 1. Create a function to sync user_id with user_roles based on email
CREATE OR REPLACE FUNCTION public.handle_user_role_sync()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_roles
  SET user_id = NEW.id
  WHERE email = NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger to fire on user creation in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_sync_role ON auth.users;
CREATE TRIGGER on_auth_user_created_sync_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_role_sync();

-- 3. Retroactively sync any existing users
UPDATE public.user_roles ur
SET user_id = au.id
FROM auth.users au
WHERE ur.email = au.email AND ur.user_id IS NULL;
