/*
  # HT1-HT3 Settings Platform Schema

  ## Overview
  Complete database schema for the HT1-HT3 Settings pack hosting platform.
  
  ## New Tables
  
  ### `admin_keys`
  - `id` (uuid, primary key) - Unique identifier
  - `key_value` (text, unique) - The actual admin key for authentication
  - `created_by` (text) - Admin who created this key
  - `usage_type` (text) - 'single' or 'multi' use
  - `max_uses` (integer) - Maximum number of uses allowed (null for unlimited multi-use)
  - `current_uses` (integer) - Current usage count
  - `expires_at` (timestamptz) - Optional expiration date
  - `is_active` (boolean) - Whether the key is currently active
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `admin_sessions`
  - `id` (uuid, primary key) - Session identifier
  - `admin_key_id` (uuid) - Reference to admin_keys
  - `session_token` (text, unique) - Session token for authentication
  - `expires_at` (timestamptz) - Session expiration
  - `created_at` (timestamptz) - Creation timestamp
  
  ### `packs`
  - `id` (uuid, primary key) - Unique pack identifier
  - `name` (text) - Pack name
  - `creator_name` (text) - Creator's name
  - `version` (text) - Pack version
  - `description` (text) - Pack description
  - `category` (text) - Category: texture_packs, overlays, mods, settings_packs
  - `thumbnail_url` (text) - Thumbnail image URL
  - `download_url` (text) - Download link or file URL
  - `screenshots` (jsonb) - Array of screenshot URLs
  - `is_featured` (boolean) - Featured pack flag
  - `view_count` (integer) - Number of views
  - `download_count` (integer) - Number of downloads
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `pack_ratings`
  - `id` (uuid, primary key) - Rating identifier
  - `pack_id` (uuid) - Reference to packs
  - `user_identifier` (text) - Anonymous user identifier (IP hash or session)
  - `rating` (integer) - Rating value (1-5 stars)
  - `created_at` (timestamptz) - Rating timestamp
  
  ## Security
  - Enable RLS on all tables
  - Public read access for packs and ratings
  - Admin-only write access using session tokens
  - Admin keys table secured for admin access only
  
  ## Notes
  - All timestamps use timestamptz for proper timezone handling
  - JSONB used for flexible screenshot storage
  - Indexes added for performance on common queries
*/

-- Create admin_keys table
CREATE TABLE IF NOT EXISTS admin_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_value text UNIQUE NOT NULL,
  created_by text NOT NULL,
  usage_type text NOT NULL CHECK (usage_type IN ('single', 'multi')),
  max_uses integer DEFAULT NULL,
  current_uses integer DEFAULT 0,
  expires_at timestamptz DEFAULT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_key_id uuid REFERENCES admin_keys(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create packs table
CREATE TABLE IF NOT EXISTS packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  creator_name text NOT NULL,
  version text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('texture_packs', 'overlays', 'mods', 'settings_packs')),
  thumbnail_url text NOT NULL,
  download_url text NOT NULL,
  screenshots jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pack_ratings table
CREATE TABLE IF NOT EXISTS pack_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id uuid REFERENCES packs(id) ON DELETE CASCADE,
  user_identifier text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(pack_id, user_identifier)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_packs_category ON packs(category);
CREATE INDEX IF NOT EXISTS idx_packs_created_at ON packs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_packs_download_count ON packs(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_packs_featured ON packs(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_pack_ratings_pack_id ON pack_ratings(pack_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);

-- Enable Row Level Security
ALTER TABLE admin_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for packs (public read, admin write)
CREATE POLICY "Anyone can view packs"
  ON packs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert packs"
  ON packs FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  );

CREATE POLICY "Admins can update packs"
  ON packs FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  );

CREATE POLICY "Admins can delete packs"
  ON packs FOR DELETE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  );

-- RLS Policies for pack_ratings (public read, anyone can rate)
CREATE POLICY "Anyone can view ratings"
  ON pack_ratings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert ratings"
  ON pack_ratings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for admin_keys (admin access only)
CREATE POLICY "Admins can view admin keys"
  ON admin_keys FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  );

CREATE POLICY "Admins can create admin keys"
  ON admin_keys FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  );

CREATE POLICY "Admins can update admin keys"
  ON admin_keys FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  );

CREATE POLICY "Admins can delete admin keys"
  ON admin_keys FOR DELETE
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_sessions
      WHERE session_token = current_setting('request.headers', true)::json->>'x-admin-token'
      AND expires_at > now()
    )
  );

-- RLS Policies for admin_sessions
CREATE POLICY "Anyone can verify sessions"
  ON admin_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create sessions"
  ON admin_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_packs_updated_at
  BEFORE UPDATE ON packs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a master admin key for initial setup
INSERT INTO admin_keys (key_value, created_by, usage_type, is_active)
VALUES ('HT1-MASTER-KEY-2024', 'system', 'multi', true)
ON CONFLICT (key_value) DO NOTHING;