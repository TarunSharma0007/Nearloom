-- Add profile visibility column to profiles table
ALTER TABLE public.profiles
ADD COLUMN profile_visibility text NOT NULL DEFAULT 'public'
CHECK (profile_visibility IN ('public', 'logged_in', 'private'));