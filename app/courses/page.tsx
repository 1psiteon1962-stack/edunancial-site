import Link from "next/link";
import { getContent } from "../../data/content";

export default function CoursesPage() {
  const content = getContent("en");

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontSize: 30, margin: "0 0 12px" }}>{content.coursesTitle}</h1>
      <p style={{ lineHeight: 1.6, marginTop: 0 }}>
        This is the Courses page. Content is guaranteed at build time to prevent prerender crashes.
      </p>

      <ul style={{ lineHeight: 1.9 }}>
        <li>Beginner Foundations</li>
        <li>Business & Profit Systems</li>
        <li>Real Estate Basics</li>
        <li>Stocks & Options Intro</li>
      </ul>

      <p style={{ marginTop: 18 }}>
        <Link href="/" style={{ textDecoration: "none" }}>← Back</Link>
      </p>

      <footer style={{ marginTop: 30, fontSize: 12, opacity: 0.75 }}>{content.footerNote}</footer>
    </main>
  );
}
