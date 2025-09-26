import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const emailSubscriptions = pgTable("email_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  isActive: varchar("is_active").default("true").notNull(),
});

export const salesAgents = pgTable("sales_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  isActive: varchar("is_active").default("true").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dealerSignups = pgTable("dealer_signups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dealershipName: text("dealership_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  location: text("location"),
  message: text("message"),
  salesAgentId: varchar("sales_agent_id"),
  signupAt: timestamp("signup_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmailSubscriptionSchema = createInsertSchema(emailSubscriptions).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export const insertSalesAgentSchema = createInsertSchema(salesAgents).pick({
  firstName: true,
  lastName: true,
  email: true,
}).extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

export const insertDealerSignupSchema = createInsertSchema(dealerSignups).pick({
  dealershipName: true,
  contactPerson: true,
  email: true,
  phone: true,
  location: true,
  message: true,
  salesAgentId: true,
}).extend({
  dealershipName: z.string().min(1, "Dealership name is required"),
  contactPerson: z.string().min(1, "Contact person name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
  salesAgentId: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEmailSubscription = z.infer<typeof insertEmailSubscriptionSchema>;
export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertSalesAgent = z.infer<typeof insertSalesAgentSchema>;
export type SalesAgent = typeof salesAgents.$inferSelect;
export type InsertDealerSignup = z.infer<typeof insertDealerSignupSchema>;
export type DealerSignup = typeof dealerSignups.$inferSelect;
