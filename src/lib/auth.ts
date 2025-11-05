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

// Validation for backend auth mode
if (USE_BACKEND_AUTH && !PROJECT_ID) {
  console.error('❌ VITE_USE_BACKEND_AUTH is true but VITE_PROJECT_ID is missing');
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string) {
  if (USE_BACKEND_AUTH) {
    const res = await fetch(`${BACKEND_URL}/api/projects/${PROJECT_ID}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    return await res.json();
  }
  
  return await supabase.auth.signUp({ email, password });
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string) {
  if (USE_BACKEND_AUTH) {
    const res = await fetch(`${BACKEND_URL}/api/projects/${PROJECT_ID}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return await res.json();
  }
  
  return await supabase.auth.signInWithPassword({ email, password });
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
export async function signOut() {
  return await supabase.auth.signOut();
}

/**
 * Get current session
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Get current user
 */
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

