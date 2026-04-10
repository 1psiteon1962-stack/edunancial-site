import { LevelId } from "./levels";

export type LevelAccess = {
  canViewContent: boolean;
  canAccessTools: boolean;
  canJoinLiveSessions: boolean;
};

export const LEVEL_ACCESS: Record<LevelId, LevelAccess> = {
  free: {
    canViewContent: true,
    canAccessTools: false,
    canJoinLiveSessions: false,
  },
  starter: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: false,
  },
  builder: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
  },
  operator: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
  },
  owner: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
  },
  investor: {
    canViewContent: true,
    canAccessTools: true,
    canJoinLiveSessions: true,
  },
};
