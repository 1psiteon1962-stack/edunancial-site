import { US_LEVELS } from "../../../../data/us/levels";
import AccessGate from "../components/AccessGate";

export default function USLevel3Page() {
  const lvl = US_LEVELS.find((x) => x.code === "L3");
  if (!lvl) return null;

  return (
    <main>
      <h1 style={{ fontSize: 30, marginBottom: 6 }}>{lvl.title}</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>{lvl.tagline}</p>

      <AccessGate required="pro">
        <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 14, marginTop: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Outcomes</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {lvl.outcomes.map((o) => (
              <li key={o} style={{ marginBottom: 6 }}>{o}</li>
            ))}
          </ul>
        </div>

        <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 14, marginTop: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Modules</div>
          {lvl.modules.map((m) => (
            <div key={m.title} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800 }}>{m.title}</div>
              <ul style={{ margin: "6px 0 0 0", paddingLeft: 18 }}>
                {m.bullets.map((b) => (
                  <li key={b} style={{ marginBottom: 6 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AccessGate>

      <div style={{ marginTop: 16 }}>
        <a
          href={lvl.nextPath.href}
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #111",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          {lvl.nextPath.label}
        </a>
      </div>
    </main>
  );
}
