exports.handler = async function (event) {
  try {
    const data = JSON.parse(event.body || "{}");

    console.log("EDUNANCIAL_TRAFFIC", {
      timestamp: new Date().toISOString(),
      site: data.site || "unknown",
      region: data.region || "unknown",
      role: data.role || "unknown",
      language: data.language || "unknown",
      path: data.path || "",
      referrer: data.referrer || "",
      userAgent: data.userAgent || ""
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok" })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "bad_request" })
    };
  }
};
