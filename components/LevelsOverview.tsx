import { EDUNANCIAL_LEVELS } from "@/lib/levels"

export default function LevelsOverview() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edunancial Levels</h2>

      <ul>
        {EDUNANCIAL_LEVELS.map((level) => (
          <li key={level.id} style={{ marginBottom: "1rem" }}>
            <strong>{level.title}</strong>
            <p>{level.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
