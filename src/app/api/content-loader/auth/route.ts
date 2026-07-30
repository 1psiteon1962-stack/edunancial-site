const error =
  "The temporary content-loader publish path has been retired. Use /admin/content/upload and the admin batch publish flow instead.";

export async function GET() {
  return Response.json({ authenticated: false, error }, { status: 410 });
}

export async function POST() {
  return Response.json({ error }, { status: 410 });
}

export async function DELETE() {
  return Response.json({ error }, { status: 410 });
}
