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

  async getDealerSignups(): Promise<DealerSignup[]> {
    console.log("Fetching all dealer signups...");

    const { data, error } = await supabase
      .from('dealer_signups')
      .select('*')
      .order('signup_at', { ascending: false });

    if (error) {
      console.error("Error fetching dealer signups:", error);
      throw new Error(`Failed to fetch dealer signups: ${error.message}`);
    }

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
  },

  // Add subscription stats method
  async getSubscriptionStats() {
    const { count, error } = await supabase
      .from('email_subscriptions')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return {
      totalSubscriptions: count || 0,
      activeSubscriptions: count || 0 // Since we don't have inactive subscriptions in our schema
    };
  },

  // Sales agent methods
  async getSalesAgents() {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('is_active', 'true')
      .order('first_name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getSalesAgentById(id: string) {
    const { data, error } = await supabase
      .from('sales_agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  },

  async createSalesAgent(agentData: any) {
    const { data, error } = await supabase
      .from('sales_agents')
      .insert([agentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update method names to match interface
  async createEmailSubscription(subscription: InsertEmailSubscription) {
    return this.addEmailSubscription(subscription);
  },

  async createDealerSignup(data: InsertDealerSignup): Promise<DealerSignup> {
    console.log("Creating dealer signup with data:", data);

    const { data: result, error } = await supabase
      .from('dealer_signups')
      .insert({
        dealership_name: data.dealershipName,
        contact_person: data.contactPerson,
        email: data.email,
        phone: data.phone,
        location: data.location,
        message: data.message,
        sales_agent_id: data.salesAgentId,
        signup_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Database error during dealer signup:", error);
      throw new Error(`Failed to create dealer signup: ${error.message}`);
    }

    return result;
  },

  async performDataAssessment(): Promise<any> {
    console.log("Performing comprehensive data assessment...");

    try {
      // Get table information
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_type')
        .eq('table_schema', 'public');

      if (tablesError) {
        console.log("Could not fetch table info, proceeding with basic assessment...");
      }

      // Assess each table we know about
      const assessments = {};

      // Email subscriptions assessment
      const { data: emailData, error: emailError } = await supabase
        .from('email_subscriptions')
        .select('*', { count: 'exact', head: true });

      const { data: emailSample } = await supabase
        .from('email_subscriptions')
        .select('*')
        .limit(5);

      assessments['email_subscriptions'] = {
        total_records: emailData?.length || 0,
        fields: emailSample && emailSample.length > 0 ? Object.keys(emailSample[0]) : [],
        sample_data: emailSample?.slice(0, 2) || [],
        table_exists: !emailError
      };

      // Dealer signups assessment
      const { data: dealerData, error: dealerError } = await supabase
        .from('dealer_signups')
        .select('*', { count: 'exact', head: true });

      const { data: dealerSample } = await supabase
        .from('dealer_signups')
        .select('*')
        .limit(5);

      // Analyze dealer signup field completeness
      const fieldAnalysis = {};
      if (dealerSample && dealerSample.length > 0) {
        const fields = Object.keys(dealerSample[0]);
        fields.forEach(field => {
          const nonNullCount = dealerSample.filter(record => record[field] !== null && record[field] !== '').length;
          fieldAnalysis[field] = {
            completion_rate: `${Math.round((nonNullCount / dealerSample.length) * 100)}%`,
            sample_values: dealerSample.map(record => record[field]).filter(val => val !== null && val !== '').slice(0, 3)
          };
        });
      }

      assessments['dealer_signups'] = {
        total_records: dealerData?.length || 0,
        fields: dealerSample && dealerSample.length > 0 ? Object.keys(dealerSample[0]) : [],
        field_analysis: fieldAnalysis,
        sample_data: dealerSample?.slice(0, 2) || [],
        table_exists: !dealerError,
        sales_agent_field_exists: dealerSample && dealerSample.length > 0 && dealerSample[0].hasOwnProperty('sales_agent')
      };

      // Users assessment
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      assessments['users'] = {
        total_records: userData?.length || 0,
        table_exists: !userError
      };

      return {
        database_connected: true,
        tables_assessed: Object.keys(assessments),
        assessments,
        recommendations: [
          dealerSample && dealerSample.length > 0 && !dealerSample[0].hasOwnProperty('sales_agent')
            ? "Add sales_agent column to dealer_signups table"
            : "Sales agent field is properly configured",
          assessments['dealer_signups']?.total_records === 0
            ? "No dealer signups found - consider adding test data"
            : `Found ${assessments['dealer_signups']?.total_records} dealer signups`,
          assessments['email_subscriptions']?.total_records === 0
            ? "No email subscriptions found"
            : `Found ${assessments['email_subscriptions']?.total_records} email subscriptions`
        ]
      };

    } catch (error) {
      console.error("Data assessment error:", error);
      throw new Error(`Data assessment failed: ${error.message}`);
    }
  }
};