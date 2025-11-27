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

#### `friendships`
Manages user friend relationships (bidirectional).

```sql
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);
```

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

### Frontend Architecture

#### Pages
- **Auth** (`/auth`) - Login/signup page using backend proxy authentication
- **Dashboard** (`/dashboard`) - Main application interface with tabs:
  - My Collection - Browse and manage books
  - Add Book - ISBN entry and book fetching
  - Friends - Friend management (placeholder)
  - Lending - Lending requests (placeholder)

#### Key Components
- **Dashboard.tsx** - Main application interface with:
  - Stats cards (total books, read books, friends, active lendings)
  - Collection grid with search/filter
  - ISBN entry form with Open Library API integration
  - Book detail preview and add to collection
  - Read/unread status toggle

#### State Management
- React hooks (`useState`, `useEffect`)
- Custom hooks: `useAuth()`, `useToast()`
- Direct Supabase queries via backend proxy SDK

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

## Brand Identity

**Name**: BookHarmony  
**Tagline**: Unite your world of books with ease  
**Target Audience**: Book enthusiasts and collectors who want to manage and share their physical book collections online

**Value Propositions**:
- Effortless book management
- Connect with fellow readers
- Secure and user-friendly

**Personality**: Warm, friendly, inviting - like a cozy library, not a sterile database
