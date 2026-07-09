import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#08101f]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
