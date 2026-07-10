export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const ENV_DEFAULT_LOG_LEVEL: Record<string, LogLevel> = {
  development: "debug",
  staging: "info",
  production: "info",
};

export function resolveLogLevel(
  environment = process.env.NODE_ENV,
  configuredLevel = process.env.LOG_LEVEL
): LogLevel {
  const normalizedLevel = configuredLevel?.toLowerCase();

  if (
    normalizedLevel === "debug" ||
    normalizedLevel === "info" ||
    normalizedLevel === "warn" ||
    normalizedLevel === "error"
  ) {
    return normalizedLevel;
  }

  return ENV_DEFAULT_LOG_LEVEL[environment ?? "development"] ?? "info";
}

export const activeLogLevel = resolveLogLevel();

export function shouldLog(level: LogLevel, minimumLevel = activeLogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[minimumLevel];
}
