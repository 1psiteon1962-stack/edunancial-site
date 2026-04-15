export type KPIEventName =
  | "page_view"
  | "click"
  | "signup"
  | "login"
  | "purchase";

export interface KPIEvent {
  event_name: KPIEventName;
  event_type?: string | null;

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

  metadata?: Record<string, any>;
}

/**
 * THIS is what Netlify is complaining about
 */
export type InsertableKPIEventRow = {
  site_id: string;
  site_region: string;

  event_name: KPIEventName;
  event_type?: string;

  user_id?: string | null;
  session_id?: string | null;

  ip_hash?: string | null;
  user_agent?: string | null;

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

  metadata?: Record<string, any>;
};
