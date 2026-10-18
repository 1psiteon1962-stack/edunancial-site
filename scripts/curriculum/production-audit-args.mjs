/**
 * Strict, side-effect-free argument parser for scripts/curriculum/production-audit.mjs.
 * Every malformed, unknown, duplicated or unsupported option fails BEFORE any network
 * call, so a typo can never silently widen (or narrow) a production audit.
 */
export const AUDIT_TRACKS = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"];
export const AUDIT_LEVELS = [1, 2, 3, 4, 5];
const VALUE_FLAGS = new Set(["base", "tracks", "levels", "locales", "out", "concurrency"]);
const BOOLEAN_FLAGS = new Set(["update-baseline"]);

export const AUDIT_USAGE =
  "Usage: node scripts/curriculum/production-audit.mjs [--base https://edunancial.com] [--tracks RED,WHITE] " +
  "[--levels 1,2] [--locales en-US,fr-CA] [--out reports/production-audit] [--concurrency 1-3] [--update-baseline]";

export class AuditArgsError extends Error {}

// Message prefixes are a stable contract relied on by existing CI tests and operators.
const SELECTION_FLAGS = new Set(["tracks", "levels", "locales"]);
function prefixFor(name) {
  if (SELECTION_FLAGS.has(name)) return "Invalid audit selection: ";
  if (name === "concurrency") return "Invalid --concurrency: ";
  return "Invalid arguments: ";
}
const fail = (name, message) => { throw new AuditArgsError(prefixFor(name) + message); };

function splitList(name, raw) {
  const items = raw.split(",").map((item) => item.trim());
  if (!items.length || items.some((item) => item === "")) fail(name, `--${name} must be a nonempty comma-separated list without empty items.`);
  if (new Set(items).size !== items.length) fail(name, `--${name} contains duplicate values.`);
  return items;
}

export function parseAuditArgs(argv, env = {}) {
  const seen = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) fail("", `Unexpected argument "${token}".`);
    if (token.includes("=")) fail("", `Unsupported form "${token}": use "--name value".`);
    const name = token.slice(2);
    if (!VALUE_FLAGS.has(name) && !BOOLEAN_FLAGS.has(name)) fail("", `Unknown option "${token}".`);
    if (seen.has(name)) fail(name, `Option "${token}" was given more than once.`);
    if (BOOLEAN_FLAGS.has(name)) { seen.set(name, true); continue; }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--") || value.trim() === "") fail(name, `Option "${token}" requires a value.`);
    seen.set(name, value);
    index += 1;
  }

  const baseRaw = seen.get("base") ?? env.EDUNANCIAL_BASE_URL ?? "https://edunancial.com";
  let baseUrl;
  try { baseUrl = new URL(baseRaw); } catch { fail("base", "--base must be an absolute URL."); }
  if (baseUrl.protocol !== "https:" && !(baseUrl.protocol === "http:" && ["localhost", "127.0.0.1"].includes(baseUrl.hostname))) {
    fail("base", "--base must use https (http is allowed only for localhost).");
  }
  if (baseUrl.search || baseUrl.hash || baseUrl.username || baseUrl.password) fail("base", "--base must not contain credentials, a query, or a fragment.");
  const base = baseUrl.toString().replace(/\/+$/u, "");

  const tracks = seen.has("tracks") ? splitList("tracks", seen.get("tracks")) : [...AUDIT_TRACKS];
  if (tracks.some((track) => !AUDIT_TRACKS.includes(track))) fail("tracks", "--tracks must use known uppercase track codes.");

  let levels = [...AUDIT_LEVELS];
  if (seen.has("levels")) {
    const raw = splitList("levels", seen.get("levels"));
    if (raw.some((level) => !/^[1-5]$/.test(level))) fail("levels", "--levels must be integers 1-5.");
    levels = raw.map(Number);
  }

  let locales = null;
  if (seen.has("locales")) {
    locales = splitList("locales", seen.get("locales"));
    if (locales.some((locale) => !/^[a-z]{2,3}(?:-[A-Za-z0-9]+)*$/.test(locale))) fail("locales", "--locales must contain locale codes.");
  }

  const concurrencyRaw = seen.get("concurrency") ?? "1";
  if (!/^[1-3]$/.test(concurrencyRaw)) fail("concurrency", "use an integer from 1 to 3.");

  const out = seen.get("out") ?? "reports/production-audit";

  return { base, tracks, levels, locales, out, concurrency: Number(concurrencyRaw), updateBaseline: seen.has("update-baseline") };
}
