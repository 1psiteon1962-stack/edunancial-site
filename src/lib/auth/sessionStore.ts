const revokedSessionIds = new Map<string, number>();

export function revokeSession(sessionId: string, expiresAt: number): void {
  revokedSessionIds.set(sessionId, expiresAt);
}

export function isSessionRevoked(sessionId: string): boolean {
  const now = Math.floor(Date.now() / 1000);

  for (const [id, exp] of revokedSessionIds.entries()) {
    if (exp <= now) {
      revokedSessionIds.delete(id);
      continue;
    }

    if (id === sessionId) {
      return true;
    }
  }

  return false;
}
