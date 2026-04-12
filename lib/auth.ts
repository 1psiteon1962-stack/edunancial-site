export function getUser() {
  return { id: "demo-user", role: "admin" };
}

export function requireAdmin() {
  return true;
}
