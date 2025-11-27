SET search_path TO proj_6a24a7eb;

-- Books table: stores unique book information
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn VARCHAR(13) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  summary TEXT,
  published_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User books table: tracks which books users own and reading status
CREATE TABLE IF NOT EXISTS user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Friendships table: bidirectional friendship relationships
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Lending requests table: tracks book borrowing requests between friends
CREATE TABLE IF NOT EXISTS lending_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  borrower_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'returned')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  returned_at TIMESTAMP WITH TIME ZONE,
  CHECK (owner_id != borrower_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_books_user_id ON user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_book_id ON user_books(book_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_lending_requests_owner ON lending_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_lending_requests_borrower ON lending_requests(borrower_id);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
