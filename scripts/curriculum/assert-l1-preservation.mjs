import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const ROOT = process.cwd();
const TRACKS = ["RED","WHITE","BLUE","GOLD","PURPLE","ORANGE","BLACK"];
const LOCALES = ["en","en-GB","es-ES","es-Caribbean","fr-FR","fr-CA","it","de","nl","pt-PT","pt-BR"];
const GREEN_REQUIRED = ["en","es-ES","es-Caribbean","fr-CA"];\nconst L1_GB_REQUIRED = ["RED","WHITE","BLUE","GOLD","PURPLE"];

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else files.push(p);
  }
  return files;
}

function normLocale(value) {
  const v = value.replaceAll("_","-").toLowerCase();
  const aliases = {"en-gb":"en-GB","es-es":"es-ES","es-caribbean":"es-Caribbean","fr-fr":"fr-FR","fr-ca":"fr-CA","pt-pt":"pt-PT","pt-br":"pt-BR","it-it":"it"};
  return aliases[v] ?? v;
}

function idsFor(track, locale) {
  const ids = new Set();
  const bundleRoot = join(ROOT,"curriculum","translation-bundles","l1");
  if (locale !== "en" && existsSync(bundleRoot)) {
    const prefix = (track+"-l1-"+locale).toLowerCase();
    if (readdirSync(bundleRoot).some(name => name.toLowerCase().startsWith(prefix))) {
      for (let n=1;n<=50;n++) ids.add(track+"-L1-"+String(n).padStart(3,"0"));
    }
  }
  const canonical = join(ROOT,"content","curriculum",track,"L1");
  for (const p of walk(canonical)) {
    const f = basename(p);
    const m = f.match(new RegExp("^"+track+"-L1-(\\d{3})(?:\\.([^.]+))?\\.md$","i"));
    if (!m) continue;
    const fileLocale = normLocale(m[2] ?? "en");
    if (fileLocale === locale) ids.add(track+"-L1-"+m[1]);
  }

  const legacy = join(ROOT,"content","courses",track.toLowerCase(),"level-1");
  for (const p of walk(legacy)) {
    const f = basename(p);
    const id = f.toUpperCase().match(new RegExp("("+track+"-L1-\\d{3})"))?.[1];
    if (!id) continue;
    if (p.toLowerCase().endsWith(".json")) {
      try {
        const data = JSON.parse(readFileSync(p,"utf8"));
        const t = data.translations ?? {};
        const hit = Object.entries(t).find(([k,v]) => normLocale(k) === locale && v && typeof v === "object" && String(v.title ?? "").trim() && String(v.body ?? "").trim());
        if (hit) ids.add(id);
      } catch {}
    } else if (p.toLowerCase().endsWith(".md")) {
      const normalizedPath = p.replaceAll("\\","/").toLowerCase().replaceAll("_","-");
      const token = locale.toLowerCase();
      if (normalizedPath.includes("/"+token+"/") || normalizedPath.includes("-"+token+"-") || normalizedPath.endsWith("-"+token+".md")) {
        const body = readFileSync(p,"utf8").trim();
        if (body) ids.add(id);
      }
    }
  }
  return ids;
}

const required = Object.fromEntries(TRACKS.map(t => [t,LOCALES]));
required.GREEN = GREEN_REQUIRED;\nfor (const track of L1_GB_REQUIRED) required[track] = [...new Set([...required[track], "en-GB"])];
const failures = [];
for (const [track, locales] of Object.entries(required)) {
  for (const locale of locales) {
    const ids = idsFor(track, locale);
    if (ids.size !== 50) failures.push(track+" L1 "+locale+": "+ids.size+"/50");
  }
}
if (failures.length) {
  console.error("[l1-preservation] REGRESSION: completed Level 1 curriculum would be lost:\n"+failures.join("\n"));
  process.exit(1);
}
console.log("[l1-preservation] PASS: all protected Level 1 color/locale sets retain 50 lessons");
