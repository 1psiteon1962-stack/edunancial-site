import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const PIN_HASH_PREFIX = "scrypt";
const MAX_PIN_FAILURES = 5;
const PIN_LOCKOUT_MINUTES = 15;

export interface UserSecuritySettingsRow {
  user_id: string;
  pin_hash: string | null;
  pin_failed_attempts: number;
  pin_locked_until: string | null;
  pin_changed_at: string | null;
  require_pin_for_sensitive_actions: boolean;
  created_at: string;
  updated_at: string;
}

export interface SecurityEventRow {
  id: string;
  user_id: string | null;
  event_type: string;
  outcome: "success" | "failure" | "blocked";
  request_id: string | null;
  ip_fingerprint: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function getPinPepper(): string {
  const pepper = (process.env.EDUNANCIAL_MEMBER_PIN_PEPPER ?? "").trim();
  if (pepper.length < 32) {
    throw new Error("EDUNANCIAL_MEMBER_PIN_PEPPER with at least 32 characters is required.");
  }
  return pepper;
}

export function validateSecurityPin(pin: string): string | null {
  if (!/^\d{6}$/.test(pin)) {
    return "PIN must be exactly 6 numeric digits.";
  }
  if (/^(\d)\1{5}$/.test(pin)) {
    return "PIN is too weak. Choose a less predictable 6-digit PIN.";
  }
  if (pin === "123456" || pin === "654321" || pin === "012345" || pin === "987654") {
    return "PIN is too weak. Choose a less predictable 6-digit PIN.";
  }

  const ascending = "01234567890";
  const descending = "9876543210";
  if (ascending.includes(pin) || descending.includes(pin)) {
    return "PIN is too weak. Choose a less predictable 6-digit PIN.";
  }

  return null;
}

export function hashSecurityPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const peppered = `${pin}:${getPinPepper()}`;
  const digest = scryptSync(peppered, salt, 64).toString("hex");
  return `${PIN_HASH_PREFIX}$${salt}$${digest}`;
}

export function verifySecurityPinHash(pin: string, storedHash: string | null | undefined): boolean {
  if (!storedHash) {
    return false;
  }
  const [prefix, salt, digest] = storedHash.split("$");
  if (prefix !== PIN_HASH_PREFIX || !salt || !digest) {
    return false;
  }

  const calculated = scryptSync(`${pin}:${getPinPepper()}`, salt, 64).toString("hex");
  const left = Buffer.from(calculated, "hex");
  const right = Buffer.from(digest, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isPinLocked(settings: Pick<UserSecuritySettingsRow, "pin_locked_until">): boolean {
  return Boolean(settings.pin_locked_until && Date.parse(settings.pin_locked_until) > Date.now());
}

export function computePinFailureState(currentAttempts: number) {
  const nextAttempts = currentAttempts + 1;
  const lockedUntil = nextAttempts >= MAX_PIN_FAILURES
    ? new Date(Date.now() + PIN_LOCKOUT_MINUTES * 60_000).toISOString()
    : null;

  return {
    failedAttempts: nextAttempts,
    lockedUntil,
    locked: Boolean(lockedUntil),
  };
}

export function requireRecentAuthentication(lastSignInAt: string | null, maxAgeMinutes = 15): boolean {
  if (!lastSignInAt) {
    return false;
  }
  return Date.now() - Date.parse(lastSignInAt) <= maxAgeMinutes * 60_000;
}

export async function getUserSecuritySettings(userId: string): Promise<UserSecuritySettingsRow> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("user_security_settings")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: false })
    .select("user_id, pin_hash, pin_failed_attempts, pin_locked_until, pin_changed_at, require_pin_for_sensitive_actions, created_at, updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Unable to load user security settings: ${error?.message ?? "unknown error"}`);
  }

  return data as UserSecuritySettingsRow;
}

export async function recordSecurityEvent(input: {
  userId: string | null;
  eventType: string;
  outcome?: "success" | "failure" | "blocked";
  requestId?: string | null;
  ipFingerprint?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from("security_events").insert({
    user_id: input.userId,
    event_type: input.eventType,
    outcome: input.outcome ?? "success",
    request_id: input.requestId ?? null,
    ip_fingerprint: input.ipFingerprint ?? null,
    user_agent: input.userAgent ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    throw new Error(`Unable to record security event: ${error.message}`);
  }
}

export async function listRecentSecurityEvents(userId: string, limit = 10): Promise<SecurityEventRow[]> {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("security_events")
    .select("id, user_id, event_type, outcome, request_id, ip_fingerprint, user_agent, metadata, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Unable to load security events: ${error.message}`);
  }

  return (data ?? []) as SecurityEventRow[];
}
