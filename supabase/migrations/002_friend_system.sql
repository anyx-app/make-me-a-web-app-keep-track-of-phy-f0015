SET search_path TO proj_6a24a7eb;

-- Users table: stores user profile information including username for search
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friend requests table: tracks one-way friend requests before acceptance
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id),
  CHECK (requester_id != recipient_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_friend_requests_requester ON friend_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_recipient ON friend_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);

-- RLS Policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_all" ON users;
CREATE POLICY "users_select_all" ON users 
  FOR SELECT 
  USING ((auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb');

DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" ON users 
  FOR INSERT 
  WITH CHECK ((auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb');

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users 
  FOR UPDATE 
  USING ((auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' AND id = (auth.jwt() ->> 'sub')::uuid)
  WITH CHECK ((auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' AND id = (auth.jwt() ->> 'sub')::uuid);

-- RLS Policies for friend_requests table
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friend_requests_select" ON friend_requests;
CREATE POLICY "friend_requests_select" ON friend_requests 
  FOR SELECT 
  USING (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND (requester_id = (auth.jwt() ->> 'sub')::uuid OR recipient_id = (auth.jwt() ->> 'sub')::uuid)
  );

DROP POLICY IF EXISTS "friend_requests_insert" ON friend_requests;
CREATE POLICY "friend_requests_insert" ON friend_requests 
  FOR INSERT 
  WITH CHECK (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND requester_id = (auth.jwt() ->> 'sub')::uuid
  );

DROP POLICY IF EXISTS "friend_requests_update" ON friend_requests;
CREATE POLICY "friend_requests_update" ON friend_requests 
  FOR UPDATE 
  USING (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND recipient_id = (auth.jwt() ->> 'sub')::uuid
  )
  WITH CHECK (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND recipient_id = (auth.jwt() ->> 'sub')::uuid
  );

DROP POLICY IF EXISTS "friend_requests_delete" ON friend_requests;
CREATE POLICY "friend_requests_delete" ON friend_requests 
  FOR DELETE 
  USING (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND (requester_id = (auth.jwt() ->> 'sub')::uuid OR recipient_id = (auth.jwt() ->> 'sub')::uuid)
  );

-- Update existing friendships table RLS policies
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friendships_select" ON friendships;
CREATE POLICY "friendships_select" ON friendships 
  FOR SELECT 
  USING (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND (user_id = (auth.jwt() ->> 'sub')::uuid OR friend_id = (auth.jwt() ->> 'sub')::uuid)
  );

DROP POLICY IF EXISTS "friendships_insert" ON friendships;
CREATE POLICY "friendships_insert" ON friendships 
  FOR INSERT 
  WITH CHECK ((auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb');

DROP POLICY IF EXISTS "friendships_delete" ON friendships;
CREATE POLICY "friendships_delete" ON friendships 
  FOR DELETE 
  USING (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND (user_id = (auth.jwt() ->> 'sub')::uuid OR friend_id = (auth.jwt() ->> 'sub')::uuid)
  );

-- Update user_books RLS policies
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_books_select" ON user_books;
CREATE POLICY "user_books_select" ON user_books 
  FOR SELECT 
  USING ((auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb');

DROP POLICY IF EXISTS "user_books_insert" ON user_books;
CREATE POLICY "user_books_insert" ON user_books 
  FOR INSERT 
  WITH CHECK (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND user_id = (auth.jwt() ->> 'sub')::uuid
  );

DROP POLICY IF EXISTS "user_books_update" ON user_books;
CREATE POLICY "user_books_update" ON user_books 
  FOR UPDATE 
  USING (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND user_id = (auth.jwt() ->> 'sub')::uuid
  )
  WITH CHECK (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND user_id = (auth.jwt() ->> 'sub')::uuid
  );

DROP POLICY IF EXISTS "user_books_delete" ON user_books;
CREATE POLICY "user_books_delete" ON user_books 
  FOR DELETE 
  USING (
    (auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb' 
    AND user_id = (auth.jwt() ->> 'sub')::uuid
  );

-- Update books RLS policies
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "books_select" ON books;
CREATE POLICY "books_select" ON books 
  FOR SELECT 
  USING ((auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb');

DROP POLICY IF EXISTS "books_insert" ON books;
CREATE POLICY "books_insert" ON books 
  FOR INSERT 
  WITH CHECK ((auth.jwt() ->> 'schema_name')::text = 'proj_6a24a7eb');

-- Create a view for friends' books search
CREATE OR REPLACE VIEW friends_books AS
SELECT DISTINCT 
  b.id,
  b.isbn,
  b.title,
  b.author,
  b.cover_url,
  b.summary,
  b.published_year,
  ub.user_id as owner_id,
  u.username as owner_username,
  u.display_name as owner_display_name
FROM books b
INNER JOIN user_books ub ON ub.book_id = b.id
INNER JOIN users u ON u.id = ub.user_id
WHERE EXISTS (
  SELECT 1 FROM friendships f
  WHERE f.status = 'accepted'
  AND (
    (f.user_id = (auth.jwt() ->> 'sub')::uuid AND f.friend_id = ub.user_id)
    OR
    (f.friend_id = (auth.jwt() ->> 'sub')::uuid AND f.user_id = ub.user_id)
  )
);
