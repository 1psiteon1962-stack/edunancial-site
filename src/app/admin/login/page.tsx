import { redirect } from "next/navigation";

import LoginForm from "@/components/admin-content/LoginForm";
import { getAdminSession } from "@/lib/admin-content/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/content");

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
      <h1 className="mx-auto max-w-md text-center text-4xl font-black">Admin Login</h1>
      <LoginForm />
    </main>
  );
}
