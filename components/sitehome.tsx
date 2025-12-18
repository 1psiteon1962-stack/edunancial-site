import Link from "next/link";
import siteConfig from "../data/site-config";
import { getContent } from "../data/content";

type Props = {
  locale?: "en" | "es";
};

export default function SiteHome({ locale }: Props) {
  const content = getContent(locale ?? siteConfig.defaultLocale);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
      <header style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, opacity: 0.75 }}>{siteConfig.siteName}</div>
        <h1 style={{ fontSize: 34, margin: "10px 0 0" }}>{content.heroTitle}</h1>
      </header>

      <section style={{ marginTop: 24, padding: 16, border: "1px solid #e5e5e5", borderRadius: 12 }}>
        <h2 style={{ margin: "0 0 10px" }}>{content.storyTitle}</h2>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Edunancial is built to help beginners and growing entrepreneurs build wealth with clarity, structure,
          and discipline—step by step.
        </p>
      </section>

      <section style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <Link
          href="/courses"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e5e5e5",
            textDecoration: "none",
          }}
        >
          {content.coursesTitle}
        </Link>

        <Link
          href="/apps"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e5e5e5",
            textDecoration: "none",
          }}
        >
          {content.appsTitle}
        </Link>

        <Link
          href="/en"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e5e5e5",
            textDecoration: "none",
          }}
        >
          English
        </Link>

        <Link
          href="/es"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #e5e5e5",
            textDecoration: "none",
          }}
        >
          Español
        </Link>
      </section>

      <footer style={{ marginTop: 30, fontSize: 12, opacity: 0.75 }}>
        {content.footerNote}
      </footer>
    </main>
  );
}
