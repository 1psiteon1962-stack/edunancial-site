import assert from "node:assert/strict";
import test from "node:test";

import {
  inferCurriculumPackageIdentity,
  resolvePackageUploadConfig,
} from "@/lib/admin-content/package-upload-config";
import type { CourseUploadConfig } from "@/lib/admin-content/upload-intake";

const baseConfig: CourseUploadConfig = {
  destination: "courses",
  track: "green",
  level: "level-1",
  language: "en-US",
  membershipAccess: "basic",
  publicationStatus: "draft",
  title: "Fallback title",
  description: "Bulk curriculum package upload",
};

test("recognizes Canadian French GREEN Level 1 ZIP naming", () => {
  const identity = inferCurriculumPackageIdentity("GREEN-L1-fr-CA-COMPLETE.zip", "en-US");
  assert.equal(identity.track, "green");
  assert.equal(identity.level, "level-1");
  assert.equal(identity.language, "fr-CA");
});

test("recognizes Brazil and Portugal Portuguese ZIP naming", () => {
  const brazil = inferCurriculumPackageIdentity("GREEN-L1-pt-BR-COMPLETE.zip", "en-US");
  const portugal = inferCurriculumPackageIdentity("GREEN-L1-pt-PT-COMPLETE.zip", "en-US");
  assert.equal(brazil.language, "pt-BR");
  assert.equal(portugal.language, "pt-PT");
  assert.equal(brazil.track, "green");
  assert.equal(portugal.track, "green");
  assert.equal(brazil.level, "level-1");
  assert.equal(portugal.level, "level-1");
});

test("explicit filename locale overrides batch default language", () => {
  const resolved = resolvePackageUploadConfig(baseConfig, "GREEN-L1-fr-CA-COMPLETE.zip");
  assert.equal(resolved.destination, "courses");
  if (resolved.destination !== "courses") throw new Error("Expected course upload config");
  assert.equal(resolved.track, "green");
  assert.equal(resolved.level, "level-1");
  assert.equal(resolved.language, "fr-CA");
});

test("canonical lesson filename may use owner-selected fallback language", () => {
  const identity = inferCurriculumPackageIdentity("GREEN-L1-001.md", "pt-BR");
  assert.equal(identity.track, "green");
  assert.equal(identity.level, "level-1");
  assert.equal(identity.language, "pt-BR");
});

test("rejects package names that omit color or level", () => {
  assert.throws(() => inferCurriculumPackageIdentity("fr-CA-COMPLETE.zip", "fr-CA"), /missing color track/u);
  assert.throws(() => inferCurriculumPackageIdentity("GREEN-fr-CA-COMPLETE.zip", "fr-CA"), /missing level/u);
});
