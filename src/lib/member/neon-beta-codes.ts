import { createHash, randomBytes } from "node:crypto";

/**
 * Neon-backed single-use alpha/beta access codes (table public.beta_invite_codes,
 * migration db/neon/20261017_beta_single_use_codes.sql).
 *
 * - Codes carry 160 random bits: EDU-XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
 *   (32 symbols from a 32-symbol alphabet; 256 % 32 === 0, so no modulo bias).
 * - Only the SHA-256 digest of the normalized code is stored. With 160 random bits a
 *   digest cannot be reversed or brute-forced, so no extra secret is required.
 * - Redemption is ONE conditional UPDATE: the row is claimed only if it is unredeemed
 *   and unrevoked, so two simultaneous redeemers cannot both win. UNIQUE(redeemed_by)
 *   stops one account from consuming two codes. The 30-day clock (720 hours) starts at
 *   redemption, using a single statement_timestamp() for both timestamps.
 * - The account id always comes from the server-verified session, never from request JSON.
 */
export const BETA_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const BETA_CODE_GROUPS = 4;
export const BETA_CODE_GROUP_LENGTH = 8;
export const BETA_CODE_SYMBOLS = BETA_CODE_GROUPS * BETA_CODE_GROUP_LENGTH;
export const BETA_CODE_PREFIX = "EDU";
export const BETA_DURATION_HOURS = 720; // exactly 30 days (owner decision 2026-10-20)
export const BETA_MAX_BATCH = 50;

/** Minimal shape of the Neon tagged-template client (also satisfied by test fakes). */
export type SqlClient = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Record<string, unknown>[]>;

const format = (symbols: string) =>
  `${BETA_CODE_PREFIX}-${Array.from({ length: BETA_CODE_GROUPS }, (_, i) => symbols.slice(i * BETA_CODE_GROUP_LENGTH, (i + 1) * BETA_CODE_GROUP_LENGTH)).join("-")}`;

export function generateBetaCode(random: (size: number) => Uint8Array = (size) => randomBytes(size)): string {
  const bytes = random(BETA_CODE_SYMBOLS);
  return format(Array.from(bytes, (value) => BETA_CODE_ALPHABET[value % BETA_CODE_ALPHABET.length]).join(""));
}

/** Accepts case, spaces and dashes; the "EDU" prefix is optional. Anything else is invalid. */
export function normalizeBetaCode(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 200) return null;
  const cleaned = input.toUpperCase().replace(/[\s_-]/g, "");
  const body = cleaned.length === BETA_CODE_PREFIX.length + BETA_CODE_SYMBOLS && cleaned.startsWith(BETA_CODE_PREFIX)
    ? cleaned.slice(BETA_CODE_PREFIX.length)
    : cleaned;
  if (body.length !== BETA_CODE_SYMBOLS) return null;
  for (const char of body) if (!BETA_CODE_ALPHABET.includes(char)) return null;
  return format(body);
}

export function hashBetaCode(normalizedCode: string): string {
  return createHash("sha256").update(normalizedCode).digest("hex");
}

export function issueBetaCodeBatch(count: number, random?: (size: number) => Uint8Array): { code: string; codeHash: string }[] {
  if (!Number.isInteger(count) || count < 1 || count > BETA_MAX_BATCH) throw new Error(`count must be an integer from 1 to ${BETA_MAX_BATCH}.`);
  const seen = new Set<string>();
  const out: { code: string; codeHash: string }[] = [];
  while (out.length < count) {
    const code = generateBetaCode(random);
    const codeHash = hashBetaCode(code);
    if (seen.has(codeHash)) continue;
    seen.add(codeHash);
    out.push({ code, codeHash });
  }
  return out;
}

const toIso = (value: unknown): string | null => (value == null ? null : new Date(value as string).toISOString());

/** Persist hashes only. Throws unless every hash was stored (single statement: all or nothing). */
export async function storeBetaCodeHashes(sql: SqlClient, hashes: string[]): Promise<number[]> {
  const rows = await sql`
    insert into beta_invite_codes (code_hash)
    select unnest(${hashes}::text[])
    returning id
  `;
  if (rows.length !== hashes.length) throw new Error(`Only ${rows.length} of ${hashes.length} beta codes were persisted.`);
  return rows.map((row) => Number(row.id));
}

export type RedeemResult =
  | { outcome: "redeemed"; codeId: number; redeemedAt: string; expiresAt: string }
  | { outcome: "invalid" }
  | { outcome: "account_already_redeemed" };

function isRedeemedByUniqueViolation(error: unknown): boolean {
  const e = error as { code?: string; constraint?: string; message?: string } | null;
  return Boolean(e && e.code === "23505" && /redeemed_by/.test(`${e.constraint ?? ""} ${e.message ?? ""}`));
}

export async function redeemBetaCode(sql: SqlClient, codeHash: string, verifiedUserId: string): Promise<RedeemResult> {
  if (!verifiedUserId) throw new Error("redeemBetaCode requires a server-verified account id.");
  try {
    const rows = await sql`
      update beta_invite_codes
      set redeemed_by = ${verifiedUserId},
          redeemed_at = statement_timestamp(),
          expires_at = statement_timestamp() + interval '720 hours'
      where code_hash = ${codeHash}
        and redeemed_at is null
        and revoked_at is null
      returning id, redeemed_at, expires_at
    `;
    const row = rows[0];
    if (!row) return { outcome: "invalid" };
    return { outcome: "redeemed", codeId: Number(row.id), redeemedAt: toIso(row.redeemed_at)!, expiresAt: toIso(row.expires_at)! };
  } catch (error) {
    if (isRedeemedByUniqueViolation(error)) return { outcome: "account_already_redeemed" };
    throw error;
  }
}

export interface NeonBetaGrant {
  codeId: number;
  redeemedAt: string;
  expiresAt: string;
  revokedAt: string | null;
  /** Evaluated with the database clock, so expiry is enforced server-side. */
  active: boolean;
}

export async function getNeonBetaGrant(sql: SqlClient, verifiedUserId: string): Promise<NeonBetaGrant | null> {
  const rows = await sql`
    select id, redeemed_at, expires_at, revoked_at,
           (revoked_at is null and expires_at > statement_timestamp()) as active
    from beta_invite_codes
    where redeemed_by = ${verifiedUserId}
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    codeId: Number(row.id),
    redeemedAt: toIso(row.redeemed_at)!,
    expiresAt: toIso(row.expires_at)!,
    revokedAt: toIso(row.revoked_at),
    active: row.active === true,
  };
}

export async function getBetaCodeSummary(sql: SqlClient) {
  const rows = await sql`
    select
      count(*)::int as total,
      count(*) filter (where redeemed_at is null and revoked_at is null)::int as available,
      count(*) filter (where redeemed_at is not null and revoked_at is null and expires_at > statement_timestamp())::int as active,
      count(*) filter (where redeemed_at is not null and revoked_at is null and expires_at <= statement_timestamp())::int as expired,
      count(*) filter (where revoked_at is not null)::int as revoked
    from beta_invite_codes
  `;
  const r = rows[0] ?? {};
  return { total: Number(r.total ?? 0), available: Number(r.available ?? 0), active: Number(r.active ?? 0), expired: Number(r.expired ?? 0), revoked: Number(r.revoked ?? 0) };
}

export async function listBetaCodes(sql: SqlClient) {
  const rows = await sql`
    select id, issued_at, redeemed_at, expires_at, revoked_at, (redeemed_by is not null) as redeemed
    from beta_invite_codes
    order by id desc
    limit 200
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    issuedAt: toIso(row.issued_at),
    redeemedAt: toIso(row.redeemed_at),
    expiresAt: toIso(row.expires_at),
    revokedAt: toIso(row.revoked_at),
    redeemed: row.redeemed === true,
  }));
}

export async function revokeBetaCode(sql: SqlClient, codeId: number): Promise<boolean> {
  const rows = await sql`
    update beta_invite_codes set revoked_at = statement_timestamp()
    where id = ${codeId} and revoked_at is null
    returning id
  `;
  return rows.length === 1;
}

/** Owner-authorized extension of a redeemed, unrevoked grant. */
export async function extendBetaCode(sql: SqlClient, codeId: number, days: number): Promise<string | null> {
  if (!Number.isInteger(days) || days < 1 || days > 180) throw new Error("days must be an integer from 1 to 180.");
  const rows = await sql`
    update beta_invite_codes
    set expires_at = greatest(expires_at, statement_timestamp()) + make_interval(days => ${days}::int)
    where id = ${codeId} and redeemed_at is not null and revoked_at is null
    returning expires_at
  `;
  return rows[0] ? toIso(rows[0].expires_at) : null;
}

export const BETA_REDEEM_GENERIC_ERROR =
  "That access code could not be redeemed. Check the code and try again, or contact support@edunancial.com.";
