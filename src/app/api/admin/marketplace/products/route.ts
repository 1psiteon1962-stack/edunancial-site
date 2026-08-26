import { NextRequest } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";

const PRODUCT_TYPES = new Set([
  "EBOOK",
  "AUDIOBOOK",
  "COURSE",
  "TEMPLATE",
  "WORKBOOK",
  "DOWNLOAD",
  "BUSINESS_TOOL",
  "OTHER",
]);

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function GET(request: NextRequest) {
  const auth = await requireOwnerApiSession(request);
  if (!auth.ok) return auth.response;

  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("marketplace_products")
    .select("id,slug,title,description,product_type,status,price_cents,currency,primary_asset_path,cover_asset_path,sample_asset_path,author_name,language_code,country_code,category,tags,created_at,updated_at,published_at")
    .order("updated_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ products: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = String(body.title ?? "").trim();
    const productType = String(body.productType ?? "").trim().toUpperCase();
    const priceCents = Number(body.priceCents ?? 0);
    const primaryAssetPath = String(body.primaryAssetPath ?? "").trim() || null;

    if (!title) return Response.json({ error: "Product title is required." }, { status: 400 });
    if (!PRODUCT_TYPES.has(productType)) return Response.json({ error: "Select a supported product type." }, { status: 400 });
    if (!Number.isInteger(priceCents) || priceCents < 0) return Response.json({ error: "Price must be a non-negative amount in cents." }, { status: 400 });

    const slugBase = slugify(String(body.slug ?? "") || title);
    if (!slugBase) return Response.json({ error: "A valid product slug is required." }, { status: 400 });

    const db = getKpiSupabaseAdmin();
    const record = {
      slug: slugBase,
      title,
      description: String(body.description ?? "").trim(),
      product_type: productType,
      status: "DRAFT",
      price_cents: priceCents,
      currency: String(body.currency ?? "USD").trim().toUpperCase() || "USD",
      primary_asset_path: primaryAssetPath,
      cover_asset_path: String(body.coverAssetPath ?? "").trim() || null,
      sample_asset_path: String(body.sampleAssetPath ?? "").trim() || null,
      author_name: String(body.authorName ?? "").trim() || null,
      language_code: String(body.languageCode ?? "en-US").trim() || "en-US",
      country_code: String(body.countryCode ?? "").trim().toUpperCase() || null,
      category: String(body.category ?? "").trim() || null,
      tags: Array.isArray(body.tags) ? body.tags.map(String).filter(Boolean).slice(0, 25) : [],
      metadata: typeof body.metadata === "object" && body.metadata !== null ? body.metadata : {},
      created_by: auth.session.email,
    };

    const { data, error } = await db.from("marketplace_products").insert(record).select("*").single();
    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json({ success: true, product: data }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to create marketplace product." },
      { status: 400 },
    );
  }
}
