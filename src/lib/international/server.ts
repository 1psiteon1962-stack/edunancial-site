import { cookies } from "next/headers";

import { translate } from "@/lib/international/i18n";
import { normalizeLanguageCode } from "@/lib/international/languages";
import { LANGUAGE_COOKIE_NAME } from "@/lib/international/preferences";

export async function getServerLanguage() {
  const cookieStore = await cookies();
  return normalizeLanguageCode(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value ?? "en-US");
}

export async function getServerTranslator() {
  const language = await getServerLanguage();

  return {
    language,
    t: (key: string, values?: Record<string, string | number>) =>
      translate(language, key, values),
  };
}
