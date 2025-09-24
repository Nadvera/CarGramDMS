import { type User, type InsertUser, type EmailSubscription, type InsertEmailSubscription, type InsertDealerSignup } from "@shared/schema";
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

import { supabase } from "./db";
import type { InsertEmailSubscription, InsertDealerSignup } from "@shared/schema";

export const storage = {
  // Email subscription methods
  async addEmailSubscription(subscription: InsertEmailSubscription) {
    const { data, error } = await supabase
      .from('email_subscriptions')
      .insert([subscription])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('409: Email already subscribed');
      }
      throw error;
    }

    return data;
  },

  async getEmailSubscriptionByEmail(email: string) {
    const { data, error } = await supabase
      .from('email_subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // Not found error is OK
      throw error;
    }

    return data;
  },

  // Dealer signup methods
  async addDealerSignup(signup: InsertDealerSignup) {
    const { data, error } = await supabase
      .from('dealer_signups')
      .insert([signup])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDealerSignups() {
    const { data, error } = await supabase
      .from('dealer_signups')
      .select('*')
      .order('signup_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // User methods (for future use)
  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  async createUser(userData: any) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};