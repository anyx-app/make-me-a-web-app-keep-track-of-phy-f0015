/**
 * Dual-mode authentication library
 * 
 * Automatically switches between:
 * - Native Supabase Auth (dedicated instances)
 * - Backend Proxy Auth (shared schema projects)
 * 
 * Determined by VITE_USE_BACKEND_AUTH environment variable
 */

import { supabase } from '@/integrations/supabase/client';

const USE_BACKEND_AUTH = import.meta.env.VITE_USE_BACKEND_AUTH === 'true';
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
const BACKEND_URL = import.meta.env.VITE_ANYX_SERVER_URL || 'https://anyx.dev';
const SESSION_KEY = 'anyx.auth.session';

// Validation for backend auth mode
if (USE_BACKEND_AUTH && !PROJECT_ID) {
  console.error('❌ VITE_USE_BACKEND_AUTH is true but VITE_PROJECT_ID is missing');
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
  };
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface AuthResponse {
  user?: {
    id: string;
    email: string;
  };
  session?: AuthSession;
  message?: string;
  error?: string;
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  if (USE_BACKEND_AUTH) {
    const res = await fetch(`${BACKEND_URL}/api/projects/${PROJECT_ID}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const error = await res.json();
      return { error: error.error || 'Signup failed' };
    }
    
    const data = await res.json();
    
    // Backend signup doesn't return session (user must login separately)
    return data;
  }
  
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  
  return {
    user: data.user ? { id: data.user.id, email: data.user.email || '' } : undefined,
    session: data.session ? {
      user: { id: data.user!.id, email: data.user!.email || '' },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: Date.now() + 3600 * 1000 // 1 hour default
    } : undefined
  };
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  if (USE_BACKEND_AUTH) {
    const res = await fetch(`${BACKEND_URL}/api/projects/${PROJECT_ID}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const error = await res.json();
      return { error: error.error || 'Login failed' };
    }
    
    const data = await res.json();
    
    if (data.session) {
      // Convert expires_at from seconds to milliseconds if needed
      const session = {
        ...data.session,
        expires_at: data.session.expires_at * 1000 // Supabase returns seconds
      };
      setSession(session);
      return { ...data, session };
    }
    
    return data;
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  
  const session = data.session ? {
    user: { id: data.user.id, email: data.user.email || '' },
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: Date.now() + 3600 * 1000
  } : undefined;
  
  return {
    user: data.user ? { id: data.user.id, email: data.user.email || '' } : undefined,
    session
  };
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(
  provider: 'google' | 'github' | 'azure' | 'facebook' | 'gitlab' | 'bitbucket',
  redirectTo?: string
) {
  const redirect = redirectTo || window.location.origin + '/auth/callback';
  
  if (USE_BACKEND_AUTH) {
    const res = await fetch(`${BACKEND_URL}/api/projects/${PROJECT_ID}/auth/oauth/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirect_to: redirect })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'OAuth initiation failed');
    }
    
    const { auth_url } = await res.json();
    window.location.href = auth_url;
    return;
  }
  
  await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirect }
  });
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  if (USE_BACKEND_AUTH) {
    clearSession();
    window.location.href = '/auth';
    return;
  }
  
  await supabase.auth.signOut();
}

/**
 * Get current session (backend auth mode only)
 */
export function getSession(): AuthSession | null {
  if (!USE_BACKEND_AUTH) return null;
  
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  
  try {
    const session = JSON.parse(sessionStr);
    
    if (session.expires_at && session.expires_at < Date.now()) {
      clearSession();
      return null;
    }
    
    return session;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Set session (backend auth mode only)
 */
export function setSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Trigger custom event for same-tab updates (storage event only fires in other tabs)
  window.dispatchEvent(new CustomEvent('auth-session-change', { detail: session }));
}

/**
 * Clear session (backend auth mode only)
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  // Trigger custom event for same-tab updates
  window.dispatchEvent(new CustomEvent('auth-session-change', { detail: null }));
}

