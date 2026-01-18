import { redirect } from "next/navigation";

export function requireAdmin(isAdmin: boolean) {
  if (!isAdmin) {
    redirect("/");
  }
}
