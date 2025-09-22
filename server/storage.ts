import { type User, type InsertUser, type EmailSubscription, type InsertEmailSubscription } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getEmailSubscriptionByEmail(email: string): Promise<EmailSubscription | undefined>;
  createEmailSubscription(subscription: InsertEmailSubscription): Promise<EmailSubscription>;
  getSubscriptionStats(): Promise<{ totalSubscriptions: number; activeSubscriptions: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emailSubscriptions: Map<string, EmailSubscription>;

  constructor() {
    this.users = new Map();
    this.emailSubscriptions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEmailSubscriptionByEmail(email: string): Promise<EmailSubscription | undefined> {
    return Array.from(this.emailSubscriptions.values()).find(
      (subscription) => subscription.email === email,
    );
  }

  async createEmailSubscription(insertSubscription: InsertEmailSubscription): Promise<EmailSubscription> {
    const id = randomUUID();
    const subscription: EmailSubscription = {
      id,
      email: insertSubscription.email,
      subscribedAt: new Date(),
      isActive: "true",
    };
    this.emailSubscriptions.set(id, subscription);
    return subscription;
  }

  async getSubscriptionStats(): Promise<{ totalSubscriptions: number; activeSubscriptions: number }> {
    const allSubscriptions = Array.from(this.emailSubscriptions.values());
    const activeSubscriptions = allSubscriptions.filter(sub => sub.isActive === "true");
    
    return {
      totalSubscriptions: allSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
    };
  }
}

export const storage = new MemStorage();
