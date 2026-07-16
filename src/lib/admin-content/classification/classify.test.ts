import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { classifyFile } from "@/lib/admin-content/classification/classify";

describe("admin-content classification", () => {
  test("classifies Spanish real-estate lesson content", () => {
    const proposal = classifyFile({
      normalizedFilename: "real-estate-level-2-lesson-es.md",
      archivePath: "content/academy/real-estate-level-2-lesson-es.md",
      previewText: "Leccion de bienes raices para inversionistas.",
      rawText: "## Learning Objectives\n\nCurso de bienes raices y finanzas para inversionistas.",
    });

    assert.equal(proposal.pillar, "red");
    assert.equal(proposal.category, "lessons");
    assert.equal(proposal.language, "es");
    assert.equal(proposal.academyLevel, "level-2");
    assert.match(proposal.destination, /^content\/curriculum\/RED\/L2\//);
  });

  test("classifies legal policy content into data/legal destination", () => {
    const proposal = classifyFile({
      normalizedFilename: "privacy-policy-fr.md",
      archivePath: null,
      previewText: "Politique de confidentialite",
      rawText: "Conditions de confidentialite et politique de donnees.",
    });

    assert.equal(proposal.category, "legal");
    assert.match(proposal.destination, /^data\/content\/legal\/fr\//);
  });
});
