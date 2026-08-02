/**
 * Server-side user role management store.
 *
 * Persists a JSON file at `.admin-data/users.json`. Each record maps a user's
 * email address to an admin-assigned role and optional metadata.
 *
 * This store is separate from the client-side localStorage member auth;
 * it is the authoritative server-side source for role assignments.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { AdminRole } from "@/lib/admin-content/types";

export interface AdminManagedUser {
  id: string;
  email: string;
  role: AdminRole;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const DATA_DIR = join(process.cwd(), ".admin-data");
const USERS_FILE = join(DATA_DIR, "users.json");

async function ensureDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readUsers(): Promise<AdminManagedUser[]> {
  await ensureDir();
  try {
    const raw = await readFile(USERS_FILE, "utf8");
    return JSON.parse(raw) as AdminManagedUser[];
  } catch {
    return [];
  }
}

async function writeUsers(users: AdminManagedUser[]): Promise<void> {
  await ensureDir();
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function generateId(): string {
  return `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function listAdminUsers(): Promise<AdminManagedUser[]> {
  return readUsers();
}

export async function getAdminUser(id: string): Promise<AdminManagedUser | null> {
  const users = await readUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function getAdminUserByEmail(email: string): Promise<AdminManagedUser | null> {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export async function createAdminUser(
  data: Omit<AdminManagedUser, "id" | "createdAt" | "updatedAt">,
): Promise<AdminManagedUser> {
  const users = await readUsers();
  const normalized = data.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalized);
  if (existing) {
    throw new Error(`A user record for ${normalized} already exists.`);
  }

  const now = new Date().toISOString();
  const newUser: AdminManagedUser = {
    id: generateId(),
    email: normalized,
    role: data.role,
    notes: data.notes ?? "",
    createdAt: now,
    updatedAt: now,
    createdBy: data.createdBy,
  };

  await writeUsers([...users, newUser]);
  return newUser;
}

export async function updateAdminUser(
  id: string,
  patch: Partial<Pick<AdminManagedUser, "role" | "notes">>,
): Promise<AdminManagedUser | null> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return null;

  const updated: AdminManagedUser = {
    ...users[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  users[idx] = updated;
  await writeUsers(users);
  return updated;
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  const users = await readUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;
  await writeUsers(filtered);
  return true;
}
