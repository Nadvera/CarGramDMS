import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailSubscriptionSchema, insertDealerSignupSchema } from "@shared/schema";
import { z } from "zod";
import { sendDealerSignupNotification, sendDealerWelcomeEmail } from "./email";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://user:password@host:port/database",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Email subscription endpoint
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertEmailSubscriptionSchema.parse(req.body);

      // Check if email already exists
      const existingSubscription = await storage.getEmailSubscriptionByEmail(validatedData.email);

      if (existingSubscription) {
        return res.status(409).json({ 
          message: "Email already subscribed to our newsletter.",
          success: false 
        });
      }

      const subscription = await storage.createEmailSubscription(validatedData);

      res.json({ 
        message: "Successfully subscribed to Cargram newsletter!",
        success: true,
        subscriptionId: subscription.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0].message,
          success: false
        });
      }

      console.error("Email subscription error:", error);
      res.status(500).json({ 
        message: "Failed to subscribe. Please try again.",
        success: false
      });
    }
  });

  // Get subscription stats (for internal use)
  app.get("/api/subscription-stats", async (req, res) => {
    try {
      const stats = await storage.getSubscriptionStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching subscription stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Dealer signup endpoint
  app.post("/api/dealer-signup", async (req, res) => {
    try {
      const validatedData = insertDealerSignupSchema.parse(req.body);

      // Create dealer signup in database
      let signup;
      try {
        signup = await storage.createDealerSignup(validatedData);
        console.log("New dealer signup:", signup);
      } catch (dbError) {
        console.error("Database error during dealer signup:", dbError);
        return res.status(500).json({ 
          message: "Database connection error. Please try again later.",
          success: false
        });
      }

      // Send notification email to help@cargram.io
      const notificationSent = await sendDealerSignupNotification(validatedData);

      // Send welcome email to dealer
      const welcomeSent = await sendDealerWelcomeEmail(validatedData.email, validatedData.dealershipName);

      res.json({ 
        message: "Thank you for your interest in Cargram Pro! We'll be in touch within 24 hours.",
        success: true,
        signupId: signup.id,
        emailsStatus: {
          notificationSent,
          welcomeSent
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: error.errors[0].message,
          success: false,
          field: error.errors[0].path[0]
        });
      }

      console.error("Dealer signup error:", error);
      res.status(500).json({ 
        message: "Failed to submit signup. Please try again.",
        success: false
      });
    }
  });

  // Get all dealer signups (for testing)
  app.get("/api/dealer-signups", async (req, res) => {
    try {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM dealer_signups ORDER BY signup_at DESC');
        res.json({ signups: result.rows, count: result.rows.length });
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error fetching dealer signups:", error);
      res.status(500).json({ message: "Failed to fetch signups" });
    }
  });


  const httpServer = createServer(app);
  return httpServer;
}