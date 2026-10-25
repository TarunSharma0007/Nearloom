-- Add notification preferences column to profiles table
ALTER TABLE public.profiles
ADD COLUMN notification_preferences jsonb DEFAULT '{"community_updates": true, "new_members": false, "weekly_digest": true, "marketing": false}'::jsonb;