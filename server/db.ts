
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Create tables if they don't exist
export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create dealer_signups table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dealer_signups (
        id SERIAL PRIMARY KEY,
        dealership_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        dealer_license TEXT,
        monthly_inventory TEXT NOT NULL,
        current_software TEXT,
        interested_features TEXT[],
        signup_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        notes TEXT
      )
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}
