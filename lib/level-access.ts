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
  1: {
    canViewContent: true,
    canAccessTools: false,
    canJoinLiveSessions: false,
  },
  2: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: false,
  },
  3: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
  },
  4: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
  },
  5: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
  },
};

export function getLevelAccess(level: Level): LevelAccess {
  return LEVEL_ACCESS[level];
}
