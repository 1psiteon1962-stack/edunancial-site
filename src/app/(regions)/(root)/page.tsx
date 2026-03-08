import React from "react";

type PageData = {
  clientModules?: any[];
};

async function getRegionHome(): Promise<PageData | null> {
  try {
    const res = await fetch(process.env.CMS_HOME_ENDPOINT || "", {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

function PageBuilder({ modules }: { modules: any[] }) {
  if (!modules.length) {
    return (
      <section style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <h1>Edunancial</h1>
        <p>Where Education and Financial Literacy Meet.</p>
      </section>
    );
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      {modules.map((module, i) => (
        <section key={i}>
          <pre>{JSON.stringify(module, null, 2)}</pre>
        </section>
      ))}
    </main>
  );
}

export default async function Page() {
  const pageData = await getRegionHome();

  const modules = pageData?.clientModules ?? [];

  return <PageBuilder modules={modules} />;
}
