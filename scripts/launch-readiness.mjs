import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

async function exists(relative) {
  try { await access(path.join(root, relative)); return true; } catch { return false; }
}

async function text(relative) {
  return readFile(path.join(root, relative), "utf8");
}

const requiredFiles = [
  "src/lib/positioning.ts",
  "src/lib/international/i18n.ts",
  "src/lib/tax/checkout-tax.ts",
  "src/lib/tax/runtime-calculator.ts",
  "src/app/api/square/payment-link/route.ts",
  "src/app/executive/dashboard/page.tsx",
  "src/app/executive/investor-data/page.tsx",
  "supabase/migrations/20260824_000006_location_tax_engine.sql",
  "supabase/migrations/20260824_000003_investor_kpi_dimensions.sql",
];

for (const file of requiredFiles) if (!(await exists(file))) failures.push(`Missing launch-critical file: ${file}`);

const i18n = await text("src/lib/international/i18n.ts");
for (const phrase of [
  "begin with financial literacy, build financial competency, and work toward financial intelligence",
  "first three lessons of Level 1 free",
]) if (!i18n.toLowerCase().includes(phrase.toLowerCase())) failures.push(`Canonical public positioning missing: ${phrase}`);

const checkout = await text("src/app/api/square/payment-link/route.ts");
for (const marker of [
  "EDUNANCIAL_RUNTIME_TAX_ENFORCEMENT_ENABLED",
  "charge-adapter-disabled",
  "resolveCheckoutTax",
  "assertCountryOperationAllowed",
]) if (!checkout.includes(marker)) failures.push(`Checkout launch guard missing: ${marker}`);

const taxMigration = await text("supabase/migrations/20260824_000006_location_tax_engine.sql");
for (const marker of ["checkout_tax_determinations", "sales_tax_collected_by_location", "rule_version", "date_verified"]) if (!taxMigration.includes(marker)) failures.push(`Tax evidence schema missing: ${marker}`);

const investor = await text("src/app/executive/investor-data/page.tsx");
for (const marker of ["Revenue by currency", "Demographic rollup", "Level advancement", "Growth forecasts", "Tax liabilities & remittance"]) if (!investor.includes(marker)) failures.push(`Investor intelligence view missing section: ${marker}`);

const localeEnglish = await text("src/locales/en.json");
if (localeEnglish.includes("putting the finishing touches on the free trial experience")) warnings.push("Legacy en.json still contains old free-trial copy, but runtime English override supersedes it. Remove during locale regeneration.");
if (localeEnglish.includes("financial literacy and financial competency membership platform")) warnings.push("Legacy en.json still contains two-stage positioning, but runtime English override supersedes it. Remove during locale regeneration.");

console.log("Launch readiness audit");
for (const warning of warnings) console.log(`WARN: ${warning}`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exit(1);
}
console.log("PASS: launch-critical code paths and fail-closed controls are present.");
