-- Create cards table for task prioritization system
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  owner TEXT NOT NULL,
  effort TEXT NOT NULL,
  urgency INTEGER NOT NULL CHECK (urgency >= 1 AND urgency <= 10),
  important INTEGER NOT NULL CHECK (important >= 1 AND important <= 10),
  reach INTEGER NOT NULL CHECK (reach >= 0),
  impact INTEGER NOT NULL CHECK (impact >= 1 AND impact <= 10),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  effort_months NUMERIC NOT NULL CHECK (effort_months > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient sorting by creation date
CREATE INDEX idx_cards_created_at ON cards(created_at DESC);

-- Enable Row Level Security
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for development (allow all operations)
-- Note: In production, replace this with proper user-based policies
CREATE POLICY "Allow all operations for development"
  ON cards
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE cards IS 'Task cards with Eisenhower Matrix (urgency/importance) and RICE framework (reach/impact/confidence/effort) prioritization';
