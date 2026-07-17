import { requireAdminPageSession } from "@/lib/admin-content/auth";
import MediaLibraryClient from "@/components/admin-content/MediaLibraryClient";

export const metadata = { title: "Media Library | Edunancial Admin" };

export default async function AdminMediaPage() {
  await requireAdminPageSession();
  return <MediaLibraryClient />;
}
