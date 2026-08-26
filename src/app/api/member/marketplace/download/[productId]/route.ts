import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedSupabaseUser } from "@/lib/auth/server";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

const MARKETPLACE_BUCKET = process.env.EDUNANCIAL_MARKETPLACE_STORAGE_BUCKET?.trim() || "marketplace-products";
const DOWNLOAD_TTL_SECONDS = 300;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const user = await getAuthenticatedSupabaseUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { productId } = await params;
  const db = getKpiSupabaseAdmin();
  const { data: entitlement, error: entitlementError } = await db
    .from("marketplace_entitlements")
    .select("id,product_id,status")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (entitlementError) {
    return NextResponse.json({ error: "Unable to verify Marketplace access." }, { status: 500 });
  }
  if (!entitlement) return NextResponse.json({ error: "You do not own this Marketplace item." }, { status: 403 });

  const { data: product, error: productError } = await db
    .from("marketplace_products")
    .select("id,title,status,primary_asset_path")
    .eq("id", productId)
    .maybeSingle();

  if (productError) return NextResponse.json({ error: "Unable to load Marketplace product." }, { status: 500 });
  if (!product || !product.primary_asset_path) {
    return NextResponse.json({ error: "This product does not have a downloadable asset." }, { status: 404 });
  }
  if (product.status === "ARCHIVED") {
    return NextResponse.json({ error: "This Marketplace product is no longer available." }, { status: 410 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Marketplace delivery storage is not configured." }, { status: 503 });
  }

  const storage = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const { data: signed, error: signedError } = await storage.storage
    .from(MARKETPLACE_BUCKET)
    .createSignedUrl(product.primary_asset_path, DOWNLOAD_TTL_SECONDS, { download: true });

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: "Unable to prepare the secure download." }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl, 307);
}
