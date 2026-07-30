type QueryResult<T> = {
  data: T[] | null;
  error: Error | null;
};

function getSupabaseAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new Error(
      "KPI Supabase access requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return { url, serviceRoleKey };
}

class SupabaseAdminClient {
  from(table: string) {
    return {
      select: async (columns = "*"): Promise<QueryResult<Record<string, unknown>>> => {
        try {
          const { url, serviceRoleKey } = getSupabaseAdminConfig();
          const response = await fetch(
            `${url}/rest/v1/${encodeURIComponent(table)}?select=${encodeURIComponent(columns)}`,
            {
              headers: {
                apikey: serviceRoleKey,
                Authorization: "Bearer " + serviceRoleKey,
              },
              cache: "no-store",
            },
          );

          if (!response.ok) {
            return {
              data: null,
              error: new Error(`Supabase KPI query failed (${response.status}).`),
            };
          }

          return {
            data: (await response.json()) as Record<string, unknown>[],
            error: null,
          };
        } catch (error) {
          return {
            data: null,
            error: error as Error,
          };
        }
      },
    };
  }
}

export const supabaseAdmin = new SupabaseAdminClient();
