export async function fetchHomepageData() {
  try {
    const baseUrl = process.env.CMS_BASE_URL;

    // ✅ If no CMS configured, return safe fallback
    if (!baseUrl) {
      console.warn("CMS_BASE_URL not set — using fallback homepage data");
      return {
        clientModules: [],
      };
    }

    const res = await fetch(`${baseUrl}/homepage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("CMS fetch failed:", res.status);
      return {
        clientModules: [],
      };
    }

    const data = await res.json();

    // ✅ Guarantee shape so build NEVER crashes
    return {
      clientModules: data?.clientModules || [],
    };
  } catch (err) {
    console.error("fetchHomepageData error:", err);

    return {
      clientModules: [],
    };
  }
}
