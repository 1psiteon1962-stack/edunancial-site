export const dynamic = 'force-dynamic';

import { getRootPage } from '../../../lib/hygraph';

export default async function Page() {
  let pageData: any = null;

  try {
    pageData = await getRootPage();
  } catch (error) {
    console.error('❌ Hygraph fetch failed:', error);
  }

  // ✅ HARD FAIL WITH CLEAR MESSAGE (NO MORE clientModules CRASH)
  if (!pageData) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Edunancial</h1>
        <p>
          ❌ Homepage data not loading.<br />
          Check Netlify environment variables for Hygraph.
        </p>
      </main>
    );
  }

  const clientModules = pageData?.clientModules ?? [];

  return (
    <main>
      {clientModules.length === 0 ? (
        <p>No modules returned from CMS.</p>
      ) : (
        clientModules.map((mod: any, i: number) => (
          <div key={i}>{JSON.stringify(mod)}</div>
        ))
      )}
    </main>
  );
}
