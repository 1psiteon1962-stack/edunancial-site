export function requireAdmin(user: any) {
  if (!user || user.role !== "admin") {
    throw new Error("Admin access required");
  }
}
