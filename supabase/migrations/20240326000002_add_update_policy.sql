-- Add update policy for generations table
CREATE POLICY "Users can update their own generations"
    ON generations
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id); 