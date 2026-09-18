#!/usr/bin/env node
import { readFileSync } from "node:fs";
const manifest=JSON.parse(readFileSync("content/generated/translation-manifest.json","utf8"));
const registry=JSON.parse(readFileSync("content/registries/locales.json","utf8"));
const tracks=["RED","WHITE","BLUE","GREEN","GOLD","PURPLE","ORANGE","BLACK"];
const locales=registry.locales.filter(x=>x.status==="active"&&x.locale!=="en-US"&&x.locale!=="en-GB").map(x=>x.locale);
const failures=[];
for(const track of tracks) for(let n=1;n<=50;n++){const id=`${track}-L1-${String(n).padStart(3,"0")}`;const lesson=manifest.lessons[id];if(!lesson?.canonical){failures.push(`${id}: canonical missing`);continue;}for(const locale of locales){const t=lesson.translations?.[locale];if(!t||t.status!=="published"||t.stale) failures.push(`${id} [${locale}]: complete current translation missing`);}}
if(failures.length){console.error(`L1 LOCALIZATION GATE FAILED: ${failures.length} missing/stale lesson-locale pairs`);for(const x of failures.slice(0,200))console.error(x);if(failures.length>200)console.error(`... plus ${failures.length-200} more`);process.exit(1);}
console.log(`L1 LOCALIZATION GATE PASSED: ${tracks.length*50} lessons x ${locales.length} active translated locales`);
