import { getKpiSupabaseAdmin } from "@/lib/kpi/supabaseAdmin";
import type { CatalogItemType, PaymentCatalogItem } from "@/lib/payments/catalog";

interface MarketplaceProductRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  product_type: string;
  status: string;
  price_cents: number;
  currency: string;
  country_code: string | null;
}

function mapMarketplaceType(productType: string): CatalogItemType {
  switch (productType.toUpperCase()) {
    case "EBOOK":
    case "AUDIOBOOK":
      return "book";
    case "COURSE":
      return "course";
    case "TEMPLATE":
    case "WORKBOOK":
    case "DOWNLOAD":
    case "BUSINESS_TOOL":
      return "digital_product";
    default:
      return "other";
  }
}

/**
 * Resolve a marketplace item from the server-owned marketplace table.
 * Only PUBLISHED products are purchasable. Price, currency, type and market
 * restrictions come from the database; callers never supply those values.
 */
export async function resolveMarketplaceCatalogItem(itemId: string): Promise<PaymentCatalogItem | undefined> {
  const normalized = itemId.trim();
  if (!normalized) return undefined;

  const db = getKpiSupabaseAdmin();
  const { data, error } = await db
    .from("marketplace_products")
    .select("id,slug,title,description,product_type,status,price_cents,currency,country_code")
    .or(`id.eq.${normalized},slug.eq.${normalized}`)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (error || !data) return undefined;
  const product = data as MarketplaceProductRow;
  if (!Number.isInteger(product.price_cents) || product.price_cents < 0) return undefined;

  return {
    id: `marketplace:${product.id}`,
    name: product.title,
    description: product.description,
    type: mapMarketplaceType(product.product_type),
    price: product.price_cents / 100,
    currency: product.currency.trim().toUpperCase(),
    isRecurring: false,
    contentId: product.id,
    active: true,
    metadata: {
      marketplace_product_id: product.id,
      marketplace_slug: product.slug,
      ...(product.country_code ? { marketplace_country_code: product.country_code.trim().toUpperCase() } : {}),
    },
  };
}
