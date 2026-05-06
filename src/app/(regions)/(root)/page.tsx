// src/app/(regions)/(root)/page.tsx

export const dynamic = "force-static";

type HomeClientModule = {
  id: string;
  title: string;
  description: string;
};

type HomePageData = {
  title: string;
  description: string;
  clientModules: HomeClientModule[];
};

async function getSafeHomePageData(): Promise<HomePageData> {
  return {
    title: "Edunancial",
    description:
      "Financial education, business structure, and global growth tools.",
    clientModules: [
      {
        id: "financial-literacy",
        title: "Financial Literacy",
        description:
          "Learn how money, credit, investing, business structure, and long-term wealth systems work.",
      },
      {
        id: "business-formation",
        title: "Business Formation",
        description:
          "Understand how to build, structure, and operate a business with discipline and compliance.",
      },
      {
        id: "global-growth",
        title: "Global Growth",
        description:
          "Explore practical frameworks for expanding business education and opportunity across regions.",
      },
    ],
  };
}

export default async function Page() {
  const page = await getSafeHomePageData();

  return (
    <main>
      <section>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </section>

      <section>
        {page.clientModules.map((module) => (
          <article key={module.id}>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
