export async function POST() {
  return Response.json(
    {
      error:
        "The temporary content-loader publish path has been retired. Use /admin/content/upload and the admin batch publish flow instead.",
    },
    { status: 410 },
  );
}
