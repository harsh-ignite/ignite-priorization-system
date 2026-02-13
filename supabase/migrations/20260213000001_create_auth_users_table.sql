-- Create auth_users table for basic authentication
CREATE TABLE IF NOT EXISTS auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for development (allow all operations)
CREATE POLICY "Allow all operations for development"
  ON auth_users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE auth_users IS 'Basic authentication users table with hardcoded credentials';
