import { resolveContent } from "@/lib/content-resolver";

export default function Home({
  searchParams,
}: {
  searchParams?: { region?: string };
}) {
  const content = resolveContent(searchParams?.region);

  return (
    <main style={{ padding: "3rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{content.headline}</h1>
      <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
        {content.subheadline}
      </p>

      <ul style={{ marginTop: "2rem" }}>
        {content.pillars.map((pillar: string) => (
          <li key={pillar} style={{ marginBottom: "0.5rem" }}>
            {pillar}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "2.5rem" }}>
        <button style={{ marginRight: "1rem" }}>
          {content.ctaPrimary}
        </button>
        <button>{content.ctaSecondary}</button>
      </div>
    </main>
  );
}
