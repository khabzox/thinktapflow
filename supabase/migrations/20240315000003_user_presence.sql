-- Add last_seen column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE;

-- Create index for faster online user queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen
    ON profiles (last_seen DESC);

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update their own last_seen" ON profiles;

-- Update RLS policies to allow updating last_seen
CREATE POLICY "Users can update their own last_seen"
    ON profiles 
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
    );

-- Add realtime replication for presence
ALTER PUBLICATION supabase_realtime ADD TABLE profiles; 