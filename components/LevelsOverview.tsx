// components/LevelsOverview.tsx

import { EDUNANCIAL_LEVELS } from "@/lib/levels"

export default function LevelsOverview() {
  return (
    <section>
      <h2>Edunancial Levels</h2>

      <ul>
        {EDUNANCIAL_LEVELS.map((lvl) => (
          <li key={lvl.id}>
            <strong>{lvl.label}</strong>
            <br />
            {lvl.description}
            <br />
            <strong>Audience:</strong> {lvl.audience}
            <br />
            <strong>Access:</strong> {lvl.access}
            <br />
            <strong>Monetization:</strong> {lvl.monetization}
          </li>
        ))}
      </ul>
    </section>
  )
}
