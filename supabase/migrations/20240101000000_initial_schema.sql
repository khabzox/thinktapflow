-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create generations table
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    input_content TEXT NOT NULL,
    generated_posts JSONB NOT NULL,
    platforms TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create monthly_usage table
CREATE TABLE monthly_usage (
    user_id UUID NOT NULL,
    month_year TEXT NOT NULL,
    generation_count INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY (user_id, month_year),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    user_id UUID PRIMARY KEY,
    paddle_subscription_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for generations table
CREATE POLICY "Users can view their own generations"
    ON generations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations"
    ON generations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for monthly_usage table
CREATE POLICY "Users can view their own usage"
    ON monthly_usage FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
    ON monthly_usage FOR ALL
    USING (auth.uid() = user_id);

-- Create RLS policies for subscriptions table
CREATE POLICY "Users can view their own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
    ON subscriptions FOR ALL
    USING (auth.uid() = user_id); 