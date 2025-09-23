import { type User, type InsertUser, type EmailSubscription, type InsertEmailSubscription, type DealerSignup, type InsertDealerSignup } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getEmailSubscriptionByEmail(email: string): Promise<EmailSubscription | undefined>;
  createEmailSubscription(subscription: InsertEmailSubscription): Promise<EmailSubscription>;
  getSubscriptionStats(): Promise<{ totalSubscriptions: number; activeSubscriptions: number }>;
  createDealerSignup(signup: InsertDealerSignup): Promise<DealerSignup>;
  getAllDealerSignups(): Promise<DealerSignup[]>;
  getDealerSignup(id: string): Promise<DealerSignup | undefined>;
  updateDealerSignupStatus(id: string, status: string, notes?: string): Promise<DealerSignup | undefined>;
}

import { users, emailSubscriptions, dealerSignups } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getEmailSubscriptionByEmail(email: string): Promise<EmailSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(emailSubscriptions)
      .where(eq(emailSubscriptions.email, email));
    return subscription || undefined;
  }

  async createEmailSubscription(insertSubscription: InsertEmailSubscription): Promise<EmailSubscription> {
    const [subscription] = await db
      .insert(emailSubscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async getSubscriptionStats(): Promise<{ totalSubscriptions: number; activeSubscriptions: number }> {
    const allSubscriptions = await db.select().from(emailSubscriptions);
    const activeSubscriptions = allSubscriptions.filter(sub => sub.isActive === "true");
    
    return {
      totalSubscriptions: allSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
    };
  }

  async createDealerSignup(insertSignup: InsertDealerSignup): Promise<DealerSignup> {
    const [signup] = await db
      .insert(dealerSignups)
      .values(insertSignup)
      .returning();
    return signup;
  }

  async getAllDealerSignups(): Promise<DealerSignup[]> {
    return await db.select().from(dealerSignups);
  }

  async getDealerSignup(id: string): Promise<DealerSignup | undefined> {
    const [signup] = await db
      .select()
      .from(dealerSignups)
      .where(eq(dealerSignups.id, id));
    return signup || undefined;
  }

  async updateDealerSignupStatus(id: string, status: string, notes?: string): Promise<DealerSignup | undefined> {
    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const [signup] = await db
      .update(dealerSignups)
      .set(updateData)
      .where(eq(dealerSignups.id, id))
      .returning();
    return signup || undefined;
  }
}

export const storage = new DatabaseStorage();
