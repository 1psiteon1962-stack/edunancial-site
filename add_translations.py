import json
from pathlib import Path


LOCALES_DIR = Path("/home/runner/work/edunancial-site/edunancial-site/src/locales")
SOURCE_LOCALE = "en"
SKIP_LOCALES = {"en", "es"}


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


ENGLISH = load_json(LOCALES_DIR / f"{SOURCE_LOCALE}.json")
SAMPLE = load_json(LOCALES_DIR / "am.json")
MISSING_KEYS = [key for key in ENGLISH if key not in SAMPLE]


def build_duplicate_value_index(locale_data: dict, english_data: dict) -> dict:
    index = {}
    for key, localized_value in locale_data.items():
        english_value = english_data.get(key)
        if english_value and english_value not in index and localized_value != english_value:
            index[english_value] = localized_value
    return index


def build_translations() -> dict:
    translations = {}
    for locale_path in sorted(LOCALES_DIR.glob("*.json")):
        locale = locale_path.stem
        if locale in SKIP_LOCALES:
            continue

        locale_data = load_json(locale_path)
        duplicate_values = build_duplicate_value_index(locale_data, ENGLISH)
        translations[locale] = {}

        for key in MISSING_KEYS:
            english_value = ENGLISH[key]
            translated = duplicate_values.get(english_value, english_value)
            translations[locale][key] = translated

    return translations


TRANSLATIONS = build_translations()


def update_locale(locale: str) -> int:
    path = LOCALES_DIR / f"{locale}.json"
    data = load_json(path)
    for key in MISSING_KEYS:
        if key not in data:
            data[key] = TRANSLATIONS[locale][key]

    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    return len(data)


def main() -> None:
    counts = {}
    for locale in sorted(TRANSLATIONS):
        counts[locale] = update_locale(locale)

    for locale, count in counts.items():
        print(f"{locale}: {count}")


if __name__ == "__main__":
    main()
