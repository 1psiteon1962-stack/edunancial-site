import { getAdminSession } from "@/lib/admin-content/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session || session.role !== "owner") {
    return Response.json({ authenticated: false }, { status: 401 });
  }
  return Response.json({
    authenticated: true,
    email: session.email,
    role: session.role,
    csrfToken: session.csrfToken,
    expiresAt: session.expiresAt,
  });
}
