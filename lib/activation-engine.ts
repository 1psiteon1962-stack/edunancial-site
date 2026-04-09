import { Level } from "./levels";

export type ActivationResult = {
  success: boolean;
  level: Level;
};

export function activateLevel(level: Level): ActivationResult {
  return {
    success: true,
    level,
  };
}
