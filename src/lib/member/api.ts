export function resolveProgressAccessScope(authenticatedUserId: string | null, requestedUserId?: string | null) {
  if (!authenticatedUserId) {
    return { ok: false as const, status: 401, error: "Authentication required." };
  }
  if (requestedUserId && requestedUserId !== authenticatedUserId) {
    return { ok: false as const, status: 403, error: "Forbidden." };
  }
  return { ok: true as const, userId: authenticatedUserId };
}

export function sanitizeMemberApiPayload<T extends Record<string, unknown>>(payload: T) {
  const clone = { ...payload };
  delete clone.password;
  delete clone.pin;
  delete clone.pin_hash;
  delete clone.access_token;
  delete clone.refresh_token;
  delete clone.token;
  return clone;
}
