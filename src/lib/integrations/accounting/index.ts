/**
 * Accounting provider adapter.
 *
 * Supports:
 *   - QuickBooks Online (ACCOUNTING_PROVIDER=quickbooks)
 *   - Stub (default)
 *
 * Environment variables:
 *   ACCOUNTING_PROVIDER       – "quickbooks" (default: "stub")
 *   QUICKBOOKS_ACCESS_TOKEN   – QuickBooks OAuth2 access token
 *   QUICKBOOKS_COMPANY_ID     – QuickBooks company (realm) ID
 *   QUICKBOOKS_ENVIRONMENT    – "sandbox" | "production"
 */

import type { AccountingProvider, InvoiceParams, ProviderConfig } from "../types";

export interface AccountingConfig extends ProviderConfig {
  accessToken?: string;
  companyId?: string;
}

// ─── QuickBooks Online ────────────────────────────────────────────────────────

class QuickBooksProvider implements AccountingProvider {
  readonly id = "quickbooks";
  readonly name = "QuickBooks Online";

  get config(): AccountingConfig {
    return {
      enabled: !!(process.env.QUICKBOOKS_ACCESS_TOKEN && process.env.QUICKBOOKS_COMPANY_ID),
      accessToken: process.env.QUICKBOOKS_ACCESS_TOKEN,
      companyId: process.env.QUICKBOOKS_COMPANY_ID,
      environment: (process.env.QUICKBOOKS_ENVIRONMENT as "sandbox" | "live") ?? "sandbox",
    };
  }

  isAvailable(): boolean {
    return !!(this.config.accessToken && this.config.companyId);
  }

  private baseUrl(): string {
    return this.config.environment === "live"
      ? "https://quickbooks.api.intuit.com"
      : "https://sandbox-quickbooks.api.intuit.com";
  }

  async createInvoice(params: InvoiceParams): Promise<{ id: string; url?: string }> {
    const { companyId, accessToken } = this.config;
    const res = await fetch(
      `${this.baseUrl()}/v3/company/${companyId}/invoice`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          CustomerRef: { value: params.customerId },
          CurrencyRef: { value: params.currency.toUpperCase() },
          DueDate: params.dueDate,
          Line: params.lineItems.map((item) => ({
            Amount: (item.amount / 100) * item.quantity,
            DetailType: "SalesItemLineDetail",
            SalesItemLineDetail: {
              Qty: item.quantity,
              UnitPrice: item.amount / 100,
            },
            Description: item.description,
          })),
        }),
      }
    );

    const json = (await res.json()) as { Invoice: { Id: string } };
    return { id: json.Invoice.Id };
  }

  async recordPayment(invoiceId: string, amount: number): Promise<void> {
    const { companyId, accessToken } = this.config;
    await fetch(`${this.baseUrl()}/v3/company/${companyId}/payment`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        TotalAmt: amount / 100,
        Line: [{ Amount: amount / 100, LinkedTxn: [{ TxnId: invoiceId, TxnType: "Invoice" }] }],
      }),
    });
  }
}

// ─── Stub ──────────────────────────────────────────────────────────────────────

class StubAccountingProvider implements AccountingProvider {
  readonly id = "stub";
  readonly name = "Accounting Stub";
  readonly config: AccountingConfig = { enabled: true };
  isAvailable(): boolean { return true; }

  async createInvoice(params: InvoiceParams): Promise<{ id: string }> {
    const id = `inv_${Date.now()}`;
    console.log("[AccountingStub] Create invoice for customer:", params.customerId, "→", id);
    return { id };
  }

  async recordPayment(invoiceId: string, amount: number): Promise<void> {
    console.log("[AccountingStub] Record payment:", amount, "for invoice", invoiceId);
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export const accountingProvider: AccountingProvider =
  process.env.ACCOUNTING_PROVIDER === "quickbooks"
    ? new QuickBooksProvider()
    : new StubAccountingProvider();
