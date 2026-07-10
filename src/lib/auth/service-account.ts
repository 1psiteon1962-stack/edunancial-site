/**
 * Service account support.
 * Service accounts are machine-identities (CI/CD pipelines, microservices, etc.)
 * that authenticate with a long-lived signed service token or API key.
 */

import { createServiceToken } from "./jwt";
import { createApiKey } from "./api-key";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceAccount {
  id: string;
  name: string;
  description: string;
  scopes: string[];
  createdAt: string;
  disabled?: boolean;
}

// ─── In-memory registry (replace with database in production) ─────────────────

const serviceAccounts = new Map<string, ServiceAccount>();

// ─── API ──────────────────────────────────────────────────────────────────────

export function registerServiceAccount(account: ServiceAccount): void {
  serviceAccounts.set(account.id, account);
}

export function getServiceAccount(id: string): ServiceAccount | undefined {
  return serviceAccounts.get(id);
}

export function listServiceAccounts(): ServiceAccount[] {
  return [...serviceAccounts.values()];
}

export function disableServiceAccount(id: string): boolean {
  const acct = serviceAccounts.get(id);
  if (!acct) return false;
  serviceAccounts.set(id, { ...acct, disabled: true });
  return true;
}

/**
 * Issue a short-lived JWT for a service account.
 */
export async function issueServiceJwt(serviceId: string): Promise<string> {
  const acct = serviceAccounts.get(serviceId);
  if (!acct || acct.disabled) {
    throw new Error(`Service account '${serviceId}' not found or disabled`);
  }
  return createServiceToken(serviceId, acct.scopes);
}

/**
 * Create an API key scoped to a service account.
 * Returns raw key (shown once).
 */
export async function issueServiceApiKey(
  serviceId: string
): Promise<{ rawKey: string; keyId: string }> {
  const acct = serviceAccounts.get(serviceId);
  if (!acct || acct.disabled) {
    throw new Error(`Service account '${serviceId}' not found or disabled`);
  }
  const { rawKey, record } = await createApiKey(serviceId, acct.scopes, "live");
  return { rawKey, keyId: record.id };
}
