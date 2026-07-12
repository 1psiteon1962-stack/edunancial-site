import {
  DEFAULT_REGION_ID,
  getRegionalConfiguration,
  GlobalRegionId,
} from "./regions";

export type RegionalContentType =
  | "courses"
  | "books"
  | "announcements"
  | "promotions"
  | "pricing";

export interface RegionalContentEntry<TValue> {
  id: string;
  type: RegionalContentType;
  defaultValue: TValue;
  regionalOverrides?: Partial<Record<GlobalRegionId, TValue>>;
}

export interface RegionalContentAdminDraft<TValue> {
  regionId: GlobalRegionId;
  value: TValue;
}

export function resolveRegionalContentValue<TValue>(
  entry: RegionalContentEntry<TValue>,
  regionId?: string
): TValue {
  const region = getRegionalConfiguration(regionId).id;
  const override = entry.regionalOverrides?.[region];

  if (override !== undefined) {
    return override;
  }

  return entry.defaultValue;
}

export function upsertRegionalOverride<TValue>(
  entry: RegionalContentEntry<TValue>,
  draft: RegionalContentAdminDraft<TValue>
): RegionalContentEntry<TValue> {
  return {
    ...entry,
    regionalOverrides: {
      ...(entry.regionalOverrides ?? {}),
      [draft.regionId]: draft.value,
    },
  };
}

export function buildRegionalPublicationMatrix<TValue>(
  entry: RegionalContentEntry<TValue>
) {
  return Object.values(getRegionalPublicationDefaults()).map((regionId) => ({
    regionId,
    hasOverride: entry.regionalOverrides?.[regionId] !== undefined,
    usesFallback:
      entry.regionalOverrides?.[regionId] === undefined && regionId !== DEFAULT_REGION_ID,
  }));
}

function getRegionalPublicationDefaults(): Record<GlobalRegionId, GlobalRegionId> {
  return {
    "north-america": "north-america",
    "latin-america": "latin-america",
    caribbean: "caribbean",
    europe: "europe",
    africa: "africa",
    "middle-east": "middle-east",
    "asia-pacific": "asia-pacific",
  };
}
