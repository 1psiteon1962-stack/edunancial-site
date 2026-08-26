import { NextResponse } from "next/server";

import { getAuthenticatedSupabaseUser } from "@/lib/auth/server";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export async function GET() {
  const user = await getAuthenticatedSupabaseUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const db = getKpiSupabaseAdmin();
  const { data: entitlements, error } = await db
    .from("marketplace_entitlements")
    .select("id,product_id,source,granted_at,marketplace_products(id,slug,title,description,product_type,status,author_name,language_code,category,cover_asset_path,primary_asset_path)")
    .eq("user_id", user.id)
    .eq("status", "ACTIVE")
    .order("granted_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Unable to load your Marketplace library." }, { status: 500 });

  const items = (entitlements ?? []).map((entry: any) => {
    const product = Array.isArray(entry.marketplace_products) ? entry.marketplace_products[0] : entry.marketplace_products;
    if (!product) return null;
    return {
      entitlementId: entry.id,
      source: entry.source,
      grantedAt: entry.granted_at,
      product: {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        productType: product.product_type,
        status: product.status,
        authorName: product.author_name,
        languageCode: product.language_code,
        category: product.category,
        hasCover: Boolean(product.cover_asset_path),
        downloadable: Boolean(product.primary_asset_path) && product.status !== "ARCHIVED",
        downloadUrl: product.primary_asset_path && product.status !== "ARCHIVED"
          ? `/api/member/marketplace/download/${encodeURIComponent(product.id)}`
          : null,
      },
    };
  }).filter(Boolean);

  return NextResponse.json({ items });
}
