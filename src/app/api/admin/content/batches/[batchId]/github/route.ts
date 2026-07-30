export async function POST() {
  return Response.json(
    {
      error:
        "Direct GitHub PR creation has been retired. Use /api/admin/content/batches/[batchId]/publish for the only supported production publish path.",
    },
    { status: 410 },
  );
}
