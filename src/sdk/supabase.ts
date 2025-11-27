// Supabase Backend Proxy SDK for Shared Schema Projects
// Version: 1.0.0
// This SDK routes database queries through the Anyx backend API
// for secure access to shared schema databases

interface QueryFilter {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
  value: unknown;
}

interface QueryOrder {
  column: string;
  ascending?: boolean;
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
  private insertValues?: Record<string, unknown>[];
  private updateValues?: Record<string, unknown>;

  constructor(table: string) {
    this.tableName = table;
  }

  select(columns: string = '*') {
    this.selectClause = columns;
    this.operation = 'select';
    return this;
  }

  eq(column: string, value: unknown) {
    this.filtersList.push({ column, operator: 'eq', value });
    return this;
  }

  neq(column: string, value: unknown) {
    this.filtersList.push({ column, operator: 'neq', value });
    return this;
  }

  gt(column: string, value: unknown) {
    this.filtersList.push({ column, operator: 'gt', value });
    return this;
  }

  gte(column: string, value: unknown) {
    this.filtersList.push({ column, operator: 'gte', value });
    return this;
  }

  lt(column: string, value: unknown) {
    this.filtersList.push({ column, operator: 'lt', value });
    return this;
  }

  lte(column: string, value: unknown) {
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

  in(column: string, values: unknown[]) {
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
      ascending: options?.ascending ?? true
    });
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  offset(count: number) {
    this.offsetValue = count;
    return this;
  }

  single() {
    this.singleMode = true;
    return this;
  }

  insert(values: Record<string, unknown> | Record<string, unknown>[]) {
    this.operation = 'insert';
    this.insertValues = Array.isArray(values) ? values : [values];
    return this;
  }

  update(values: Record<string, unknown>) {
    this.operation = 'update';
    this.updateValues = values;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  async execute() {
    const projectId = import.meta.env.VITE_PROJECT_ID;
    const backendUrl = import.meta.env.VITE_ANYX_SERVER_URL;

    const payload: Record<string, unknown> = {
      table: this.tableName,
      operation: this.operation || 'select'
    };

    if (this.operation === 'insert') {
      payload.values = this.insertValues;
      if (this.selectClause) payload.select = this.selectClause;
    } else if (this.operation === 'update') {
      payload.values = this.updateValues;
      payload.filters = this.filtersList;
      if (this.selectClause) payload.select = this.selectClause;
    } else if (this.operation === 'delete') {
      payload.filters = this.filtersList;
    } else {
      payload.select = this.selectClause || '*';
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

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<unknown | TResult> {
    return this.execute().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<unknown> {
    return this.execute().finally(onfinally);
  }
}

export const supabase = {
  from: (table: string) => new QueryBuilder(table)
};
