import Link from "next/link";
import AdminLibraryForm from "@/components/library/AdminLibraryForm";

export const metadata = {
  title: "Add Library Item | Admin",
};

export default function AdminLibraryNewPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-8">
      <div className="mx-auto max-w-4xl">

        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <Link href="/admin" className="hover:text-white">Admin</Link>
          <span className="mx-2">›</span>
          <Link href="/admin/library" className="hover:text-white">Library</Link>
          <span className="mx-2">›</span>
          <span>New Item</span>
        </nav>

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">ADMIN</p>
        <h1 className="mt-4 text-5xl font-black mb-10">Add Library Item</h1>

        <AdminLibraryForm />
      </div>
    </main>
  );
}
