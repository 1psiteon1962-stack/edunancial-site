import Link from "next/link";
import { getContent } from "../../data/content";

export default function AppsPage() {
  const content = getContent("en");

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontSize: 30, margin: "0 0 12px" }}>{content.appsTitle}</h1>
      <p style={{ lineHeight: 1.6, marginTop: 0 }}>
        This is the Apps page. It’s stable during build so Netlify can prerender without crashing.
      </p>

      <ul style={{ lineHeight: 1.9 }}>
        <li>EduVesting — investor readiness & screening tool</li>
        <li>EduMath — math learning line</li>
        <li>Levels 1–5 Literacy Assessment (coming)</li>
      </ul>

      <p style={{ marginTop: 18 }}>
        <Link href="/" style={{ textDecoration: "none" }}>← Back</Link>
      </p>

      <footer style={{ marginTop: 30, fontSize: 12, opacity: 0.75 }}>{content.footerNote}</footer>
    </main>
  );
}
