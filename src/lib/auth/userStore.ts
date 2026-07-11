import type { AuthRole } from "./roles";
import { hashPassword } from "./password";

export type StoredUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AuthRole;
  passwordHash: string;
  emailVerified: boolean;
  verificationTokenHash: string | null;
  verificationTokenExpiresAt: number | null;
  resetTokenHash: string | null;
  resetTokenExpiresAt: number | null;
};

const usersByEmail = new Map<string, StoredUser>();

function randomUserId(): string {
  return crypto.randomUUID();
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function seedAdminUser(): void {
  const adminEmail = process.env.AUTH_ADMIN_EMAIL;
  const adminPassword = process.env.AUTH_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const normalized = normalizeEmail(adminEmail);

  if (usersByEmail.has(normalized)) {
    return;
  }

  usersByEmail.set(normalized, {
    id: randomUserId(),
    email: normalized,
    firstName: "Platform",
    lastName: "Administrator",
    role: "administrator",
    passwordHash: hashPassword(adminPassword),
    emailVerified: true,
    verificationTokenHash: null,
    verificationTokenExpiresAt: null,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  });
}

seedAdminUser();

export function getUserByEmail(email: string): StoredUser | null {
  return usersByEmail.get(normalizeEmail(email)) ?? null;
}

export function getUserById(id: string): StoredUser | null {
  for (const user of usersByEmail.values()) {
    if (user.id === id) {
      return user;
    }
  }

  return null;
}

export function createUser(input: {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role?: AuthRole;
}): StoredUser {
  const email = normalizeEmail(input.email);

  const user: StoredUser = {
    id: randomUserId(),
    email,
    firstName: input.firstName,
    lastName: input.lastName,
    role: input.role ?? "free-member",
    passwordHash: input.passwordHash,
    emailVerified: false,
    verificationTokenHash: null,
    verificationTokenExpiresAt: null,
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  };

  usersByEmail.set(email, user);
  return user;
}

export function updateUser(email: string, update: Partial<StoredUser>): StoredUser | null {
  const normalized = normalizeEmail(email);
  const existing = usersByEmail.get(normalized);

  if (!existing) {
    return null;
  }

  const next = {
    ...existing,
    ...update,
  };

  usersByEmail.set(normalized, next);
  return next;
}

export function findUserByVerificationToken(token: string): StoredUser | null {
  for (const user of usersByEmail.values()) {
    if (!user.verificationTokenHash || !user.verificationTokenExpiresAt) {
      continue;
    }

    if (user.verificationTokenExpiresAt <= Date.now()) {
      continue;
    }

    if (token === user.verificationTokenHash) {
      return user;
    }
  }

  return null;
}

export function findUserByResetToken(token: string): StoredUser | null {
  for (const user of usersByEmail.values()) {
    if (!user.resetTokenHash || !user.resetTokenExpiresAt) {
      continue;
    }

    if (user.resetTokenExpiresAt <= Date.now()) {
      continue;
    }

    if (token === user.resetTokenHash) {
      return user;
    }
  }

  return null;
}
