import { redirect } from "next/navigation";

export default function RegionRouter({ params }: { params: { region: string } }) {
  if (params.region === "us") {
    redirect("/us");
  }

  return (
    <div style={{ padding: "3rem" }}>
      <h1>Edunancial</h1>
      <p>Region: {params.region.toUpperCase()}</p>
      <p>This region is initializing.</p>
    </div>
  );
}
