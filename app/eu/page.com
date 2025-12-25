import { redirect } from "next/navigation";

export default function Page() {
  redirect("/eu/en");
}
