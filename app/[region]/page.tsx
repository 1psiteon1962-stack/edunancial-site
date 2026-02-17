import { notFound } from "next/navigation";
import { getRegion } from "../lib/regions";

type PageProps = {
  params: {
    region: string;
  };
};

export default function RegionPage({ params }: PageProps) {
  const region = getRegion(params.region);

  if (!region) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{region.name}</h1>
      <p>Region code: {region.code}</p>
      <p>Default language: {region.defaultLanguage}</p>

      <h3>Languages</h3>
      <ul>
        {region.languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
    </main>
  );
}
