-- Fix search_path for functions
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fix update_tag_usage function
DROP FUNCTION IF EXISTS update_tag_usage CASCADE;
CREATE OR REPLACE FUNCTION update_tag_usage()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_tag_usage_on_community_tag
  AFTER INSERT OR DELETE ON community_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage();