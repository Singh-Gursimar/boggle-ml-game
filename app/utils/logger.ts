type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    };
    console.error(this.formatMessage('error', message, errorContext));
    
    // In production, you could send to error tracking service
    if (!this.isDevelopment && typeof window !== 'undefined') {
      // Example: Send to your error tracking service
      // trackError(message, errorContext);
    }
  }

  // Track game events for analytics
  trackEvent(eventName: string, properties?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.log(`[TRACK] ${eventName}`, properties);
    }
    
    // In production, integrate with analytics service
    // Example: analytics.track(eventName, properties);
  }
}

export const logger = new Logger();
