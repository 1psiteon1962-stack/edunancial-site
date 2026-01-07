/**
 * Strategic readiness switches.
 * Used for geopolitical or regulatory transitions.
 */

export type ReadinessKey =
  | "CUBA_MARKET_OPEN"
  | "LATAM_EXPANSION_PHASE_2"
  | "AFRICA_PARTNERS_READY";

export const READINESS: Record<ReadinessKey, boolean> = {
  CUBA_MARKET_OPEN: false,
  LATAM_EXPANSION_PHASE_2: false,
  AFRICA_PARTNERS_READY: false,
};
