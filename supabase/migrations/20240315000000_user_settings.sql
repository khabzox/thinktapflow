-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    email_notifications BOOLEAN DEFAULT true,
    content_updates BOOLEAN DEFAULT true,
    marketing_updates BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view basic profile info" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;

-- Create policies for profiles
CREATE POLICY "Users can view basic profile info"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create policies for user_settings
CREATE POLICY "Users can view own settings"
    ON user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
    ON user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into profiles
    INSERT INTO profiles (id, full_name, email)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);

    -- Insert into user_settings
    INSERT INTO user_settings (user_id)
    VALUES (new.id);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user(); 