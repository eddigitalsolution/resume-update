-- =======================================================
-- SYSTEM AUDIT & DB HARDENING MIGRATION
-- DATE: 2026-05-19
-- SUMMARY:
-- Refactor all table policies to use the non-recursive
-- public.is_admin() SECURITY DEFINER helper function.
-- =======================================================

-- 1. Ensure public.is_admin() helper exists
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

-- 2. HARDEN PROJECTS POLICIES
DROP POLICY IF EXISTS "Allow all actions for authenticated users on projects" ON projects;
CREATE POLICY "Allow all actions for authenticated users on projects" ON projects FOR ALL USING (public.is_admin());

-- 3. HARDEN SKILLS POLICIES
DROP POLICY IF EXISTS "Allow all actions for authenticated users on skills" ON skills;
CREATE POLICY "Allow all actions for authenticated users on skills" ON skills FOR ALL USING (public.is_admin());

-- 4. HARDEN UPDATES POLICIES
DROP POLICY IF EXISTS "Allow all actions for authenticated users on updates" ON updates;
CREATE POLICY "Allow all actions for authenticated users on updates" ON updates FOR ALL USING (public.is_admin());

-- 5. HARDEN RESUME POLICIES
DROP POLICY IF EXISTS "Allow all actions for authenticated users on resume" ON resume;
CREATE POLICY "Allow all actions for authenticated users on resume" ON resume FOR ALL USING (public.is_admin());

-- 6. HARDEN USER_ROLES POLICIES (ELIMINATE CORE RECURSION)
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
CREATE POLICY "Admins can manage all roles" ON user_roles FOR ALL USING (public.is_admin());
