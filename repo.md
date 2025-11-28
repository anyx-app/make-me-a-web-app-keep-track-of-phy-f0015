# BookHarmony - Technical Documentation

## Project Overview

**BookHarmony** is a web application for managing physical book collections. Users can track their books, mark reading status, connect with friends, and manage book lending.

## Tech Stack

- **Frontend**: React 19.1.0 + TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6.28.0
- **Build Tool**: Vite
- **Backend**: Anyx Backend Proxy (managed Supabase)
- **Database**: PostgreSQL (Supabase) with schema `proj_6a24a7eb`
- **Authentication**: Backend Proxy Auth
- **External APIs**: Google Books API for book metadata

## Architecture

### Database Schema

The application uses a shared Supabase schema (`proj_6a24a7eb`) with the following tables:

#### `books`
Stores book metadata fetched from ISBN lookups.

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  summary TEXT,
  published_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `user_books`
Maps users to their book collections with reading status.

```sql
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);
```

#### `users`
Stores user profile information for username-based friend lookups.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Indexes:
- `idx_users_username` - Fast username searches
- `idx_users_email` - Fast email lookups

#### `friend_requests`
Manages friend request workflow (pending, accepted, declined).

```sql
CREATE TABLE friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id),
  CHECK (requester_id != recipient_id)
);
```

Indexes:
- `idx_friend_requests_recipient` - Fast incoming request queries
- `idx_friend_requests_requester` - Fast outgoing request queries
- `idx_friend_requests_status` - Filter by status

#### `friendships`
Manages bidirectional friend relationships (created automatically on request acceptance).

```sql
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'accepted',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);
```

Indexes:
- `idx_friendships_user` - Fast friend list queries
- `idx_friendships_friend` - Reverse lookups
- `idx_friendships_status` - Filter by status

#### `lending_requests`
Tracks book lending between friends.

```sql
CREATE TABLE lending_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE,
  returned_at TIMESTAMPTZ,
  CHECK (owner_id != borrower_id)
);
```

#### Database Views

##### `friends_books`
Pre-joined view for efficient friends' catalog search (works around backend proxy JOIN limitations):

```sql
CREATE VIEW friends_books AS
SELECT 
  ub.id,
  ub.user_id,
  ub.book_id,
  ub.is_read,
  ub.added_at,
  b.isbn,
  b.title,
  b.author,
  b.cover_url,
  b.summary,
  b.published_year,
  u.username as owner_username,
  u.display_name as owner_display_name
FROM user_books ub
JOIN books b ON b.id = ub.book_id
JOIN users u ON u.id = ub.user_id;
```

**Usage**: Query this view with friendship filtering to get book details + owner info in a single query.

### Frontend Architecture

#### Pages
- **Auth** (`/auth`) - Login/signup page using backend proxy authentication
- **Dashboard** (`/dashboard`) - Main application interface with tabs:
  - **My Collection** - Browse and manage books
  - **Add Book** - ISBN entry and book fetching
  - **Friends** - Complete friend management system
  - **Friends' Catalog** - Search across approved friends' book collections
  - **Lending** - Lending requests (placeholder)

#### Key Components
- **Dashboard.tsx** - Main application interface with:
  - Stats cards (total books, read books, friends, active lendings)
  - Collection grid with search/filter
  - ISBN entry form with Open Library API integration
  - Book detail preview and add to collection
  - Read/unread status toggle
  - Friend management UI (search users, send/accept/decline requests, manage friends)
  - Friends' catalog search with scoped results

#### State Management
- React hooks (`useState`, `useEffect`, `useCallback`)
- Custom hooks: `useAuth()`, `useToast()`
- Direct Supabase queries via backend proxy SDK

#### Services

##### `friendService.ts`
Complete friend management API:

```typescript
// Ensure user exists in users table (call on login/signup)
await friendService.ensureUserExists(userId: string, email: string)

// Search users by username
const results = await friendService.searchUsers(username: string, currentUserId: string)

// Send friend request
await friendService.sendFriendRequest(requesterId: string, recipientUsername: string)

// View requests
const incoming = await friendService.getIncomingRequests(userId: string)
const outgoing = await friendService.getOutgoingRequests(userId: string)

// Respond to request (creates bidirectional friendship on accept)
await friendService.acceptFriendRequest(requestId: string, userId: string)
await friendService.declineFriendRequest(requestId: string, userId: string)

// Manage friends
const friends = await friendService.getFriends(userId: string)
await friendService.removeFriend(userId: string, friendId: string)
```

**Security**: All friend requests and friendships enforce auth checks at the application layer. Bidirectional friendships are created automatically when a request is accepted.

##### `friendsCatalogService.ts`
Search across approved friends' book catalogs:

```typescript
// Search books owned by user's friends (scoped to approved friendships)
const results = await searchFriendsCatalog(userId: string, query: string)

// Get detailed book info with owner information
const details = await getFriendBookDetails(bookId: string, ownerId: string)
```

**Security**: Results are strictly scoped to books owned by users with approved friendships. No data exposure from non-friends.

### API Integration

#### Google Books API
Used to fetch book metadata from ISBN:

```typescript
const response = await fetch(
  `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
)
```

Returns (from `items[0].volumeInfo`):
- `title` - Book title
- `authors` - Array of author names
- `imageLinks.thumbnail` - Cover image URL
- `description` - Book summary/description
- `publishedDate` - Publication date (YYYY or YYYY-MM-DD format)

The published year is extracted from `publishedDate` and stored as `published_year` integer.

#### Backend Proxy
All database queries route through the backend proxy:

```typescript
import { supabase } from '@/sdk/supabase'

// Example query (Note: Backend proxy does NOT support PostgREST joins)
const { data, error } = await supabase
  .from('user_books')
  .select('*')
  .eq('user_id', user.id)

// For related data, fetch separately and join in frontend
const { data: booksData } = await supabase
  .from('books')
  .select('*')
  .in('id', bookIds)
```

**Important**: The backend proxy SDK does NOT support:
- PostgREST nested selects (e.g., `books(*)`)
- Relation syntax (e.g., `table.field`)
- Join operators (`!inner`, `!left`)

To work with related data, fetch tables separately and join in the frontend, or create database VIEWs.

#### Error Handling

The SDK (`src/sdk/supabase.ts`) includes robust error handling:

**Environment Validation**:
- Validates `VITE_PROJECT_ID` and `VITE_ANYX_SERVER_URL` before executing queries
- Throws user-friendly error messages if configuration is missing

**Network Error Handling**:
- Catches `TypeError: Failed to fetch` (network failures, CORS issues, DNS errors)
- Provides detailed console logs with diagnostic information
- Returns user-friendly error messages for UI display

**HTTP Error Handling**:
- Automatically handles 401/403 authentication failures (clears session, redirects to `/auth`)
- Parses error responses from backend API
- Logs detailed error context (table, operation, URL) for debugging

**Best Practices**:
```typescript
try {
  const { data } = await supabase.from('table').select('*')
  // Use data
} catch (error) {
  // error.message will be user-friendly
  console.error('Operation failed:', error)
  toast({ title: 'Error', description: error.message, variant: 'destructive' })
}
```

## Design System

### Brand Colors
- **Primary**: #4A90E2 (HSL: 212 72% 58%) - Trustworthy blue
- **Accent**: #FF5A5F (HSL: 358 100% 67%) - Warm coral
- **Secondary**: #F5F7FA (HSL: 216 33% 97%) - Soft gray background

### Design Pattern
**Gradient-Heavy** with soft shadows:
- Cards: `bg-gradient-to-br from-primary/10 to-accent/5`
- Buttons: `bg-gradient-to-r from-primary to-accent`
- Borders: `border-primary/20`
- Shadows: `shadow-lg hover:shadow-xl transition-shadow`

### Typography
- Logo: Text-based "BookHarmony" with primary color
- Headings: Bold with gradient text for emphasis
- Body: Clean, readable sans-serif

## Features Implementation

### ✅ Implemented
1. **Authentication** - Login/signup via backend proxy
2. **ISBN Book Entry** - Manual ISBN input with Google Books API
3. **Book Metadata Fetching** - Automatic title, author, cover, summary, published year
4. **Collection Management** - Add books, view collection grid
5. **Read/Unread Tracking** - Toggle reading status
6. **Search & Filter** - Filter books by title/author
7. **Dashboard Stats** - Real-time collection statistics
8. **Responsive Design** - Mobile-first with gradient aesthetics
9. **Enhanced Error Handling** - Clear feedback for missing books and API errors

### 🚧 Planned (Placeholders)
1. **Barcode Scanning** - Use phone camera to scan ISBN barcodes
2. **Friends System** - Add friends by username, view friend lists
3. **Friend Collection Browse** - Search friends' book catalogs
4. **Lending Requests** - Request to borrow books from friends
5. **Lending Management** - Approve/decline requests, track due dates

## Development Notes

### Database Access
- Schema: `proj_6a24a7eb` (shared schema, NOT public)
- All migrations must start with: `SET search_path TO proj_6a24a7eb;`
- SDK automatically routes queries through backend proxy

### Environment Variables
```
VITE_USE_BACKEND_AUTH=true
VITE_ANYX_API_KEY=<your_key>
```

### Key Files
- `src/pages/Dashboard.tsx` - Main application interface
- `src/pages/Auth.tsx` - Authentication page
- `supabase/migrations/001_initial_schema.sql` - Database schema
- `src/sdk/supabase.ts` - Backend proxy SDK (pre-configured)

## Future Enhancements

1. **Camera Integration** - Add barcode scanner using device camera
2. **Social Features** - Complete friends and lending functionality
3. **Book Recommendations** - AI-powered reading suggestions
4. **Reading Goals** - Set and track reading targets
5. **Book Reviews** - Write and share book reviews with friends
6. **Collections/Tags** - Organize books into custom collections
7. **Import/Export** - Bulk import from Goodreads or CSV

## Deployment

Built for **Vercel serverless** deployment:
- Static frontend only
- No custom Node.js server required
- Backend via Anyx proxy and Supabase Edge Functions

## Recent Fixes

### Authentication in SDK (2025-01)
**Issue**: Dashboard queries were failing with "TypeError: Failed to fetch" because SDK requests to the backend proxy were missing authentication headers.

**Solution**: Modified `src/sdk/supabase.ts` execute() method to:
1. Retrieve access token from localStorage (`anyx.auth.session`)
2. Include `Authorization: Bearer <token>` header in all backend proxy requests
3. Handle 401/403 responses by clearing expired session and redirecting to /auth

This fix resolves all dashboard data loading errors and ensures authenticated users can properly access their collections.

### Console Error Cleanup (2025-01)
**Issue**: Production console logs were polluted with numerous "TypeError: Failed to fetch" and "Error loading dashboard data" messages that appeared as errors but were actually expected network failures during normal operation (e.g., network unavailability, service maintenance).

**Root Cause Analysis**:
- SDK diagnostic logging in `src/sdk/supabase.ts` was using `console.error()` for all network failures
- Dashboard and service layers were logging operational errors as `console.error()` even when gracefully handling them with fallback data
- HTTP 4xx client errors (user issues) were logged at same severity as 5xx server errors (system issues)

**Solution**: Implemented graduated error logging strategy:
1. **SDK Layer** (`src/sdk/supabase.ts`):
   - Network errors → `console.warn()` (diagnostic info, not critical failures)
   - HTTP 4xx errors → `console.warn()` (client errors, expected behavior)
   - HTTP 5xx errors → `console.error()` (server errors requiring investigation)
   - Auth parsing errors → `console.warn()` (handled gracefully)

2. **Dashboard Layer** (`src/pages/Dashboard.tsx`):
   - Dashboard data loading → `console.warn()` with default value fallbacks
   - Friend data loading → `console.warn()` with empty array fallbacks
   - Google Books API errors → `console.warn()` (user already sees toast notification)

3. **Service Layer** (`src/services/friendService.ts`, `src/services/friendsCatalogService.ts`):
   - All functions returning empty arrays on error → `console.warn()` (graceful degradation)
   - Functions throwing errors kept `console.error()` for upstream handling

**Benefits**:
- Console errors now only appear for critical system failures requiring immediate attention
- Network unavailability (expected during service maintenance) no longer pollutes error logs
- Developers can quickly identify actual bugs vs. operational warnings
- Production monitoring tools can focus on real errors instead of noise

**Preserved Behaviors**:
- All error handling remains unchanged (graceful degradation, fallback values)
- User-facing error messages (toasts, UI states) unchanged
- SDK configuration errors remain as `console.error()` (critical setup issues)

## Brand Identity

**Name**: BookHarmony  
**Tagline**: Unite your world of books with ease  
**Target Audience**: Book enthusiasts and collectors who want to manage and share their physical book collections online

**Value Propositions**:
- Effortless book management
- Connect with fellow readers
- Secure and user-friendly

**Personality**: Warm, friendly, inviting - like a cozy library, not a sterile database
