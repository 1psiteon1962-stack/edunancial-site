export async function getRootPage() {
  const endpoint = process.env.HYGRAPH_ENDPOINT;
  const token = process.env.HYGRAPH_TOKEN;

  // ✅ HARD GUARD — prevents silent failure
  if (!endpoint) {
    console.error('❌ HYGRAPH_ENDPOINT is missing');
    return null;
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query: `
          query GetHomePage {
            page(where: { slug: "home" }) {
              clientModules
            }
          }
        `,
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('❌ Hygraph response not OK:', res.status);
      return null;
    }

    const json = await res.json();

    if (!json?.data?.page) {
      console.error('❌ No page data returned from Hygraph');
      return null;
    }

    return json.data.page;
  } catch (error) {
    console.error('❌ Hygraph fetch exception:', error);
    return null;
  }
}
