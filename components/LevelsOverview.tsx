// components/LevelsOverview.tsx

import { EDUNANCIAL_LEVELS } from "@/lib/levels"

export default function LevelsOverview() {
  return (
    <section style={{ marginTop: "3rem" }}>
      <h2>Edunancial Levels</h2>

      <ul style={{ marginTop: "1.5rem" }}>
        {EDUNANCIAL_LEVELS.map((lvl: any) => (
          <li
            key={lvl.level}
            style={{
              marginBottom: "1.5rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid #ddd"
            }}
          >
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
  )
}
