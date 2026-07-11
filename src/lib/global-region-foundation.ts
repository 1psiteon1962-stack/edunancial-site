export const CURRICULUM_TRACKS = ["red", "white", "blue"] as const;
export const CURRICULUM_LEVELS = [1, 2, 3, 4, 5] as const;

export type CurriculumTrack = (typeof CURRICULUM_TRACKS)[number];
export type CurriculumLevel = (typeof CURRICULUM_LEVELS)[number];

export interface GlobalRegionFoundation {
  id: string;
  name: string;
  description: string;
  path: string;
}

export const GLOBAL_REGION_FOUNDATIONS: readonly GlobalRegionFoundation[] = [
  {
    id: "north-america",
    name: "North America",
    description: "Regional architecture for U.S. and Canada rollout.",
    path: "/regions/north-america",
  },
  {
    id: "europe",
    name: "Europe",
    description: "Regional architecture for Europe rollout.",
    path: "/regions/europe",
  },
  {
    id: "latin-america",
    name: "Latin America",
    description: "Regional architecture for Latin America rollout.",
    path: "/regions/latin-america",
  },
  {
    id: "caribbean",
    name: "Caribbean",
    description: "Regional architecture for Caribbean rollout.",
    path: "/regions/caribbean",
  },
  {
    id: "africa",
    name: "Africa",
    description: "Regional architecture for Africa rollout.",
    path: "/regions/africa",
  },
  {
    id: "middle-east",
    name: "Middle East",
    description: "Regional architecture for Middle East rollout.",
    path: "/regions/middle-east",
  },
  {
    id: "asia-pacific",
    name: "Asia-Pacific",
    description: "Regional architecture for Asia-Pacific rollout.",
    path: "/regions/asia-pacific",
  },
] as const;

export function getRegionFoundation(regionId: string) {
  return GLOBAL_REGION_FOUNDATIONS.find((region) => region.id === regionId);
}

export function isCurriculumTrack(track: string): track is CurriculumTrack {
  return CURRICULUM_TRACKS.includes(track as CurriculumTrack);
}

export function parseCurriculumLevel(level: string): CurriculumLevel | null {
  if (!level.startsWith("level-")) {
    return null;
  }

  const levelNumber = Number(level.replace("level-", ""));

  return CURRICULUM_LEVELS.includes(levelNumber as CurriculumLevel)
    ? (levelNumber as CurriculumLevel)
    : null;
}
