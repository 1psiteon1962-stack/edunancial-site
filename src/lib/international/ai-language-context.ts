import { getLanguageByCode, normalizeLanguageCode } from "./languages";

export type AILanguageContext = {
  languageCode: string;
  languageName: string;
  nativeLanguageName: string;
  systemPromptSuffix: string;
  responseInstruction: string;
};

/**
 * Returns context information for AI prompts based on the active language.
 * Pass the result into system prompts so the AI responds in the user's language.
 */
export function getAILanguageContext(languageCode: string): AILanguageContext {
  const normalized = normalizeLanguageCode(languageCode);
  const languageDef = getLanguageByCode(normalized);

  const languageName = languageDef?.label ?? normalized;
  const nativeLanguageName = languageDef?.nativeLabel ?? normalized;

  const responseInstruction = `Please respond in ${languageName} (${nativeLanguageName}).`;

  const systemPromptSuffix = [
    `The user's preferred language is ${languageName} (${nativeLanguageName}).`,
    responseInstruction,
    "Maintain this language throughout the entire conversation unless the user explicitly requests a different language.",
  ].join(" ");

  return {
    languageCode: normalized,
    languageName,
    nativeLanguageName,
    systemPromptSuffix,
    responseInstruction,
  };
}
