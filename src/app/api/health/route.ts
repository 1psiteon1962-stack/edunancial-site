import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Standard health check endpoint for load balancers, container orchestrators,
 * and monitoring systems. Returns 200 when the application is ready to serve
 * traffic, or 503 when degraded.
 *
 * Extend the `checks` array to add real liveness probes (DB ping, cache ping, etc.)
 */

interface HealthCheckResult {
  name: string;
  status: "pass" | "fail" | "warn";
  durationMs?: number;
  message?: string;
}

async function runChecks(): Promise<HealthCheckResult[]> {
  const start = Date.now();

  // Application readiness — always passes if process is alive
  const appCheck: HealthCheckResult = {
    name: "application",
    status: "pass",
    durationMs: Date.now() - start,
  };

  // TODO: Replace with real DB ping when Supabase/Postgres client is available.
  // Example:
  //   const dbStart = Date.now();
  //   try { await db.raw("SELECT 1"); dbCheck.status = "pass"; } catch { dbCheck.status = "fail"; }
  const dbCheck: HealthCheckResult = {
    name: "database",
    status: "pass", // placeholder
    durationMs: 0,
    message: "Demo — wire real DB check for production",
  };

  // TODO: Replace with real cache ping.
  const cacheCheck: HealthCheckResult = {
    name: "cache",
    status: "pass", // placeholder
    durationMs: 0,
    message: "Demo — wire real cache check for production",
  };

  return [appCheck, dbCheck, cacheCheck];
}

export async function GET() {
  const startedAt = new Date().toISOString();
  const checks = await runChecks();
  const allPass = checks.every((c) => c.status !== "fail");
  const hasDegraded = checks.some((c) => c.status === "warn");

  const body = {
    status: allPass ? (hasDegraded ? "degraded" : "healthy") : "unhealthy",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
    environment: process.env.NODE_ENV ?? "development",
    checkedAt: startedAt,
    checks,
  };

  return NextResponse.json(body, {
    status: allPass ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache",
      "X-Health-Status": body.status,
    },
  });
}
