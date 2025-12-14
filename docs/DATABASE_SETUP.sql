-- ============================================================================
-- SUPABASE DATABASE SCHEMA SETUP SCRIPT
-- ============================================================================
-- Use this script to set up a new Supabase instance with all required tables
-- and configurations.
--
-- Instructions:
-- 1. Create a new Supabase project
-- 2. Go to SQL Editor
-- 3. Copy this entire script
-- 4. Run it in the SQL Editor
-- 5. Update your .env with new credentials
-- ============================================================================

-- Enable required extensions (may already be enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- Extended user profile with Stripe subscription data
-- Foreign key to auth.users(id) for one-to-one relationship

CREATE TABLE IF NOT EXISTS profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT,
  customer_id TEXT,
  price_id TEXT,
  has_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_profiles_auth_user
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE
);

-- ============================================================================
-- 2. CREATE INDEXES
-- ============================================================================
-- Improve query performance for common lookups

CREATE INDEX IF NOT EXISTS idx_profiles_customer_id ON profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_has_access ON profiles(has_access);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Control data access at the database level

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Service role can bypass RLS (for webhook processing)
CREATE POLICY "Service role can do everything"
  ON profiles
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- 4. AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================================
-- When a user signs up in auth.users, automatically create their profile

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. AUTO-UPDATE TIMESTAMP
-- ============================================================================
-- Automatically update updated_at when profile changes

CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profiles_updated ON profiles;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_updated_at();

-- ============================================================================
-- 6. COMMENTS & DOCUMENTATION
-- ============================================================================
-- Document the schema for future reference

COMMENT ON TABLE profiles IS 'User profiles with subscription data. One-to-one with auth.users.';
COMMENT ON COLUMN profiles.id IS 'Foreign key to auth.users(id)';
COMMENT ON COLUMN profiles.email IS 'User email (denormalized from auth.users)';
COMMENT ON COLUMN profiles.customer_id IS 'Stripe Customer ID from checkout webhook';
COMMENT ON COLUMN profiles.price_id IS 'Stripe Price ID of current subscription';
COMMENT ON COLUMN profiles.has_access IS 'Whether user has active subscription access';
COMMENT ON COLUMN profiles.created_at IS 'Profile creation timestamp';
COMMENT ON COLUMN profiles.updated_at IS 'Last profile modification timestamp';

-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================
-- Uncomment these after setup to verify everything works

-- Check table structure
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_name = 'profiles' ORDER BY ordinal_position;

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename = 'profiles';

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Check triggers
-- SELECT trigger_name, function_name FROM information_schema.triggers 
-- WHERE trigger_schema = 'public' AND event_object_table = 'profiles';

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- The database is now ready to use. Update your environment variables:
--
-- NEXT_PUBLIC_SUPABASE_URL=<your_new_url>
-- NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_new_anon_key>
-- SUPABASE_SERVICE_ROLE_KEY=<your_new_service_role_key>
--
-- Test the connection with:
-- SELECT * FROM profiles;
-- ============================================================================
