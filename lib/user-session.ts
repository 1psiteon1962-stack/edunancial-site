// lib/user-session.ts
import { Level } from "./levels";

// TEMPORARY: default visitor level
export function getUserLevel(): Level {
  return 1; // everyone starts at Foundation
}
