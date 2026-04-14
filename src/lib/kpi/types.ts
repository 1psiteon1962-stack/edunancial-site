// ===============================
// KPI EVENT NAMES
// ===============================
export type KPIEventName =
  | "page_view"
  | "cta_click"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase_success"
  | "purchase_failed"
  | "subscription_start"
  | "subscription_cancel"
  | "refund_processed"
  | "lead_capture"
  | "affiliate_conversion";

// ===============================
// KPI EVENT (INPUT TYPE)
// ===============================
export type KPIEvent = {
  event_name: KPIEventName;
  event_type?: string;

  user_id?: string | null;
  session_id?: string | null;

  path?: string | null;
  referrer?: string | null;

  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;

  currency?: string | null;
  value?: number | null;
  sku?: string | null;
  order_id?: string | null;

  metadata?: Record<string, unknown>;
};

// ===============================
// SITE CONTEXT (USED IN INSERT)
// ===============================
export type SiteContext = {
  site_id: string;
  site_region: string;
};

// ===============================
// DATABASE INSERT TYPE (CRITICAL)
// ===============================
export type InsertableKPIEventRow = {
  site_id: string;
  site_region: string;

  event_name: string;
  event_type?: string;

  user_id: string | null;
  session_id: string | null;

  ip_hash: string | null;
  user_agent: string | null;

  path: string | null;
  referrer: string | null;

  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;

  currency: string | null;
  value: number | null;
  sku: string | null;
  order_id: string | null;

  metadata: Record<string, unknown>;
};
