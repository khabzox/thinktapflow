-- Create monthly_usage table
CREATE TABLE IF NOT EXISTS public.monthly_usage (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL,
    generation_count INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, month_year)
);

-- Add RLS policies
ALTER TABLE public.monthly_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
    ON public.monthly_usage
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert/update usage"
    ON public.monthly_usage
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create function to update monthly usage
CREATE OR REPLACE FUNCTION public.update_monthly_usage()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.monthly_usage (user_id, month_year, generation_count)
    VALUES (
        NEW.user_id,
        to_char(NEW.created_at::date, 'YYYY-MM'),
        1
    )
    ON CONFLICT (user_id, month_year)
    DO UPDATE SET
        generation_count = monthly_usage.generation_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on generations table
DROP TRIGGER IF EXISTS update_monthly_usage_trigger ON public.generations;
CREATE TRIGGER update_monthly_usage_trigger
    AFTER INSERT ON public.generations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_monthly_usage(); 