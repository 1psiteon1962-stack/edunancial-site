import { getActiveRegion } from "@/lib/region-resolver";
import { contentByRegion } from "@/data/content";

export default function HomePage() {
  const region = getActiveRegion();
  const content = contentByRegion[region];

  return (
    <main style={{ padding: "3rem", maxWidth: 960, margin: "0 auto" }}>
      <h1>{content.heroTitle}</h1>
      <p style={{ fontSize: "1.25rem", marginTop: "1rem" }}>
        {content.heroSubtitle}
      </p>

      <h2 style={{ marginTop: "2rem" }}>Core Focus</h2>
      <ul>
        {content.focus.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </main>
  );
}
