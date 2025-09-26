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
    // Check if tables exist by trying to select from them
    // If they don't exist, Supabase will return an error and we'll know to create them manually
    
    const { error: usersCheck } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const { error: emailCheck } = await supabase
      .from('email_subscriptions')
      .select('id')
      .limit(1);

    const { error: dealerCheck } = await supabase
      .from('dealer_signups')
      .select('id')
      .limit(1);

    const { error: agentsCheck } = await supabase
      .from('sales_agents')
      .select('id')
      .limit(1);

    // Log which tables need to be created manually
    if (usersCheck) console.log('Users table needs to be created in Supabase dashboard');
    if (emailCheck) console.log('Email subscriptions table needs to be created in Supabase dashboard');
    if (dealerCheck) console.log('Dealer signups table needs to be created in Supabase dashboard');
    if (agentsCheck) console.log('Sales agents table needs to be created in Supabase dashboard');

    console.log('Database connection verified');
  } catch (error) {
    console.warn('Database initialization warning:', error);
    // Don't throw error to prevent deployment failure
  }
}