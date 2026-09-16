import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "../../..");
const es = JSON.parse(readFileSync(join(ROOT, "src", "locales", "es.json"), "utf8")) as Record<string, string>;
const trackPage = readFileSync(join(ROOT, "src", "app", "(public)", "curriculum", "[track]", "page.tsx"), "utf8");

const EXPECTED: Record<string, string> = {
  "nav.curriculum": "Currículo",
  "curriculum.trackLabel": "Ruta",
  "curriculum.tab.overview": "Resumen",
  "curriculum.tab.lessons": "Lecciones",
  "curriculum.tab.caseStudies": "Casos de estudio",
  "curriculum.tab.resources": "Recursos",
  "curriculum.tab.flashcards": "Tarjetas de estudio",
  "curriculum.whatYouLearn.title": "Lo que aprenderás",
  "curriculum.whatYouLearn.body": "Desarrolla conocimientos a través de cinco niveles estructurados y luego aplícalos a decisiones financieras cada vez más realistas. Tu membresía determina los niveles disponibles para ti, mientras que los niveles anteriores permanecen disponibles para repaso.",
  "curriculum.realWorldFocus.title": "Enfoque en el mundo real",
  "curriculum.realWorldFocus.body": "Aprende conceptos en contexto y practica aplicándolos a decisiones reales, no promesas, predicciones ni asesoría de inversión personalizada.",
  "curriculum.lessonsCurrentlyAvailable": "{{count}} lecciones disponibles actualmente",
  "curriculum.lessonsAvailable": "{{count}} lecciones disponibles",
  "curriculum.levelLabel": "Nivel {{level}}",
  "curriculum.level1.name": "Alfabetización Financiera",
  "curriculum.level2.name": "Competencia Financiera",
  "curriculum.level3.name": "Razonamiento Aplicado",
  "curriculum.level4.name": "Integración Estratégica",
  "curriculum.level5.name": "Inteligencia Financiera",
  "curriculum.previewLessons": "Vista previa / abrir lecciones →",
  "curriculum.openLevel": "Abrir nivel →",
  "curriculum.inDevelopment": "Currículo en desarrollo",
};

test("Spanish curriculum track UI contains every key used by TrackPage", () => {
  const missing = Object.keys(EXPECTED).filter((key) => !(key in es));
  assert.deepEqual(missing, [], `Missing Spanish TrackPage keys: ${missing.join(", ")}`);

  for (const [key, value] of Object.entries(EXPECTED)) {
    assert.equal(es[key], value, `${key} must retain the approved Spanish translation`);
  }
});

test("TrackPage references the guarded curriculum translation keys", () => {
  for (const key of Object.keys(EXPECTED).filter((key) => key !== "nav.curriculum")) {
    assert.ok(trackPage.includes(`"${key}"`), `TrackPage no longer references expected translation key: ${key}`);
  }
});
