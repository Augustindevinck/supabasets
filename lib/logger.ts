/**
 * Logger Utility - Senior Clean Code Logging System
 * Unified logging across the entire application
 * Handles different environments and log levels
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LogContext {
  module?: string;
  userId?: string | number;
  requestId?: string;
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error | string;
  stack?: string;
}

class Logger {
  private isDevelopment: boolean;
  private minLogLevel: LogLevel;

  constructor() {
    this.isDevelopment =
      typeof window === "undefined"
        ? process.env.NODE_ENV === "development"
        : process.env.NEXT_PUBLIC_ENV === "development";

    // In production, only log WARN and ERROR
    // In development, log everything
    this.minLogLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const minIndex = levels.indexOf(this.minLogLevel);
    const levelIndex = levels.indexOf(level);
    return levelIndex >= minIndex;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;

    let log = `[${timestamp}] [${level}]`;

    if (context?.module) {
      log += ` [${context.module}]`;
    }

    log += ` ${message}`;

    if (context && Object.keys(context).length > 0) {
      const contextStr = JSON.stringify(context, null, 2);
      log += ` | Context: ${contextStr}`;
    }

    if (error) {
      const errorStr =
        typeof error === "string" ? error : error.toString();
      log += ` | Error: ${errorStr}`;

      if (entry.stack) {
        log += `\n${entry.stack}`;
      }
    }

    return log;
  }

  private getConsoleMethod(
    level: LogLevel
  ): (...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error | string
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: this.formatTimestamp(),
      context,
      error,
      stack: error instanceof Error ? error.stack : undefined,
    };

    const formattedLog = this.formatLog(entry);
    const consoleMethod = this.getConsoleMethod(level);

    // Use style for browsers
    if (typeof window !== "undefined") {
      const colors: Record<LogLevel, string> = {
        DEBUG: "color: #0000ff",
        INFO: "color: #008000",
        WARN: "color: #ff8800",
        ERROR: "color: #ff0000",
      };

      consoleMethod(`%c${formattedLog}`, colors[level]);

      if (error instanceof Error) {
        consoleMethod(error);
      }
    } else {
      // Server-side: plain text
      consoleMethod(formattedLog);

      if (error instanceof Error) {
        consoleMethod(error);
      }
    }
  }

  /**
   * Debug level - detailed information for diagnosing problems
   */
  debug(
    message: string,
    context?: LogContext
  ): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info level - general informational messages
   */
  info(
    message: string,
    context?: LogContext
  ): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warn level - warning messages for potentially harmful situations
   */
  warn(
    message: string,
    context?: LogContext,
    error?: Error | string
  ): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  /**
   * Error level - error messages for error events
   */
  error(
    message: string,
    error?: Error | string,
    context?: LogContext
  ): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Performance tracking
   */
  startTimer(label: string): () => number {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.debug(`${label} completed in ${duration.toFixed(2)}ms`, {
        module: "Performance",
        duration: `${duration.toFixed(2)}ms`,
      });
      return duration;
    };
  }

  /**
   * API call logging
   */
  logApiCall(
    method: string,
    endpoint: string,
    status?: number,
    duration?: number
  ): void {
    const context: LogContext = {
      module: "API",
      method,
      endpoint,
      ...(status && { status }),
      ...(duration && { duration: `${duration.toFixed(2)}ms` }),
    };

    const level = status && status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
    this.log(level, `${method} ${endpoint}`, context);
  }

  /**
   * User action logging
   */
  logUserAction(
    action: string,
    userId?: string | number,
    details?: LogContext
  ): void {
    const context: LogContext = {
      module: "UserAction",
      action,
      ...(userId && { userId }),
      ...details,
    };

    this.log(LogLevel.INFO, `User action: ${action}`, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type-safe logger wrapper for specific modules
export function createModuleLogger(moduleName: string) {
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { module: moduleName, ...context }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { module: moduleName, ...context }),
    warn: (message: string, context?: LogContext, error?: Error | string) =>
      logger.warn(message, { module: moduleName, ...context }, error),
    error: (message: string, error?: Error | string, context?: LogContext) =>
      logger.error(message, error, { module: moduleName, ...context }),
    logApiCall: (
      method: string,
      endpoint: string,
      status?: number,
      duration?: number
    ) => logger.logApiCall(method, endpoint, status, duration),
    logUserAction: (
      action: string,
      userId?: string | number,
      details?: LogContext
    ) => logger.logUserAction(action, userId, details),
    startTimer: (label: string) => logger.startTimer(`[${moduleName}] ${label}`),
  };
}

export default logger;
