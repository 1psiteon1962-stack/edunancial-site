import { getRootPage } from "@/lib/velite";

export default async function Page() {
  const page = await getRootPage();

  return (
    <main>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
    </main>
  );
}
