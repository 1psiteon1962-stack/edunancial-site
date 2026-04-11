export async function getHomePage() {
  try {
    const res = await fetch(
      process.env.STRAPI_API_URL + "/api/homepage?populate=*",
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Strapi fetch failed:", res.status);
      return null;
    }

    const data = await res.json();

    return data ?? null;
  } catch (err) {
    console.error("CMS ERROR:", err);
    return null;
  }
}
