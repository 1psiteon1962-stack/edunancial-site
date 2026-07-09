import type { Metadata } from "next";
import DevOpsDashboard from "@/components/DevOpsDashboard";

export const metadata: Metadata = {
  title: "DevOps Dashboard",
  description: "Deployment status, build history, and environment health monitoring.",
};

export default function DevOpsPage() {
  return <DevOpsDashboard />;
}
