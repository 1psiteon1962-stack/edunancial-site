/**
 * Email provider adapter with multi-provider support.
 *
 * Supports:
 *   - SendGrid  (EMAIL_PROVIDER=sendgrid)
 *   - Resend    (EMAIL_PROVIDER=resend)
 *   - SMTP stub (default fallback)
 *
 * Environment variables:
 *   EMAIL_PROVIDER       – "sendgrid" | "resend" (default: "stub")
 *   SENDGRID_API_KEY     – SendGrid API key
 *   RESEND_API_KEY       – Resend API key
 *   EMAIL_FROM_ADDRESS   – Default from address
 */

import type { EmailProvider, SendEmailParams, ProviderConfig } from "../types";

export interface EmailConfig extends ProviderConfig {
  apiKey: string;
  fromAddress: string;
}

// ─── SendGrid ──────────────────────────────────────────────────────────────────

class SendGridProvider implements EmailProvider {
  readonly id = "sendgrid";
  readonly name = "SendGrid";

  get config(): EmailConfig {
    return {
      enabled: !!process.env.SENDGRID_API_KEY,
      apiKey: process.env.SENDGRID_API_KEY ?? "",
      fromAddress: process.env.EMAIL_FROM_ADDRESS ?? "noreply@edunancial.com",
    };
  }

  isAvailable(): boolean { return !!this.config.apiKey; }

  async send(params: SendEmailParams): Promise<{ messageId: string }> {
    const to = Array.isArray(params.to) ? params.to : [params.to];

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: to.map((email) => ({ email })) }],
        from: { email: params.from ?? this.config.fromAddress },
        subject: params.subject,
        content: [
          ...(params.html ? [{ type: "text/html", value: params.html }] : []),
          ...(params.text ? [{ type: "text/plain", value: params.text }] : []),
        ],
        ...(params.templateId ? { template_id: params.templateId } : {}),
        ...(params.templateData ? { dynamic_template_data: params.templateData } : {}),
      }),
    });

    const messageId = res.headers.get("x-message-id") ?? "";
    return { messageId };
  }
}

// ─── Resend ───────────────────────────────────────────────────────────────────

class ResendProvider implements EmailProvider {
  readonly id = "resend";
  readonly name = "Resend";

  get config(): EmailConfig {
    return {
      enabled: !!process.env.RESEND_API_KEY,
      apiKey: process.env.RESEND_API_KEY ?? "",
      fromAddress: process.env.EMAIL_FROM_ADDRESS ?? "noreply@edunancial.com",
    };
  }

  isAvailable(): boolean { return !!this.config.apiKey; }

  async send(params: SendEmailParams): Promise<{ messageId: string }> {
    const to = Array.isArray(params.to) ? params.to : [params.to];

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.config.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from ?? this.config.fromAddress,
        to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    const json = (await res.json()) as { id: string };
    return { messageId: json.id };
  }
}

// ─── Console stub (dev fallback) ──────────────────────────────────────────────

class StubEmailProvider implements EmailProvider {
  readonly id = "stub";
  readonly name = "Console (dev stub)";
  readonly config: EmailConfig = {
    enabled: true,
    apiKey: "",
    fromAddress: "noreply@edunancial.com",
  };

  isAvailable(): boolean { return true; }

  async send(params: SendEmailParams): Promise<{ messageId: string }> {
    const id = `stub_${Date.now()}`;
    console.log("[EmailStub] Send email:", JSON.stringify({ ...params, messageId: id }));
    return { messageId: id };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

function createEmailProvider(): EmailProvider {
  const type = process.env.EMAIL_PROVIDER ?? "stub";
  switch (type) {
    case "sendgrid": return new SendGridProvider();
    case "resend": return new ResendProvider();
    default: return new StubEmailProvider();
  }
}

export const emailProvider: EmailProvider = createEmailProvider();
