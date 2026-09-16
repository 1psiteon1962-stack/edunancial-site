import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

test("Next output tracing includes both committed curriculum roots", () => {
  const config = read("next.config.mjs");
  assert.match(config, /\.\/content\/courses\/\*\*\/\*/u);
  assert.match(config, /\.\/content\/curriculum\/\*\*\/\*/u);
});

test("Netlify server function explicitly bundles both committed curriculum roots", () => {
  const toml = read("netlify.toml");
  assert.match(toml, /included_files\s*=\s*\[[\s\S]*?"content\/courses\/\*\*"[\s\S]*?\]/u);
  assert.match(toml, /included_files\s*=\s*\[[\s\S]*?"content\/curriculum\/\*\*"[\s\S]*?\]/u);
});

test("Netlify Next.js adapter remains configured through the supported plugin declaration", () => {
  const toml = read("netlify.toml");
  assert.match(toml, /package\s*=\s*"@netlify\/plugin-nextjs"/u);
});
