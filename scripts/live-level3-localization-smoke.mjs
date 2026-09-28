import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const baseUrl = (process.env.BASE_URL || "https://www.edunancial.com").replace(/\/$/, "");
const root = join(process.cwd(), "content", "courses");
const retryCount = Number(process.env.RETRY_COUNT || "20");
const retryDelayMs = Number(process.env.RETRY_DELAY_MS || "30000");

function parseFrontMatter(raw) {
  if (!raw.startsWith("---")) return {};
  const parts = raw.split("---");
  if (parts.length < 3) return {};
  const out = {};
  for (const line of (parts[1] || "").split(/\r?\n/u)) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (!key) continue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    out[key] = value.replaceAll('\\\"', '"');
  }
  return out;
}

function loadExpectations() {
  const expected = [];
  for (const track of readdirSync(root)) {
    const levelDir = join(root, track, "level-3");
    if (!existsSync(levelDir) || !statSync(levelDir).isDirectory()) continue;
    for (const localeDir of readdirSync(levelDir)) {
      if (["en", "en_us", "en-us"].includes(localeDir.toLowerCase())) continue;
      const dir = join(levelDir, localeDir);
      if (!statSync(dir).isDirectory()) continue;
      const files = readdirSync(dir).filter((name) => name.toLowerCase().endsWith(".md")).sort();
      if (!files.length) continue;
      const representative = files.find((name) => /(?:^|-)001\.md$/iu.test(name)) || files[0];
      const fm = parseFrontMatter(readFileSync(join(dir, representative), "utf8"));
      if (!fm.id || !fm.title) throw new Error(`Missing id/title in ${track}/level-3/${localeDir}/${representative}`);
      expected.push({ track: track.toUpperCase(), locale: fm.locale || localeDir.replaceAll("_", "-"), id: fm.id.toUpperCase(), title: fm.title });
    }
  }
  return expected.sort((a, b) => a.track.localeCompare(b.track) || a.locale.localeCompare(b.locale));
}

const expected = loadExpectations();
if (!expected.length) throw new Error("No localized Level 3 expectations found");

async function checkOne(item) {
  const url = `${baseUrl}/api/public/curriculum/catalog?lang=${encodeURIComponent(item.locale)}`;
  const response = await fetch(url, { redirect: "follow", headers: { "user-agent": "EdunancialLevel3LocalizationSmoke/1.0" } });
  if (!response.ok) return { ok: false, message: `${item.track} ${item.locale}: HTTP ${response.status}` };
  let payload;
  try { payload = await response.json(); }
  catch { return { ok: false, message: `${item.track} ${item.locale}: response was not JSON` }; }
  const lesson = payload?.lessons?.[item.id];
  if (!lesson) return { ok: false, message: `${item.track} ${item.locale}: ${item.id} missing from live catalog` };
  if (lesson.title !== item.title) return { ok: false, message: `${item.track} ${item.locale}: expected "${item.title}" but live returned "${lesson.title}"` };
  return { ok: true, message: `PASS ${item.track} ${item.locale} ${item.id}: ${lesson.title}` };
}

let lastFailures = [];
for (let attempt = 1; attempt <= retryCount; attempt++) {
  const results = await Promise.all(expected.map(checkOne));
  lastFailures = results.filter((result) => !result.ok);
  for (const result of results.filter((result) => result.ok)) console.log(result.message);
  if (!lastFailures.length) {
    console.log(`\nAll ${expected.length} live Level 3 localization checks passed against ${baseUrl}.`);
    process.exit(0);
  }
  console.error(`\nAttempt ${attempt}/${retryCount} has ${lastFailures.length} failure(s):`);
  for (const failure of lastFailures) console.error(`- ${failure.message}`);
  if (attempt < retryCount) await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
}
console.error("\nLive Level 3 localization smoke test failed:");
for (const failure of lastFailures) console.error(`- ${failure.message}`);
process.exit(1);
