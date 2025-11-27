// src/lib/console-logger.ts

interface LogEntry {
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  url?: string;
  sourceFile?: string;
  stackTrace?: string;
  metadata?: Record<string, unknown>;
}

interface LoggerConfig {
  projectId: string;
  endpoint: string;
  enabled?: boolean;
  flushInterval?: number;
  maxBufferSize?: number;
  productionOnly?: boolean;
}

class ConsoleLogger {
  private buffer: LogEntry[] = [];
  private sessionId: string;
  private config: Required<LoggerConfig>;
  private timer?: number;
  private originalConsole: Partial<Console>;

  constructor(config: LoggerConfig) {
    this.config = {
      enabled: true,
      flushInterval: 10000, // 10 seconds
      maxBufferSize: 50,
      productionOnly: true,
      ...config
    };

    this.sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    this.originalConsole = {};
    
    if (this.config.enabled) {
      this.interceptConsole();
      this.startFlushTimer();
      this.setupUnloadHandler();
    }

    console.info(`[ConsoleLogger] Initialized (session: ${this.sessionId.slice(0, 8)}...)`);
  }

  private interceptConsole() {
    const levels = ['log', 'info', 'warn', 'error', 'debug'] as const;
    
    levels.forEach(level => {
      // Store original
      this.originalConsole[level] = console[level];
      
      // Override
      console[level] = (...args: unknown[]) => {
        // Call original
        this.originalConsole[level]!(...args);
        
        // Decide if we should capture
        const shouldCapture = this.shouldCaptureLog(level);
        if (!shouldCapture) return;
        
        // Format message
        const message = args.map(arg => {
          if (arg instanceof Error) {
            return `${arg.name}: ${arg.message}`;
          }
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        }).join(' ');
        
        // Create log entry
        const entry: LogEntry = {
          level,
          message: message.substring(0, 10000), // Limit length
          timestamp: new Date().toISOString(),
          url: window.location.href,
        };
        
        // Capture stack trace for errors
        if (level === 'error') {
          const errorArg = args.find(arg => arg instanceof Error);
          if (errorArg?.stack) {
            entry.stackTrace = errorArg.stack.substring(0, 10000);
          } else {
            // Create stack trace
            try {
              throw new Error();
            } catch (e) {
              entry.stackTrace = (e as Error).stack?.substring(0, 10000);
            }
          }
        }
        
        // Add to buffer
        this.buffer.push(entry);
        
        // Flush immediately for errors
        if (level === 'error') {
          this.flush();
        } else if (this.buffer.length >= this.config.maxBufferSize) {
          this.flush();
        }
      };
    });
  }

  private shouldCaptureLog(level: string): boolean {
    // In production, only capture errors and warnings
    if (this.config.productionOnly && import.meta.env.PROD) {
      return ['error', 'warn'].includes(level);
    }
    
    // In development, capture all levels
    return true;
  }

  private startFlushTimer() {
    this.timer = window.setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  private setupUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
    
    // Also handle visibility change (mobile)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  private async flush() {
    if (this.buffer.length === 0) return;
    
    const logsToSend = [...this.buffer];
    this.buffer = [];
    
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: this.config.projectId,
          sessionId: this.sessionId,
          userAgent: navigator.userAgent,
          logs: logsToSend
        }),
        keepalive: true // Important for beforeunload
      });

      if (!response.ok) {
        // Use original console to avoid recursive logging
        this.originalConsole.warn?.(`[ConsoleLogger] Failed to send logs: ${response.status}`);
      }
    } catch (error) {
      // Silent fail - don't spam user with logging errors
      // Only log in development
      if (import.meta.env.DEV) {
        this.originalConsole.warn?.('[ConsoleLogger] Failed to send logs:', error);
      }
    }
  }

  public destroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.flush();
    
    // Restore original console methods
    Object.entries(this.originalConsole).forEach(([level, fn]) => {
      (console as unknown as Record<string, unknown>)[level] = fn;
    });
  }
}

// Auto-initialize if environment variables are set
let logger: ConsoleLogger | null = null;

const projectId = import.meta.env.VITE_PROJECT_ID;
const logsEndpoint = import.meta.env.VITE_LOGS_ENDPOINT;

if (projectId && logsEndpoint) {
  try {
    logger = new ConsoleLogger({
      projectId,
      endpoint: logsEndpoint,
      enabled: true,
      productionOnly: true
    });
  } catch (error) {
    console.error('[ConsoleLogger] Failed to initialize:', error);
  }
}

export { logger, ConsoleLogger };

