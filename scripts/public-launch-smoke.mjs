const baseUrl = (process.env.BASE_URL || "https://www.edunancial.com").replace(/\/$/, "");

const routes = [
  "/",
  "/dashboard",
  "/features",
  "/pricing",
  "/membership",
  "/courses",
  "/curriculum",
  "/curriculum/red",
  "/curriculum/red/l2",
  "/curriculum/red/l2/red-l2-001",
  "/curriculum/red/l2/red-l2-002",
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

const requiredBodyTokens = new Map([
  ["/curriculum/red/l2", ["RED-L2-001", "RED-L2-002"]],
  ["/curriculum/red/l2/red-l2-001", ["RED-L2-001"]],
  ["/curriculum/red/l2/red-l2-002", ["RED-L2-002"]],
]);

const failures = [];

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "EdunancialLaunchSmoke/1.1" },
    });

    const contentType = response.headers.get("content-type") || "";
    const isExpectedStatus = response.status >= 200 && response.status < 400;

    if (!isExpectedStatus) {
      failures.push(`${route}: HTTP ${response.status}`);
      console.error(`FAIL ${route} -> HTTP ${response.status}`);
      continue;
    }

    let body = null;
    const needsBody = route === "/api/health" || requiredBodyTokens.has(route);
    if (needsBody) body = await response.text();

    if (route === "/api/health" && !body?.includes("ok")) {
      failures.push(`${route}: health response does not contain ok`);
      console.error(`FAIL ${route} -> unexpected health body`);
      continue;
    }

    const requiredTokens = requiredBodyTokens.get(route) || [];
    const missingTokens = requiredTokens.filter((token) => !body?.includes(token));
    if (missingTokens.length > 0) {
      failures.push(`${route}: missing production curriculum markers ${missingTokens.join(", ")}`);
      console.error(`FAIL ${route} -> missing ${missingTokens.join(", ")}`);
      continue;
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
