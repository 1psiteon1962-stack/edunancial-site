# Level 5 translation progress (backup branch, not for main)
Order: RED, WHITE, BLUE, GREEN, GOLD, PURPLE, ORANGE, BLACK
Languages: en-GB es-ES fr-FR pt-BR pt-PT it nl de ht (es-419 on hold)
Batches: work/<COLOR>-L5-<loc>/bNN.txt ; zips: out/ ; log: delivered.txt
How to resume (read first):
- Source: tools/show45.sh <C> L5 FROM TO > tmp_src.txt ; per-lesson tags/keys: see grep loop in git log / summary.
- Full translations (it, nl, de, ht, pt-BR): write work/<C>-L5-<loc>/bNN.txt (5 lessons each), PARTIAL=1 tools/check45.sh <C> L5 <loc>, commit+push each batch.
- Derived locales: en-GB = tools/engb.py + engb_notes_<C>.py ; es-ES = es_es.py + es_notes_<C>.py (from es-Caribbean) ;
  fr-FR = fr_fr.py + fr_notes_<C>.py (from fr-CA) ; pt-PT = cp pt-BR dir, pt_notes_<C>.py, then pt_pt.py <C> L5.
  Note scripts are color-specific: write a new one per color by grepping the source locale for local-law clauses.
- Finish each pack: tools/finish.sh <C> L5 <loc> "note" ; then send zip to user. For a new color copy English
  content/curriculum/<C>/L5/*.md into sitecopy/content/curriculum/<C>/L5/ first.
- Next up: RED COMPLETE for all 9 (de, ht delivered). WHITE en-GB DONE. WHITE es-ES DONE (used tools/es_es_paper.py = es_es without renta->alquiler). WHITE fr-FR DONE. WHITE pt-BR DONE. WHITE pt-PT DONE. WHITE it DONE (site PR #1534). WHITE nl DONE (site PR #1535). WHITE de DONE (site PR #1536). WHITE ht DONE (site PR #1537, smoke 19470/19470). BLUE en-GB DONE (PR #1538), es-ES DONE (PR #1539), fr-FR DONE (PR #1540). BLUE pt-BR DONE (PR #1541). BLUE pt-PT DONE (PR #1542). Then BLUE pt-PT, it, nl, de; then BLUE ht. Publish with tools/sitepr.sh C LOC "Name" then tools/sitemerge.sh PR SHA, then dispatch smoke. Tip: translate it/nl/de/ht from the pt-BR batches (faithful to English) and swap Brazil notes for local ones; keep plain OPINION counts equal to English (checker does not test them; run the opinion check in git log).
Status:
- RED-L5 en-GB DONE 2026-11-20
- RED-L5 es-ES DONE 2026-11-20
- RED-L5 fr-FR DONE 2026-11-20
- RED-L5 pt-BR DONE 2026-11-20
- RED-L5 pt-PT DONE 2026-11-20
- RED-L5 it DONE 2026-11-20
- RED-L5 nl DONE 2026-11-20
- RED-L5 de DONE 2026-11-20
- RED-L5 ht DONE 2026-11-20
- WHITE-L5 en-GB DONE 2026-11-20
- WHITE-L5 es-ES DONE 2026-11-20
- WHITE-L5 fr-FR DONE 2026-11-20
- WHITE-L5 pt-BR DONE 2026-11-21
- 2026-11-21 WHITE pt-BR DONE + delivered (out/WHITE-L5-001-050-pt-BR.zip). Old 11/17 task trig_01K5pppd69eyH6Yu6Dz6xhXb DISABLED at owner request ("fix the problems"); only trig_01RgAtQi54xTMr5ByLHGvac3 fires Sun 11/22 14:05Z.
- WHITE pt-PT PLAN: cp -r work/WHITE-L5-pt-BR work/WHITE-L5-pt-PT; write tools/pt_notes_WHITE.py (same format as pt_notes_RED.py) swapping every "no Brasil..." note (find them: grep -o "[^.;:]*Brasil[^;]*" work/WHITE-L5-pt-PT/b*.txt ; ~63 hits, also summaries in b03,b05,b06,b09 and key takeaways) for hedged Portugal notes; then python3 tools/pt_pt.py WHITE L5; grep Brasil must be 0; check45; finish.sh.
  Portugal facts to use (hedge + "confirme com um contabilista"): capital income/mais-valias taxa liberatória/autónoma 28% (englobamento opcional; obrigatório p/ mais-valias de títulos detidos <365 dias se rendimento no último escalão); menos-valias reportáveis 5 anos se englobar; no monthly exemption; dividendos 28% (ou englobamento a 50%); PPR (dedução à coleta 20% c/ limites por idade, regras de resgate); seguros de capitalização/PPR taxa reduzida após 5/8 anos; Certificados de Aforro/Tesouro (IGCP); Fundo de Garantia de Depósitos até 100 000 EUR por depositante/instituição; Sistema de Indemnização aos Investidores até 25 000 EUR; regulador CMVM (consultores autónomos registados; MiFID II adequação); acordo PT-EUA para evitar dupla tributação existe (dividendos em regra 15%); cripto: mais-valias 28% se detidas <365 dias, isentas se >=365 dias (desde 2023), regime MiCA; herança: Imposto do Selo 10%, isentos cônjuge/descendentes/ascendentes; sem trusts (exceto Zona Franca da Madeira); stock options = rendimento categoria A; sem estatuto de trader; sem obrigações municipais relevantes p/ particulares; ETFs/fundos: tributação na distribuição/resgate a 28%, sem come-cotas; PSI concentrado em poucos setores (energia, banca, retalho).
- WHITE-L5 pt-PT DONE 2026-11-21
- 2026-11-21 PM: RED L5 (9 locales) + WHITE L5 (en-GB, es-ES, fr-FR, pt-BR, pt-PT) LIVE via PR #1527 (merged). Owner rule: no more zips; load packs into the site via Git PR -> checks -> squash merge -> live smoke (workflow 369202259, dispatch on main; must show all lessons match).
  Incident: after #1527, catalog API 12s/502s. Root cause = committed-translation-fallback parsed the whole runtime manifest; fixed in #1532 (merged). Also #1528 slimmed /courses payload. Revert #1530 closed unmerged; temporary removal ledger entries removed (#1533). Live smoke 19270/19270 PASS.
  Admin stalled uploads (15 zips, 11/21): leave untouched; do NOT run recovery.
- WHITE-L5 it DONE 2026-11-21
- WHITE-L5 nl DONE 2026-11-21
- WHITE count targets (RSR/OPN, others 0): 003 O2, 004 O1, 005 R4 O1, 006 O2, 007 O1, 011 O1, 012 R3, 013 R2 O1, 014 O1, 015 R2, 016 O2, 017 R2, 018 O2, 019 R2 O1, 020 O1, 021 O2, 023 R3, 024 R2, 025 R1, 026 O1, 031 O1, 033 O2, 034 R3, 035 R2, 038 R2, 041 O1, 044 O1, 046 O1. de tags: ANNAHME/MEINUNG, GEPRÜFTE TATSACHE, BEISPIEL ZUR VERANSCHAULICHUNG, LÄNDERSPEZIFISCHE REGEL, MEINUNG.
- WHITE-L5 de DONE 2026-11-22
- WHITE-L5 ht DONE 2026-11-22
- BLUE-L5 en-GB DONE 2026-11-22
- BLUE-L5 es-ES DONE 2026-11-22
- BLUE-L5 fr-FR DONE 2026-11-22
- BLUE count targets (R=REGION-SPECIFIC RULE count, O=OPINION count excl. opening ASSUMPTION/OPINION; others 0): 003 R2, 004 R3, 005 R2, 008 O1, 009 O1, 011 O1, 013 O1, 014 O1, 015 R2, 017 R4, 019 R2, 020 O1, 021 O1, 024 R2, 025 R1, 026 O1, 028 R2, 034 R2, 035 R2, 037 R1, 041 R3, 044 O1, 046 O1
- 2026-11-22 OWNER RULE: Haitian (ht) must exist for EVERY color at EVERY level (L1-L5). Decision: keep ht, delete nothing. Plan: (1) finish L5 all colors x 9 langs incl. ht; (2) then backfill ht for L1, L2, L4 (all 8 colors) and L3 (BLUE GREEN GOLD PURPLE ORANGE BLACK). 1,800 ht lessons to do. L1-L4 formats differ: use tools/check1.sh / check3.sh / show1.sh / show3.sh; inspect an existing L3 ht pack (RED/WHITE) for format first.
- BLUE-L5 pt-BR DONE 2026-11-22
- BLUE-L5 pt-PT DONE 2026-11-22
