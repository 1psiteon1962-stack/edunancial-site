/**
 * Preference storage helpers.
 *
 * Re-exports the session and saved language preference functions from the
 * canonical `src/lib/international/preferences.ts` module.
 *
 * Use these helpers to:
 *   - Store a session-only language override (sessionStorage)
 *   - Store a durable saved default language (localStorage + cookie)
 *   - Clear individual or all overrides to restore automatic detection
 */

export {
  SESSION_LANGUAGE_KEY,
  SAVED_LANGUAGE_KEY,
  LANGUAGE_COOKIE_NAME,
  loadSessionLanguageOverride,
  saveSessionLanguageOverride,
  clearSessionLanguageOverride,
  loadSavedLanguagePreference,
  saveSavedLanguagePreference,
  clearSavedLanguagePreference,
} from "@/lib/international/preferences";
