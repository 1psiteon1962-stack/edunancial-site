import type { EmailTemplate } from "@/types/support";

// i18n: TODO — extract subject/body strings into a translation catalog once
// multi-language transactional email is prioritized.

function wrapper(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#08101f;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
    <table role="presentation" width="100%" style="background-color:#08101f;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" style="background-color:#101a2f;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.1);">
                <span style="color:#facc15;letter-spacing:0.3em;text-transform:uppercase;font-weight:bold;font-size:12px;">Edunancial</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;border-top:1px solid rgba(255,255,255,0.1);color:#94a3b8;font-size:12px;">
                Edunancial Inc. &middot; support@edunancial.com &middot;
                <a href="{{unsubscribeUrl}}" style="color:#60a5fa;">Manage preferences</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    category: "onboarding",
    subject: "Welcome to Edunancial, {{firstName}}!",
    variables: ["firstName", "loginUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:28px;font-weight:900;margin:0 0 16px;">Welcome, {{firstName}}!</h1>
      <p style="color:#cbd5e1;line-height:1.6;">We're excited to have you join Edunancial. Your journey toward financial confidence starts now.</p>
      <p style="margin:24px 0;">
        <a href="{{loginUrl}}" style="background-color:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Go to your dashboard</a>
      </p>
      <p style="color:#94a3b8;line-height:1.6;">If you have any questions, our support team is always ready to help.</p>
    `),
    textBody:
      "Welcome, {{firstName}}! We're excited to have you join Edunancial. Visit {{loginUrl}} to get started.",
  },
  {
    id: "email_verification",
    name: "Email Verification",
    category: "onboarding",
    subject: "Verify your Edunancial email address",
    variables: ["firstName", "verificationUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">Confirm your email</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, please confirm this is your email address to activate your account.</p>
      <p style="margin:24px 0;">
        <a href="{{verificationUrl}}" style="background-color:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Verify email address</a>
      </p>
      <p style="color:#94a3b8;line-height:1.6;">This link expires in 24 hours. If you didn't create an Edunancial account, you can ignore this email.</p>
    `),
    textBody:
      "Hi {{firstName}}, confirm your email by visiting {{verificationUrl}}. This link expires in 24 hours.",
  },
  {
    id: "password_reset",
    name: "Password Reset",
    category: "security",
    subject: "Reset your Edunancial password",
    variables: ["firstName", "resetUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">Reset your password</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, we received a request to reset your password.</p>
      <p style="margin:24px 0;">
        <a href="{{resetUrl}}" style="background-color:#dc2626;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Reset password</a>
      </p>
      <p style="color:#94a3b8;line-height:1.6;">This link expires in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
    `),
    textBody:
      "Hi {{firstName}}, reset your password by visiting {{resetUrl}}. This link expires in 30 minutes.",
  },
  {
    id: "membership_upgrade",
    name: "Membership Upgrade Confirmation",
    category: "billing",
    subject: "You've upgraded to Edunancial {{planName}}",
    variables: ["firstName", "planName", "amount", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">You're now on {{planName}}!</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, your upgrade to the {{planName}} plan was successful. You were charged {{amount}} for the prorated difference.</p>
      <p style="color:#94a3b8;line-height:1.6;">Your new benefits are available immediately — enjoy full access to the catalog.</p>
    `),
    textBody:
      "Hi {{firstName}}, your upgrade to {{planName}} was successful. You were charged {{amount}}.",
  },
  {
    id: "billing_receipt",
    name: "Billing Receipt",
    category: "billing",
    subject: "Your Edunancial receipt for {{amount}}",
    variables: ["firstName", "amount", "date", "invoiceUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">Payment receipt</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, thank you for your payment of {{amount}} on {{date}}.</p>
      <p style="margin:24px 0;">
        <a href="{{invoiceUrl}}" style="background-color:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Download invoice</a>
      </p>
    `),
    textBody:
      "Hi {{firstName}}, thank you for your payment of {{amount}} on {{date}}. Download your invoice: {{invoiceUrl}}",
  },
  {
    id: "payment_failure",
    name: "Payment Failure",
    category: "billing",
    subject: "Action needed: your Edunancial payment failed",
    variables: ["firstName", "updatePaymentUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">We couldn't process your payment</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, your most recent payment didn't go through. Please update your payment method to avoid interruption to your membership.</p>
      <p style="margin:24px 0;">
        <a href="{{updatePaymentUrl}}" style="background-color:#dc2626;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Update payment method</a>
      </p>
    `),
    textBody:
      "Hi {{firstName}}, your payment failed. Update your payment method: {{updatePaymentUrl}}",
  },
  {
    id: "course_enrollment",
    name: "Course Enrollment Confirmation",
    category: "courses",
    subject: "You're enrolled in {{courseName}}",
    variables: ["firstName", "courseName", "courseUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">You're enrolled!</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, you're now enrolled in {{courseName}}. Jump back in whenever you're ready.</p>
      <p style="margin:24px 0;">
        <a href="{{courseUrl}}" style="background-color:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Start learning</a>
      </p>
    `),
    textBody:
      "Hi {{firstName}}, you're enrolled in {{courseName}}. Start learning: {{courseUrl}}",
  },
  {
    id: "course_completion",
    name: "Course Completion",
    category: "courses",
    subject: "You completed {{courseName}}!",
    variables: ["firstName", "courseName", "achievementsUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">Congratulations, {{firstName}}!</h1>
      <p style="color:#cbd5e1;line-height:1.6;">You've successfully completed {{courseName}}. Your progress and next recommended steps are waiting on your dashboard.</p>
      <p style="margin:24px 0;">
        <a href="{{achievementsUrl}}" style="background-color:#16a34a;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">View achievement</a>
      </p>
    `),
    textBody:
      "Congratulations {{firstName}}! You completed {{courseName}}. View your achievement: {{achievementsUrl}}",
  },
  {
    id: "certificate_notification",
    name: "Certificate Earned",
    category: "courses",
    subject: "Your certificate for {{courseName}} is ready",
    variables: ["firstName", "courseName", "certificateUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">Your certificate is ready</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, your certificate for {{courseName}} has been generated and is ready to download or share.</p>
      <p style="margin:24px 0;">
        <a href="{{certificateUrl}}" style="background-color:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Download certificate</a>
      </p>
    `),
    textBody:
      "Hi {{firstName}}, your certificate for {{courseName}} is ready: {{certificateUrl}}",
  },
  {
    id: "newsletter",
    name: "Monthly Newsletter",
    category: "marketing",
    subject: "Edunancial Monthly: {{monthName}} highlights",
    variables: ["firstName", "monthName", "highlightsUrl", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">{{monthName}} highlights</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, here's what's new at Edunancial this month, including new courses and community stories.</p>
      <p style="margin:24px 0;">
        <a href="{{highlightsUrl}}" style="background-color:#2563eb;color:#ffffff;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Read the highlights</a>
      </p>
    `),
    textBody:
      "Hi {{firstName}}, here's what's new at Edunancial this month: {{highlightsUrl}}",
  },
  {
    id: "promotional",
    name: "Promotional Offer",
    category: "marketing",
    subject: "{{offerHeadline}} — limited time",
    variables: ["firstName", "offerHeadline", "offerUrl", "expiryDate", "unsubscribeUrl"],
    htmlBody: wrapper(`
      <h1 style="font-size:24px;font-weight:900;margin:0 0 16px;">{{offerHeadline}}</h1>
      <p style="color:#cbd5e1;line-height:1.6;">Hi {{firstName}}, this offer is available through {{expiryDate}}. Don't miss it.</p>
      <p style="margin:24px 0;">
        <a href="{{offerUrl}}" style="background-color:#facc15;color:#08101f;padding:12px 20px;border-radius:8px;font-weight:bold;text-decoration:none;">Claim offer</a>
      </p>
    `),
    textBody:
      "Hi {{firstName}}, {{offerHeadline}} available through {{expiryDate}}: {{offerUrl}}",
  },
];

export function getTemplate(id: string): EmailTemplate | undefined {
  return emailTemplates.find((template) => template.id === id);
}

export function renderTemplate(
  template: EmailTemplate,
  vars: Record<string, string>
): { subject: string; htmlBody: string; textBody: string } {
  const replace = (input: string) =>
    input.replace(/{{\s*(\w+)\s*}}/g, (match, key: string) =>
      key in vars ? vars[key] : match
    );

  return {
    subject: replace(template.subject),
    htmlBody: replace(template.htmlBody),
    textBody: replace(template.textBody),
  };
}
