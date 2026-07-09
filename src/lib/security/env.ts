const REQUIRED_PRODUCTION_ENV_VARS = [
  "EDUNANCIAL_ENCRYPTION_KEY",
  "EDUNANCIAL_SESSION_SECRET",
] as const;

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getSecurityEnvironmentStatus() {
  const missing = REQUIRED_PRODUCTION_ENV_VARS.filter(
    (key) => isProductionRuntime() && !process.env[key]
  );

  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    ready: missing.length === 0,
    missing,
  };
}
