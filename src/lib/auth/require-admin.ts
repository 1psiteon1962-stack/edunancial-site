export const ADMIN_ACCESS_COOKIE = "edunancial_admin_access";

function getAdminToken(): string | null {
  const token = process.env.ADMIN_METRICS_TOKEN?.trim();
  return token ? token : null;
}

export function isAdminProtectionEnabled(): boolean {
  return Boolean(getAdminToken());
}

export function hasValidAdminAccessToken(
  candidateToken: string | null | undefined
): boolean {
  const adminToken = getAdminToken();

  if (!adminToken || !candidateToken) {
    return false;
  }

  return candidateToken.trim() === adminToken;
}

export async function requireAdmin(candidateToken?: string | null) {
  if (!isAdminProtectionEnabled()) {
    return true;
  }

  return hasValidAdminAccessToken(candidateToken);
}
