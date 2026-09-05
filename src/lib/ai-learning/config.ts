import { LANGUAGE_CATALOG } from "@/lib/international/languages";

export const AI_LEARNING_ADMIN_STORAGE_KEY = "edunancial:ai-learning-config";

export interface AILearningAdminConfig {
  enabledGlobally: boolean;
  enabledTracks: string[];
  disabledLessons: string[];
  supportedJurisdictions: string[];
  supportedLanguages: string[];
  publicAssistanceEnabled: boolean;
}

export const DEFAULT_AI_LEARNING_CONFIG: AILearningAdminConfig = {
  enabledGlobally: true,
  enabledTracks: ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"],
  disabledLessons: [],
  supportedJurisdictions: [
    "US",
    "CA",
    "MX",
    "DO",
    "GB",
    "EU",
    "AU",
    "JP",
    "KR",
    "IN",
    "AFRICA",
    "LATAM",
    "MIDDLE-EAST",
  ],
  // The server pipeline canonicalizes locale codes to lowercase (for example,
  // en-US -> en-us). Keep the allow-list in the same canonical form so valid
  // regional locales are not rejected before the model call.
  supportedLanguages: LANGUAGE_CATALOG.map((language) => language.code.toLowerCase()),
  publicAssistanceEnabled: true,
};

export function mergeAILearningConfig(
  candidate: Partial<AILearningAdminConfig> | null | undefined,
): AILearningAdminConfig {
  if (!candidate) {
    return DEFAULT_AI_LEARNING_CONFIG;
  }

  return {
    enabledGlobally:
      typeof candidate.enabledGlobally === "boolean"
        ? candidate.enabledGlobally
        : DEFAULT_AI_LEARNING_CONFIG.enabledGlobally,
    enabledTracks:
      candidate.enabledTracks?.map((track) => track.toUpperCase()) ??
      DEFAULT_AI_LEARNING_CONFIG.enabledTracks,
    disabledLessons:
      candidate.disabledLessons?.map((lesson) => lesson.toUpperCase()) ??
      DEFAULT_AI_LEARNING_CONFIG.disabledLessons,
    supportedJurisdictions:
      candidate.supportedJurisdictions?.map((jurisdiction) => jurisdiction.toUpperCase()) ??
      DEFAULT_AI_LEARNING_CONFIG.supportedJurisdictions,
    supportedLanguages:
      candidate.supportedLanguages?.map((language) => language.toLowerCase()) ??
      DEFAULT_AI_LEARNING_CONFIG.supportedLanguages,
    publicAssistanceEnabled:
      typeof candidate.publicAssistanceEnabled === "boolean"
        ? candidate.publicAssistanceEnabled
        : DEFAULT_AI_LEARNING_CONFIG.publicAssistanceEnabled,
  };
}

export function canUseAILearningTrack(track: string | null, config: AILearningAdminConfig): boolean {
  if (!track) {
    return true;
  }

  return config.enabledTracks.includes(track.toUpperCase());
}

export function canUseAILearningLesson(
  lessonId: string | null,
  config: AILearningAdminConfig,
): boolean {
  if (!lessonId) {
    return true;
  }

  return !config.disabledLessons.includes(lessonId.toUpperCase());
}
