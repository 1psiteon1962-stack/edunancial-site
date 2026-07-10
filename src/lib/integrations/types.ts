/**
 * Core provider integration interfaces.
 * All provider adapters must implement the relevant interfaces from this file.
 * Implementations can be swapped without changing call-site code.
 */

// ─── Base provider ────────────────────────────────────────────────────────────

export interface ProviderConfig {
  enabled: boolean;
  environment?: "live" | "test" | "sandbox";
  [key: string]: unknown;
}

export interface Provider<TConfig extends ProviderConfig = ProviderConfig> {
  readonly id: string;
  readonly name: string;
  config: TConfig;
  isAvailable(): boolean;
}

// ─── Payment provider ─────────────────────────────────────────────────────────

export interface CreatePaymentIntentParams {
  amount: number; // in smallest currency unit (cents)
  currency: string; // ISO 4217 e.g. "usd"
  customerId?: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret?: string;
  status: string;
  amount: number;
  currency: string;
}

export interface RefundParams {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

export interface PaymentProvider extends Provider {
  createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntent>;
  refund(params: RefundParams): Promise<{ id: string; status: string }>;
  constructWebhookEvent(
    payload: string,
    signature: string
  ): Promise<{ type: string; data: unknown }>;
}

// ─── Email provider ───────────────────────────────────────────────────────────

export interface SendEmailParams {
  to: string | string[];
  from?: string;
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
}

export interface EmailProvider extends Provider {
  send(params: SendEmailParams): Promise<{ messageId: string }>;
}

// ─── SMS provider ─────────────────────────────────────────────────────────────

export interface SendSmsParams {
  to: string;
  from?: string;
  body: string;
}

export interface SmsProvider extends Provider {
  send(params: SendSmsParams): Promise<{ messageId: string }>;
}

// ─── Analytics provider ───────────────────────────────────────────────────────

export interface TrackEventParams {
  name: string;
  userId?: string;
  anonymousId?: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

export interface AnalyticsProvider extends Provider {
  track(params: TrackEventParams): Promise<void>;
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
  page(name: string, properties?: Record<string, unknown>): Promise<void>;
}

// ─── AI provider ─────────────────────────────────────────────────────────────

export interface CompletionParams {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface CompletionResult {
  text: string;
  model: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
}

export interface AiProvider extends Provider {
  complete(params: CompletionParams): Promise<CompletionResult>;
  embed(text: string): Promise<number[]>;
}

// ─── CRM provider ─────────────────────────────────────────────────────────────

export interface CrmContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface CrmProvider extends Provider {
  upsertContact(contact: CrmContact): Promise<{ id: string }>;
  getContact(id: string): Promise<CrmContact | null>;
  addTag(contactId: string, tag: string): Promise<void>;
}

// ─── Accounting provider ──────────────────────────────────────────────────────

export interface InvoiceParams {
  customerId: string;
  lineItems: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  currency: string;
  dueDate?: string;
}

export interface AccountingProvider extends Provider {
  createInvoice(params: InvoiceParams): Promise<{ id: string; url?: string }>;
  recordPayment(invoiceId: string, amount: number): Promise<void>;
}

// ─── Learning provider ────────────────────────────────────────────────────────

export interface LearningEnrollParams {
  userId: string;
  courseId: string;
  metadata?: Record<string, unknown>;
}

export interface LearningProvider extends Provider {
  enrollUser(params: LearningEnrollParams): Promise<{ enrollmentId: string }>;
  getProgress(userId: string, courseId: string): Promise<{ percent: number; completedAt?: string }>;
  issueCertificate(userId: string, courseId: string): Promise<{ certificateId: string; url: string }>;
}
