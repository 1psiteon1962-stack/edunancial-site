- BLACK-L2-042 English has stray quiz line '2. (renumbered)' (source defect; omitted in ht)
- BLUE-L4-040 Q2: English answer key says "B" but the correct option is A (A = definition of sunk cost fallacy; B = "legitimate, sound reasoning"). ht file uses Q2: A (correct). en + other locales (fr-CA etc.) still say B — needs owner-approved fix across locales (do not overwrite without approval).

## GOLD-L4-049 arithmetic (found while translating ht, 2026-11-23)
- English source says $100k @7% gross, 0.10% vs 1.10% fee, 30y → ~$761k vs ~$568k (diff ~$193k). Correct: ~$740k vs ~$558k (diff ~$182k, ~25%). $761k is the no-fee figure.
- Worked example: $500k, 25y, 0.15% vs 1.15% → diff is ~$549k (~$2.62M vs ~$2.07M), not "exceeding $600,000".
- ht version uses corrected figures; answer key unchanged (B). Other locales still carry original figures — owner approval needed before fixing them.

## PURPLE-L4-011 cross-reference (2026-11-23)
- English says workers comp is "this level's Lesson 21"; it is Lesson 13. ht uses Lesson 13. Other locales unchanged (owner approval needed).
- RESOLVED 2026-11-23 (owner OK): GOLD-L4-049 figures and PURPLE-L4-011 lesson ref fixed in all locales — PR 1620 merged (f6849205), registry/inventory checksums updated.

## 2026-11-23 Level 1 locale audit
### Wrong-topic (translated from older English curriculum)
BLUE L1: es-ES 001-050, es-Caribbean 001-050, fr-FR 001-050, fr-CA 001-050, it 001-050, pt-BR 001-020 (021-050 missing), ht missing 001-050
BLUE L1 partial: de 038,040-048 ; nl 024-031,033 ; pt-PT 024-031  (verify)
GREEN L1: fr-FR 028-035, fr-CA 028-035
ORANGE L1: en-GB,de,it,nl,pt-BR,pt-PT 002-015 (old topics)
PURPLE L1: en-GB,de,fr-FR,it,nl,pt-BR,pt-PT 001-050 (old curriculum); es-ES 001-050 contains French (copy of fr-CA); es-Caribbean 026-050 placeholder "Alfabetización jurídica aplicada — Lección N"; fr-CA on-topic but generic template objectives (quality)
RED L1: it 022,023,024,025,036,039,044,046,047 (wrong topic); fr-FR 021 (verify); es-ES template-quality; RED-L1-020 fr-FR/fr-CA partial English lines
WHITE L1: es-ES,es-Caribbean,fr-FR,fr-CA,it,nl 001-050 (old curriculum); de 001,002 frontmatter title is bare ID (body OK)
RED L1: fr-FR 021 confirmed wrong (rental property vs commercial RE)
BLUE L1 partial confirmed: de 040-048 (9); nl 026-031 (6); pt-PT 026-031 (6); de 038 OK
BLACK L1: topics OK; de/fr-FR/it/nl frontmatter titles have numeric prefix "N." (cosmetic)
### Generic-template sets (boilerplate shared across >=8 lessons; >25% of lesson sentences) — not faithful translations
- ('BLACK', '1', 'de') 50 001 .. 050
- ('BLACK', '1', 'es-ES') 38 013 .. 050
- ('BLACK', '1', 'fr-FR') 50 001 .. 050
- ('BLACK', '1', 'it') 50 001 .. 050
- ('BLACK', '1', 'nl') 50 001 .. 050
- ('BLUE', '1', 'de') 20 031 .. 050
- ('BLUE', '1', 'nl') 30 021 .. 050
- ('BLUE', '1', 'pt-PT') 45 001 .. 045
- ('GOLD', '1', 'de') 50 001 .. 050
- ('GOLD', '1', 'en-GB') 50 001 .. 050
- ('GOLD', '1', 'es-Caribbean') 30 016 .. 045
- ('GOLD', '1', 'es-ES') 49 002 .. 050
- ('GOLD', '1', 'fr-CA') 49 002 .. 050
- ('GOLD', '1', 'fr-FR') 45 001 .. 045
- ('GOLD', '1', 'it-IT') 25 021 .. 045
- ('GOLD', '1', 'nl') 44 002 .. 050
- ('GOLD', '1', 'pt-BR') 45 001 .. 045
- ('GOLD', '1', 'pt-PT') 44 002 .. 046
- ('GREEN', '1', 'es-ES') 50 001 .. 050
- ('GREEN', '1', 'fr-CA') 35 006 .. 050
- ('GREEN', '1', 'fr-FR') 35 006 .. 050
- ('ORANGE', '1', 'de') 50 001 .. 050
- ('ORANGE', '1', 'en-GB') 50 001 .. 050
- ('ORANGE', '1', 'it') 50 001 .. 050
- ('ORANGE', '1', 'nl') 50 001 .. 050
- ('ORANGE', '1', 'pt-BR') 50 001 .. 050
- ('ORANGE', '1', 'pt-PT') 50 001 .. 050
- ('PURPLE', '1', 'es-Caribbean') 25 026 .. 050
- ('PURPLE', '1', 'es-ES') 40 011 .. 050
- ('PURPLE', '1', 'fr-CA') 40 011 .. 050
- ('RED', '1', 'es-ES') 49 001 .. 050
- ('WHITE', '1', 'de') 20 031 .. 050
- ('WHITE', '1', 'pt-BR') 40 006 .. 045
- ('WHITE', '1', 'pt-PT') 40 006 .. 045
### Fixed so far
- PR 1621: localized evidence labels (~4,950 files), BLUE-L4-040 key, BLACK-L2-042 stray line — MERGED
- PR 1622: RED L1 it 9 wrong-topic lessons; RED-L1-021 hollow placeholder (en + 11 locales) authored+translated; RED-L1-020/024 fr-CA/fr-FR half-English — in CI
- L2-L5: topics and structure match English in all locales (checked)
