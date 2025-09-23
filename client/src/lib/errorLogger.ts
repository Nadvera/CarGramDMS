export class ErrorLogger {
  static log(error: Error, context?: string) {
    const timestamp = new Date().toISOString();

    const errorInfo = {
      timestamp,
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Always log to console in development
    if (import.meta.env.MODE === 'development') {
      console.group(`🚨 Error ${context ? `(${context})` : ''}`);
      console.error('Error:', error);
      console.table(errorInfo);
      console.groupEnd();
    }

    // In production, you might want to send to a logging service
    if (import.meta.env.MODE === 'production') {
      // Send to your logging service
      this.sendToLoggingService(errorInfo);
    }

    return errorInfo;
  }

  private static sendToLoggingService(errorInfo: any) {
    // This could send to your backend, Sentry, LogRocket, etc.
    fetch('/api/logs/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorInfo),
    }).catch(() => {
      // Silently fail if logging service is down
    });
  }

  static setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.log(new Error(`Unhandled Promise Rejection: ${event.reason}`), 'Promise Rejection');
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.log(new Error(event.message), 'Global Error');
    });
  }
}