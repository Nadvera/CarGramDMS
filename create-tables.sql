
-- Create all required tables in Supabase
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMP DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS sales_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS dealer_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dealership_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    location TEXT,
    message TEXT,
    signup_at TIMESTAMP DEFAULT NOW() NOT NULL,
    sales_agent_id UUID REFERENCES sales_agents(id)
);

-- Insert sample sales agents
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
