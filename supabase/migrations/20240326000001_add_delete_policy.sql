-- Add delete policy for generations table
CREATE POLICY "Users can delete their own generations"
    ON generations
    FOR DELETE
    USING (auth.uid() = user_id); 