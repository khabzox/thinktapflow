-- Create ai_metrics table to store generation metrics
CREATE TABLE ai_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    request_time TIMESTAMP WITH TIME ZONE NOT NULL,
    response_time TIMESTAMP WITH TIME ZONE NOT NULL,
    tokens_used INTEGER NOT NULL,
    character_count INTEGER NOT NULL,
    platform_count INTEGER NOT NULL,
    success BOOLEAN NOT NULL,
    error TEXT,
    provider_type TEXT NOT NULL,
    model_name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create content_parsing table to store parsed content
CREATE TABLE content_parsing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    extracted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    word_count INTEGER NOT NULL,
    reading_time INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create platform_constraints table to store platform-specific constraints
CREATE TABLE platform_constraints (
    platform TEXT PRIMARY KEY,
    max_length INTEGER NOT NULL,
    max_posts INTEGER NOT NULL,
    hashtag_count INTEGER NOT NULL,
    tone TEXT NOT NULL,
    format TEXT NOT NULL
);

-- Create user_ai_config table to store user-specific AI configurations
CREATE TABLE user_ai_config (
    user_id UUID PRIMARY KEY,
    provider_type TEXT NOT NULL DEFAULT 'groq',
    model TEXT,
    temperature FLOAT DEFAULT 0.7,
    max_tokens INTEGER,
    top_p FLOAT DEFAULT 1.0,
    include_emojis BOOLEAN DEFAULT true,
    default_target_audience TEXT,
    custom_instructions TEXT,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE ai_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_parsing ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_metrics
CREATE POLICY "Users can view their own metrics"
    ON ai_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
    ON ai_metrics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for content_parsing
CREATE POLICY "Users can view their own parsed content"
    ON content_parsing FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parsed content"
    ON content_parsing FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for platform_constraints
CREATE POLICY "Everyone can view platform constraints"
    ON platform_constraints FOR SELECT
    TO authenticated
    USING (true);

-- Create RLS policies for user_ai_config
CREATE POLICY "Users can view their own AI config"
    ON user_ai_config FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own AI config"
    ON user_ai_config FOR ALL
    USING (auth.uid() = user_id); 