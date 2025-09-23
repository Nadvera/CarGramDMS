import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { ErrorLogger } from "./lib/errorLogger";
import App from "./App";
import "./index.css";

// Setup global error handlers
ErrorLogger.setupGlobalHandlers();

// Initialize Sentry for error tracking
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "", // You'll need to set this in your environment
  environment: import.meta.env.MODE || "development",
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Only send errors in production, log them in development
    if (import.meta.env.DEV) {
      console.error('Sentry Event:', event);
      return null; // Don't send to Sentry in dev
    }
    return event;
  },
});

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={({ error, resetError }) => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <pre className="text-sm bg-gray-100 p-4 rounded mb-4 max-w-2xl overflow-auto">
          {error.message}
        </pre>
        <button 
          onClick={resetError}
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  )}>
    <App />
  </Sentry.ErrorBoundary>
);