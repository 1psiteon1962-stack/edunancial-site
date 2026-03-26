export async function getHomePageData() {
  try {
    const endpoint = process.env.HYGRAPH_ENDPOINT;

    if (!endpoint) {
      console.warn('HYGRAPH_ENDPOINT missing — returning fallback data');
      return {
        clientModules: [],
      };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HYGRAPH_TOKEN || ''}`,
      },
      body: JSON.stringify({
        query: `
          query HomePage {
            page(where: { slug: "home" }) {
              id
            }
          }
        `,
      }),
    });

    const json = await res.json();

    if (!json?.data) {
      return {
        clientModules: [],
      };
    }

    return {
      clientModules: [],
      ...json.data,
    };
  } catch (error) {
    console.error('Hygraph fetch failed:', error);

    return {
      clientModules: [],
    };
  }
}
