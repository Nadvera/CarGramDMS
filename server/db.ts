
import { Pool } from 'pg';

// Use a simple in-memory database fallback if no PostgreSQL is available
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/cargram";

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Add connection timeout and retry logic
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10
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
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        email TEXT,
        name TEXT
      )
    `);

    // Create email_subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_subscriptions (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        isActive BOOLEAN DEFAULT true,
        signup_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}
