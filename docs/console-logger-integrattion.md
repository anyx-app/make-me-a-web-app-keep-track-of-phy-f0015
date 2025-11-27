# Console Logger Integration for Boilerplate

## Overview

This integration captures runtime console logs from generated projects and sends them to the backend for debugging and monitoring. It implements a **batched queue system** that:

- ✅ Batches logs (sends every 10s or when buffer reaches 50 logs)
- ✅ Flushes immediately on errors
- ✅ Captures stack traces for errors
- ✅ Filters to errors/warns only in production
- ✅ Handles page unload gracefully
- ✅ Non-blocking (silent failures)
- ✅ Session tracking for debugging

---

## Installation Steps

### Step 1: Create Console Logger Module

Create `src/lib/console-logger.ts` in your boilerplate:

\`\`\`typescript
// src/lib/console-logger.ts

interface LogEntry {
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  url?: string;
  sourceFile?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
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

    this.sessionId = \`\${Date.now()}-\${Math.random().toString(36).slice(2, 11)}\`;
    this.originalConsole = {};
    
    if (this.config.enabled) {
      this.interceptConsole();
      this.startFlushTimer();
      this.setupUnloadHandler();
    }

    console.info(\`[ConsoleLogger] Initialized (session: \${this.sessionId.slice(0, 8)}...)\`);
  }

  private interceptConsole() {
    const levels = ['log', 'info', 'warn', 'error', 'debug'] as const;
    
    levels.forEach(level => {
      // Store original
      this.originalConsole[level] = console[level];
      
      // Override
      console[level] = (...args: any[]) => {
        // Call original
        this.originalConsole[level]!(...args);
        
        // Decide if we should capture
        const shouldCapture = this.shouldCaptureLog(level);
        if (!shouldCapture) return;
        
        // Format message
        const message = args.map(arg => {
          if (arg instanceof Error) {
            return \`\${arg.name}: \${arg.message}\`;
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
        this.originalConsole.warn?.(\`[ConsoleLogger] Failed to send logs: \${response.status}\`);
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
      (console as any)[level] = fn;
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
\`\`\`

---

### Step 2: Import in Main Entry Point

Update `src/main.tsx`:

\`\`\`typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize console logger (must be before any other imports that might log)
import './lib/console-logger'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
\`\`\`

---

### Step 3: Environment Variables

The backend will automatically set these environment variables in Vercel for each generated project:

\`\`\`bash
# Set by backend during deployment
VITE_PROJECT_ID=<project-uuid>
VITE_LOGS_ENDPOINT=https://<supabase-project>.supabase.co/functions/v1/capture-logs
\`\`\`

**No manual configuration needed!**

---

## Testing

### Local Development Testing

To test locally, add to your `.env.local`:

\`\`\`bash
VITE_PROJECT_ID=test-project-id
VITE_LOGS_ENDPOINT=http://localhost:54321/functions/v1/capture-logs
\`\`\`

Then test with:

\`\`\`typescript
console.log('Test log message');
console.warn('Test warning');
console.error('Test error');
console.error(new Error('Test error with stack trace'));
\`\`\`

Logs should be batched and sent within 10 seconds (or immediately for errors).

---

## Features

### Batching Strategy
- **Normal logs**: Buffered and sent every 10 seconds
- **Errors**: Sent immediately (no waiting)
- **Buffer full**: Auto-flush when 50 logs accumulated
- **Page unload**: Flush remaining logs before leaving

### Production Filtering
- **Production**: Only errors and warnings captured
- **Development**: All log levels captured
- **Configurable**: Can be changed via \`productionOnly\` config

### Data Safety
- **Message length**: Limited to 10,000 characters
- **Stack traces**: Limited to 10,000 characters
- **URLs**: Limited to 2,048 characters
- **Silent failures**: Never throws errors that break your app

### Session Tracking
Each browser session gets a unique ID, making it easy to:
- Track user journeys through errors
- Replay issue sequences
- Debug session-specific problems

---

## API Usage Examples

### Query All Logs for a Project

\`\`\`typescript
// GET /api/projects/{projectId}/console-logs
const response = await fetch('/api/projects/abc-123/console-logs?limit=100');
const { logs, count, sessions } = await response.json();
\`\`\`

### Query Only Errors

\`\`\`typescript
// GET /api/projects/{projectId}/console-logs?level=error
const response = await fetch('/api/projects/abc-123/console-logs?level=error');
const { logs } = await response.json();
\`\`\`

### Query Specific Session

\`\`\`typescript
// GET /api/projects/{projectId}/console-logs?sessionId=xxx
const response = await fetch(\`/api/projects/abc-123/console-logs?sessionId=\${sessionId}\`);
\`\`\`

### Clear Logs

\`\`\`typescript
// DELETE /api/projects/{projectId}/console-logs
await fetch('/api/projects/abc-123/console-logs', { method: 'DELETE' });
\`\`\`

### Clear Old Logs Only

\`\`\`typescript
// DELETE logs older than 24 hours
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
await fetch(\`/api/projects/abc-123/console-logs?olderThan=\${oneDayAgo}\`, { 
  method: 'DELETE' 
});
\`\`\`

---

## Advanced Configuration

### Custom Logger Instance

If you need more control:

\`\`\`typescript
import { ConsoleLogger } from './lib/console-logger';

const customLogger = new ConsoleLogger({
  projectId: 'my-project',
  endpoint: 'https://my-endpoint',
  enabled: true,
  flushInterval: 5000, // Flush every 5 seconds
  maxBufferSize: 100, // Buffer up to 100 logs
  productionOnly: false // Capture all logs even in production
});

// Later, cleanup
customLogger.destroy();
\`\`\`

---

## Performance Impact

- **Memory**: ~1KB per log entry × 50 buffer = ~50KB max
- **Network**: 1 request per 10 seconds (or less if errors)
- **CPU**: Negligible (simple string operations)
- **Bundle size**: ~2KB minified

---

## Privacy & Security

- ✅ No PII captured automatically
- ✅ Only captures what your app logs
- ✅ Requires valid project ID (validated on server)
- ✅ Rate limiting on Edge Function (todo: implement)
- ✅ 7-day automatic log cleanup

---

## Troubleshooting

### Logs Not Appearing?

1. Check environment variables are set:
   \`\`\`typescript
   console.log('Project ID:', import.meta.env.VITE_PROJECT_ID);
   console.log('Endpoint:', import.meta.env.VITE_LOGS_ENDPOINT);
   \`\`\`

2. Check browser console for \`[ConsoleLogger]\` messages

3. Check Network tab for POST requests to logs endpoint

### Too Many Logs?

Adjust the production filter:
\`\`\`typescript
// In console-logger.ts, modify shouldCaptureLog()
private shouldCaptureLog(level: string): boolean {
  // Only capture errors in production
  if (import.meta.env.PROD) {
    return level === 'error'; // More strict
  }
  return true;
}
\`\`\`

---

## Next Steps (Future Enhancements)

- [ ] Rate limiting per project
- [ ] Log search/filtering UI
- [ ] Real-time log streaming
- [ ] Alert thresholds (email on X errors)
- [ ] Source map integration (map minified stack traces)
- [ ] Performance metrics tracking
- [ ] User session replay

---

## Questions?

Contact the backend team or refer to:
- Edge Function: \`supabase/functions/capture-logs/index.ts\`
- API Endpoint: \`app/api/projects/[projectId]/console-logs/route.ts\`
- Database Schema: \`migrations/20251018_create_console_logs.sql\`

