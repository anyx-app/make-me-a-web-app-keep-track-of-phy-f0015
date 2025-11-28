import { supabase } from '@/sdk/supabase';

export interface User {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  created_at?: string;
}

export interface FriendRequest {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at?: string;
}

export interface FriendRequestWithUser extends FriendRequest {
  requester?: User;
  recipient?: User;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
}

export const friendService = {
  async ensureUserExists(userId: string, email: string, username?: string): Promise<User> {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingUser) {
        return existingUser as User;
      }

      const defaultUsername = username || email.split('@')[0] + '_' + userId.substring(0, 8);
      
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email,
          username: defaultUsername,
          display_name: email.split('@')[0]
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create user: ${error}`);
      }

      return newUser as User;
    } catch (error) {
      console.error('Error ensuring user exists:', error);
      throw error;
    }
  },

  async searchUsersByUsername(query: string): Promise<User[]> {
    try {
      if (!query || query.trim().length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', `%${query.trim()}%`)
        .limit(10);

      if (error) {
        throw new Error(`Failed to search users: ${error}`);
      }

      return (data || []) as User[];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  async sendFriendRequest(requesterId: string, recipientUsername: string): Promise<FriendRequest> {
    try {
      const { data: recipient } = await supabase
        .from('users')
        .select('*')
        .eq('username', recipientUsername)
        .single();

      if (!recipient) {
        throw new Error('User not found');
      }

      if (recipient.id === requesterId) {
        throw new Error('You cannot send a friend request to yourself');
      }

      const { data: existingRequest } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('requester_id', requesterId)
        .eq('recipient_id', recipient.id)
        .single();

      if (existingRequest) {
        throw new Error('Friend request already sent');
      }

      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', requesterId)
        .eq('friend_id', recipient.id)
        .eq('status', 'accepted')
        .single();

      if (existingFriendship) {
        throw new Error('Already friends');
      }

      const { data: newRequest, error } = await supabase
        .from('friend_requests')
        .insert({
          requester_id: requesterId,
          recipient_id: recipient.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to send friend request: ${error}`);
      }

      return newRequest as FriendRequest;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  async getIncomingRequests(userId: string): Promise<FriendRequestWithUser[]> {
    try {
      const { data: requests } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('recipient_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!requests || requests.length === 0) {
        return [];
      }

      const requesterIds = requests.map((r: FriendRequest) => r.requester_id);
      const { data: requesters } = await supabase
        .from('users')
        .select('*')
        .in('id', requesterIds);

      const requestersMap = new Map<string, User>();
      (requesters || []).forEach((user: User) => {
        requestersMap.set(user.id, user);
      });

      return requests.map((req: FriendRequest) => ({
        ...req,
        requester: requestersMap.get(req.requester_id)
      }));
    } catch (error) {
      // Use console.warn since we gracefully return empty array
      console.warn('Error getting incoming requests:', error);
      return [];
    }
  },

  async getOutgoingRequests(userId: string): Promise<FriendRequestWithUser[]> {
    try {
      const { data: requests } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('requester_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!requests || requests.length === 0) {
        return [];
      }

      const recipientIds = requests.map((r: FriendRequest) => r.recipient_id);
      const { data: recipients } = await supabase
        .from('users')
        .select('*')
        .in('id', recipientIds);

      const recipientsMap = new Map<string, User>();
      (recipients || []).forEach((user: User) => {
        recipientsMap.set(user.id, user);
      });

      return requests.map((req: FriendRequest) => ({
        ...req,
        recipient: recipientsMap.get(req.recipient_id)
      }));
    } catch (error) {
      // Use console.warn since we gracefully return empty array
      console.warn('Error getting outgoing requests:', error);
      return [];
    }
  },

  async acceptFriendRequest(requestId: string, userId: string): Promise<void> {
    try {
      const { data: request } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('id', requestId)
        .eq('recipient_id', userId)
        .single();

      if (!request) {
        throw new Error('Friend request not found');
      }

      const friendRequest = request as FriendRequest;

      await supabase
        .from('friend_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      await supabase.from('friendships').insert([
        {
          user_id: friendRequest.requester_id,
          friend_id: friendRequest.recipient_id,
          status: 'accepted'
        },
        {
          user_id: friendRequest.recipient_id,
          friend_id: friendRequest.requester_id,
          status: 'accepted'
        }
      ]);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },

  async declineFriendRequest(requestId: string, userId: string): Promise<void> {
    try {
      const { data: request } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('id', requestId)
        .eq('recipient_id', userId)
        .single();

      if (!request) {
        throw new Error('Friend request not found');
      }

      await supabase
        .from('friend_requests')
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .eq('id', requestId);
    } catch (error) {
      console.error('Error declining friend request:', error);
      throw error;
    }
  },

  async getFriends(userId: string): Promise<User[]> {
    try {
      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (!friendships || friendships.length === 0) {
        return [];
      }

      const friendIds = friendships.map((f: Friendship) => f.friend_id);
      const { data: friends } = await supabase
        .from('users')
        .select('*')
        .in('id', friendIds);

      return (friends || []) as User[];
    } catch (error) {
      // Use console.warn since we gracefully return empty array
      console.warn('Error getting friends:', error);
      return [];
    }
  },

  async removeFriend(userId: string, friendId: string): Promise<void> {
    try {
      await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId);

      await supabase
        .from('friendships')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', userId);
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }
};
