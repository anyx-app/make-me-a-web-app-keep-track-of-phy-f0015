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

    // Validate required environment variables
    if (!projectId) {
      console.error('SDK Configuration Error: VITE_PROJECT_ID is not set');
      throw new Error('Database configuration error: Missing project ID. Please check your environment variables.');
    }
    
    if (!backendUrl) {
      console.error('SDK Configuration Error: VITE_ANYX_SERVER_URL is not set');
      throw new Error('Database configuration error: Missing server URL. Please check your environment variables.');
    }

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

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    // Add authentication token if available
    const sessionStr = localStorage.getItem('anyx.auth.session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      } catch (e) {
        console.warn('Failed to parse auth session:', e);
      }
    }

    const url = `${backendUrl}/api/projects/${projectId}/query`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Handle authentication failures
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('anyx.auth.session');
          window.dispatchEvent(new CustomEvent('auth-session-change', { detail: null }));
          window.location.href = '/auth';
          throw new Error('Session expired. Please sign in again.');
        }
        
        let errorMessage = 'Query failed';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // Use console.warn for non-critical HTTP errors to avoid polluting error logs
        if (response.status >= 400 && response.status < 500) {
          console.warn(`SDK Query Error [${response.status}]:`, errorMessage, {
            table: this.tableName,
            operation: this.operation || 'select',
            url
          });
        } else {
          // Only use console.error for server errors (5xx)
          console.error(`SDK Query Error [${response.status}]:`, errorMessage, {
            table: this.tableName,
            operation: this.operation || 'select',
            url
          });
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // Handle network-level errors (CORS, DNS, connection refused, etc.)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // Use console.warn instead of console.error for diagnostic info
        // to avoid polluting production error logs
        console.warn('SDK Network Error: Unable to reach backend server', {
          url,
          table: this.tableName,
          operation: this.operation || 'select',
          possibleCauses: [
            'Network connectivity issues',
            'CORS configuration problem',
            'Backend server is down or unreachable',
            'Invalid backend URL',
            'Browser blocking the request'
          ]
        });
        
        throw new Error(
          'Unable to connect to the server. Please check your internet connection and try again. If the problem persists, the service may be temporarily unavailable.'
        );
      }
      
      // Re-throw other errors (like our custom errors from above)
      throw error;
    }
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
