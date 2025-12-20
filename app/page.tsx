import { headers } from "next/headers";
import { resolveRegion, REGION_META } from "@/lib/regions";
import { resolveContent } from "@/lib/content-resolver";

export default function HomePage() {
  const headerList = headers();
  const pathname = headerList.get("x-pathname") || "/";
  const region = resolveRegion(pathname);

  const meta = REGION_META[region];
  const content = resolveContent(region);

  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <small>{meta.label}</small>

      <h1>{content.heroTitle}</h1>
      <p>{content.heroBody}</p>

      <p>
        <strong>Focus:</strong> {content.literacyFocus}
      </p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button disabled>{content.ctaPrimary}</button>
        <button disabled>{content.ctaSecondary}</button>
      </div>

      <p style={{ marginTop: "3rem", fontSize: "0.85rem" }}>
        Payments disabled — financial literacy access only.
      </p>
    </main>
  );
}
