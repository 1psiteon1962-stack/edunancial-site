import { redirect } from "next/navigation";
import { DEFAULT_REGION } from "@/lib/diagnostic/constants";

export default function DiagnosticRootPage() {
  redirect(`/${DEFAULT_REGION}/diagnostic`);
}
