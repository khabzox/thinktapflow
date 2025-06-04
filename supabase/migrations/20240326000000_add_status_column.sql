-- Add status column to generations table
ALTER TABLE generations 
ADD COLUMN IF NOT EXISTS status TEXT 
CHECK (status IN ('completed', 'archived', 'deleted')) 
DEFAULT 'completed';
 
-- Update existing rows to have the default status
UPDATE generations 
SET status = 'completed' 
WHERE status IS NULL; 