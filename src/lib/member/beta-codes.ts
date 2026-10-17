import { createHmac, randomBytes } from "node:crypto";

/**
 * Alpha/Beta access codes.
 * Format: EDU-XXXX-XXXX-XXXX-XXXX (16 random symbols from a 32-symbol alphabet = 80 bits of entropy).
 * 256 is divisible by 32, so mapping random bytes with `% 32` has no modulo bias.
 * Plaintext codes are shown to the owner exactly once at issuance and are never persisted.
 */
export const BETA_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const BETA_CODE_RANDOM_LENGTH = 16;
export const BETA_CODE_PREFIX = "EDU";
export const BETA_CODE_DURATION_DAYS = 90;
export const BETA_CODE_MAX_BATCH = 50;

export function generateBetaCode(random: (size: number) => Uint8Array = (size) => randomBytes(size)): string {
  const bytes = random(BETA_CODE_RANDOM_LENGTH);
  const symbols = Array.from(bytes, (value) => BETA_CODE_ALPHABET[value % BETA_CODE_ALPHABET.length]).join("");
  return `${BETA_CODE_PREFIX}-${symbols.slice(0, 4)}-${symbols.slice(4, 8)}-${symbols.slice(8, 12)}-${symbols.slice(12, 16)}`;
}

/**
 * Normalizes user input (case, spaces, dashes; prefix optional). The alphabet excludes the
 * look-alike characters O, 0, I and 1, so any of those makes the input invalid.
 */
export function normalizeBetaCode(input: string): string | null {
  const cleaned = input.toUpperCase().replace(/[\s_-]/g, "");
  const withPrefixLength = BETA_CODE_PREFIX.length + BETA_CODE_RANDOM_LENGTH;
  const body = cleaned.length === withPrefixLength && cleaned.startsWith(BETA_CODE_PREFIX)
    ? cleaned.slice(BETA_CODE_PREFIX.length)
    : cleaned;
  if (body.length !== BETA_CODE_RANDOM_LENGTH) return null;
  for (const char of body) {
    if (!BETA_CODE_ALPHABET.includes(char)) return null;
  }
  return `${BETA_CODE_PREFIX}-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}-${body.slice(12, 16)}`;
}

export function getBetaCodePepper(env: Record<string, string | undefined> = process.env): string {
  const pepper = env.BETA_CODE_PEPPER?.trim();
  if (!pepper || pepper.length < 32) {
    throw new Error("BETA_CODE_PEPPER is not configured (server-only secret, minimum 32 characters).");
  }
  return pepper;
}

/** Keyed hash used for storage and lookup. Input must already be normalized. */
export function hashBetaCode(normalizedCode: string, pepper: string): string {
  return createHmac("sha256", pepper).update(normalizedCode).digest("hex");
}

export function betaCodeHint(normalizedCode: string): string {
  return normalizedCode.slice(-4);
}

export interface IssuedBetaCode {
  code: string;
  codeHash: string;
  codeHint: string;
}

export function issueBetaCodes(count: number, pepper: string, random?: (size: number) => Uint8Array): IssuedBetaCode[] {
  if (!Number.isInteger(count) || count < 1 || count > BETA_CODE_MAX_BATCH) {
    throw new Error(`count must be an integer between 1 and ${BETA_CODE_MAX_BATCH}.`);
  }
  const seen = new Set<string>();
  const issued: IssuedBetaCode[] = [];
  while (issued.length < count) {
    const code = generateBetaCode(random);
    const codeHash = hashBetaCode(code, pepper);
    if (seen.has(codeHash)) continue;
    seen.add(codeHash);
    issued.push({ code, codeHash, codeHint: betaCodeHint(code) });
  }
  return issued;
}

export type BetaRedeemOutcome = "redeemed" | "invalid" | "already_has_beta";

/** One generic message for every failure that could reveal whether a code exists. */
export const BETA_REDEEM_GENERIC_ERROR = "That access code could not be redeemed. Check the code and try again, or contact support@edunancial.com.";

export function describeBetaRedeemOutcome(outcome: BetaRedeemOutcome, expiresAt: string | null) {
  if (outcome === "redeemed") {
    return { ok: true as const, status: 200, message: "Beta access activated. Full access to all tracks, levels, and languages for 90 days.", expiresAt };
  }
  if (outcome === "already_has_beta") {
    return { ok: false as const, status: 409, message: "This account already has active beta access. Your code was not used.", expiresAt };
  }
  return { ok: false as const, status: 400, message: BETA_REDEEM_GENERIC_ERROR, expiresAt: null };
}