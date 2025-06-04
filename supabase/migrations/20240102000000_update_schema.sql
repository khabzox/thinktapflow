-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update users table if it exists
DO $$ 
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'subscription_tier') THEN
        ALTER TABLE users ADD COLUMN subscription_tier TEXT DEFAULT 'free';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'usage_count') THEN
        ALTER TABLE users ADD COLUMN usage_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'usage_limit') THEN
        ALTER TABLE users ADD COLUMN usage_limit INTEGER DEFAULT 10;
    END IF;
END $$;

-- Create generations table if it doesn't exist
CREATE TABLE IF NOT EXISTS generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    input_content TEXT NOT NULL,
    posts JSONB NOT NULL DEFAULT '{}'::jsonb,
    platforms TEXT[] NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add tokens_used column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'generations'
        AND column_name = 'tokens_used'
    ) THEN
        ALTER TABLE generations ADD COLUMN tokens_used integer DEFAULT 0;
    END IF;
END $$;

-- Rename columns if they exist (for backward compatibility)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'generations'
        AND column_name = 'content'
    ) THEN
        ALTER TABLE generations RENAME COLUMN content TO input_content;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'generations'
        AND column_name = 'generated_posts'
    ) THEN
        ALTER TABLE generations RENAME COLUMN generated_posts TO posts;
    END IF;
END $$;

-- Create or replace indexes
DROP INDEX IF EXISTS generations_user_id_idx;
DROP INDEX IF EXISTS generations_created_at_idx;
CREATE INDEX generations_user_id_idx ON generations(user_id);
CREATE INDEX generations_created_at_idx ON generations(created_at DESC);

-- Enable Row Level Security if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Users can view their own generations" ON generations;
DROP POLICY IF EXISTS "Users can insert their own generations" ON generations;

-- Create RLS policies for users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile"
            ON users FOR SELECT
            USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile"
            ON users FOR UPDATE
            USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' AND policyname = 'Enable insert for authenticated users'
    ) THEN
        CREATE POLICY "Enable insert for authenticated users"
            ON users FOR INSERT
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Create RLS policies for generations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'generations' AND policyname = 'Users can view their own generations'
    ) THEN
        CREATE POLICY "Users can view their own generations"
            ON generations FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'generations' AND policyname = 'Users can insert their own generations'
    ) THEN
        CREATE POLICY "Users can insert their own generations"
            ON generations FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.generations TO authenticated;

-- Update or create the user creation trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, subscription_tier, usage_count, usage_limit)
    VALUES (
        NEW.id,
        NEW.email,
        'free',
        0,
        10
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 