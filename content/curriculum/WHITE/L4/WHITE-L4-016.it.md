---
id: WHITE-L4-016
track: WHITE
officialTrackName: "Paper Assets"
level: 4
lessonNumber: 16
title: "Analisi dello straddle: perché scommettere sulla volatilità è diverso dallo scommettere sulla direzione"
summary: "Comprendi come uno straddle con opzioni permette a un investitore di guadagnare da un forte movimento del prezzo in entrambe le direzioni, distinguendo le scommesse sulla volatilità da quelle sulla direzione."
version: "1.0"
author: "Edunancial Faculty"
date: "2026-10-11"
locale: "it"
source_locale: "en-US"
---
# WHITE-L4-016: Analisi dello straddle: perché scommettere sulla volatilità è diverso dallo scommettere sulla direzione

## Scenario di apertura
IPOTESI/OPINIONE (scenario ipotetico solo a scopo didattico): Immagina la valuta di un'economia di medie dimensioni che perde in pochi mesi una parte consistente del suo valore rispetto alle principali valute di riserva, a causa della fuga di capitali dal Paese e del calo della fiducia degli investitori. Mentre la valuta di un'economia di medie dimensioni oscilla in modo imprevedibile in un contesto di fuga di capitali, un investitore che segue un'azione collegata ed esposta a quella valuta crede che stia per arrivare un forte movimento del prezzo, ma non ha una convinzione precisa sulla direzione. Questa lezione presenta la strategia costruita proprio per questo tipo di incertezza.

## Obiettivi di apprendimento
- Spiegare la struttura di una strategia in opzioni di long straddle.
- Spiegare perché uno straddle guadagna da un forte movimento del prezzo in entrambe le direzioni.
- Individuare le condizioni in cui uno straddle ha probabilità di perdere denaro.
- Distinguere una scommessa direzionale da una scommessa sulla volatilità usando l'esempio dello straddle.

## Contenuto principale
Un long straddle consiste nell'acquistare sia un'opzione call sia un'opzione put sulla stessa azione sottostante, con lo stesso prezzo di esercizio e la stessa data di scadenza. FATTO VERIFICATO: poiché la posizione comprende sia una call (che guadagna valore quando l'azione sale) sia una put (che guadagna valore quando l'azione scende), uno straddle può diventare redditizio se l'azione compie un forte movimento in una qualsiasi delle due direzioni, e questo lo distingue fondamentalmente da una semplice scommessa direzionale, come l'acquisto di una sola call (Lezione 14) o di una sola put (Lezione 15).

Ecco il "perché" lo straddle viene descritto come una scommessa sulla volatilità e non sulla direzione: un investitore incerto su come si muoverà un'azione esposta alla valuta nell'incertezza dello scenario qui sopra, ma convinto che arriverà comunque un movimento significativo in un senso o nell'altro, può usare uno straddle per posizionarsi su quella volatilità attesa senza dover indovinare la direzione. Il premio complessivo pagato per la call e per la put rappresenta il costo totale di questa posizione, e l'azione deve muoversi abbastanza in una delle due direzioni da coprire quel costo complessivo prima che la posizione diventi redditizia.

Ecco perché uno straddle perde denaro se l'azione resta relativamente ferma, anche se l'investitore aveva "ragione" sull'esistenza dell'incertezza: sia la call sia la put perdono valore col passare del tempo (un concetto chiamato decadimento temporale, approfondito nelle lezioni più avanzate sulle opzioni) se il forte movimento atteso non si concretizza prima della scadenza. Ecco perché uno straddle va inteso come una pura scommessa sulla volatilità: l'investitore scommette che l'ampiezza del movimento supererà quella già incorporata nei prezzi dal mercato delle opzioni, non su una particolare direzione.

## Esempio pratico
ESEMPIO ILLUSTRATIVO: Un'azione è scambiata a 100 dollari. Un investitore compra sia una call sia una put con prezzo di esercizio di 100 dollari, pagando un premio complessivo di 8 dollari per azione (800 dollari in totale per contratti standard). Se alla scadenza l'azione è salita a 130 dollari, la call vale 30 dollari (molto più del costo complessivo di 8 dollari) e produce un buon profitto, nonostante la put scada senza valore. Se invece l'azione scende a 70 dollari, la put vale 30 dollari e produce un profitto simile, nonostante la call scada senza valore. Ma se alla scadenza l'azione si trova semplicemente a 102 dollari, entrambe le opzioni valgono pochissimo e l'investitore perde gran parte o tutto il premio complessivo di 800 dollari: questo mostra che la strategia aveva bisogno di un forte movimento, in una qualsiasi direzione, per avere successo.

## Quiz di esercitazione
**D1. Che cosa combina un long straddle?**
A) Due opzioni call con prezzi di esercizio diversi
B) Un'opzione call e un'opzione put sulla stessa azione, con lo stesso prezzo di esercizio e la stessa scadenza
C) La vendita di un'opzione call e l'acquisto di un'azione
D) Solo un'opzione put, senza alcuna call

**D2. Perché uno straddle viene descritto come una scommessa sulla volatilità e non sulla direzione?**
A) Guadagna solo se l'azione sale, proprio come una sola opzione call
B) Può diventare redditizio con un forte movimento del prezzo in entrambe le direzioni, perché combina una call e una put
C) Guadagna solo se l'azione resta perfettamente ferma
D) Gli straddle non hanno alcun rapporto con il movimento del prezzo

**D3. In quale condizione un long straddle di solito perde denaro?**
A) Quando l'azione compie un movimento molto forte in una qualsiasi direzione
B) Quando l'azione resta relativamente ferma, perché né la call né la put guadagnano abbastanza valore da coprire il premio complessivo pagato
C) Gli straddle guadagnano sempre, indipendentemente dal movimento dell'azione
D) Quando l'investitore prevede correttamente la direzione dell'azione

**D4. Nell'esempio, perché l'investitore ha guadagnato quando l'azione è salita a 130 dollari, nonostante la put sia scaduta senza valore?**
A) Il guadagno di 30 dollari dell'opzione call ha superato di molto il premio complessivo di 8 dollari pagato per entrambe le opzioni
B) Anche l'opzione put è aumentata di valore nello stesso momento
C) All'investitore è stato rimborsato il premio della put senza valore
D) Il profitto non aveva alcun rapporto con il valore dell'opzione call

**D5. Perché lo straddle dell'esempio ha perso denaro quando l'azione si è fermata a 102 dollari?**
A) Un movimento di 2 dollari era più che sufficiente per guadagnare con una delle due opzioni
B) Né la call né la put hanno guadagnato abbastanza valore da un movimento così piccolo da coprire il premio complessivo di 800 dollari pagato
C) La strategia dello straddle perde sempre denaro, indipendentemente dal movimento dell'azione
D) L'investitore era obbligato a esercitare entrambe le opzioni contemporaneamente

## Chiave delle risposte
D1: B
D2: B
D3: B
D4: A
D5: B

## Risposte e spiegazioni
**D1.** Uno straddle abbina specificamente una call e una put con lo stesso prezzo di esercizio e la stessa scadenza per posizionarsi su un forte movimento in una qualsiasi direzione.

**D2.** Poiché sia la componente call sia la componente put permettono alla posizione di guadagnare da un forte movimento indipendentemente dalla direzione, lo straddle punta sull'ampiezza del movimento e non sulla direzione.

**D3.** Un movimento del prezzo insufficiente significa che nessuna delle due gambe dello straddle guadagna abbastanza valore da compensare il premio totale pagato per entrambe le opzioni.

**D4.** Il forte guadagno della sola call è bastato a compensare ampiamente il costo totale di entrambe le opzioni, anche con la put scaduta senza valore.

**D5.** Il piccolo movimento del prezzo è rimasto al di sotto di quanto serviva perché una delle due opzioni generasse un guadagno sufficiente a compensare il costo totale dei premi.

## Punti chiave
- Un long straddle combina una call e una put con lo stesso prezzo di esercizio e la stessa scadenza sulla stessa azione sottostante.
- Questa struttura può guadagnare da un forte movimento del prezzo in entrambe le direzioni, ed è quindi una scommessa sulla volatilità e non sulla direzione.
- Uno straddle perde denaro se l'azione resta relativamente ferma, perché nessuna delle due opzioni guadagna abbastanza valore da coprire il premio complessivo.
- Uno straddle ha successo quando il movimento effettivo del prezzo supera quello che il mercato aveva previsto nei prezzi combinati delle opzioni, indipendentemente dalla direzione.
