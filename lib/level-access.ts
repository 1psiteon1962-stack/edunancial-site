// lib/level-access.ts

import { Level } from "./levels"

export type LevelAccess = {
  canViewContent: boolean
  canAccessTools: boolean
  canJoinLiveSessions: boolean
  canRequestAdvisory: boolean
}

export const LEVEL_ACCESS: Record<Level, LevelAccess> = {
  free: {
    canViewContent: true,
    canAccessTools: false,
    canJoinLiveSessions: false,
    canRequestAdvisory: false,
  },
  basic: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: false,
    canRequestAdvisory: false,
  },
  premium: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
    canRequestAdvisory: false,
  },
  pro: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
    canRequestAdvisory: true,
  },
  enterprise: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
    canRequestAdvisory: true,
  },
}

export function getLevelAccess(level: Level): LevelAccess {
  return LEVEL_ACCESS[level]
}
