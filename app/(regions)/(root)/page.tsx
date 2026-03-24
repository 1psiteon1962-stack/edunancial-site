export const dynamic = 'force-dynamic';

import { getRootPage } from '../../../lib/directus';

export default async function Page() {
  let pageData: any = null;

  try {
    pageData = await getRootPage();
  } catch (error) {
    console.error('❌ getRootPage() failed:', error);
  }

  // HARD GUARD — THIS IS THE FIX
  if (!pageData) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Edunancial</h1>
        <p>Homepage data not available (safe fallback).</p>
      </main>
    );
  }

  const clientModules = pageData?.clientModules ?? [];

  return (
    <main>
      {clientModules.length === 0 ? (
        <p>No modules available.</p>
      ) : (
        clientModules.map((mod: any, i: number) => (
          <div key={i}>{JSON.stringify(mod)}</div>
        ))
      )}
    </main>
  );
}
