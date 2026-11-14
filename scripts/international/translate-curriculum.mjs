// Level-agnostic curriculum translator (Levels 1-5) for Edunancial.
// Writes canonical sidecars content/curriculum/<TRACK>/L<n>/<ID>.<locale>.md with the
// front matter required by scripts/curriculum/validate.mjs. Existing learner-ready
// sidecars are kept unless EDUNANCIAL_TRANSLATION_FORCE=1; stubs/templates are replaced.
//
// Usage: node scripts/international/translate-curriculum.mjs <locale> [<locale> ...]
// Env:   OPENAI_API_KEY (required), OPENAI_ORGANIZATION, EDUNANCIAL_TRANSLATION_MODEL,
//        EDUNANCIAL_TRANSLATION_LEVEL (1-5, required), EDUNANCIAL_TRANSLATION_TRACK (optional),
//        EDUNANCIAL_TRANSLATION_LESSON (optional number or ID), EDUNANCIAL_TRANSLATION_FORCE=1
import fs from "node:fs";
import path from "node:path";

const LOCALE_GUIDE = {
  "en-GB": "British English (UK spelling such as organise, behaviour, programme; UK vocabulary; convert illustrative US dollar amounts to GBP with the same numbers)",
  "es-Caribbean": "Caribbean Spanish (Puerto Rico / Dominican Republic register; use tú; natural Caribbean financial vocabulary)",
  "es-ES": "Castilian Spanish for Spain (use tú; Spain vocabulary such as ordenador, coste, móvil; illustrative amounts in euros with the same numbers)",
  "fr-CA": "Canadian French (Québec; use tu; Québec vocabulary such as courriel, magasiner where natural)",
  "fr-FR": "French for France (use tu; France vocabulary; illustrative amounts in euros with the same numbers)",
  "pt-BR": "Brazilian Portuguese (use você; Brazilian vocabulary; illustrative amounts in reais (R$) with the same numbers)",
  "pt-PT": "European Portuguese for Portugal (impersonal address, never você; estar a + infinitive, never gerund after estar; equipa, planear, registo, facto, contacto, gerir, telemóvel; illustrative amounts in euros with the same numbers)",
  "de": "German (Germany; use du; illustrative amounts in euros with the same numbers)",
  "it": "Italian (Italy; use tu; illustrative amounts in euros with the same numbers)",
  "nl": "Dutch (Netherlands; use je/jij; illustrative amounts in euros with the same numbers)",
};

const locales = process.argv.slice(2);
if (!locales.length) throw new Error("Pass one or more locales, e.g. de it nl");
for (const l of locales) if (!LOCALE_GUIDE[l]) throw new Error(`Unsupported locale: ${l}`);

const apiKey = process.env.OPENAI_API_KEY?.trim();
if (!apiKey) throw new Error("OPENAI_API_KEY is required");
const organization = process.env.OPENAI_ORGANIZATION?.trim();
const model = process.env.EDUNANCIAL_TRANSLATION_MODEL?.trim() || "gpt-4.1-mini";
const level = Number(process.env.EDUNANCIAL_TRANSLATION_LEVEL || "");
if (!Number.isInteger(level) || level < 1 || level > 5) throw new Error("EDUNANCIAL_TRANSLATION_LEVEL must be 1-5");
const wantTrack = (process.env.EDUNANCIAL_TRANSLATION_TRACK || "").trim().toUpperCase();
const wantLesson = (process.env.EDUNANCIAL_TRANSLATION_LESSON || "").trim();
const force = process.env.EDUNANCIAL_TRANSLATION_FORCE === "1";

const root = process.cwd();
const registry = JSON.parse(fs.readFileSync("curriculum/registry.json", "utf8"));
let lessons = [];
for (const track of Object.values(registry.tracks || {})) {
  for (const [lk, lvl] of Object.entries(track.levels || {})) {
    if (Number(lk) !== level) continue;
    for (const a of Object.values(lvl.assets || {})) {
      if (a.type === "lesson" && a.status === "active" && a.lessonNumber >= 1 && a.lessonNumber <= 50) lessons.push(a);
    }
  }
}
if (wantTrack) lessons = lessons.filter((a) => String(a.track).toUpperCase() === wantTrack);
if (wantLesson) lessons = lessons.filter((a) => a.id === wantLesson || a.lessonNumber === Number(wantLesson));
lessons.sort((a, b) => a.track.localeCompare(b.track) || a.lessonNumber - b.lessonNumber);
if (!lessons.length) throw new Error(`No lessons for level=${level} track=${wantTrack || "ALL"}`);
console.log(`Selection: ${lessons.length} lesson(s), level ${level}, locales ${locales.join(", ")}, model ${model}, force=${force}`);

const parse = (raw) => {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/u.exec(raw);
  const fm = {};
  if (!m) return { fm, body: raw.trim() };
  for (const line of m[1].split(/\r?\n/u)) {
    const i = line.indexOf(":");
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { fm, body: m[2].trim() };
};

const EN = new Set("the and of to is a in that for with this you are be or as".split(" "));
function learnerReady(body, englishBody, locale) {
  const b = String(body || "");
  if (b.length < Math.max(1500, 0.4 * englishBody.length)) return false;
  if (locale !== "en-GB") {
    const w = b.toLowerCase().match(/[a-z]+/g) || [];
    if (w.length && w.filter((x) => EN.has(x)).length / w.length > 0.12) return false;
  }
  const sentences = b.split(/(?<=[.!?])\s+/u).map((s) => s.trim()).filter((s) => s.length > 40);
  if (sentences.length && 1 - new Set(sentences).size / sentences.length > 0.3) return false;
  return true;
}

const q = (v) => JSON.stringify(String(v ?? ""));

async function translate(a, raw, locale) {
  const p = parse(raw);
  const title = p.fm.title || a.title || a.id;
  const summary = p.fm.summary || "";
  const prompt = `Translate this complete Edunancial financial-education lesson from American English into ${LOCALE_GUIDE[locale]}.
Rules:
- Translate EVERYTHING: headings, objectives, body, examples, quiz questions, answer key, explanations, key takeaways. Do not summarize, shorten, omit, or add content.
- Preserve all Markdown structure (headings, bold, lists, numbering) and all numbers, percentages, formulas and lesson IDs (e.g. ${a.id}).
- Translate content labels naturally (VERIFIED FACT, ILLUSTRATIVE EXAMPLE, ESTIMATE, ASSUMPTION, OPINION, REGION-SPECIFIC RULE).
- Keep U.S. program names (FHA, VA, IRS, 401(k), Fannie Mae) as names, explained naturally if needed.
- Plainspoken 7th-8th grade reading level; no investment, legal or tax advice beyond what the source says.
Return ONLY JSON: {"title": string, "summary": string, "body": string (full translated Markdown body)}.
LESSON ID: ${a.id}
TITLE: ${title}
SUMMARY: ${summary}
BODY:
${p.body}`;
  const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  if (organization) headers["OpenAI-Organization"] = organization;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `You are a meticulous professional curriculum translator into ${LOCALE_GUIDE[locale]}. Output JSON only.` },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) {
    const e = new Error(`${a.id} ${locale}: API ${res.status} ${await res.text()}`);
    e.nonRetryable = res.status === 401 || res.status === 403;
    throw e;
  }
  const j = await res.json();
  const t = JSON.parse(j.choices?.[0]?.message?.content || "{}");
  if (!t.title || !t.body) throw new Error(`${a.id} ${locale}: missing title/body`);
  if (!learnerReady(t.body, p.body, locale)) throw new Error(`${a.id} ${locale}: quality gate failed (length/English/repetition)`);
  const fm = [
    `id: ${a.id}`,
    `track: ${a.track}`,
    `officialTrackName: ${q(p.fm.officialTrackName || a.trackName || "")}`,
    `level: ${level}`,
    `lessonNumber: ${a.lessonNumber}`,
    `locale: ${locale}`,
    `source_locale: en-US`,
    `title: ${q(t.title)}`,
    `summary: ${q(t.summary || t.title)}`,
    `version: "1.0"`,
    `author: "Waldemar M. Caban, JD MA"`,
    `translationModel: ${q(model)}`,
  ].join("\n");
  return `---\n${fm}\n---\n\n${t.body.trim()}\n`;
}

let failures = 0;
for (const locale of locales) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(6, lessons.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= lessons.length) return;
      const a = lessons[i];
      const dest = path.join(root, "content", "curriculum", a.track, `L${level}`, `${a.id}.${locale}.md`);
      const raw = fs.readFileSync(path.join(root, a.path), "utf8");
      const englishBody = parse(raw).body;
      if (!force && fs.existsSync(dest) && learnerReady(parse(fs.readFileSync(dest, "utf8")).body, englishBody, locale)) {
        console.log(`[${locale}] keep ${a.id}`);
        continue;
      }
      let last = null;
      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          fs.writeFileSync(dest, await translate(a, raw, locale));
          last = null;
          break;
        } catch (e) {
          last = e;
          console.error(`attempt ${attempt}: ${e.message.slice(0, 300)}`);
          if (e.nonRetryable) break;
          await new Promise((r) => setTimeout(r, attempt * 3000));
        }
      }
      if (last) { failures++; console.error(`[${locale}] FAILED ${a.id}`); }
      else console.log(`[${locale}] translated ${a.id}`);
    }
  });
  await Promise.all(workers);
}
console.log(`Done. failures=${failures}`);
if (failures) process.exitCode = 1;
