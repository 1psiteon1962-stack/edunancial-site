exports.handler = async function (event) {
  try {
    const data = JSON.parse(event.body || "{}");

    console.log("EDUNANCIAL_TRAFFIC", {
      timestamp: new Date().toISOString(),
      site: data.site || "unknown",
      path: data.path || "",
      referrer: data.referrer || "",
      language: data.language || "",
      userAgent: data.userAgent || "",
      hostname: data.hostname || ""
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false })
    };
  }
};
