# Copilot instructions — Edunancial

Repository: `1psiteon1962-stack/edunancial-site`
Production branch: `main`

## Non-negotiable curriculum safety

Curriculum is protected production data.

1. NEVER delete, hide, rename, recycle, orphan, or reduce an existing canonical lesson or translation unless the user explicitly requests removal and the destructive curriculum approval process is satisfied.
2. NEVER treat absence from Supabase, publication state, cache, or a replacement loader as permission to hide committed active curriculum.
3. NEVER weaken or remove curriculum preservation/integrity tests to make CI pass.
4. NEVER lower an inventory baseline to accommodate a regression. Repair the regression.
5. Canonical IDs (`RED-L2-001`, etc.) are permanent and must never be reused for unrelated lessons.
6. Authored lesson content remains version-controlled in Git. Databases are for dynamic state such as publication flags, entitlements, progress, and scheduling.
7. Translation locales attach to canonical lesson IDs. Adding one locale must not remove or overwrite another.
8. Payment, authentication, cybersecurity, UI, hosting, and database work must preserve the effective curriculum inventory.
9. If a change unexpectedly reduces lessons/locales, STOP and report the named missing IDs/locales. Do not improvise a bypass.
10. Intentional removals must be documented in `curriculum/curriculum-removals.json` and require explicit human owner approval. Copilot must not self-authorize removal.

When modifying curriculum loading/publication logic, add or maintain regression coverage proving that an empty/unavailable dynamic publication-state store cannot silently erase existing committed active lessons.
