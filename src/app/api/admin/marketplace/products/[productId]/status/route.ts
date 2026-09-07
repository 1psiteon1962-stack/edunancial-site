import { NextRequest } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

const ALLOWED_STATUSES = new Set(["DRAFT", "READY", "PUBLISHED", "ARCHIVED"]);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const { productId } = await params;
    const body = (await request.json()) as { status?: unknown };
    const status = String(body.status ?? "").trim().toUpperCase();
    if (!ALLOWED_STATUSES.has(status)) {
      return Response.json({ error: "Unsupported Marketplace product status." }, { status: 400 });
    }

    const db = getKpiSupabaseAdmin();
    const { data: existing, error: readError } = await db
      .from("marketplace_products")
      .select("id,title,primary_asset_path,price_cents,currency")
      .eq("id", productId)
      .single();
    if (readError || !existing) return Response.json({ error: "Marketplace product not found." }, { status: 404 });

    if ((status === "READY" || status === "PUBLISHED") && !existing.primary_asset_path) {
      return Response.json({ error: "A primary product file is required before publication." }, { status: 400 });
    }

    const { data, error } = await db
      .from("marketplace_products")
      .update({ status })
      .eq("id", productId)
      .select("id,title,status,updated_at,published_at")
      .single();
    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json({ success: true, product: data });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to update Marketplace product." }, { status: 400 });
  }
}
