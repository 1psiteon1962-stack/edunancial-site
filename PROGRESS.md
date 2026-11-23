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
- Next up: RED COMPLETE for all 9 (de, ht delivered). WHITE en-GB DONE. WHITE es-ES DONE (used tools/es_es_paper.py = es_es without renta->alquiler). WHITE fr-FR DONE. WHITE pt-BR DONE. WHITE pt-PT DONE. WHITE it DONE (site PR #1534). WHITE nl DONE (site PR #1535). WHITE de DONE (site PR #1536). WHITE ht DONE (site PR #1537, smoke 19470/19470). BLUE en-GB DONE (PR #1538), es-ES DONE (PR #1539), fr-FR DONE (PR #1540). BLUE pt-BR DONE (PR #1541). BLUE pt-PT DONE (PR #1542). BLUE it DONE (PR #1543). BLUE nl DONE (PR #1544). BLUE de DONE (PR #1545). BLUE ht DONE (PR #1546). BLUE COMPLETE for all 9. GREEN en-GB DONE (PR #1547). GREEN es-ES DONE (PR #1548). GREEN fr-FR DONE (PR #1549). GREEN pt-BR DONE (PR #1550). GREEN pt-PT DONE (PR #1551). GREEN it DONE (PR #1552). GREEN nl DONE (PR #1553). GREEN de DONE (PR #1554). GREEN ht DONE (PR #1557). GREEN COMPLETE for all 9. NEXT: GOLD L5 (es-Caribbean + fr-CA already on main; derive en-GB, es-ES, fr-FR; full pt-BR->pt-PT, it, nl, de, ht). Then BLUE de, ht. Publish with tools/sitepr.sh C LOC "Name" then tools/sitemerge.sh PR SHA, then dispatch smoke. Tip: translate it/nl/de/ht from the pt-BR batches (faithful to English) and swap Brazil notes for local ones; keep plain OPINION counts equal to English (checker does not test them; run the opinion check in git log). GOLD es-ES DONE (PR #1558), fr-FR DONE (PR #1559), en-GB DONE (PR #1560). GOLD pt-BR b01-b05 committed; GOLD pt-BR DONE (PR #1561), pt-PT DONE (PR #1562). GOLD it DONE (PR #1563). GOLD nl DONE (PR #1564). GOLD de LIVE (PR 1565); GOLD ALL 9 LIVE (ht PR 1566); PURPLE en-GB, es-ES finished; PURPLE fr-FR finished; PURPLE en-GB es-ES fr-FR LIVE (PRs 1567-1569); PURPLE pt-BR LIVE (PR 1570); PURPLE pt-PT LIVE (PR 1571); PURPLE it LIVE (PR 1572); PURPLE nl LIVE (PR 1573); PURPLE de LIVE (PR 1574); PURPLE ht LIVE (PR 1575) - PURPLE COMPLETE all 9; ORANGE en-GB LIVE (PR 1576); ORANGE es-ES LIVE (PR 1577); ORANGE fr-FR LIVE (PR 1578); ORANGE pt-BR LIVE (PR 1579); ORANGE pt-PT LIVE (PR 1580); ORANGE it LIVE (PR 1581); ORANGE nl LIVE (PR 1582); ORANGE de b01 committed; ORANGE de b02 committed; ORANGE de b03 committed; ORANGE de b04 committed; ORANGE de b05 committed; ORANGE de b06 committed; ORANGE de b07 committed; ORANGE de b08 committed; ORANGE de b09 committed; ORANGE de b10 committed; ORANGE de LIVE (PR 1583); ORANGE ht b01 committed; ORANGE ht b02 committed; ORANGE ht b03 committed; ORANGE ht b04 committed; ORANGE ht b05 committed; ORANGE ht b06 committed; ORANGE ht b07 committed; ORANGE ht b08 committed; ORANGE ht LIVE (PR 1584); ORANGE COMPLETE all 9; BLACK en-GB es-ES fr-FR finished (no R tags in BLACK), site PRs chaining; BLACK pt-BR b01-b02 committed (colors in Portuguese: VERMELHO BRANCO AZUL VERDE DOURADO ROXO LARANJA PRETO); BLACK pt-BR b03 committed; BLACK pt-BR b04 committed; BLACK pt-BR b05 committed; BLACK pt-BR b06 committed; BLACK pt-BR b07 committed; BLACK pt-BR b08 committed; NEXT: BLACK pt-BR b09
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
- BLUE-L5 it DONE 2026-11-22
- BLUE-L5 nl DONE 2026-11-22
- BLUE-L5 de DONE 2026-11-22
- BLUE-L5 ht DONE 2026-11-22
- GREEN-L5 en-GB DONE 2026-11-22
- GREEN-L5 es-ES DONE 2026-11-22
- GREEN-L5 fr-FR DONE 2026-11-22
- GREEN-L5 pt-BR DONE 2026-11-22
- GREEN-L5 pt-PT DONE 2026-11-22
- GREEN-L5 it DONE 2026-11-22
- GREEN-L5 nl DONE 2026-11-22
- GREEN-L5 de DONE 2026-11-22
- GREEN-L5 ht DONE 2026-11-22
- GOLD-L5 es-ES DONE 2026-11-22
- GOLD-L5 fr-FR DONE 2026-11-22
- GOLD-L5 en-GB DONE 2026-11-22
- GOLD-L5 pt-BR DONE 2026-11-22
- GOLD-L5 pt-PT DONE 2026-11-22
- GOLD-L5 it DONE 2026-11-22
- GOLD-L5 nl DONE 2026-11-22
- GOLD-L5 de DONE 2026-11-22
- GOLD-L5 ht DONE 2026-11-22
- PURPLE-L5 en-GB DONE 2026-11-22
- PURPLE-L5 es-ES DONE 2026-11-22
- PURPLE-L5 fr-FR DONE 2026-11-22
- PURPLE-L5 pt-BR DONE 2026-11-22
- PURPLE-L5 pt-PT DONE 2026-11-22
- PURPLE-L5 it DONE 2026-11-22
- PURPLE-L5 nl DONE 2026-11-22

## Owner directive (2026-11-22) — after ALL translations finish
- Claude + ChatGPT coordinate the marketing plan (handoff via Google Drive / cut-and-paste); plan includes the marketing bots and multi-platform global presence.
- Weeks 1–6: education only (why people need it, benefits; emotional triggers: fear, anger, feeling cheated, chance to do better, providing for children).
- ~1.5 weeks before launch: start subscription readiness; then keep educating while converting to subscribers.
- "Edunancial is a business. It must succeed financially."
- PURPLE-L5 de DONE 2026-11-22
- PURPLE-L5 ht DONE 2026-11-22
- ORANGE-L5 en-GB DONE 2026-11-22
- ORANGE-L5 es-ES DONE 2026-11-22
- ORANGE English R counts (O0 all): 001:2 002:3 003:1 004:4 005:2 006:1 007:3 008:3 009:4 010:3 011:2 012:1 013:2 014:5 015:1 016:3 017:4 018:1 019:1 020:3 021:2 022:4 023:5 024:1 025:1 026:2 027:4 028:2 029:4 030:6 031:0 032:9 033:7 034:2 035:0 036:1 037:3 038:1 039:0 040:2 041:4 042:1 043:2 044:0 045:3 046:1 047:0 048:0 049:3 050:0
- NOTE: earlier en-GB packs (RED..PURPLE) kept US "colors" (engb.py bug, fixed 11/22 for ORANGE onward). Not changed in live packs (approved-lesson rule); ask owner before backfilling.
- NOTE: bash glob order of work/*/b*.txt is odd in this shell; python sorted() is lesson order. Write note lists in LESSON order.
- ORANGE-L5 fr-FR DONE 2026-11-22
- ORANGE-L5 pt-BR DONE 2026-11-22
- ORANGE-L5 pt-PT DONE 2026-11-22
- ORANGE-L5 it DONE 2026-11-22
- ORANGE-L5 nl DONE 2026-11-22
- ORANGE-L5 de DONE 2026-11-22
- ORANGE-L5 ht DONE 2026-11-22
- BLACK-L5 en-GB DONE 2026-11-22
- BLACK-L5 es-ES DONE 2026-11-22
- BLACK-L5 fr-FR DONE 2026-11-22
