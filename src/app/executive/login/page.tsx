import { redirect } from "next/navigation";

import ExecutiveLoginForm from "@/components/executive/ExecutiveLoginForm";
import { getAdminSession } from "@/lib/admin-content/auth";

export const metadata = {
  title: "Executive Login | Edunancial",
};

export default async function ExecutiveLoginPage() {
  const session = await getAdminSession();
  if (session?.role === "owner") {
    redirect("/executive/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">Owner Access Only</p>
        <h1 className="mt-4 text-5xl font-black">Executive Dashboard</h1>
        <p className="mt-6 text-lg text-slate-300">
          Secure owner-level access. Server-side session authentication required.
        </p>
      </div>
      <ExecutiveLoginForm />
      <p className="mt-10 text-center text-xs text-slate-600">
        This area is restricted to authorized executive personnel. All access is logged.
      </p>
    </main>
  );
}
