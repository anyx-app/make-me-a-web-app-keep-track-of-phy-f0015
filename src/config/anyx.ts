export type AnyxConfig = {
  serverUrl?: string;
  projectId?: string;
  apiKey?: string; // only used in server/test contexts
};

function readImportMetaEnv(): Partial<AnyxConfig> {
  const meta = import.meta as unknown as { env?: Record<string, unknown> };
  const env = meta.env ?? {};
  return {
    serverUrl: env.VITE_ANYX_SERVER_URL as string | undefined,
    projectId: env.VITE_PROJECT_ID as string | undefined,
    apiKey: env.ANYX_COMMON_API_KEY as string | undefined,
  };
}

function readProcessEnv(): Partial<AnyxConfig> {
  const env = typeof process !== "undefined" ? process.env ?? {} : {};
  return {
    serverUrl: env.VITE_ANYX_SERVER_URL || env.ANYX_SERVER_URL,
    projectId: env.VITE_PROJECT_ID || env.ANYX_PROJECT_ID,
    apiKey: env.ANYX_COMMON_API_KEY,
  };
}

export function getAnyxConfig(): AnyxConfig {
  // Process env first (SSR/tests), then import.meta.env (Vite runtime)
  const fromProcess = readProcessEnv();
  const fromImportMeta = readImportMetaEnv();
  const merged: AnyxConfig = { ...fromProcess, ...fromImportMeta };
  if (!merged.serverUrl) {
    merged.serverUrl = "https://anyx.dev";
  }
  return merged;
}


