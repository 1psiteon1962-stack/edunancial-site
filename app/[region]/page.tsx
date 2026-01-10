import { redirect } from "next/navigation";

export default function RegionPage({
  params
}: {
  params: { region: string };
}) {
  const region = params.region?.toLowerCase();

  if (region === "us") redirect("/us/home");
  if (region === "latam") redirect("/latam/home");
  if (region === "africa") redirect("/africa/home");
  if (region === "eu") redirect("/eu/home");

  redirect("/us");
}
