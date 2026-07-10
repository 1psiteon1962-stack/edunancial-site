/**
 * SMS provider adapter with multi-provider support.
 *
 * Supports:
 *   - Twilio   (SMS_PROVIDER=twilio)
 *   - Console stub (default)
 *
 * Environment variables:
 *   SMS_PROVIDER         – "twilio" (default: "stub")
 *   TWILIO_ACCOUNT_SID   – Twilio account SID
 *   TWILIO_AUTH_TOKEN    – Twilio auth token
 *   TWILIO_FROM_NUMBER   – Twilio sender phone number
 */

import type { SmsProvider, SendSmsParams, ProviderConfig } from "../types";

export interface SmsConfig extends ProviderConfig {
  accountSid?: string;
  authToken?: string;
  fromNumber?: string;
}

// ─── Twilio ───────────────────────────────────────────────────────────────────

class TwilioProvider implements SmsProvider {
  readonly id = "twilio";
  readonly name = "Twilio";

  get config(): SmsConfig {
    return {
      enabled: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER,
    };
  }

  isAvailable(): boolean {
    return !!(this.config.accountSid && this.config.authToken);
  }

  async send(params: SendSmsParams): Promise<{ messageId: string }> {
    const { accountSid, authToken, fromNumber } = this.config;
    const creds = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const body = new URLSearchParams({
      To: params.to,
      From: params.from ?? fromNumber ?? "",
      Body: params.body,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${creds}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      }
    );

    const json = (await res.json()) as { sid: string };
    return { messageId: json.sid };
  }
}

// ─── Console stub ─────────────────────────────────────────────────────────────

class StubSmsProvider implements SmsProvider {
  readonly id = "stub";
  readonly name = "Console (dev stub)";
  readonly config: SmsConfig = { enabled: true };
  isAvailable(): boolean { return true; }

  async send(params: SendSmsParams): Promise<{ messageId: string }> {
    const id = `stub_sms_${Date.now()}`;
    console.log("[SmsStub] Send SMS:", JSON.stringify({ ...params, messageId: id }));
    return { messageId: id };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

function createSmsProvider(): SmsProvider {
  return process.env.SMS_PROVIDER === "twilio"
    ? new TwilioProvider()
    : new StubSmsProvider();
}

export const smsProvider: SmsProvider = createSmsProvider();
