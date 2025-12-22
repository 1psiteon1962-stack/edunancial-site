// components/LevelsOverview.tsx

import { EDUNANCIAL_LEVELS } from "@/lib/levels";

export default function LevelsOverview() {
  return (
    <section>
      <ul>
        {EDUNANCIAL_LEVELS.map((lvl) => (
          <li key={lvl.id}>
            <strong>{lvl.title}</strong>
            <br />
            {lvl.description}
          </li>
        ))}
      </ul>
    </section>
  );
}
