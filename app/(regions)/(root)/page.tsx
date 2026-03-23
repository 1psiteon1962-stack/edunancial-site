import SectionRenderer from '../../../components/sections/SectionRenderer';
import { getHomePageData } from '../../../lib/directus';

export default async function Page() {
  let clientModules: any[] = [];

  try {
    const data = await getHomePageData();

    const regions = Array.isArray(data?.regions) ? data.regions : [];

    const defaultRegion =
      process.env.NEXT_PUBLIC_DEFAULT_REGION || '';

    // SAFE REGION SELECTION
    const homeRegion =
      regions.find((r: any) => r?.slug === defaultRegion) ||
      regions[0] ||
      null;

    if (
      homeRegion &&
      Array.isArray(homeRegion.clientModules)
    ) {
      clientModules = homeRegion.clientModules;
    }
  } catch (error) {
    console.error('Homepage fetch failed:', error);
  }

  return (
    <main>
      {clientModules.length > 0 ? (
        <SectionRenderer sections={clientModules} />
      ) : (
        <div style={{ padding: 40 }}>
          <h1>Edunancial</h1>
          <p>Fallback content — no region data available.</p>
        </div>
      )}
    </main>
  );
}
