# Migration: Shared Schema CRUD Fix

**Issue**: Projects generated before Nov 9, 2025 have SELECT-only SDK. INSERT/UPDATE/DELETE operations crash with errors like:
```
PUT https://.../api/projects/[id]/update 404 Not Found
```

**Cause**: Old SDK only supported SELECT queries. Backend proxy now supports full CRUD.

---

## Fix: Replace `src/sdk/supabase.ts`

**1. Delete old file:**
```bash
rm src/sdk/supabase.ts
```

**2. Create new file with updated SDK:**

```typescript
// src/sdk/supabase.ts
interface QueryFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
  value: any;
}

interface QueryOrder {
  column: string;
  ascending: boolean;
}

class QueryBuilder {
  private tableName: string;
  private selectClause: string = '*';
  private filtersList: QueryFilter[] = [];
  private orderList: QueryOrder[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private singleMode: boolean = false;
  private operation?: 'select' | 'insert' | 'update' | 'delete';
  private insertValues?: Record<string, any>[];
  private updateValues?: Record<string, any>;

  constructor(table: string) {
    this.tableName = table;
  }

  select(columns: string = '*') {
    this.selectClause = columns;
    return this;
  }

  eq(column: string, value: any) {
    this.filtersList.push({ column, operator: 'eq', value });
    return this;
  }

  neq(column: string, value: any) {
    this.filtersList.push({ column, operator: 'neq', value });
    return this;
  }

  gt(column: string, value: any) {
    this.filtersList.push({ column, operator: 'gt', value });
    return this;
  }

  gte(column: string, value: any) {
    this.filtersList.push({ column, operator: 'gte', value });
    return this;
  }

  lt(column: string, value: any) {
    this.filtersList.push({ column, operator: 'lt', value });
    return this;
  }

  lte(column: string, value: any) {
    this.filtersList.push({ column, operator: 'lte', value });
    return this;
  }

  like(column: string, value: string) {
    this.filtersList.push({ column, operator: 'like', value });
    return this;
  }

  ilike(column: string, value: string) {
    this.filtersList.push({ column, operator: 'ilike', value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filtersList.push({ column, operator: 'in', value: values });
    return this;
  }

  is(column: string, value: null) {
    this.filtersList.push({ column, operator: 'is', value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderList.push({
      column,
      ascending: options?.ascending !== false
    });
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  range(from: number, to: number) {
    this.offsetValue = from;
    this.limitValue = to - from + 1;
    return this;
  }

  single() {
    this.singleMode = true;
    this.limitValue = 1;
    return this;
  }

  // NEW: INSERT
  insert(values: Record<string, any> | Record<string, any>[]) {
    this.operation = 'insert';
    this.insertValues = Array.isArray(values) ? values : [values];
    return this;
  }

  // NEW: UPDATE
  update(values: Record<string, any>) {
    this.operation = 'update';
    this.updateValues = values;
    return this;
  }

  // NEW: DELETE
  delete() {
    this.operation = 'delete';
    return this;
  }

  async execute() {
    const projectId = import.meta.env.VITE_PROJECT_ID;
    const backendUrl = import.meta.env.VITE_ANYX_SERVER_URL;

    const payload: any = {
      table: this.tableName,
      operation: this.operation || 'select'
    };

    if (this.operation === 'insert') {
      payload.values = this.insertValues;
      payload.select = this.selectClause;
    } else if (this.operation === 'update') {
      payload.values = this.updateValues;
      payload.filters = this.filtersList;
      payload.select = this.selectClause;
    } else if (this.operation === 'delete') {
      payload.filters = this.filtersList;
    } else {
      payload.select = this.selectClause;
      payload.filters = this.filtersList;
      payload.order = this.orderList;
      payload.limit = this.limitValue;
      payload.offset = this.offsetValue;
      payload.single = this.singleMode;
    }

    const response = await fetch(`${backendUrl}/api/projects/${projectId}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Query failed');
    }

    const result = await response.json();
    return result;
  }

  then(onfulfilled?: any, onrejected?: any) {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch(onrejected: any) {
    return this.execute().catch(onrejected);
  }

  finally(onfinally: any) {
    return this.execute().finally(onfinally);
  }
}

export const supabase = {
  from: (table: string) => new QueryBuilder(table)
};

export function getSupabase() {
  return supabase;
}
```

---

## Usage Examples

```typescript
import { supabase } from '@/sdk/supabase'

// SELECT (unchanged)
const { data, error } = await supabase.from('vehicles').select('*')

// INSERT (new)
const { data } = await supabase
  .from('vehicles')
  .insert({ name: 'Tesla Model 3', status: 'available' })
  .select()  // Returns inserted row

// INSERT MULTIPLE (new)
const { data } = await supabase
  .from('vehicles')
  .insert([
    { name: 'Tesla Model 3', status: 'available' },
    { name: 'Tesla Model S', status: 'rented' }
  ])
  .select()

// UPDATE (new)
const { data } = await supabase
  .from('vehicles')
  .update({ status: 'rented' })
  .eq('id', '123')
  .select()  // Returns updated row

// DELETE (new)
const { data } = await supabase
  .from('vehicles')
  .delete()
  .eq('id', '123')  // Returns deleted row
```

---

## Testing

```bash
# Lint & build to verify syntax
pnpm lint && pnpm build
```

---

## When NOT Needed

- **Dedicated Supabase instances**: No migration needed (they use native Supabase client)
- **External DB projects**: No migration needed
- **Projects without database**: No migration needed

This migration is **only** for **shared schema projects** (multi-tenant with custom schemas like `proj_xxxx`).

