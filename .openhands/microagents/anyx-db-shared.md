# Shared Schema Database Mode

**Type**: Anyx Managed Supabase (Multi-Tenant)  
**Schema**: `proj_{shortId}` (isolated via PostgreSQL schemas)  
**Auth**: Backend Proxy (centralized)

---

## 🎯 Overview

Your project uses a **shared Supabase instance** with schema isolation. Each project gets its own schema namespace within a single PostgreSQL database.

**Key Differences from Dedicated Mode:**
- Authentication goes through backend proxy (`/api/projects/{id}/auth/*`)
- Database user has limited permissions (no DDL on `auth` schema)
- RLS policies must reference `app_metadata.schema_name` for isolation
- Migrations auto-applied via backend cron (not Supabase CLI)

---

## 💾 Database Setup

### Step 1: Create Initial Schema from mockData

If `src/data/mockData.ts` exists, convert it to SQL:

```typescript
// Example mockData
export const products = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 150 }
]
```

**Generate migration:**

```sql
-- supabase/migrations/00000000000000_initial_schema.sql

-- Products table
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for isolation
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_isolation" ON products
  FOR ALL USING (
    (auth.jwt() ->> 'schema_name')::text = current_setting('app.current_schema', true)
  );

-- Seed data
INSERT INTO products (name, price) VALUES 
  ('Product A', 100),
  ('Product B', 150),
  ('Product C', 200)
ON CONFLICT DO NOTHING;
```

### Step 2: Delete mockData (no longer needed)

```bash
rm src/data/mockData.ts
```

### Step 3: Update components to use Supabase queries

```tsx
// ❌ OLD (mockData)
import { products } from '@/data/mockData'

function ProductList() {
  return products.map(p => <div key={p.id}>{p.name}</div>)
}
```

```tsx
// ✅ NEW (Supabase)
import { supabase } from '@/integrations/supabase/client'
import { useEffect, useState } from 'react'

function ProductList() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setProducts(data || [])
    })
  }, [])
  
  return products.map(p => <div key={p.id}>{p.name}</div>)
}
```

---

## 🔐 Authentication

**CRITICAL**: DO NOT use `supabase.auth.*` directly. Use backend proxy.

### Import from `@/lib/auth`

```tsx
import { signUp, signIn, signInWithOAuth, signOut } from '@/lib/auth'

// Email/password signup
const { user, session } = await signUp('user@example.com', 'password')

// Email/password login
const { user, session } = await signIn('user@example.com', 'password')

// OAuth
await signInWithOAuth('google', window.location.origin + '/auth/callback')

// Sign out
await signOut()
```

### Why Backend Proxy?

- **Namespaced emails**: Real email `user@example.com` → stored as `proj_xxx_user@example.com`
- **Multi-tenant isolation**: Each project has isolated auth users
- **OAuth support**: Backend handles provider redirects
- **`app_metadata` injection**: `schema_name` and `project_id` auto-set

---

## 📋 RLS Policies (Required!)

**All tables MUST have RLS policies** for isolation:

```sql
-- Standard pattern
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "table_name_isolation" ON table_name
  FOR ALL USING (
    (auth.jwt() ->> 'schema_name')::text = current_setting('app.current_schema', true)
  );
```

**User-scoped policies** (if table has `user_id` column):

```sql
CREATE POLICY "table_name_user_isolation" ON table_name
  FOR ALL USING (
    auth.uid() = user_id 
    AND (auth.jwt() ->> 'schema_name')::text = current_setting('app.current_schema', true)
  );
```

---

## 🚫 Limitations

### Cannot Use:
- ❌ Supabase CLI (`supabase db push`, `supabase functions deploy`)
- ❌ Direct `auth.users` table inserts
- ❌ DDL on `auth` schema (grants, policies)
- ❌ Native Supabase Auth SDK calls

### Must Use:
- ✅ SQL migrations in `supabase/migrations/*.sql` (auto-applied)
- ✅ Backend auth proxy (`@/lib/auth`)
- ✅ RLS policies for ALL tables
- ✅ Idempotent SQL (`DROP IF EXISTS`, `ON CONFLICT`)

---

## 📝 Migration Best Practices

### Idempotency (Critical)

```sql
-- ✅ GOOD - Idempotent
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (...);

DROP POLICY IF EXISTS "products_isolation" ON products;
CREATE POLICY "products_isolation" ON products ...;

-- ❌ BAD - Non-idempotent
CREATE TABLE products (...);  -- Fails if exists
CREATE POLICY "products_isolation" ON products ...;  -- Fails if exists
```

### RLS Policy Pattern (Postgres 14)

```sql
-- ✅ GOOD - Works on Postgres 14
DROP POLICY IF EXISTS "policy_name" ON table_name;
CREATE POLICY "policy_name" ON table_name ...;

-- ❌ BAD - CREATE POLICY IF NOT EXISTS doesn't exist in Postgres 14
CREATE POLICY IF NOT EXISTS "policy_name" ON table_name ...;
```

### Foreign Keys

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for isolation
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_isolation" ON orders
  FOR ALL USING (
    auth.uid() = user_id 
    AND (auth.jwt() ->> 'schema_name')::text = current_setting('app.current_schema', true)
  );
```

---

## 🔄 Workflow

1. **Create migration file**: `supabase/migrations/{timestamp}_{name}.sql`
2. **Write idempotent SQL**: Use `DROP IF EXISTS`, `ON CONFLICT`
3. **Add RLS policies**: All tables must have isolation policies
4. **Commit & push**: Migration auto-detected
5. **Backend cron applies**: Within 1 minute
6. **Check logs**: AnyX backend → Project → Database logs

---

## 🐛 Common Errors

### "permission denied for schema auth"
- Backend cron executes as superuser (handles this automatically)
- Don't try to grant permissions yourself

### "relation already exists"
- Use `DROP TABLE IF EXISTS` for idempotency

### "policy already exists"
- Use `DROP POLICY IF EXISTS` before `CREATE POLICY`

### "RLS violation"
- Check RLS policy uses correct `schema_name` check
- Verify `app_metadata.schema_name` is set for user (backend handles this)

### "Cannot read properties of null (auth.users)"
- Don't insert directly into `auth.users`
- Use backend proxy (`signUp()` from `@/lib/auth`)

---

## ✅ Checklist

Before committing migrations:

- [ ] Idempotent SQL (`DROP IF EXISTS`)
- [ ] RLS policies on ALL tables
- [ ] `schema_name` isolation in policies
- [ ] Seed data uses `ON CONFLICT DO NOTHING`
- [ ] Foreign keys reference correct schema
- [ ] No DDL on `auth` schema
- [ ] Using backend auth proxy (`@/lib/auth`)

---

**Read also:**
- `anyx-core-guidelines.md` - General project rules
- `anyx-defensive-coding.md` - Error prevention
- Boilerplate README → "Dual-Mode Authentication"

