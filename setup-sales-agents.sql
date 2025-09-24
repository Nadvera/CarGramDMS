
-- Create sales_agents table
CREATE TABLE IF NOT EXISTS sales_agents (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    is_active VARCHAR DEFAULT 'true' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Insert the sales agents: Brandon, Ron, and Karen
INSERT INTO sales_agents (first_name, last_name, email) VALUES
    ('Brandon', 'Martinez', 'brandon.martinez@cargram.io'),
    ('Ron', 'Thompson', 'ron.thompson@cargram.io'),
    ('Karen', 'Williams', 'karen.williams@cargram.io'),
    ('Alex', 'Rodriguez', 'alex.rodriguez@cargram.io'),
    ('Sarah', 'Johnson', 'sarah.johnson@cargram.io'),
    ('Mike', 'Chen', 'mike.chen@cargram.io'),
    ('Jessica', 'Williams', 'jessica.williams@cargram.io'),
    ('David', 'Thompson', 'david.thompson@cargram.io')
ON CONFLICT (email) DO NOTHING;

-- Update dealer_signups table to add sales_agent_id column if it doesn't exist
ALTER TABLE dealer_signups 
ADD COLUMN IF NOT EXISTS sales_agent_id VARCHAR;

-- Drop the old sales_agent column if it exists (optional cleanup)
-- ALTER TABLE dealer_signups DROP COLUMN IF EXISTS sales_agent;
