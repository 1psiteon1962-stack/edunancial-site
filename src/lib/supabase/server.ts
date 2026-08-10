export interface SupabaseRestOrder {
  column: string;
  ascending?: boolean;
}

export interface SupabaseRestSelectOptions {
  columns?: string;
  filters?: Record<string, string | number>;
  order?: SupabaseRestOrder;
  limit?: number;
}

function normalizeSupabaseUrl(rawUrl: string | undefined): string {
  return (rawUrl ?? "").trim().replace(/\/+$/, "");
}

function getSupabaseServerCredentials(): { baseUrl: string; key: string } {
  const baseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

  if (!baseUrl || !key) {
    throw new Error(
      "Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return { baseUrl, key };
}

function buildSelectUrl(table: string, options: SupabaseRestSelectOptions = {}): URL {
  const { baseUrl } = getSupabaseServerCredentials();
  const url = new URL(`${baseUrl}/rest/v1/${table}`);

  url.searchParams.set("select", options.columns ?? "*");

  for (const [column, value] of Object.entries(options.filters ?? {})) {
    url.searchParams.set(column, `eq.${value}`);
  }

  if (options.order) {
    const direction = options.order.ascending === false ? "desc" : "asc";
    url.searchParams.set("order", `${options.order.column}.${direction}`);
  }

  if (typeof options.limit === "number") {
    url.searchParams.set("limit", String(options.limit));
  }

  return url;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase REST error (${response.status}): ${body}`);
  }

  return (await response.json()) as T;
}

function headersForSupabase() {
  const { key } = getSupabaseServerCredentials();

  return {
    apikey: key,
    Authorization: "Bearer " + key,
    "Content-Type": "application/json",
  } as const;
}

export async function supabaseSelect<T>(
  table: string,
  options: SupabaseRestSelectOptions = {},
): Promise<T[]> {
  const response = await fetch(buildSelectUrl(table, options).toString(), {
    method: "GET",
    headers: headersForSupabase(),
    cache: "no-store",
  });

  return parseResponse<T[]>(response);
}

export async function supabaseUpsert<T>(
  table: string,
  payload: Record<string, unknown> | Array<Record<string, unknown>>,
  onConflictColumns: string,
): Promise<T[]> {
  const { baseUrl } = getSupabaseServerCredentials();
  const url = new URL(`${baseUrl}/rest/v1/${table}`);
  url.searchParams.set("on_conflict", onConflictColumns);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      ...headersForSupabase(),
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return parseResponse<T[]>(response);
}
