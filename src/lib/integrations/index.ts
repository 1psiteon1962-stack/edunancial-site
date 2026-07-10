/**
 * Integration hub barrel export and provider registry.
 * Consumers use the registry to get the active provider for each category.
 */

export * from "./types";
export * from "./stripe";
export * from "./paypal";
export * from "./analytics";
export * from "./email";
export * from "./sms";
export * from "./ai";
export * from "./crm";
export * from "./accounting";
export * from "./learning";

// ─── Provider registry ────────────────────────────────────────────────────────

import { stripeProvider } from "./stripe";
import { paypalProvider } from "./paypal";
import { googleAnalyticsProvider, googleSearchConsoleProvider, microsoftClarityProvider } from "./analytics";
import { emailProvider } from "./email";
import { smsProvider } from "./sms";
import { aiProvider } from "./ai";
import { crmProvider } from "./crm";
import { accountingProvider } from "./accounting";
import { learningProvider } from "./learning";
import type { PaymentProvider, AnalyticsProvider, EmailProvider, SmsProvider, AiProvider, CrmProvider, AccountingProvider, LearningProvider } from "./types";

export interface IntegrationRegistry {
  payment: {
    stripe: PaymentProvider;
    paypal: PaymentProvider;
  };
  analytics: {
    google: AnalyticsProvider;
    searchConsole: typeof googleSearchConsoleProvider;
    clarity: typeof microsoftClarityProvider;
  };
  email: EmailProvider;
  sms: SmsProvider;
  ai: AiProvider;
  crm: CrmProvider;
  accounting: AccountingProvider;
  learning: LearningProvider;
}

export const integrations: IntegrationRegistry = {
  payment: {
    stripe: stripeProvider,
    paypal: paypalProvider,
  },
  analytics: {
    google: googleAnalyticsProvider,
    searchConsole: googleSearchConsoleProvider,
    clarity: microsoftClarityProvider,
  },
  email: emailProvider,
  sms: smsProvider,
  ai: aiProvider,
  crm: crmProvider,
  accounting: accountingProvider,
  learning: learningProvider,
};
