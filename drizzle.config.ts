import { defineConfig } from "drizzle-kit";

// Use Supabase URL if DATABASE_URL is not set
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or SUPABASE_URL must be provided");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
