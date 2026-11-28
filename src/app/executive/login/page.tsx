import { redirect } from "next/navigation";

import ExecutiveLoginForm from "@/components/executive/ExecutiveLoginForm";
import { getAdminSession } from "@/lib/admin-content/auth";
import { safeOwnerNext } from "@/lib/admin-content/owner-next";

export const metadata = {
  title: "Executive Login | Edunancial",
};

export default async function ExecutiveLoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const next = safeOwnerNext(Array.isArray(params.next) ? params.next[0] : params.next);
  const session = await getAdminSession();
  if (session?.role === "owner") {
    redirect(next ?? "/executive/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#08101f] px-6 py-16 text-white">
      <h1 className="mx-auto max-w-md text-center text-4xl font-black">Executive Login</h1>
      <ExecutiveLoginForm next={next} />
    </main>
  );
}
