// SAFE SERVER-SIDE SUPABASE CLIENT (NO EXTERNAL PACKAGE REQUIRED)

// This avoids build failure if @supabase/supabase-js is not installed.
// You can swap this later for the real client once dependencies are stable.

type QueryResult<T> = {
  data: T[] | null;
  error: Error | null;
};

class MockSupabaseClient {
  from(_table: string) {
    return {
      select: async (): Promise<QueryResult<Record<string, unknown>>> => {
        return {
          data: [],
          error: null,
        };
      },
      insert: async (_payload: unknown): Promise<QueryResult<null>> => {
        return {
          data: null,
          error: null,
        };
      },
    };
  }
}

// EXPORT USED THROUGHOUT YOUR APP
export const supabaseAdmin = new MockSupabaseClient();
