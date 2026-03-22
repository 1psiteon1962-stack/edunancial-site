import SectionRenderer from '@/components/sections/SectionRenderer';
import { getHomepage } from '@/lib/directus';

export default async function Page() {
  let data = null;

  try {
    data = await getHomepage();
  } catch (error) {
    console.error('Directus fetch failed:', error);
  }

  // SAFE FALLBACK (this prevents build crash)
  const modules = data?.clientModules ?? [];

  return (
    <main>
      {modules.length > 0 ? (
        <SectionRenderer sections={modules} />
      ) : (
        <div style={{ padding: 40 }}>
          <h1>Edunancial</h1>
          <p>Platform loading…</p>
        </div>
      )}
    </main>
  );
}
