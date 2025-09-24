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
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  dealerLicense: text("dealer_license"),
  monthlyInventory: text("monthly_inventory").notNull(),
  currentSoftware: text("current_software"),
  interestedFeatures: text("interested_features").array(),
  salesAgentId: varchar("sales_agent_id"),
  signupAt: timestamp("signup_at").defaultNow().notNull(),
  status: varchar("status").default("pending").notNull(),
  notes: text("notes"),
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
  contactName: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  dealerLicense: true,
  monthlyInventory: true,
  currentSoftware: true,
  interestedFeatures: true,
  salesAgentId: true,
}).extend({
  dealershipName: z.string().min(1, "Dealership name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Please enter a valid zip code"),
  dealerLicense: z.string().optional(),
  monthlyInventory: z.string().min(1, "Monthly inventory is required"),
  currentSoftware: z.string().optional(),
  interestedFeatures: z.array(z.string()).default([]),
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
