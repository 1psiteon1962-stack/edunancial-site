// /components/levels/LevelAccess.tsx

type Level = 1 | 2 | 3 | 4 | 5;

interface LevelConfig {
  title: string;
  description: string;
  access: string[];
  monetization: "free" | "paid" | "invite";
}

const LEVELS: Record<Level, LevelConfig> = {
  1: {
    title: "Level 1 — Awareness",
    description:
      "Foundational financial literacy. Understanding money, risk, and behavior.",
    access: [
      "Free articles",
      "Intro videos",
      "Youth & family literacy content",
    ],
    monetization: "free",
  },

  2: {
    title: "Level 2 — Structure",
    description:
      "Personal structure: budgeting, credit, discipline, and basic investing logic.",
    access: [
      "Structured learning paths",
      "Worksheets & checklists",
      "Basic calculators",
    ],
    monetization: "free",
  },

  3: {
    title: "Level 3 — Execution",
    description:
      "Applying knowledge: investing frameworks, business fundamentals, risk control.",
    access: [
      "Advanced tools",
      "Scenario modeling",
      "Private content libraries",
    ],
    monetization: "paid",
  },

  4: {
    title: "Level 4 — Optimization",
    description:
      "Scaling decisions: tax strategy, entities, capital efficiency.",
    access: [
      "Advanced strategy modules",
      "Founder-only content",
      "Priority updates",
    ],
    monetization: "paid",
  },

  5: {
    title: "Level 5 — Capital Architecture",
    description:
      "Institutional thinking: governance, capital deployment, long-term durability.",
    access: [
      "Invite-only content",
      "Private briefings",
      "Future capital platforms",
    ],
    monetization: "invite",
  },
};

export default function LevelAccess({ level }: { level: Level }) {
  const config = LEVELS[level];

  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>{config.title}</h2>
      <p>{config.description}</p>

      <h4>Access Includes:</h4>
      <ul>
        {config.access.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
        Access Type: {config.monetization.toUpperCase()}
      </p>
    </section>
  );
}
