const baseUrl = (process.env.BASE_URL || "https://www.edunancial.com").replace(/\/$/, "");

const routes = [
  "/",
  "/dashboard",
  "/features",
  "/pricing",
  "/membership",
  "/courses",
  "/books",
  "/blog",
  "/community",
  "/downloads",
  "/our-story",
  "/mission",
  "/vision",
  "/faq",
  "/privacy",
  "/contact",
  "/robots.txt",
  "/sitemap.xml",
  "/api/health",
];

const failures = [];

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "EdunancialLaunchSmoke/1.0" },
    });

    const contentType = response.headers.get("content-type") || "";
    const isExpectedStatus = response.status >= 200 && response.status < 400;

    if (!isExpectedStatus) {
      failures.push(`${route}: HTTP ${response.status}`);
      console.error(`FAIL ${route} -> HTTP ${response.status}`);
      continue;
    }

    if (route === "/api/health") {
      const body = await response.text();
      if (!body.includes("ok")) {
        failures.push(`${route}: health response does not contain ok`);
        console.error(`FAIL ${route} -> unexpected health body`);
        continue;
      }
    }

    if (route.endsWith(".xml") && !contentType.includes("xml")) {
      failures.push(`${route}: expected XML content type, got ${contentType}`);
      console.error(`FAIL ${route} -> ${contentType}`);
      continue;
    }

    if (route.endsWith(".txt") && !contentType.includes("text")) {
      failures.push(`${route}: expected text content type, got ${contentType}`);
      console.error(`FAIL ${route} -> ${contentType}`);
      continue;
    }

    console.log(`PASS ${route} -> ${response.status}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${route}: ${message}`);
    console.error(`FAIL ${route} -> ${message}`);
  }
}

if (failures.length > 0) {
  console.error("\nPublic launch smoke checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nAll ${routes.length} public launch smoke checks passed for ${baseUrl}.`);
