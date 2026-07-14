import { normalizeLanguageCode } from "./international/languages";

const BETA_WINDOW_MS = 72 * 60 * 60 * 1000;

export const BETA_INVITATIONS_STORAGE_KEY = "edunancial:beta-invitations";
export const BETA_FEEDBACK_STORAGE_KEY = "edunancial:beta-feedback";
export const BETA_AUDIT_STORAGE_KEY = "edunancial:beta-audit";

export type BetaInvitationStatus = "approved" | "active" | "expired" | "revoked";

export interface BetaInvitationRecord {
  id: string;
  testerName: string;
  approvedEmail: string;
  passNumberHash: string;
  passNumberMasked: string;
  status: BetaInvitationStatus;
  createdAt: string;
  sentAt: string | null;
  redeemedAt: string | null;
  firstLoginAt: string | null;
  betaStartsAt: string | null;
  betaExpiresAt: string | null;
  revokedAt: string | null;
  feedbackSubmittedAt: string | null;
}

export interface BetaAccessSummary {
  invitationId: string;
  status: BetaInvitationStatus | "none";
  approvedEmail: string;
  redeemedAt: string | null;
  firstLoginAt: string | null;
  betaStartsAt: string | null;
  betaExpiresAt: string | null;
  feedbackSubmittedAt: string | null;
  remainingMs: number;
}

export interface BetaFeedbackSubmission {
  id: string;
  invitationId: string;
  testerId: string;
  email: string;
  submittedAt: string;
  countryRegion?: string;
  rating: number;
  strongestFeature: string;
  improvementRequest: string;
  confusingMoment: string;
  practicalOutcome: string;
  additionalNotes?: string;
}

export interface BetaAuditEntry {
  id: string;
  invitationId: string;
  actor: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface BetaInvitationEmail {
  subject: string;
  text: string;
}

function createId(prefix: string): string {
  const random = new Uint8Array(8);
  crypto.getRandomValues(random);
  return `${prefix}-${Array.from(random, (value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function maskPassNumber(passNumber: string): string {
  return `${passNumber.slice(0, 4)}-${passNumber.slice(-4)}`;
}

export function formatRemainingBetaTime(remainingMs: number): string {
  const safeRemainingMs = Math.max(0, remainingMs);
  const totalMinutes = Math.ceil(safeRemainingMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m remaining`;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function generatePassNumber(): string {
  const buffer = new Uint8Array(12);
  crypto.getRandomValues(buffer);
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const raw = Array.from(buffer, (value) => alphabet[value % alphabet.length]).join("");
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

export async function createBetaInvitation({
  testerName,
  approvedEmail,
  existingInvitations,
  now = new Date().toISOString(),
}: {
  testerName: string;
  approvedEmail: string;
  existingInvitations: BetaInvitationRecord[];
  now?: string;
}): Promise<{
  invitation: BetaInvitationRecord;
  passNumber: string;
  auditEntry: BetaAuditEntry;
}> {
  const normalizedEmail = normalizeEmail(approvedEmail);
  let passNumber = generatePassNumber();
  let passNumberHash = await sha256(passNumber);

  while (existingInvitations.some((invitation) => invitation.passNumberHash === passNumberHash)) {
    passNumber = generatePassNumber();
    passNumberHash = await sha256(passNumber);
  }

  const invitation: BetaInvitationRecord = {
    id: createId("beta"),
    testerName: testerName.trim(),
    approvedEmail: normalizedEmail,
    passNumberHash,
    passNumberMasked: maskPassNumber(passNumber),
    status: "approved",
    createdAt: now,
    sentAt: null,
    redeemedAt: null,
    firstLoginAt: null,
    betaStartsAt: null,
    betaExpiresAt: null,
    revokedAt: null,
    feedbackSubmittedAt: null,
  };

  return {
    invitation,
    passNumber,
    auditEntry: createBetaAuditEntry(invitation.id, "admin", "beta.invitation.created", now, {
      approvedEmail: normalizedEmail,
      testerName: invitation.testerName,
    }),
  };
}

export function createBetaAuditEntry(
  invitationId: string,
  actor: string,
  action: string,
  timestamp = new Date().toISOString(),
  metadata?: Record<string, unknown>,
): BetaAuditEntry {
  return {
    id: createId("beta-audit"),
    invitationId,
    actor,
    action,
    timestamp,
    metadata,
  };
}

export function getBetaAccessSummary(
  invitation: BetaInvitationRecord | null,
  email: string,
  now = new Date().toISOString(),
): BetaAccessSummary {
  if (!invitation || normalizeEmail(invitation.approvedEmail) !== normalizeEmail(email)) {
    return {
      invitationId: "",
      status: "none",
      approvedEmail: normalizeEmail(email),
      redeemedAt: null,
      firstLoginAt: null,
      betaStartsAt: null,
      betaExpiresAt: null,
      feedbackSubmittedAt: null,
      remainingMs: 0,
    };
  }

  const remainingMs = invitation.betaExpiresAt
    ? Math.max(0, new Date(invitation.betaExpiresAt).getTime() - new Date(now).getTime())
    : 0;

  return {
    invitationId: invitation.id,
    status: invitation.status,
    approvedEmail: invitation.approvedEmail,
    redeemedAt: invitation.redeemedAt,
    firstLoginAt: invitation.firstLoginAt,
    betaStartsAt: invitation.betaStartsAt,
    betaExpiresAt: invitation.betaExpiresAt,
    feedbackSubmittedAt: invitation.feedbackSubmittedAt,
    remainingMs,
  };
}

export async function applyBetaLogin({
  invitation,
  email,
  passNumber,
  now = new Date().toISOString(),
}: {
  invitation: BetaInvitationRecord | null;
  email: string;
  passNumber?: string;
  now?: string;
}): Promise<{
  invitation: BetaInvitationRecord | null;
  access: BetaAccessSummary;
  auditEntries: BetaAuditEntry[];
  error?: string;
}> {
  if (!invitation) {
    return {
      invitation: null,
      access: getBetaAccessSummary(null, email, now),
      auditEntries: [],
    };
  }

  if (normalizeEmail(invitation.approvedEmail) !== normalizeEmail(email)) {
    return {
      invitation,
      access: getBetaAccessSummary(invitation, email, now),
      auditEntries: [
        createBetaAuditEntry(invitation.id, email, "beta.access.denied.email-mismatch", now),
      ],
      error: "This beta invitation is tied to a different approved email address.",
    };
  }

  if (invitation.status === "revoked") {
    return {
      invitation,
      access: getBetaAccessSummary(invitation, email, now),
      auditEntries: [createBetaAuditEntry(invitation.id, email, "beta.access.denied.revoked", now)],
      error: "This beta invitation has been revoked.",
    };
  }

  if (invitation.betaExpiresAt && new Date(now).getTime() >= new Date(invitation.betaExpiresAt).getTime()) {
    const expiredInvitation = {
      ...invitation,
      status: "expired" as const,
    };

    return {
      invitation: expiredInvitation,
      access: getBetaAccessSummary(expiredInvitation, email, now),
      auditEntries: [createBetaAuditEntry(invitation.id, email, "beta.access.expired", now)],
    };
  }

  if (invitation.status === "active" && invitation.firstLoginAt) {
    return {
      invitation,
      access: getBetaAccessSummary(invitation, email, now),
      auditEntries: [createBetaAuditEntry(invitation.id, email, "beta.access.continued", now)],
    };
  }

  if (!passNumber) {
    return {
      invitation,
      access: getBetaAccessSummary(invitation, email, now),
      auditEntries: [],
    };
  }

  const providedHash = await sha256(passNumber.trim().toUpperCase());
  if (providedHash !== invitation.passNumberHash) {
    return {
      invitation,
      access: getBetaAccessSummary(invitation, email, now),
      auditEntries: [createBetaAuditEntry(invitation.id, email, "beta.access.denied.code-mismatch", now)],
      error: "The beta pass number is invalid.",
    };
  }

  const activatedInvitation: BetaInvitationRecord = {
    ...invitation,
    status: "active",
    redeemedAt: invitation.redeemedAt ?? now,
    firstLoginAt: invitation.firstLoginAt ?? now,
    betaStartsAt: invitation.betaStartsAt ?? now,
    betaExpiresAt:
      invitation.betaExpiresAt ??
      new Date(new Date(now).getTime() + BETA_WINDOW_MS).toISOString(),
  };

  return {
    invitation: activatedInvitation,
    access: getBetaAccessSummary(activatedInvitation, email, now),
    auditEntries: [
      createBetaAuditEntry(invitation.id, email, "beta.access.activated", now, {
        betaExpiresAt: activatedInvitation.betaExpiresAt,
      }),
    ],
  };
}

export function markBetaInvitationSent(
  invitation: BetaInvitationRecord,
  now = new Date().toISOString(),
): BetaInvitationRecord {
  return {
    ...invitation,
    sentAt: invitation.sentAt ?? now,
  };
}

export function revokeBetaInvitation(
  invitation: BetaInvitationRecord,
  now = new Date().toISOString(),
): BetaInvitationRecord {
  return {
    ...invitation,
    status: "revoked",
    revokedAt: now,
  };
}

export function extendBetaInvitation(
  invitation: BetaInvitationRecord,
  hours: number,
  now = new Date().toISOString(),
): BetaInvitationRecord {
  const currentExpiry = invitation.betaExpiresAt
    ? new Date(invitation.betaExpiresAt).getTime()
    : new Date(now).getTime();

  return {
    ...invitation,
    status: invitation.status === "expired" ? "active" : invitation.status,
    betaExpiresAt: new Date(currentExpiry + hours * 60 * 60 * 1000).toISOString(),
  };
}

export function renderBetaInvitationEmail({
  testerName,
  approvedEmail,
  passNumber,
  privacyUrl = "https://www.edunancial.com/privacy",
  termsUrl = "https://www.edunancial.com/beta-terms",
  supportEmail = "support@edunancial.com",
  languageCode = "en",
}: {
  testerName: string;
  approvedEmail: string;
  passNumber: string;
  privacyUrl?: string;
  termsUrl?: string;
  supportEmail?: string;
  languageCode?: string;
}): BetaInvitationEmail {
  if (normalizeLanguageCode(languageCode) === "es") {
    return {
      subject: "Su invitación para probar Edunancial",
      text: `Hola ${testerName},

Ha sido aprobado(a) para probar Edunancial.

Correo aprobado: ${approvedEmail}
Número de pase único: ${passNumber}

Instrucciones de canje:
1. Cree o use una cuenta de Edunancial con el correo aprobado indicado arriba.
2. Inicie sesión con ese mismo correo aprobado.
3. Ingrese el número de pase durante el inicio de sesión para activar el acceso beta.

Términos importantes de la beta:
- Su número de pase es de un solo uso, no transferible y está vinculado a ${approvedEmail}.
- Su ventana de acceso beta de 72 horas comienza solo en el primer inicio de sesión exitoso después del canje válido.
- El acceso beta no se renueva automáticamente, no genera cobro automático ni se convierte automáticamente en una membresía de pago.
- Solicitamos encarecidamente sus comentarios antes de que termine su ventana.

Soporte: ${supportEmail}
Privacidad: ${privacyUrl}
Términos beta: ${termsUrl}`,
    };
  }

  return {
    subject: "Your Invitation to Test Edunancial",
    text: `Hello ${testerName},

You have been approved to test Edunancial.

Approved email: ${approvedEmail}
Unique pass number: ${passNumber}

Redemption instructions:
1. Create or use an Edunancial account with the approved email address above.
2. Sign in with that same approved email address.
3. Enter the pass number during login to activate beta access.

Important beta terms:
- Your pass number is single-use, non-transferable, and tied to ${approvedEmail}.
- Your 72-hour beta access window begins only at your first successful login after valid redemption.
- Beta access does not auto-renew, auto-bill, or auto-convert into a paid membership.
- We strongly request feedback before your window ends.

Support: ${supportEmail}
Privacy: ${privacyUrl}
Beta Terms: ${termsUrl}`,
  };
}

export function recordBetaFeedback(
  invitation: BetaInvitationRecord,
  feedback: Omit<BetaFeedbackSubmission, "invitationId" | "submittedAt">,
  now = new Date().toISOString(),
): { invitation: BetaInvitationRecord; submission: BetaFeedbackSubmission } {
  return {
    invitation: {
      ...invitation,
      feedbackSubmittedAt: now,
    },
    submission: {
      ...feedback,
      invitationId: invitation.id,
      submittedAt: now,
    },
  };
}
