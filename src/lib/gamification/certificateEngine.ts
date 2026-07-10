import type { CertificateTemplate, UserCertificate, CertificateType } from "./types";

// ─── Certificate Template Registry ───────────────────────────────────────────
//
// To add a new certificate type:
//   1. Add an entry to CERTIFICATE_TEMPLATES below.
//   2. Implement a data-source that calls `issueCertificate()` when the trigger
//      condition is met (e.g. course completion webhook, LMS event, etc.).
//   PDF generation is scaffolded via the `pdfUrl` field on UserCertificate;
//   set pdfReady: true on a template when a PDF export service is wired up.

export const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  // ── Course Completion ──────────────────────────────────────────────────────
  {
    id: "cert_financial_foundations",
    type: "course_completion",
    name: "Financial Foundations",
    description: "Awarded upon completing the Financial Foundations course.",
    triggerSlug: "financial-foundations",
    pdfReady: false,
  },
  {
    id: "cert_real_estate",
    type: "course_completion",
    name: "RED Real Estate",
    description: "Awarded upon completing the RED Real Estate course.",
    triggerSlug: "red-real-estate",
    pdfReady: false,
  },
  {
    id: "cert_investing",
    type: "course_completion",
    name: "WHITE Investing",
    description: "Awarded upon completing the WHITE Investing course.",
    triggerSlug: "white-investing",
    pdfReady: false,
  },
  {
    id: "cert_business",
    type: "course_completion",
    name: "BLUE Business",
    description: "Awarded upon completing the BLUE Business course.",
    triggerSlug: "blue-business",
    pdfReady: false,
  },
  // ── Category Mastery ──────────────────────────────────────────────────────
  {
    id: "cert_financial_competency",
    type: "category_mastery",
    name: "Financial Competency",
    description: "Awarded for mastering all four quadrants of financial competency.",
    triggerSlug: "financial-competency",
    pdfReady: false,
  },
  {
    id: "cert_entrepreneur",
    type: "category_mastery",
    name: "Entrepreneur",
    description: "Awarded for mastering the Entrepreneur learning path.",
    triggerSlug: "entrepreneur",
    pdfReady: false,
  },
  {
    id: "cert_executive",
    type: "category_mastery",
    name: "Executive",
    description: "Awarded for mastering the Executive learning path.",
    triggerSlug: "executive",
    pdfReady: false,
  },
  // ── Special Achievement ───────────────────────────────────────────────────
  {
    id: "cert_economic_self_defense",
    type: "special_achievement",
    name: "Economic Self Defense",
    description: "Awarded for completing the Economic Self Defense program.",
    triggerSlug: "economic-self-defense",
    pdfReady: false,
  },
  // ── Learning Path ─────────────────────────────────────────────────────────
  {
    id: "cert_financial_literacy_path",
    type: "learning_path",
    name: "Financial Literacy Path",
    description: "Awarded for completing the full Financial Literacy learning path.",
    triggerSlug: "financial-literacy-path",
    pdfReady: false,
  },
];

/** Look up a template by its trigger slug. */
export function getTemplateBySlug(slug: string): CertificateTemplate | undefined {
  return CERTIFICATE_TEMPLATES.find((t) => t.triggerSlug === slug);
}

/** Look up a template by its ID. */
export function getTemplateById(id: string): CertificateTemplate | undefined {
  return CERTIFICATE_TEMPLATES.find((t) => t.id === id);
}

/** Filter templates by type. */
export function getTemplatesByType(type: CertificateType): CertificateTemplate[] {
  return CERTIFICATE_TEMPLATES.filter((t) => t.type === type);
}

/**
 * Issue a certificate for a user.
 * In production, persist the returned UserCertificate to your data store.
 */
export function issueCertificate(
  userId: string,
  studentName: string,
  templateId: string,
): UserCertificate {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Certificate template not found: ${templateId}`);
  }

  const now = new Date().toISOString();
  const certificateNumber = generateCertificateNumber(userId, templateId, now);

  return {
    id: `${userId}_${templateId}_${Date.now()}`,
    userId,
    templateId,
    studentName,
    credentialTitle: template.name,
    issuedAt: now,
    certificateNumber,
    verificationUrl: `/verify/${certificateNumber}`,
    pdfUrl: template.pdfReady ? `/certificates/pdf/${certificateNumber}.pdf` : undefined,
  };
}

/** Deterministic-ish certificate number for demo; replace with UUID/sequence in production. */
function generateCertificateNumber(userId: string, templateId: string, issuedAt: string): string {
  const prefix = "EDU";
  const year = new Date(issuedAt).getFullYear();
  const hash = Math.abs(
    (userId + templateId + issuedAt).split("").reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0)
  ) % 1_000_000;
  return `${prefix}-${year}-${String(hash).padStart(6, "0")}`;
}
