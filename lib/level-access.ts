// lib/level-access.ts

import type { Level } from "./levels";

export type LevelAccess = {
  canViewContent: boolean;
  canAccessTools: boolean;
  canJoinLiveSessions: boolean;
};

export const LEVEL_ACCESS: Record<Level, LevelAccess> = {
  free: {
    canViewContent: true,
    canAccessTools: false,
    canJoinLiveSessions: false,
  },
  Foundation: {
    canViewContent: true,
    canAccessTools: false,
    canJoinLiveSessions: false,
  },
  Builder: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: false,
  },
  Visionary: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
  },
};

export function getLevelAccess(level: Level): LevelAccess {
  return LEVEL_ACCESS[level];
}
