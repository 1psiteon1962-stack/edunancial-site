import { logger } from "@/lib/observability/logger";
import { logStructuredError } from "@/lib/observability/errors";

let registered = false;

function supportsProcessEvents(): boolean {
  return (
    typeof process !== "undefined" &&
    typeof process.on === "function" &&
    typeof process.off === "function"
  );
}

export function register() {
  if (registered || !supportsProcessEvents()) {
    return;
  }

  registered = true;

  logger.info("Observability instrumentation initialized", {
    nodeEnv: process.env.NODE_ENV ?? "development",
    logLevel: process.env.LOG_LEVEL,
  });

  process.on("uncaughtException", (error: Error) => {
    logStructuredError(error, {
      source: "process.uncaughtException",
    });
  });

  process.on("unhandledRejection", (reason: unknown) => {
    logStructuredError(reason, {
      source: "process.unhandledRejection",
    });
  });
}
