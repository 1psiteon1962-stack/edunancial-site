import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { PASSWORD_POLICY } from "@/lib/passwordPolicy";

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_POLICY.minimumLength) {
    return `Password must be at least ${PASSWORD_POLICY.minimumLength} characters.`;
  }

  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    return "Password must contain an uppercase letter.";
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    return "Password must contain a lowercase letter.";
  }

  if (PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password)) {
    return "Password must contain a number.";
  }

  if (PASSWORD_POLICY.requireSpecialCharacter && !/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain a special character.";
  }

  return null;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const [saltHex, derivedHex] = hash.split(":");

  if (!saltHex || !derivedHex) {
    return false;
  }

  const computed = scryptSync(password, Buffer.from(saltHex, "hex"), 64, {
    N: 16384,
    r: 8,
    p: 1,
  });

  const stored = Buffer.from(derivedHex, "hex");

  if (computed.length !== stored.length) {
    return false;
  }

  return timingSafeEqual(computed, stored);
}

export function hashOneTimeToken(token: string): string {
  return hashPassword(token);
}

export function verifyOneTimeToken(token: string, hash: string): boolean {
  return verifyPassword(token, hash);
}
