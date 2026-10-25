-- Enable PostGIS for geospatial support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum types
CREATE TYPE community_status AS ENUM ('pending', 'active', 'paused', 'rejected', 'banned');
CREATE TYPE meeting_mode AS ENUM ('online', 'offline', 'hybrid');
CREATE TYPE admin_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'dismissed');

-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  primary_city TEXT,
  languages TEXT[] DEFAULT ARRAY['en'],
  is_community_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Locations table (hierarchical)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  state TEXT,
  district TEXT,
  city TEXT,
  locality TEXT,
  pincode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geom GEOGRAPHY(POINT, 4326),
  level TEXT NOT NULL, -- 'country', 'state', 'district', 'city', 'locality'
  parent_id UUID REFERENCES locations(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(country, state, district, city, locality, pincode)
);

-- Communities table
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description TEXT,
  category_id UUID REFERENCES categories(id),
  logo_url TEXT,
  cover_image_url TEXT,
  
  -- Location and geography
  location_id UUID REFERENCES locations(id),
  service_area TEXT, -- 'city', 'district', 'state', 'national', 'international'
  is_online_only BOOLEAN DEFAULT false,
  meeting_mode meeting_mode DEFAULT 'hybrid',
  
  -- Contact and joining
  primary_join_method TEXT, -- 'whatsapp', 'telegram', 'discord', 'website', 'email', 'form'
  whatsapp_link TEXT,
  telegram_link TEXT,
  discord_link TEXT,
  website_url TEXT,
  contact_email TEXT,
  application_form_url TEXT,
  
  -- Details
  languages TEXT[] DEFAULT ARRAY['en'],
  member_count INTEGER,
  founded_date DATE,
  meeting_frequency TEXT, -- 'weekly', 'monthly', 'events_only'
  typical_meeting_time TEXT,
  rules TEXT,
  
  -- Status and moderation
  status community_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  
  -- Metadata
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now()
);

-- Community tags (many-to-many)
CREATE TABLE community_tags (
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (community_id, tag_id)
);

-- Community admins (many-to-many with roles)
CREATE TABLE community_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role admin_role DEFAULT 'editor',
  invited_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Saved communities (user favorites)
CREATE TABLE saved_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, community_id)
);

-- Community views (analytics)
CREATE TABLE community_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  referrer TEXT,
  user_location_city TEXT,
  user_location_state TEXT,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Join clicks (analytics)
CREATE TABLE join_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  join_method TEXT NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- Reports (moderation)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES profiles(id),
  reported_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  details TEXT,
  status report_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_communities_status ON communities(status);
CREATE INDEX idx_communities_category ON communities(category_id);
CREATE INDEX idx_communities_location ON communities(location_id);
CREATE INDEX idx_communities_created_at ON communities(created_at DESC);
CREATE INDEX idx_community_views_community ON community_views(community_id);
CREATE INDEX idx_community_views_viewed_at ON community_views(viewed_at DESC);
CREATE INDEX idx_join_clicks_community ON join_clicks(community_id);
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
CREATE INDEX idx_locations_level ON locations(level);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Full-text search indexes
CREATE INDEX idx_communities_search ON communities USING GIN(
  to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(short_description, '') || ' ' || COALESCE(long_description, ''))
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Public read, users can update own profile
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories: Public read, platform admins manage
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Tags: Public read
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);

-- Locations: Public read
CREATE POLICY "Locations are viewable by everyone" ON locations FOR SELECT USING (true);

-- Communities: Public can view active, admins can manage own
CREATE POLICY "Active communities are viewable by everyone" ON communities 
  FOR SELECT USING (status = 'active' OR created_by = auth.uid());

CREATE POLICY "Users can create communities" ON communities 
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Community creators can update own communities" ON communities 
  FOR UPDATE USING (created_by = auth.uid());

-- Community tags: Match community permissions
CREATE POLICY "Community tags viewable with community" ON community_tags 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM communities WHERE id = community_tags.community_id AND (status = 'active' OR created_by = auth.uid())
    )
  );

CREATE POLICY "Community admins can manage tags" ON community_tags 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM communities WHERE id = community_tags.community_id AND created_by = auth.uid()
    )
  );

-- Community admins: Community creators can manage
CREATE POLICY "Community admins viewable by community members" ON community_admins 
  FOR SELECT USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM communities WHERE id = community_admins.community_id AND created_by = auth.uid()
  ));

CREATE POLICY "Community creators can manage admins" ON community_admins 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM communities WHERE id = community_admins.community_id AND created_by = auth.uid()
  ));

-- Saved communities: Users manage own
CREATE POLICY "Users can view own saved communities" ON saved_communities 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save communities" ON saved_communities 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave communities" ON saved_communities 
  FOR DELETE USING (auth.uid() = user_id);

-- Community views: Public can create (for analytics)
CREATE POLICY "Anyone can log community views" ON community_views 
  FOR INSERT WITH CHECK (true);

-- Join clicks: Public can create (for analytics)
CREATE POLICY "Anyone can log join clicks" ON join_clicks 
  FOR INSERT WITH CHECK (true);

-- Reports: Users can create and view own
CREATE POLICY "Users can create reports" ON reports 
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Users can view own reports" ON reports 
  FOR SELECT USING (auth.uid() = reported_by);

-- Functions

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_on_community_tag
  AFTER INSERT OR DELETE ON community_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage();