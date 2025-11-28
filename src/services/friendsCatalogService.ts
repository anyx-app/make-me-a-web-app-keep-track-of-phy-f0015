import { supabase } from '@/sdk/supabase';

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  cover_url?: string;
  summary?: string;
  published_year?: number;
}

export interface FriendBook extends Book {
  owner_id: string;
  owner_username: string;
  owner_display_name?: string;
}

export const friendsCatalogService = {
  async searchFriendsCatalog(userId: string, searchQuery: string): Promise<FriendBook[]> {
    try {
      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (!friendships || friendships.length === 0) {
        return [];
      }

      const friendIds = friendships.map((f: { friend_id: string }) => f.friend_id);

      const { data: userBooks } = await supabase
        .from('user_books')
        .select('*')
        .in('user_id', friendIds);

      if (!userBooks || userBooks.length === 0) {
        return [];
      }

      const bookIds = [...new Set(userBooks.map((ub: { book_id: string }) => ub.book_id))];

      const { data: books } = await supabase
        .from('books')
        .select('*')
        .in('id', bookIds);

      if (!books || books.length === 0) {
        return [];
      }

      let filteredBooks = books;
      if (searchQuery && searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        filteredBooks = books.filter((book: Book) => 
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.isbn && book.isbn.includes(query))
        );
      }

      const { data: owners } = await supabase
        .from('users')
        .select('*')
        .in('id', friendIds);

      const ownersMap = new Map();
      (owners || []).forEach((owner: { id: string; username: string; display_name?: string }) => {
        ownersMap.set(owner.id, owner);
      });

      const userBooksMap = new Map();
      userBooks.forEach((ub: { book_id: string; user_id: string }) => {
        if (!userBooksMap.has(ub.book_id)) {
          userBooksMap.set(ub.book_id, []);
        }
        userBooksMap.get(ub.book_id).push(ub.user_id);
      });

      const friendBooks: FriendBook[] = [];
      filteredBooks.forEach((book: Book) => {
        const ownerIds = userBooksMap.get(book.id) || [];
        ownerIds.forEach((ownerId: string) => {
          const owner = ownersMap.get(ownerId);
          if (owner) {
            friendBooks.push({
              ...book,
              owner_id: ownerId,
              owner_username: owner.username,
              owner_display_name: owner.display_name
            });
          }
        });
      });

      return friendBooks;
    } catch (error) {
      // Use console.warn since we gracefully return empty array
      console.warn('Error searching friends catalog:', error);
      return [];
    }
  },

  async getFriendBookDetails(userId: string, bookId: string): Promise<FriendBook[]> {
    try {
      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (!friendships || friendships.length === 0) {
        return [];
      }

      const friendIds = friendships.map((f: { friend_id: string }) => f.friend_id);

      const { data: userBooks } = await supabase
        .from('user_books')
        .select('*')
        .eq('book_id', bookId)
        .in('user_id', friendIds);

      if (!userBooks || userBooks.length === 0) {
        return [];
      }

      const { data: book } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      if (!book) {
        return [];
      }

      const ownerIds = userBooks.map((ub: { user_id: string }) => ub.user_id);
      const { data: owners } = await supabase
        .from('users')
        .select('*')
        .in('id', ownerIds);

      const ownersMap = new Map();
      (owners || []).forEach((owner: { id: string; username: string; display_name?: string }) => {
        ownersMap.set(owner.id, owner);
      });

      return userBooks.map((ub: { user_id: string }) => {
        const owner = ownersMap.get(ub.user_id);
        return {
          ...book,
          owner_id: ub.user_id,
          owner_username: owner?.username || 'Unknown',
          owner_display_name: owner?.display_name
        };
      });
    } catch (error) {
      // Use console.warn since we gracefully return empty array
      console.warn('Error getting friend book details:', error);
      return [];
    }
  }
};
