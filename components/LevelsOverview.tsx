import { EDUNANCIAL_LEVELS } from "@/lib/levels";

export default function LevelsOverview() {
  return (
    <section style={{ marginTop: "3rem" }}>
      <h2>Edunancial Levels Framework</h2>
      <p>
        Financial literacy is structured by readiness, responsibility,
        and long-term capital discipline.
      </p>

      <ul style={{ marginTop: "1.5rem" }}>
        {EDUNANCIAL_LEVELS.map((lvl) => (
          <li key={lvl.level} style={{ marginBottom: "1rem" }}>
            <strong>
              Level {lvl.level}: {lvl.title}
            </strong>
            <br />
            Audience: {lvl.audience}
            <br />
            Access: {lvl.access}
            <br />
            Monetization: {lvl.monetization}
          </li>
        ))}
      </ul>
    </section>
  );
}
