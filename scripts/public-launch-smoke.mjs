import { readFileSync } from "node:fs";

const baseUrl = (process.env.BASE_URL || "https://www.edunancial.com").replace(/\/$/, "");
const inventory = JSON.parse(readFileSync(new URL("../curriculum/inventory.json", import.meta.url), "utf8"));

const staticRoutes = [
  "/",
  "/dashboard",
  "/features",
  "/pricing",
  "/membership",
  "/courses",
  "/curriculum",
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

const requiredBodyTokens = new Map();
const curriculumRoutes = new Set();
const assetsByLevel = new Map();

for (const asset of inventory.assets || []) {
  if (asset?.type !== "lesson" || asset?.status !== "active" || !asset?.id || !asset?.track || !asset?.level) continue;
  const track = String(asset.track).toLowerCase();
  const level = Number(asset.level);
  const id = String(asset.id);
  const key = `${track}:l${level}`;
  const list = assetsByLevel.get(key) || [];
  list.push(id);
  assetsByLevel.set(key, list);
}

for (const [key, ids] of assetsByLevel) {
  const [track, levelSlug] = key.split(":");
  const trackRoute = `/curriculum/${track}`;
  const levelRoute = `${trackRoute}/${levelSlug}`;
  curriculumRoutes.add(trackRoute);
  curriculumRoutes.add(levelRoute);

  // Verify every registered canonical ID is present on its level listing page.
  // This catches the exact class of regression where a level silently vanishes
  // or only a subset of registered lessons is rendered.
  requiredBodyTokens.set(levelRoute, ids);

  // Also exercise one deterministic lesson route per track/level. This scales
  // with the inventory without turning a large curriculum into hundreds of
  // production HTTP requests on every smoke run.
  const representativeId = [...ids].sort()[0];
  const lessonRoute = `${levelRoute}/${representativeId.toLowerCase()}`;
  curriculumRoutes.add(lessonRoute);
  requiredBodyTokens.set(lessonRoute, [representativeId]);
}

const routes = [...new Set([...staticRoutes, ...curriculumRoutes])];
const failures = [];

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "EdunancialLaunchSmoke/1.2" },
    });

    const contentType = response.headers.get("content-type") || "";
    if (response.status < 200 || response.status >= 400) {
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
console.log(`Inventory coverage: ${assetsByLevel.size} registered track/level combination(s).`);
