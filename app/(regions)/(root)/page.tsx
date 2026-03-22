import SectionRenderer from '../../../components/sections/SectionRenderer';
import { getHomePageData } from '../../../lib/directus';

export default async function Page() {
  let modules: any[] = [];

  try {
    const homePageData = await getHomePageData();

    // CRITICAL FIX: never destructure directly
    if (
      homePageData &&
      typeof homePageData === 'object' &&
      Array.isArray(homePageData.clientModules)
    ) {
      modules = homePageData.clientModules;
    }
  } catch (error) {
    console.error('Homepage fetch failed:', error);
  }

  return (
    <main>
      {modules.length > 0 ? (
        <SectionRenderer sections={modules} />
      ) : (
        <div style={{ padding: 40 }}>
          <h1>Edunancial</h1>
          <p>Content loading...</p>
        </div>
      )}
    </main>
  );
}
