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
- PR 1622 RED L1 fixes MERGED; PR 1623 PURPLE L1 es-Caribbean+es-ES (100 files) MERGED; PR 1624 WHITE L1 es-Caribbean+es-ES (100 files) in CI
- Fidelity tool: /tmp/fidelity.py (answer key + number match vs English); template tool /tmp/tplset.py
- 2026-11-23 session:
  - PR 1625 BLUE L1 es-Caribbean, PR 1626 BLUE L1 es-ES — MERGED, smoke OK
  - PR 1627 GOLD L1 Spanish (both) — MERGED, smoke OK. Prior "kept" GOLD es-Caribbean lessons were paraphrased; all 50 retranslated.
  - PR 1628 GREEN L1 Spanish — MERGED. GREEN es-Caribbean 001-005 were condensed (002/003 missing takeaways); retranslated. 006-010 verified faithful.
  - PR 1629 BLACK L1 es-ES — MERGED, smoke OK.
  - PR 1630 RED L1 Spanish — MERGED (a4de63fa), smoke OK. RED es-Caribbean 004-050 were condensed (no "### Question N"); retranslated faithfully. es-ES derived (tools/red_eses.py).
    NOTE: phase0 safety-net workflow pins es-ES RED-L1-001 title text "¿Qué es realmente un inmueble?" — keep it.
  - PR 1631 BLUE L1 ht (50 new) + ORANGE-L1-001.ht heading fix — in CI.
  - Remaining Haitian: PURPLE L4 (001-020 batches ready in work/PURPLE-L4-ht, 021-050 to do), ORANGE L4, BLACK L4; L3 for BLUE/GREEN/GOLD/PURPLE/ORANGE/BLACK.
- 2026-11-23: PURPLE L4 ht 001-050 complete (check45 0 problems); PR 1632 opened, merge running. check45 ht heading map fixed to site convention "Senaryo pou louvri leson an"; extra hedged Haiti REGION tags allowed (matches merged GOLD/GREEN/BLUE L4 ht). Next: ORANGE L4 ht, BLACK L4 ht.
- 2026-11-23: PURPLE L4 ht merged (PR 1632, smoke success). ORANGE L4 ht 001-050 complete, PR opened. Next: BLACK L4 ht.
- 2026-11-23: BLACK L4 ht 001-050 merged (PR 1634). Smoke dispatched. Started L3 ht: BLUE (work/BLUE-L3-ht), check3/pcheck3 now support ht (7 H2 + '---' italic disclaimer, tag map FÈ VERIFYE/EGZANP ILISTRATIF/SIPOZISYON/ESTIMASYON).
- 2026-11-23: PR 1634 smoke success. BLUE L3 ht 001-031 written (b01-b07, pcheck3 0 problems). Next: BLUE L3 ht 032-050, then check3.sh BLUE ht, place, PR. Then GREEN, GOLD, PURPLE, ORANGE, BLACK L3 ht.
- 2026-11-23: BLUE L3 ht 001-050 complete (check3 0 problems), PR 1635 opened, merge running. Next: GREEN L3 ht.
- 2026-11-23: GREEN L3 ht 50/50 done, PR 1636 merging. BLUE PR 1635 merged + smoke success. Next GOLD L3 ht.
- 2026-11-23: PR 1637 (exclude glibc sharp; server fn 244->226MB) merged. GREEN PR 1636 merged. GOLD 50/50 -> PR 1638. PURPLE in progress (24/50).
- 2026-11-23: GOLD PR 1638 merged. PURPLE 50/50 -> PR 1639. Next ORANGE L3 ht.
- PURPLE PR 1639 merged; GOLD smoke success; server fn still 226M after 3 batches.
- 2026-11-23: ORANGE L3 ht PR 1640 merged (75e58ac), smoke success. BLACK L3 ht 50/50 -> PR 1641 merging. ht L3 now 8/8 colors x 50.
- 2026-11-23: BLACK L3 ht PR 1641 merged, smoke success. GREEN L1 fr-CA+fr-FR all 50 retranslated (001-005 were templates too) -> PR 1642.
- BLUE L1 fr-CA/fr-FR retranslated 001-050 → PR 1643 (2026-11-23)
- WHITE L1 fr-CA/fr-FR retranslated 001-050 → PR 1644 (2026-11-23)
- PURPLE L1 fr-CA/fr-FR retranslated 001-050 → PR 1645 (2026-11-23). French L1 now done for BLUE/WHITE/PURPLE/GREEN.
- 2026-11-23: GOLD L1 fr-CA 002-050 + fr-FR 001-050 faithful; PR 1646 (114192a). PURPLE PR 1645 merged c0b8f37.
- 2026-11-23: GOLD fr PR 1646 merged 21c4bfb. Batch A (BLACK fr-FR+de, GOLD/PURPLE en-GB) PR 1647. Batching PRs now to save Netlify credits (15/deploy).
- 2026-11-23: GOLD L1 de/it-IT/nl/pt-BR/pt-PT placed via PR 1649 (merged fffdff8, smoke pass). PURPLE L1 de 50/50 written (work/PURPLE-L1-de), not yet placed. Next: PURPLE it, nl, pt-BR, pt-PT.
