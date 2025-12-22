// lib/user-session.ts

import type { Level } from "./levels";

// TEMPORARY: default visitor level
const DEFAULT_LEVEL: Level = "Foundation";

export function getUserLevel(): Level {
  return DEFAULT_LEVEL;
}
