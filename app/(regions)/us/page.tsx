import Link from "next/link";
import { US_LEVELS } from "../../../data/us/levels";

export default function USHomePage() {
  return (
    <main>
      <h1 style={{ fontSize: 34, marginBottom: 6 }}>United States</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        Structured founder development from Level 1 through Level 5 — built for brand-new founders and
        scalable to capital-ready operators.
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
        {US_LEVELS.map((lvl) => (
          <div key={lvl.code} style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{lvl.title}</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>{lvl.tagline}</div>
            <div style={{ marginTop: 10 }}>
              <Link
                href={`/us/${lvl.code.toLowerCase().replace("l", "level-")}`}
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #111",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Open {lvl.code}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href="/us/apps"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Go to Apps
        </a>
        <a
          href="/us/pay"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Go to Pay
        </a>
      </div>
    </main>
  );
}
