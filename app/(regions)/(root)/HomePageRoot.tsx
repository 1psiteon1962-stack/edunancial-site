// app/(regions)/(root)/HomePageRoot.tsx

type ClientModule = {
  id: string;
  title: string;
  description: string;
};

const clientModules: ClientModule[] = [
  {
    id: "financial-literacy",
    title: "Financial Literacy",
    description:
      "Learn money, credit, investing, business structure, and wealth-building systems.",
  },
  {
    id: "business-structure",
    title: "Business Structure",
    description:
      "Understand entities, compliance, contracts, ownership, and operating discipline.",
  },
  {
    id: "global-growth",
    title: "Global Growth",
    description:
      "Explore practical frameworks for building and scaling across regions.",
  },
];

export default function HomePageRoot() {
  return (
    <main>
      <section>
        <h1>Edunancial</h1>
        <p>Financial education, business structure, and global growth tools.</p>
      </section>

      <section>
        {clientModules.map((item) => (
          <article key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
