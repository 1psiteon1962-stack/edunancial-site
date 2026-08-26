import { NextResponse } from "next/server";

import { getAuthenticatedSupabaseUser } from "@/lib/auth/server";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAuthenticatedSupabaseUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const db = getKpiSupabaseAdmin();
  const { data: entitlements, error } = await db
    .from("marketplace_entitlements")
    .select("id,product_id,source,granted_at")
    .eq("user_id", user.id)
    .eq("status", "ACTIVE")
    .order("granted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load your Marketplace library." }, { status: 500 });
  }

  const productIds = [...new Set((entitlements ?? []).map((row) => row.product_id))];
  if (!productIds.length) return NextResponse.json({ items: [] });

  const { data: products, error: productError } = await db
    .from("marketplace_products")
    .select("id,slug,title,description,product_type,author_name,language_code,category,cover_asset_path,primary_asset_path,sample_asset_path,status")
    .in("id", productIds)
    .neq("status", "ARCHIVED");

  if (productError) {
    return NextResponse.json({ error: "Unable to load purchased products." }, { status: 500 });
  }

  const byId = new Map((products ?? []).map((product) => [product.id, product]));
  const items = (entitlements ?? [])
    .map((entitlement) => {
      const product = byId.get(entitlement.product_id);
      if (!product) return null;
      return {
        entitlementId: entitlement.id,
        source: entitlement.source,
        grantedAt: entitlement.granted_at,
        product: {
          id: product.id,
          slug: product.slug,
          title: product.title,
          description: product.description,
          productType: product.product_type,
          authorName: product.author_name,
          languageCode: product.language_code,
          category: product.category,
          hasCover: Boolean(product.cover_asset_path),
          hasPrimaryAsset: Boolean(product.primary_asset_path),
          hasSample: Boolean(product.sample_asset_path),
        },
      };
    })
    .filter(Boolean);

  return NextResponse.json({ items });
}
