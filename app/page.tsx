// app/page.tsx
import { headers } from "next/headers";
import { CONTENT_REGISTRY } from "@/lib/content-registry";
import { resolveRegion } from "@/lib/region-resolver";

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

      <hr style={{ margin: "3rem 0" }} />

      <section>
        <h3>Coming Soon</h3>
        <ul>
          <li>EduVesting™</li>
          <li>EduMath™</li>
          <li>Level-Based Financial Literacy Tracks</li>
        </ul>
      </section>
    </main>
  );
}
