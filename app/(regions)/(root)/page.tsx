export const dynamic = 'force-dynamic';

import { MDXRemote } from 'next-mdx-remote/rsc';
import { getHomePage } from '../../../lib/directus';

export default async function Page() {
  let mdxSource: any = null;

  try {
    const homepage = await getHomePage();

    // HARD GUARD — prevents clientModules crash
    if (
      homepage &&
      homepage.mdx &&
      typeof homepage.mdx === 'object'
    ) {
      mdxSource = homepage.mdx;
    } else {
      console.warn('⚠️ Homepage MDX missing or invalid');
    }
  } catch (error) {
    console.error('❌ Homepage fetch failed:', error);
  }

  // SAFE FALLBACK — NEVER CRASH BUILD AGAIN
  if (!mdxSource) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Edunancial</h1>
        <p>Content unavailable (build-safe fallback).</p>
      </main>
    );
  }

  return <MDXRemote {...mdxSource} />;
}
