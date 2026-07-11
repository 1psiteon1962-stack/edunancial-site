/**
 * Regional legal text module
 *
 * Centralised registry of locale-specific disclaimers, terms, and
 * compliance notices. Each region inherits the global base and may
 * override specific keys without duplicating the full text.
 */

import { RegionCode } from "./engine";

// ─── Legal text shape ────────────────────────────────────────────────────────

export interface LegalTextPack {
  /** Core educational / no-advice disclaimer */
  disclaimer: string;
  /** User responsibility notice */
  userResponsibility: string;
  /** Governing jurisdiction text */
  jurisdiction: string;
  /** Privacy policy summary reference */
  privacyNotice: string;
  /** Region-specific regulatory notice (may be empty string) */
  regulatoryNotice: string;
}

// ─── Base / global text ──────────────────────────────────────────────────────

const BASE_LEGAL: LegalTextPack = {
  disclaimer: `
Edunancial provides educational and analytical frameworks for informational
purposes only. Nothing on this platform constitutes legal, investment, tax,
or accounting advice, nor creates any professional relationship.
  `.trim(),

  userResponsibility: `
Users are solely responsible for how they interpret and apply any information.
Consult qualified professionals before making decisions that affect your
finances, taxes, compliance, or legal rights.
  `.trim(),

  jurisdiction: `
All disputes related to this platform are governed by the laws of the State
of Florida, with exclusive venue in Palm Beach County, Florida.
  `.trim(),

  privacyNotice: `
Your data is processed in accordance with our Privacy Policy. We do not sell
your personal information.
  `.trim(),

  regulatoryNotice: "",
};

// ─── Region overrides ────────────────────────────────────────────────────────

const REGION_LEGAL_OVERRIDES: Partial<Record<RegionCode, Partial<LegalTextPack>>> = {
  europe: {
    privacyNotice: `
Your personal data is processed in accordance with GDPR (EU 2016/679) and our
Privacy Policy. You have the right to access, correct, port, or erase your data.
Contact us at privacy@edunancial.com to exercise your rights.
    `.trim(),

    regulatoryNotice: `
Edunancial is not registered as a financial adviser or investment firm in any
EU member state. Content is for educational purposes only. EU consumers may
have additional statutory rights under applicable national law.
    `.trim(),
  },

  latam: {
    regulatoryNotice: `
El contenido de esta plataforma es exclusivamente educativo y no constituye
asesoría financiera, legal o fiscal. Consulte a un profesional calificado
antes de tomar decisiones financieras.
    `.trim(),
  },

  africa: {
    regulatoryNotice: `
Edunancial is not licensed as a financial services provider in any African
jurisdiction. All content is educational. Regulatory requirements vary
significantly across African countries; seek local professional advice.
    `.trim(),
  },

  mena: {
    regulatoryNotice: `
لا تُعدّ منصة Edunancial مستشاراً مالياً أو مرخصاً في أي دولة في منطقة الشرق
الأوسط وشمال أفريقيا. جميع المحتويات للأغراض التعليمية فقط. يُرجى استشارة
متخصص محلي مؤهل قبل اتخاذ أي قرارات مالية.
    `.trim(),
  },

  asia: {
    regulatoryNotice: `
Edunancial is not registered as a financial adviser in any Asian jurisdiction.
Content is educational only. Regulatory requirements vary across Asia;
consult a locally licensed professional before acting on any information.
    `.trim(),
  },

  caribbean: {
    regulatoryNotice: `
Edunancial is not licensed as a financial services provider in the Caribbean.
Content is educational. Individual country regulations apply; consult a local
professional for advice specific to your jurisdiction.
    `.trim(),
  },

  oceania: {
    privacyNotice: `
Your personal data is processed in accordance with the Australian Privacy Act
1988 and our Privacy Policy. Contact privacy@edunancial.com to exercise your
data rights.
    `.trim(),

    regulatoryNotice: `
Edunancial is not registered as a financial adviser under the Corporations Act
(Australia) or the Financial Markets Conduct Act (New Zealand). Content is
educational only.
    `.trim(),
  },
};

// ─── Resolver ────────────────────────────────────────────────────────────────

/**
 * Returns the merged legal text pack for a region.
 * Region-specific keys override the global base; unset keys fall back to base.
 */
export function getLegalText(region: RegionCode): LegalTextPack {
  const overrides = REGION_LEGAL_OVERRIDES[region] ?? {};
  return { ...BASE_LEGAL, ...overrides };
}

/**
 * Returns a single legal text string by key for a region.
 */
export function getLegalKey(
  region: RegionCode,
  key: keyof LegalTextPack,
): string {
  return getLegalText(region)[key];
}
