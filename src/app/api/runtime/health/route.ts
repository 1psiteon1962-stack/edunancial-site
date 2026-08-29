import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function clean(value: string | undefined) {
  return value?.trim() || null;
}

export async function GET() {
  const deploymentKey = clean(process.env.EDUNANCIAL_DEPLOYMENT_KEY);
  const failureDomain = clean(process.env.EDUNANCIAL_FAILURE_DOMAIN);
  const region = clean(process.env.EDUNANCIAL_RUNTIME_REGION);
  const configured = Boolean(deploymentKey && failureDomain && region);

  return NextResponse.json(
    {
      ok: configured,
      service: "edunancial-runtime",
      deploymentKey,
      failureDomain,
      region,
    },
    {
      status: configured ? 200 : 503,
      headers: { "Cache-Control": "no-store, max-age=0" },
    },
  );
}
