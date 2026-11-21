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
- Next up: RED de DONE (zip delivered). RED ht IN PROGRESS (b01-b06 done; next b07 = lessons 031-035; use tools/show45.sh RED L5 31 35 > tmp_src.txt as source). Started from work/RED-L5-pt-BR/b01 (or nl) as template, Haitian Creole, hedged Haiti notes; then WHITE all 9. Tip: translate it/nl/de/ht from the pt-BR batches (faithful to English) and swap Brazil notes for local ones; keep plain OPINION counts equal to English (checker does not test them; run the opinion check in git log).
Status:
- RED-L5 en-GB DONE 2026-11-20
- RED-L5 es-ES DONE 2026-11-20
- RED-L5 fr-FR DONE 2026-11-20
- RED-L5 pt-BR DONE 2026-11-20
- RED-L5 pt-PT DONE 2026-11-20
- RED-L5 it DONE 2026-11-20
- RED-L5 nl DONE 2026-11-20
- RED-L5 de DONE 2026-11-20
