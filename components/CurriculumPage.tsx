type Level = {
  id: string;
  title: string;
  description?: string;
  price: number;
  cta?: string;
};

export default function CurriculumPage({
  headline,
  levels,
  currency,
}: {
  headline: string;
  levels: Level[];
  currency: string;
}) {
  return (
    <main>
      <h1>{headline}</h1>

      <section>
        {levels.map((lvl) => (
          <div key={lvl.id} style={{ border: "1px solid #ccc", padding: 16 }}>
            <h2>{lvl.title}</h2>
            {lvl.description && <p>{lvl.description}</p>}
            <strong>
              {lvl.price === 0 ? "Free" : `${currency} ${lvl.price}`}
            </strong>
            <br />
            <button>{lvl.cta ?? "Continue"}</button>
          </div>
        ))}
      </section>
    </main>
  );
}
