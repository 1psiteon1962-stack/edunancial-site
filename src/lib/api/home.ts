/**
 * ✅ SAFE CMS FETCH (STRAPI OR FUTURE CMS)
 * This file guarantees:
 * - No crashes during build
 * - Always returns a valid structure
 */

type HomePageResponse = {
  data?: {
    attributes?: {
      clientModules?: any[];
      [key: string]: any;
    };
  };
};

export async function getHomePage(): Promise<HomePageResponse> {
  try {
    const baseUrl = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_TOKEN;

    /**
     * ✅ If env not set → return safe fallback
     */
    if (!baseUrl || !token) {
      console.warn("Strapi env vars missing. Using fallback.");
      return {
        data: {
          attributes: {
            clientModules: [],
          },
        },
      };
    }

    const res = await fetch(`${baseUrl}/api/homepage?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    /**
     * ✅ If fetch fails → fallback
     */
    if (!res.ok) {
      console.error("Strapi fetch failed:", res.status);
      return {
        data: {
          attributes: {
            clientModules: [],
          },
        },
      };
    }

    const json = await res.json();

    /**
     * ✅ Final safety check
     */
    if (!json?.data?.attributes) {
      return {
        data: {
          attributes: {
            clientModules: [],
          },
        },
      };
    }

    return json;
  } catch (err) {
    console.error("Strapi error:", err);

    /**
     * ✅ HARD FAILSAFE
     */
    return {
      data: {
        attributes: {
          clientModules: [],
        },
      },
    };
  }
}
