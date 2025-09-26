import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be provided");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `
    });

    // Create email_subscriptions table
    const { error: emailError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS email_subscriptions (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          subscribed_at TIMESTAMP DEFAULT NOW() NOT NULL,
          is_active VARCHAR DEFAULT 'true' NOT NULL
        );
      `
    });

    // Create dealer_signups table
    const { error: dealerError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS dealer_signups (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          dealership_name TEXT NOT NULL,
          contact_person TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT,
          location TEXT,
          message TEXT,
          signup_at TIMESTAMP DEFAULT NOW() NOT NULL,
          sales_agent VARCHAR
        );
      `
    });

    // Create sales_agents table
    const { error: agentsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS sales_agents (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          is_active VARCHAR DEFAULT 'true' NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `
    });

    if (usersError) console.error('Users table error:', usersError);
    if (emailError) console.error('Email subscriptions table error:', emailError);
    if (dealerError) console.error('Dealer signups table error:', dealerError);
    if (agentsError) console.error('Sales agents table error:', agentsError);

    console.log('Supabase tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't throw error to prevent deployment failure
  }
}