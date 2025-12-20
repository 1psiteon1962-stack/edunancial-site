// app/page.tsx
import LevelOffersComponent from "@/components/LevelOffers";

export default function HomePage() {
  // TEMP: default Level (later resolved via quiz / app)
  const userLevel = 1;

  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Edunancial</h1>

      <p>
        Financial literacy is the foundation of freedom. Edunancial helps
        founders, families, and future leaders understand money, capital,
        and opportunity — globally.
      </p>

      <LevelOffersComponent level={userLevel} />
    </main>
  );
}
