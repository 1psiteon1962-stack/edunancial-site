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
      <h1 className="mx-auto max-w-md text-center text-4xl font-black">Executive Login</h1>
      <ExecutiveLoginForm />
    </main>
  );
}
