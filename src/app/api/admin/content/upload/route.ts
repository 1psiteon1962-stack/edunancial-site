export async function POST() {
  return Response.json(
    {
      error:
        "Legacy multipart uploads are retired. Use /api/admin/content/upload/presign, direct Supabase upload, and /api/admin/content/upload/finalize.",
    },
    { status: 410 },
  );
}
