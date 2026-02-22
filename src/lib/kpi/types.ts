export type KPIEventName =
  | "page_view"
  | "cta_click"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase_success"
  | "purchase_failed";

export type KPIEventInput = {
  eventName: KPIEventName;
  pathname?: string;
  referrer?: string;
  productSku?: string;
  price?: number;
  currency?: string;
  orderId?: string;
  paymentProvider?: string;
  payload?: Record<string, unknown>;
  utm?: Partial<{
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
  }>;
};
