const baseUrl = (process.env.BASE_URL || "https://www.edunancial.com").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_REQUEST_TIMEOUT_MS || 25000);
const MAX_ATTEMPTS = Number(process.env.SMOKE_MAX_ATTEMPTS || 3);
const RETRY_BASE_DELAY_MS = Number(process.env.SMOKE_RETRY_BASE_DELAY_MS || 1000);

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeErrorMessage(error) {
  if (error instanceof Error) {
    const cause =
      error.cause && typeof error.cause === "object" && "message" in error.cause
        ? ` (cause: ${error.cause.message})`
        : "";
    return `${error.name}: ${error.message}${cause}`;
  }
  return String(error);
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "EdunancialLaunchSmoke/1.0" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function shouldRetry(error, status) {
  if (typeof status === "number") return status >= 500 || status === 429;
  if (!(error instanceof Error)) return false;
  return error.name === "AbortError" || /fetch failed/i.test(error.message);
}

for (const route of routes) {
  const url = `${baseUrl}${route}`;
  let routeSucceeded = false;
  let lastFailureMessage = "";
  let attemptsUsed = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    attemptsUsed = attempt;
    const startedAt = Date.now();
    try {
      const response = await fetchWithTimeout(url);
      const elapsedMs = Date.now() - startedAt;
      const contentType = response.headers.get("content-type") || "";
      const isExpectedStatus = response.status >= 200 && response.status < 400;

      if (!isExpectedStatus) {
        lastFailureMessage = `HTTP ${response.status} ${response.statusText}`.trim();
        if (shouldRetry(undefined, response.status) && attempt < MAX_ATTEMPTS) {
          await sleep(RETRY_BASE_DELAY_MS * attempt);
          continue;
        }
        break;
      }

      if (route === "/api/health") {
        const body = await response.text();
        if (!body.includes("ok")) {
          lastFailureMessage = "health response does not contain ok";
          break;
        }
      }

      if (route.endsWith(".xml") && !contentType.includes("xml")) {
        lastFailureMessage = `expected XML content type, got ${contentType || "unknown"}`;
        break;
      }

      if (route.endsWith(".txt") && !contentType.includes("text")) {
        lastFailureMessage = `expected text content type, got ${contentType || "unknown"}`;
        break;
      }

      routeSucceeded = true;
      console.log(`PASS ${route} -> ${response.status} (${elapsedMs}ms, attempt ${attempt}/${MAX_ATTEMPTS})`);
      break;
    } catch (error) {
      lastFailureMessage = normalizeErrorMessage(error);
      if (shouldRetry(error) && attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
        continue;
      }
      break;
    }
  }

  if (!routeSucceeded) {
    const failureMessage = `${route}: ${lastFailureMessage || "unknown failure"} (attempts ${attemptsUsed}/${MAX_ATTEMPTS})`;
    failures.push(failureMessage);
    console.error(`FAIL ${route} -> ${lastFailureMessage || "unknown failure"} (attempts ${attemptsUsed}/${MAX_ATTEMPTS})`);
  }
}

if (failures.length > 0) {
  console.error("\nPublic launch smoke checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nAll ${routes.length} public launch smoke checks passed for ${baseUrl}.`);
