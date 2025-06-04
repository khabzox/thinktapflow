-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON chat_messages;

-- Create policies
CREATE POLICY "Anyone can view chat messages"
    ON chat_messages FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own messages"
    ON chat_messages FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
    ON chat_messages FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add realtime replication if not already added
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE tablename = 'chat_messages'
        AND pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
    END IF;
END
$$;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema'; 