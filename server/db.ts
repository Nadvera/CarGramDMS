import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be provided");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table_if_not_exists');

    // Create email_subscriptions table
    const { error: emailError } = await supabase.rpc('create_email_subscriptions_table_if_not_exists');

    // Create dealer_signups table  
    const { error: dealerError } = await supabase.rpc('create_dealer_signups_table_if_not_exists');

    console.log('Supabase tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}