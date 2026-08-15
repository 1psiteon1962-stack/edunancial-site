import { logger } from "@/lib/observability/logger";
import { logStructuredError } from "@/lib/observability/errors";

let registered = false;

const REQUIRED_PUBLISHED_LESSONS = ["RED-L2-001", "RED-L2-002"] as const;

function supportsProcessEvents(): boolean {
  return (
    typeof process !== "undefined" &&
    typeof process.on === "function" &&
    typeof process.off === "function"
  );
}

async function publishRequiredCurriculumLessons(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { upsertPublishedLessonFromRegistry } = await import(
      "@/lib/curriculum/authoritative-published"
    );

    // Keep writes sequential: each upsert reads the state produced by the
    // previous write, preventing one required lesson from overwriting another.
    for (const lessonId of REQUIRED_PUBLISHED_LESSONS) {
      const published = await upsertPublishedLessonFromRegistry(lessonId);
      if (!published) {
        logger.error("Required curriculum lesson could not be published", {
          lessonId,
        });
      }
    }
  } catch (error) {
    logStructuredError(error, {
      source: "instrumentation.publishRequiredCurriculumLessons",
    });
  }
}

export async function register() {
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

  await publishRequiredCurriculumLessons();
}
