import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";
import { revalidatePublishedCurriculumRoutes } from "@/lib/curriculum/revalidate";
import { reconcilePublishedTranslationsFromHistory } from "@/lib/curriculum/runtime-localization";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  try {
    const result = await reconcilePublishedTranslationsFromHistory();
    invalidateRegistryCache();
    await revalidatePublishedCurriculumRoutes();
    return Response.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Translation reconciliation failed.";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
