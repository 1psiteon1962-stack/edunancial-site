import { cookies, headers } from "next/headers";

import { translate } from "@/lib/international/i18n";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/international/languages";
import { LANGUAGE_COOKIE_NAME } from "@/lib/international/preferences";
import { resolveLocale } from "@/lib/international/resolve-locale";

type RequestLanguageOptions = {
  explicitLocale?: string | null;
  cookieHeader?: string | null;
  acceptLanguageHeader?: string | null;
};

function parseCookieLocale(cookieHeader?: string | null): string | null {
  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${LANGUAGE_COOKIE_NAME}=([^;]+)`, "u"));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export function resolveRequestLanguage(options: RequestLanguageOptions = {}) {
  return resolveLocale({
    savedPreference: options.explicitLocale ?? parseCookieLocale(options.cookieHeader),
    acceptLanguageHeader: options.acceptLanguageHeader,
  });
}

export async function getServerLanguage(options: Pick<RequestLanguageOptions, "explicitLocale"> = {}) {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  return resolveRequestLanguage({
    explicitLocale: options.explicitLocale,
    cookieHeader: `${LANGUAGE_COOKIE_NAME}=${cookieStore.get(LANGUAGE_COOKIE_NAME)?.value ?? ""}`,
    acceptLanguageHeader: headerStore.get("accept-language"),
  });
}

export async function getServerTranslator(
  options: Pick<RequestLanguageOptions, "explicitLocale"> = {},
) {
  const language = await getServerLanguage(options);

  return {
    language: language || DEFAULT_LANGUAGE_CODE,
    t: (key: string, values?: Record<string, string | number>) =>
      translate(language, key, values),
  };
}
