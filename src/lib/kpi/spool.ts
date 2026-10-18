import { randomUUID } from "node:crypto";

export const KPI_SPOOL_STORE = "kpi-event-spool";

export type KpiSpoolStore = {
  setJSON(key: string, value: unknown): Promise<unknown>;
};

type Dependencies<Row, Result> = {
  primary: (row: Row) => Promise<Result>;
  fallback: (row: Row) => Promise<unknown>;
  spool: () => KpiSpoolStore | Promise<KpiSpoolStore>;
  now?: () => Date;
  log?: (...args: unknown[]) => void;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function persistWithFallbacks<Row, Result>(
  row: Row,
  deps: Dependencies<Row, Result>,
): Promise<
  | { stored: "primary"; result: Result }
  | { stored: "fallback" }
  | { stored: "spool" }
> {
  try {
    const result = await deps.primary(row);
    return { stored: "primary", result };
  } catch (primaryError) {
    deps.log?.("KPI primary persistence failed", errorMessage(primaryError));
    try {
      await deps.fallback(row);
      return { stored: "fallback" };
    } catch (fallbackError) {
      deps.log?.("KPI fallback persistence failed", errorMessage(fallbackError));
      try {
        const timestamp = (deps.now ?? (() => new Date()))().toISOString();
        const day = timestamp.slice(0, 10);
        const key = `pending/${day}/${timestamp}-${randomUUID()}.json`;
        const store = await deps.spool();
        await store.setJSON(key, {
          row,
          failures: {
            primary: errorMessage(primaryError),
            fallback: errorMessage(fallbackError),
          },
          spooledAt: timestamp,
        });
        return { stored: "spool" };
      } catch (spoolError) {
        deps.log?.("KPI spool persistence failed", errorMessage(spoolError));
        throw new Error("KPI persistence unavailable in primary, fallback and spool", { cause: spoolError });
      }
    }
  }
}
