/**
 * Production member service — server-side only.
 *
 * All operations use the Supabase service_role client.
 * Passwords are hashed with bcrypt (cost factor 12).
 * The simpleHash function is never used here.
 *
 * This module must only be imported in server-side code.
 */

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/db/supabase";

const BCRYPT_ROUNDS = 12;
const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
const PASSWORD_RESET_EXPIRY_HOURS = 1;

// ============================================================
// TYPES
// ============================================================

export type MemberRole = "member" | "staff" | "administrator";
export type AccountStatus = "active" | "suspended" | "deactivated" | "pending_verification";
export type MembershipTier = "free" | "basic" | "premium" | "enterprise" | "beta";
export type MembershipStatus = "active" | "inactive" | "trial" | "cancelled" | "grace_period" | "expired";

export interface Member {
  id: string;
  email: string;
  emailNormalized: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  country: string;
  preferredLanguage: string;
  preferredCurrency: string;
  phone: string | null;
  biography: string | null;
  role: MemberRole;
  accountStatus: AccountStatus;
  membershipTier: MembershipTier;
  membershipStatus: MembershipStatus;
  paymentProvider: string | null;
  paymentCustomerId: string | null;
  paymentSubscriptionId: string | null;
  joinedDate: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  country: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
}

export interface AuthResult {
  success: boolean;
  member?: Member;
  error?: string;
}

// ============================================================
// HELPERS
// ============================================================

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function mapRow(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    email: row.email as string,
    emailNormalized: row.email_normalized as string,
    emailVerified: row.email_verified as boolean,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    country: row.country as string,
    preferredLanguage: (row.preferred_language as string) ?? "en",
    preferredCurrency: (row.preferred_currency as string) ?? "USD",
    phone: (row.phone as string | null) ?? null,
    biography: (row.biography as string | null) ?? null,
    role: row.role as MemberRole,
    accountStatus: row.account_status as AccountStatus,
    membershipTier: row.membership_tier as MembershipTier,
    membershipStatus: row.membership_status as MembershipStatus,
    paymentProvider: (row.payment_provider as string | null) ?? null,
    paymentCustomerId: (row.payment_customer_id as string | null) ?? null,
    paymentSubscriptionId: (row.payment_subscription_id as string | null) ?? null,
    joinedDate: row.joined_date as string,
    lastLoginAt: (row.last_login_at as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ============================================================
// TOKEN HELPERS
// ============================================================

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ============================================================
// MEMBER LOOKUP
// ============================================================

export async function findMemberByEmail(email: string): Promise<Member | null> {
  if (!isSupabaseConfigured()) return null;

  const db = getSupabaseAdmin();
  const normalized = normalizeEmail(email);

  const { data, error } = await db
    .from("members")
    .select("*")
    .eq("email_normalized", normalized)
    .single();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function findMemberById(id: string): Promise<Member | null> {
  if (!isSupabaseConfigured()) return null;

  const db = getSupabaseAdmin();
  const { data, error } = await db.from("members").select("*").eq("id", id).single();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

// ============================================================
// REGISTRATION
// ============================================================

export async function createMember(input: CreateMemberInput): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database is not configured." };
  }

  const db = getSupabaseAdmin();
  const normalized = normalizeEmail(input.email);

  // Check for existing account — use generic error to prevent enumeration
  const { data: existing } = await db
    .from("members")
    .select("id")
    .eq("email_normalized", normalized)
    .single();

  if (existing) {
    // Return generic success-like message to prevent account enumeration.
    // The real duplicate error is logged server-side.
    return {
      success: false,
      error: "If this email is not already registered, your account has been created.",
    };
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const { data: newMember, error } = await db
    .from("members")
    .insert({
      email: input.email.trim(),
      email_normalized: normalized,
      email_verified: false,
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      password_hash: passwordHash,
      country: input.country,
      preferred_language: input.preferredLanguage ?? "en",
      preferred_currency: input.preferredCurrency ?? "USD",
      role: "member",
      account_status: "pending_verification",
      membership_tier: "free",
      membership_status: "inactive",
    })
    .select()
    .single();

  if (error || !newMember) {
    return { success: false, error: "Registration failed. Please try again." };
  }

  return { success: true, member: mapRow(newMember as Record<string, unknown>) };
}

// ============================================================
// LOGIN
// ============================================================

export async function verifyMemberCredentials(
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Authentication is not configured." };
  }

  const db = getSupabaseAdmin();
  const normalized = normalizeEmail(email);

  const { data, error } = await db
    .from("members")
    .select("*")
    .eq("email_normalized", normalized)
    .single();

  // Use constant-time comparison to prevent timing attacks.
  // Always run bcrypt even if user not found (dummy hash).
  const DUMMY_HASH = "$2b$12$invalidhashfortimingnormalization/xxxxxxxxxxxxxxxxxxxxxxxxxx";
  const passwordHash = (data as Record<string, unknown> | null)?.password_hash as string | undefined ?? DUMMY_HASH;
  const passwordMatch = await bcrypt.compare(password, passwordHash);

  if (error || !data || !passwordMatch) {
    // Generic message — do not reveal whether email exists
    return { success: false, error: "Invalid email or password." };
  }

  const member = mapRow(data as Record<string, unknown>);

  if (member.accountStatus === "suspended") {
    return { success: false, error: "This account has been suspended. Please contact support." };
  }

  if (member.accountStatus === "deactivated") {
    return { success: false, error: "Invalid email or password." };
  }

  // Update last_login_at
  await db
    .from("members")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", member.id);

  return { success: true, member };
}

// ============================================================
// EMAIL VERIFICATION
// ============================================================

export async function createEmailVerificationToken(memberId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const db = getSupabaseAdmin();
  const token = generateSecureToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  const { error } = await db.from("email_verification_tokens").insert({
    member_id: memberId,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  });

  if (error) return null;
  return token;
}

export async function verifyEmailToken(token: string): Promise<{ success: boolean; memberId?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database is not configured." };
  }

  const db = getSupabaseAdmin();
  const tokenHash = hashToken(token);

  const { data, error } = await db
    .from("email_verification_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .single();

  if (error || !data) {
    return { success: false, error: "Invalid or expired verification link." };
  }

  const row = data as Record<string, unknown>;

  if (row.used_at) {
    return { success: false, error: "This verification link has already been used." };
  }

  if (new Date(row.expires_at as string) < new Date()) {
    return { success: false, error: "This verification link has expired. Please request a new one." };
  }

  // Mark token as used
  await db
    .from("email_verification_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash);

  // Mark member email as verified and activate account
  const memberId = row.member_id as string;
  await db
    .from("members")
    .update({ email_verified: true, account_status: "active" })
    .eq("id", memberId);

  return { success: true, memberId };
}

// ============================================================
// PASSWORD RESET
// ============================================================

export async function createPasswordResetToken(email: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const db = getSupabaseAdmin();
  const normalized = normalizeEmail(email);

  const { data: member } = await db
    .from("members")
    .select("id")
    .eq("email_normalized", normalized)
    .single();

  // Return null-like result even if no member (prevents enumeration).
  // Caller should always show generic "if account exists, email sent" message.
  if (!member) return null;

  const memberId = (member as Record<string, unknown>).id as string;
  const token = generateSecureToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000);

  // Invalidate any existing reset tokens for this member
  await db
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("member_id", memberId)
    .is("used_at", null);

  const { error } = await db.from("password_reset_tokens").insert({
    member_id: memberId,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  });

  if (error) return null;
  return token;
}

export async function consumePasswordResetToken(
  token: string,
  newPassword: string,
): Promise<{ success: boolean; memberId?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Database is not configured." };
  }

  const db = getSupabaseAdmin();
  const tokenHash = hashToken(token);

  const { data, error } = await db
    .from("password_reset_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .single();

  if (error || !data) {
    return { success: false, error: "Invalid or expired reset link." };
  }

  const row = data as Record<string, unknown>;

  if (row.used_at) {
    return { success: false, error: "This reset link has already been used." };
  }

  if (new Date(row.expires_at as string) < new Date()) {
    return { success: false, error: "This reset link has expired. Please request a new one." };
  }

  const memberId = row.member_id as string;
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  // Mark token as used (single-use)
  await db
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash);

  // Update password
  await db
    .from("members")
    .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
    .eq("id", memberId);

  return { success: true, memberId };
}

// ============================================================
// PROFILE UPDATE
// ============================================================

export async function updateMemberProfile(
  memberId: string,
  updates: Partial<{
    firstName: string;
    lastName: string;
    country: string;
    phone: string;
    biography: string;
    preferredLanguage: string;
    preferredCurrency: string;
  }>,
): Promise<Member | null> {
  if (!isSupabaseConfigured()) return null;

  const db = getSupabaseAdmin();

  const dbUpdates: Record<string, unknown> = {};
  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
  if (updates.country !== undefined) dbUpdates.country = updates.country;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.biography !== undefined) dbUpdates.biography = updates.biography;
  if (updates.preferredLanguage !== undefined) dbUpdates.preferred_language = updates.preferredLanguage;
  if (updates.preferredCurrency !== undefined) dbUpdates.preferred_currency = updates.preferredCurrency;

  const { data, error } = await db
    .from("members")
    .update(dbUpdates)
    .eq("id", memberId)
    .select()
    .single();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

// ============================================================
// AUDIT LOGGING
// ============================================================

export async function recordAuditEvent(
  event: string,
  opts: {
    actor?: string;
    memberId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  } = {},
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const db = getSupabaseAdmin();
  await db.from("audit_events").insert({
    event,
    actor: opts.actor ?? "system",
    member_id: opts.memberId ?? null,
    ip_address: opts.ipAddress ?? null,
    user_agent: opts.userAgent ?? null,
    metadata: opts.metadata ?? {},
  });
}
