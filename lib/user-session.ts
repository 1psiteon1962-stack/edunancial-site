import { LevelId } from "./levels";

/**
 * Default level for unauthenticated users
 * MUST match LevelId exactly (lowercase system)
 */
const DEFAULT_LEVEL: LevelId = "free";

export function getUserLevel(): LevelId {
  return DEFAULT_LEVEL;
}
