import { getSupabase } from './supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Get Supabase client for real-time features
 * Works for both project DB and centralized AnyX Realtime
 * 
 * - If project has DB: Uses project's own Supabase instance
 * - If no DB: Uses centralized AnyX Realtime (injected via same env vars)
 */
export const realtimeClient = getSupabase()

/**
 * Create namespaced channel for real-time features
 * 
 * Channel naming convention: anyx:{project_id}:{room_name}
 * This ensures isolation between projects when using centralized Realtime
 * 
 * @param roomName - Unique identifier for the room/channel (e.g., 'game-room-123', 'chat-lobby')
 * @returns RealtimeChannel instance
 * 
 * @example
 * ```typescript
 * const channel = createProjectChannel('poker-room-123')
 * 
 * // Listen for events
 * channel
 *   .on('broadcast', { event: 'player-action' }, (payload) => {
 *     console.log('Player action:', payload)
 *   })
 *   .subscribe()
 * 
 * // Send events
 * channel.send({
 *   type: 'broadcast',
 *   event: 'player-action',
 *   payload: { action: 'bet', amount: 100 }
 * })
 * ```
 */
export const createProjectChannel = (roomName: string): RealtimeChannel | null => {
  if (!realtimeClient) {
    console.warn('[Realtime] Supabase not configured, cannot create channel')
    return null
  }

  const projectId = import.meta.env.VITE_PROJECT_ID
  if (!projectId) {
    console.warn('[Realtime] VITE_PROJECT_ID not set, using unnamespaced channel')
    return realtimeClient.channel(roomName)
  }

  const channelName = `anyx:${projectId}:${roomName}`
  return realtimeClient.channel(channelName)
}

