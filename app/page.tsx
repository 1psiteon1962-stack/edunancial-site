// app/page.tsx
import { headers } from "next/headers";
import { CONTENT_REGISTRY } from "@/lib/content-registry";
import { resolveRegion } from "@/lib/region-resolver";
import PaymentSection from "@/components/PaymentSection";

export default function HomePage() {
  const headersList = headers();
  const host = headersList.get("host") || undefined;

  const region = resolveRegion(host);
  const content = CONTENT_REGISTRY[region];

  return (
    <main style={{ padding: "3rem", fontFamily: "system-ui, sans-serif" }}>
      <section>
        <h1>{content.hero.title}</h1>
        <p>{content.hero.body}</p>
      </section>

      <hr style={{ margin: "2rem 0" }} />

      <section>
        <h2>{content.mission.title}</h2>
        <p>{content.mission.body}</p>
      </section>

      <hr style={{ margin: "2rem 0" }} />

      <section>
        <h2>{content.focus.title}</h2>
        <p>{content.focus.body}</p>
      </section>

      <PaymentSection region={region} />

      <hr style={{ margin: "3rem 0" }} />

      <section>
        <h3>Platforms</h3>
        <ul>
          <li>EduVesting™ (Investment Literacy)</li>
          <li>EduMath™ (Financial Math)</li>
          <li>Level-Based Literacy Tracks</li>
        </ul>
      </section>
    </main>
  );
}
