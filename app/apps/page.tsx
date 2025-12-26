import MembershipGate from "@/app/components/MembershipGate";

export const dynamic = "error";

export default function Page() {
  return (
    <main style={{ padding: "2rem", maxWidth: 980, margin: "auto" }}>
      <h1>Apps</h1>
      <p>
        Tools are organized as apps. Some are free. Some unlock by membership level.
      </p>

      <ul>
        <li>
          <a href="/our-story">Our Story</a>
        </li>
        <li>
          <a href="/metrics">Metrics (local)</a>
        </li>
        <li>
          <a href="/membership">Membership (local switch)</a>
        </li>
        <li>
          <a href="/africa/en">Africa page</a>
        </li>
        <li>
          <a href="/latam/es">LATAM page (default ES)</a> / <a href="/latam/en">EN</a>
        </li>
      </ul>

      <hr style={{ margin: "1.5rem 0" }} />

      <h2>Gated tools</h2>

      <MembershipGate required="Foundation">
        <section style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: 10 }}>
          <h3>Founder Console (placeholder)</h3>
          <p>This is where we’ll put per-continent conclusions and upsell logic next.</p>
          <p>(Unlocked at Foundation+)</p>
        </section>
      </MembershipGate>
    </main>
  );
}
