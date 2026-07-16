import { redirect } from "next/navigation";

import LoginForm from "@/components/admin-content/LoginForm";
import { getAdminSession } from "@/lib/admin-content/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/content");

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Owner-only workspace</p>
        <h1 className="mt-4 text-5xl font-black">Edunancial Admin Login</h1>
        <p className="mt-6 text-lg text-slate-300">This secure administrative workspace uses a server-issued session and is isolated from public-site prototype authentication.</p>
      </div>
      <LoginForm />
    </main>
  );
}
