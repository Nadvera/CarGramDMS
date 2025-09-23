import { type User, type InsertUser, type EmailSubscription, type InsertEmailSubscription } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getEmailSubscriptionByEmail(email: string): Promise<EmailSubscription | undefined>;
  createEmailSubscription(subscription: InsertEmailSubscription): Promise<EmailSubscription>;
  getSubscriptionStats(): Promise<{ totalSubscriptions: number; activeSubscriptions: number }>;
  createDealerSignup(signup: InsertDealerSignup): Promise<any>;
}

import { pool, initializeDatabase } from "./db";

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize database on startup
    initializeDatabase().catch(console.error);
  }

  async getUser(id: string): Promise<User | undefined> {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM users WHERE id = $1", [id]);
      return result.rows[0] || undefined;
    } finally {
      client.release();
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM users WHERE username = $1", [username]);
      return result.rows[0] || undefined;
    } finally {
      client.release();
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO users (id, username, passwordHash, email, name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, email, name
      `;
      const values = [
        randomUUID(),
        insertUser.username,
        insertUser.passwordHash,
        insertUser.email,
        insertUser.name,
      ];
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getEmailSubscriptionByEmail(email: string): Promise<EmailSubscription | undefined> {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM email_subscriptions WHERE email = $1", [email]);
      return result.rows[0] || undefined;
    } finally {
      client.release();
    }
  }

  async createEmailSubscription(insertSubscription: InsertEmailSubscription): Promise<EmailSubscription> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO email_subscriptions (email, isActive)
        VALUES ($1, $2)
        RETURNING id, email, isActive, signup_at
      `;
      const values = [insertSubscription.email, insertSubscription.isActive];
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async getSubscriptionStats(): Promise<{ totalSubscriptions: number; activeSubscriptions: number }> {
    const client = await pool.connect();
    try {
      const allSubscriptionsResult = await client.query("SELECT * FROM email_subscriptions");
      const activeSubscriptionsResult = await client.query("SELECT * FROM email_subscriptions WHERE isActive = $1", [true]);

      return {
        totalSubscriptions: allSubscriptionsResult.rowCount,
        activeSubscriptions: activeSubscriptionsResult.rowCount,
      };
    } finally {
      client.release();
    }
  }

  async createDealerSignup(insertSignup: InsertDealerSignup): Promise<any> {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO dealer_signups (
          dealership_name, contact_name, email, phone, address,
          city, state, zip_code, dealer_license, monthly_inventory,
          current_software, interested_features
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, dealership_name, contact_name, email, signup_at
      `;

      const values = [
        insertSignup.dealershipName,
        insertSignup.contactName,
        insertSignup.email,
        insertSignup.phone,
        insertSignup.address,
        insertSignup.city,
        insertSignup.state,
        insertSignup.zipCode,
        insertSignup.dealerLicense,
        insertSignup.monthlyInventory,
        insertSignup.currentSoftware,
        insertSignup.interestedFeatures
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

export const storage = new DatabaseStorage();