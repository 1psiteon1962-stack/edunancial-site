import {
  clearContentLoaderSession,
  getContentLoaderSession,
  validateContentLoaderPassword,
} from "@/lib/content-loader/auth";

export async function GET() {
  const session = await getContentLoaderSession();
  if (!session) {
    return Response.json({ authenticated: false }, { status: 401 });
  }
  return Response.json({
    authenticated: true,
    email: session.email,
    csrfToken: session.csrfToken,
    expiresAt: session.expiresAt,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { password?: string } | null;
  const password = body?.password?.toString() ?? "";
  if (!password) {
    return Response.json({ error: "Password is required." }, { status: 400 });
  }
  return validateContentLoaderPassword(password);
}

export async function DELETE() {
  await clearContentLoaderSession();
  return Response.json({ ok: true });
}
