import { z } from "zod";
import { getAnyxConfig } from "@/config/anyx";

// Error classes for precise UI handling
export class AuthError extends Error {
  public readonly status = 401 as const;
  constructor(message = "Unauthorized: invalid or missing x-api-key") {
    super(message);
    this.name = "AuthError";
  }
}

export class TierError extends Error {
  public readonly status = 403 as const;
  constructor(message = "Forbidden: tier does not allow requested feature/model") {
    super(message);
    this.name = "TierError";
  }
}

export class CreditExceededError extends Error {
  public readonly status = 402 as const;
  constructor(message = "Payment Required: credits exceeded for current period") {
    super(message);
    this.name = "CreditExceededError";
  }
}

export class RateLimitedError extends Error {
  public readonly status = 429 as const;
  public readonly retryAfterMs?: number;
  constructor(message = "Rate Limited", retryAfterMs?: number) {
    super(message);
    this.name = "RateLimitedError";
    this.retryAfterMs = retryAfterMs;
  }
}

export class ProviderError extends Error {
  public readonly status: number;
  constructor(status: number, message = "Provider/System error") {
    super(message);
    this.name = "ProviderError";
    this.status = status;
  }
}

export class HttpError extends Error {
  public readonly status: number;
  constructor(status: number, message = "HTTP error") {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export class InvalidResponseError extends Error {
  constructor(message = "Invalid response payload") {
    super(message);
    this.name = "InvalidResponseError";
  }
}

// Request/Response schemas
const LlmResponseSchema = z.object({
  success: z.boolean(),
  model: z.string(),
  text: z.string(),
  requestId: z.string().optional(),
});
export type LlmResponse = z.infer<typeof LlmResponseSchema>;

const VisionResponseSchema = z.object({
  success: z.boolean(),
  model: z.string(),
  text: z.string(),
  imagesProcessed: z.number(),
  requestId: z.string().optional(),
});
export type VisionResponse = z.infer<typeof VisionResponseSchema>;

const ImageResponseSchema = z.object({
  success: z.boolean(),
  model: z.string(),
  size: z.string(),
  image: z.unknown(),
  requestId: z.string().optional(),
});
export type ImageResponse = z.infer<typeof ImageResponseSchema>;

const EmailResponseSchema = z.object({
  success: z.boolean(),
  id: z.string(),
  requestId: z.string().optional(),
});
export type EmailResponse = z.infer<typeof EmailResponseSchema>;

const SmsResponseSchema = z.object({
  success: z.boolean(),
  sid: z.string(),
  requestId: z.string().optional(),
});
export type SmsResponse = z.infer<typeof SmsResponseSchema>;

// Request types
export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LlmRequest = {
  model: string; // server-side enforces tier/model policy
  messages: LlmMessage[];
};

export type VisionRequest = {
  prompt: string;
  images: string[]; // URLs or base64 data URIs
  model?: "gpt-4o-mini" | "gpt-4o" | (string & object); // defaults to gpt-4o-mini
};

// OpenAI Images accepted sizes: 1024x1024, 1024x1536, 1536x1024, or 'auto'
export type ImageRequest = {
  prompt: string;
  size?: "1024x1024" | "1024x1536" | "1536x1024" | "auto" | (string & object);
};

export type EmailRequest = {
  to: string;
  subject: string;
  html: string;
};

export type SmsRequest = {
  to: string; // E.164 e.g. +15555550123
  body: string;
};

// Client config
export type AnyxClientOptions = {
  baseUrl?: string; // defaults to import.meta.env.VITE_ANYX_SERVER_URL
  projectId?: string; // defaults to import.meta.env.VITE_PROJECT_ID
  apiKey?: string; // optional; for server-side or test environments only
  retry?: {
    retries?: number; // default 2 (total attempts = retries + 1)
    backoffBaseMs?: number; // default 400ms
  };
};

// Public client interface
export type AnyxClient = {
  llm: (request: LlmRequest) => Promise<LlmResponse>;
  vision: (request: VisionRequest) => Promise<VisionResponse>;
  image: (request: ImageRequest) => Promise<ImageResponse>;
  email: (request: EmailRequest) => Promise<EmailResponse>;
  sms: (request: SmsRequest) => Promise<SmsResponse>;
  config: Readonly<{ baseUrl?: string; projectId?: string }>;
};

// Utilities
function joinUrl(base: string, path: string): string {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfter(headerValue: string | null): number | undefined {
  if (!headerValue) return undefined;
  const asInt = Number(headerValue);
  if (!Number.isNaN(asInt)) return asInt * 1000; // seconds to ms
  const date = Date.parse(headerValue);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return undefined;
}

async function doRequest<T>(
  baseUrl: string,
  projectId: string | undefined,
  apiKey: string | undefined,
  path: string,
  body: unknown,
  parse: (data: unknown) => T,
  retryCfg: { retries: number; backoffBaseMs: number }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (projectId) headers["x-project-id"] = projectId;
  if (apiKey) headers["x-api-key"] = apiKey; // only for server/test usage

  const url = joinUrl(baseUrl, path);

  let attempt = 0;
  // attempts = retries + 1
  const maxAttempts = Math.max(1, retryCfg.retries + 1);

  // keep the same body across retries
  const payload = JSON.stringify(body ?? {});

  while (attempt < maxAttempts) {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: payload,
    });

    if (res.status === 429) {
      attempt += 1;
      if (attempt >= maxAttempts) {
        const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));
        throw new RateLimitedError("Rate Limited", retryAfterMs);
      }
      const retryAfterHeaderMs = parseRetryAfter(res.headers.get("retry-after"));
      const backoffMs = retryAfterHeaderMs ?? Math.floor(retryCfg.backoffBaseMs * Math.pow(2, attempt - 1));
      await sleep(backoffMs);
      continue;
    }

    if (res.status === 401) {
      throw new AuthError();
    }
    if (res.status === 403) {
      throw new TierError();
    }
    if (res.status === 402) {
      throw new CreditExceededError();
    }
    if (res.status >= 500) {
      // try to extract message
      let message = "Provider/System error";
      try {
        const data = await res.json();
        if (data && typeof (data as Record<string, unknown>).message === "string") message = (data as Record<string, string>).message;
      } catch {
        // ignore
      }
      throw new ProviderError(res.status, message);
    }

    if (!res.ok) {
      // Other non-2xx
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        if (data && typeof (data as Record<string, unknown>).message === "string") message = (data as Record<string, string>).message;
      } catch {
        // ignore
      }
      throw new HttpError(res.status, message);
    }

    // success case
    let data: unknown;
    try {
      data = await res.json();
    } catch (err) {
      throw new InvalidResponseError("Failed to parse JSON response");
    }

    try {
      return parse(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new InvalidResponseError(err.message);
      }
      throw err;
    }
  }

  // Unreachable due to return/throws above
  throw new Error("Unexpected request flow");
}

export function createAnyxClient(options?: AnyxClientOptions): AnyxClient {
  const defaults = getAnyxConfig();
  const baseUrl = options?.baseUrl ?? defaults.serverUrl;
  const projectId = options?.projectId ?? defaults.projectId;
  const apiKey = options?.apiKey ?? defaults.apiKey; // allow via env for tests
  const retryCfg = {
    retries: options?.retry?.retries ?? 2,
    backoffBaseMs: options?.retry?.backoffBaseMs ?? 400,
  };

  if (!baseUrl) {
    // Do not throw immediately; allow consumer to pass baseUrl later when calling
    // but warn loudly to aid debugging.
    // eslint-disable-next-line no-console
    console.warn(
      "Anyx SDK: baseUrl is not set. Provide VITE_ANYX_SERVER_URL in .env or pass baseUrl to createAnyxClient()."
    );
  }

  return {
    llm: async (request: LlmRequest) => {
      if (!baseUrl) throw new Error("Anyx SDK baseUrl not configured");
      return doRequest<LlmResponse>(baseUrl, projectId, apiKey, "/api/common/llm", request, (data) => LlmResponseSchema.parse(data), retryCfg);
    },
    vision: async (request: VisionRequest) => {
      if (!baseUrl) throw new Error("Anyx SDK baseUrl not configured");
      const withDefaults = { model: "gpt-4o-mini" as const, ...request };
      return doRequest<VisionResponse>(baseUrl, projectId, apiKey, "/api/common/llm/vision", withDefaults, (data) => VisionResponseSchema.parse(data), retryCfg);
    },
    image: async (request: ImageRequest) => {
      if (!baseUrl) throw new Error("Anyx SDK baseUrl not configured");
      const withDefaults = { size: "1024x1024" as const, ...request };
      return doRequest<ImageResponse>(baseUrl, projectId, apiKey, "/api/common/image", withDefaults, (data) => ImageResponseSchema.parse(data), retryCfg);
    },
    email: async (request: EmailRequest) => {
      if (!baseUrl) throw new Error("Anyx SDK baseUrl not configured");
      return doRequest<EmailResponse>(baseUrl, projectId, apiKey, "/api/common/email", request, (data) => EmailResponseSchema.parse(data), retryCfg);
    },
    sms: async (request: SmsRequest) => {
      if (!baseUrl) throw new Error("Anyx SDK baseUrl not configured");
      return doRequest<SmsResponse>(baseUrl, projectId, apiKey, "/api/common/sms", request, (data) => SmsResponseSchema.parse(data), retryCfg);
    },
    config: Object.freeze({ baseUrl, projectId }),
  };
}


