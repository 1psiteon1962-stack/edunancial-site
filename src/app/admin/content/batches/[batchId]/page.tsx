import BatchReviewClient from "@/components/admin-content/BatchReviewClient";
import { requireAdminPageSession } from "@/lib/admin-content/auth";

export const dynamic = "force-dynamic";

export default async function AdminContentBatchPage({ params }: { params: Promise<{ batchId: string }> }) {
  await requireAdminPageSession();
  const { batchId } = await params;
  return <BatchReviewClient batchId={batchId} />;
}
