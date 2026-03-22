import SectionRenderer from '../../../components/sections/SectionRenderer';
import { getHomepage } from '../../../lib/directus';

export default async function Page() {
  let modules: any[] = [];

  try {
    const data = await getHomepage();

    // SAFETY: never destructure directly
    if (data && Array.isArray(data.clientModules)) {
      modules = data.clientModules;
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
