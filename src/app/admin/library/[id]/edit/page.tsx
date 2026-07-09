import { notFound } from "next/navigation";
import Link from "next/link";
import { getLibraryItem } from "@/lib/library/libraryData";
import AdminLibraryForm from "@/components/library/AdminLibraryForm";
import type { LibraryItemFormData } from "@/lib/library/libraryTypes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = getLibraryItem(id);
  return { title: item ? `Edit: ${item.title} | Admin` : "Edit Item | Admin" };
}

export default async function AdminLibraryEditPage({ params }: PageProps) {
  const { id } = await params;
  const item = getLibraryItem(id);
  if (!item) notFound();

  const initialData: Partial<LibraryItemFormData> = {
    type: item.type,
    title: item.title,
    author: item.author,
    description: item.description,
    longDescription: item.longDescription ?? "",
    categories: item.categories,
    tags: item.tags.join(", "),
    coverImage: item.coverImage,
    status: item.status,
    accessLevel: item.accessLevel,
    price: item.price?.toString() ?? "",
    downloadable: item.downloadable,
    fileFormat: item.fileFormat ?? "",
    mediaUrl: item.mediaUrl ?? "",
    downloadUrl: item.downloadUrl ?? "",
    previewUrl: item.previewUrl ?? "",
    language: item.language,
    durationMinutes: item.durationMinutes?.toString() ?? "",
    pageCount: item.pageCount?.toString() ?? "",
    narrator: item.narrator ?? "",
  };

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8">
      <div className="mx-auto max-w-4xl">

        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-white">Admin</Link>
          <span className="mx-2">›</span>
          <Link href="/admin/library" className="hover:text-white">Library</Link>
          <span className="mx-2">›</span>
          <span>Edit</span>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">ADMIN</p>
        <h1 className="mt-4 text-4xl font-black mb-2">Edit Library Item</h1>
        <p className="text-slate-400 mb-10">{item.title}</p>

        <AdminLibraryForm initialData={initialData} itemId={id} />
      </div>
    </main>
  );
}
