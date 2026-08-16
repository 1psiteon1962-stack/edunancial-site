export type CurriculumAdaptationType =
  | "canonical"
  | "translation"
  | "localized"
  | "jurisdiction-adaptation"
  | "comparison";

export interface CurriculumRenderingIdentity {
  lessonId: string;
  jurisdictionCode: string;
  localeCode: string;
  adaptationType: CurriculumAdaptationType;
  sourceJurisdiction: string;
}

export const DEFAULT_CURRICULUM_JURISDICTION = "US";

const ADAPTATION_TYPES = new Set<CurriculumAdaptationType>([
  "canonical",
  "translation",
  "localized",
  "jurisdiction-adaptation",
  "comparison",
]);

export function normalizeJurisdictionCode(value: unknown): string {
  const normalized = String(value ?? "")
    .trim()
    .replaceAll("_", "-")
    .toUpperCase();
  return normalized || DEFAULT_CURRICULUM_JURISDICTION;
}

export function normalizeCurriculumLocale(value: unknown): string {
  const raw = String(value ?? "").trim().replaceAll("_", "-");
  if (!raw) return "en-US";

  try {
    return Intl.getCanonicalLocales(raw)[0] ?? raw;
  } catch {
    return raw;
  }
}

export function normalizeAdaptationType(value: unknown): CurriculumAdaptationType {
  const normalized = String(value ?? "").trim().toLowerCase() as CurriculumAdaptationType;
  return ADAPTATION_TYPES.has(normalized) ? normalized : "translation";
}

export function buildRenderingKey(identity: Pick<CurriculumRenderingIdentity, "lessonId" | "jurisdictionCode" | "localeCode">): string {
  return [
    identity.lessonId.trim().toUpperCase(),
    normalizeJurisdictionCode(identity.jurisdictionCode),
    normalizeCurriculumLocale(identity.localeCode),
  ].join("::");
}

export function parseRenderingIdentity(options: {
  lessonId: string;
  localeCode: string;
  jurisdictionCode?: unknown;
  adaptationType?: unknown;
  sourceJurisdiction?: unknown;
}): CurriculumRenderingIdentity {
  const jurisdictionCode = normalizeJurisdictionCode(options.jurisdictionCode);
  const adaptationType = normalizeAdaptationType(options.adaptationType);
  const sourceJurisdiction = normalizeJurisdictionCode(
    options.sourceJurisdiction ?? (adaptationType === "jurisdiction-adaptation" ? DEFAULT_CURRICULUM_JURISDICTION : jurisdictionCode),
  );

  return {
    lessonId: options.lessonId.trim().toUpperCase(),
    jurisdictionCode,
    localeCode: normalizeCurriculumLocale(options.localeCode),
    adaptationType,
    sourceJurisdiction,
  };
}

export function assertUniqueRenderingIdentities(identities: CurriculumRenderingIdentity[]): void {
  const counts = new Map<string, number>();
  for (const identity of identities) {
    const key = buildRenderingKey(identity);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const duplicates = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([key]) => key);

  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate curriculum rendering identity detected. Each (lessonId, jurisdictionCode, localeCode) must be unique: ${duplicates.join(", ")}`,
    );
  }
}

export function assertExpectedRenderingCount(expectedRecordCount: number | null, identities: CurriculumRenderingIdentity[]): void {
  if (expectedRecordCount === null) return;
  if (!Number.isInteger(expectedRecordCount) || expectedRecordCount < 1) {
    throw new Error(`expectedRecordCount must be a positive integer; received ${expectedRecordCount}.`);
  }
  if (identities.length !== expectedRecordCount) {
    throw new Error(
      `Curriculum batch count mismatch: expected ${expectedRecordCount} renderings but validated ${identities.length}. Publication blocked before any write.`,
    );
  }
}
