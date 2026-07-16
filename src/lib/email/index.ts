/**
 * Provider-neutral email service abstraction.
 *
 * Configure one provider via environment variables.
 * Do not hard-code a single email vendor throughout the application.
 *
 * Supported providers (set EMAIL_PROVIDER):
 *   - "resend"   — Resend (https://resend.com)  [recommended]
 *   - "sendgrid" — SendGrid
 *   - "console"  — Prints to console (development / CI)
 *
 * Required environment variables (see .env.example):
 *   EMAIL_PROVIDER
 *   EMAIL_FROM_ADDRESS
 *   EMAIL_FROM_NAME
 *   RESEND_API_KEY       (when EMAIL_PROVIDER=resend)
 *   SENDGRID_API_KEY     (when EMAIL_PROVIDER=sendgrid)
 */

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
}

// ============================================================
// PROVIDER: Resend
// ============================================================

async function sendViaResend(msg: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "RESEND_API_KEY not set" };

  const fromName = process.env.EMAIL_FROM_NAME ?? "Edunancial";
  const fromAddr = process.env.EMAIL_FROM_ADDRESS ?? "noreply@edunancial.com";
  const from = fromName + " <" + fromAddr + ">";

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [msg.to],
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      return { success: false, error: "Resend error " + resp.status + ": " + body };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ============================================================
// PROVIDER: SendGrid
// ============================================================

async function sendViaSendGrid(msg: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return { success: false, error: "SENDGRID_API_KEY not set" };

  const from = {
    email: process.env.EMAIL_FROM_ADDRESS ?? "noreply@edunancial.com",
    name: process.env.EMAIL_FROM_NAME ?? "Edunancial",
  };

  try {
    const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: msg.to }] }],
        from,
        subject: msg.subject,
        content: [
          { type: "text/plain", value: msg.text },
          ...(msg.html ? [{ type: "text/html", value: msg.html }] : []),
        ],
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      return { success: false, error: "SendGrid error " + resp.status + ": " + body };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ============================================================
// PROVIDER: Console (development)
// ============================================================

function sendToConsole(msg: EmailMessage): EmailResult {
  console.log("\n=== [EMAIL SERVICE - CONSOLE MODE] ===");
  console.log("To:      " + msg.to);
  console.log("Subject: " + msg.subject);
  console.log("Body:\n" + msg.text);
  console.log("======================================\n");
  return { success: true };
}

// ============================================================
// MAIN SEND FUNCTION
// ============================================================

export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  const provider = (process.env.EMAIL_PROVIDER ?? "console").toLowerCase();

  switch (provider) {
    case "resend":
      return sendViaResend(msg);
    case "sendgrid":
      return sendViaSendGrid(msg);
    case "console":
    default:
      return sendToConsole(msg);
  }
}

// ============================================================
// EMAIL TEMPLATES
// ============================================================

const SITE_NAME = "Edunancial";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.edunancial.com";

export function buildVerificationEmail(opts: {
  firstName: string;
  to: string;
  verificationUrl: string;
}): EmailMessage {
  return {
    to: opts.to,
    subject: "Verify your " + SITE_NAME + " account",
    text: [
      "Hi " + opts.firstName + ",",
      "",
      "Welcome to " + SITE_NAME + "! Please verify your email address to activate your account.",
      "",
      "Verification link:",
      opts.verificationUrl,
      "",
      "This link expires in 24 hours. If you did not create an account, you can safely ignore this email.",
      "",
      "— The " + SITE_NAME + " Team",
    ].join("\n"),
    html: [
      "<p>Hi " + opts.firstName + ",</p>",
      "<p>Welcome to " + SITE_NAME + "! Please verify your email address to activate your account.</p>",
      '<p><a href="' + opts.verificationUrl + '" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify Email Address</a></p>',
      "<p>Or copy this link:<br><a href=\"" + opts.verificationUrl + "\">" + opts.verificationUrl + "</a></p>",
      "<p>This link expires in 24 hours.</p>",
      "<p>If you did not create an account, you can safely ignore this email.</p>",
      "<p>— The " + SITE_NAME + " Team</p>",
    ].join(""),
  };
}

export function buildPasswordResetEmail(opts: {
  firstName: string;
  to: string;
  resetUrl: string;
}): EmailMessage {
  return {
    to: opts.to,
    subject: "Reset your " + SITE_NAME + " password",
    text: [
      "Hi " + opts.firstName + ",",
      "",
      "We received a request to reset the password for your " + SITE_NAME + " account.",
      "",
      "Password reset link (expires in 1 hour):",
      opts.resetUrl,
      "",
      "If you did not request a password reset, you can safely ignore this email. Your password will not change.",
      "",
      "— The " + SITE_NAME + " Team",
    ].join("\n"),
    html: [
      "<p>Hi " + opts.firstName + ",</p>",
      "<p>We received a request to reset the password for your " + SITE_NAME + " account.</p>",
      '<p><a href="' + opts.resetUrl + '" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a></p>',
      "<p>Or copy this link:<br><a href=\"" + opts.resetUrl + "\">" + opts.resetUrl + "</a></p>",
      "<p>This link expires in 1 hour.</p>",
      "<p>If you did not request a password reset, you can safely ignore this email.</p>",
      "<p>— The " + SITE_NAME + " Team</p>",
    ].join(""),
  };
}

export { SITE_URL };
