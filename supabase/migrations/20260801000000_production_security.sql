-- Platform roles must be separate from user-editable profile attributes.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('platform_admin', 'moderator');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'platform_admin'));

-- Profiles contain email and phone data, so they must not be publicly selectable.
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Prevent users from changing privileged or system-owned profile columns.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (
  full_name,
  avatar_url,
  phone,
  primary_city,
  languages,
  notification_preferences,
  profile_visibility,
  updated_at
) ON public.profiles TO authenticated;

-- Platform staff can moderate listings and reports through RLS-protected APIs.
DROP POLICY IF EXISTS "Platform staff can view communities" ON public.communities;
CREATE POLICY "Platform staff can view communities"
ON public.communities FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Platform staff can update communities" ON public.communities;
CREATE POLICY "Platform staff can update communities"
ON public.communities FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Platform staff can view reports" ON public.reports;
CREATE POLICY "Platform staff can view reports"
ON public.reports FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Platform staff can update reports" ON public.reports;
CREATE POLICY "Platform staff can update reports"
ON public.reports FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'))
WITH CHECK (public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Platform staff can read community views" ON public.community_views;
CREATE POLICY "Platform staff can read community views"
ON public.community_views FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'));

DROP POLICY IF EXISTS "Platform staff can read join clicks" ON public.join_clicks;
CREATE POLICY "Platform staff can read join clicks"
ON public.join_clicks FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'platform_admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_communities_discovery ON public.communities(status, category_id, location_id, meeting_mode);
CREATE INDEX IF NOT EXISTS idx_communities_activity ON public.communities(last_activity_at DESC NULLS LAST);
