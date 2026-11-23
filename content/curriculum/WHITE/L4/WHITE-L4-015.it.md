---
id: WHITE-L4-015
track: WHITE
officialTrackName: "Paper Assets"
level: 4
lessonNumber: 15
title: "Analisi delle opzioni put: perché le put funzionano come un'assicurazione"
summary: "Comprendi come un'opzione put funziona in modo simile a una polizza assicurativa, proteggendo il valore di un portafoglio dal rischio di ribasso a fronte del costo definito di un premio."
version: "1.0"
author: "Edunancial Faculty"
date: "2026-10-11"
locale: "it"
source_locale: "en-US"
---
# WHITE-L4-015: Analisi delle opzioni put: perché le put funzionano come un'assicurazione

## Scenario di apertura
IPOTESI/OPINIONE (scenario ipotetico solo a scopo didattico): Immagina un'istituzione finanziaria di importanza sistemica che rivela all'improvviso una grande perdita, mai dichiarata prima, alimentando il timore che il rischio di controparte si propaghi a tutto il sistema bancario. Mentre i timori sul rischio di controparte si diffondono sui mercati finanziari, alcuni investitori vogliono proteggere le azioni che già possiedono da un ulteriore calo senza doverle vendere. Questa lezione spiega lo strumento costruito proprio per questo tipo di protezione.

## Obiettivi di apprendimento
- Spiegare la struttura di base di un'opzione put.
- Spiegare il parallelo tra un'opzione put e una polizza assicurativa.
- Spiegare come funziona una strategia di put protettiva per coprire una posizione azionaria esistente.
- Individuare il compromesso di costo legato all'uso delle put per proteggere un portafoglio.

## Contenuto principale
Un'opzione put dà al suo acquirente il diritto, ma non l'obbligo, di vendere un numero specificato di azioni a un prezzo di esercizio prestabilito entro la scadenza, in cambio di un premio pagato in anticipo. FATTO VERIFICATO: è l'immagine speculare della struttura dell'opzione call vista nella Lezione 14: mentre una call dà il diritto di comprare, una put dà il diritto di vendere, e il valore di un'opzione put di solito aumenta quando il prezzo dell'azione sottostante scende.

Ecco il "perché" un'opzione put funziona in modo simile a una polizza assicurativa: proprio come il proprietario di una casa paga un premio assicurativo per avere diritto a un indennizzo se la casa subisce danni, un investitore che possiede azioni può pagare il premio di un'opzione per avere il diritto di vendere quelle azioni a un prezzo di esercizio garantito, proteggendosi da un calo al di sotto di quel livello, come potrebbe accadere durante un periodo di stress del sistema finanziario come quello descritto nello scenario qui sopra. Se l'azione non scende, la put scade senza valore, proprio come una polizza assicurativa "spreca" il suo premio se non si presenta mai una richiesta di indennizzo; ma l'investitore è stato protetto per tutto il periodo in cui l'assicurazione (o la put) era in vigore.

Ecco perché una strategia di "put protettiva", cioè l'acquisto di un'opzione put su un'azione che l'investitore possiede già, è una tecnica di copertura comune: permette all'investitore di mantenere la proprietà dell'azione (partecipando a ogni ulteriore rialzo) limitando al tempo stesso il rischio di ribasso a un importo noto e definito (la differenza tra il prezzo attuale e il prezzo di esercizio, più il premio pagato), in modo simile a come l'assicurazione sulla casa limita la perdita massima a una franchigia mentre il proprietario conserva la piena proprietà della casa. Il compromesso, come per qualsiasi assicurazione, è il costo ricorrente del premio, che riduce il rendimento complessivo del portafoglio se alla fine la protezione non viene usata.

## Esempio pratico
ESEMPIO ILLUSTRATIVO: Un investitore possiede 100 azioni di un titolo attualmente scambiato a 80 dollari e, preoccupato per un possibile ulteriore calo in un contesto di stress del sistema finanziario, compra un'opzione put con un prezzo di esercizio di 75 dollari pagando un premio di 3 dollari per azione (300 dollari in totale). Se l'azione scende a 50 dollari, l'investitore può esercitare la put e vendere le sue azioni a 75 dollari invece che al prezzo di mercato molto più basso, limitando la perdita a 5 dollari per azione più il premio di 3 dollari, invece dell'intero calo di 30 dollari per azione che avrebbe subito senza protezione. Se invece l'azione sale a 95 dollari, la put scade senza valore e costa all'investitore il premio di 300 dollari, ma l'investitore partecipa comunque pienamente al guadagno dell'azione fino a 95 dollari.

## Quiz di esercitazione
**D1. Quale diritto dà un'opzione put al suo acquirente?**
A) Il diritto di comprare azioni a un prezzo prestabilito
B) Il diritto, ma non l'obbligo, di vendere azioni a un prezzo di esercizio prestabilito
C) Pagamenti di dividendi garantiti dall'azienda sottostante
D) L'obbligo di acquistare azioni aggiuntive

**D2. In che modo un'opzione put è simile a una polizza assicurativa?**
A) Entrambe garantiscono un profitto indipendentemente dalle condizioni di mercato
B) Entrambe comportano il pagamento di un premio per proteggersi da un esito sfavorevole, protezione che può restare inutilizzata se l'evento sfavorevole non si verifica
C) Le opzioni put e le polizze assicurative non hanno alcuna somiglianza significativa
D) Anche le polizze assicurative danno al titolare il diritto di vendere azioni

**D3. In che cosa consiste una strategia di "put protettiva"?**
A) Vendere subito tutte le azioni possedute per evitare qualsiasi rischio
B) Comprare un'opzione put su un'azione che l'investitore possiede già, per limitare il rischio di ribasso mantenendo il potenziale di rialzo
C) Comprare un'opzione call invece di possedere azioni
D) Prendere denaro in prestito per comprare altre azioni dello stesso titolo

**D4. Nell'esempio, quale sarebbe stata all'incirca la perdita per azione dell'investitore se l'azione fosse scesa a 50 dollari, tenendo conto della put protettiva?**
A) L'intero calo di 30 dollari per azione
B) Circa 5 dollari per azione più il premio di 3 dollari, perché la put permetteva di vendere al prezzo di esercizio di 75 dollari invece che al prezzo di mercato
C) Nessuna perdita
D) L'investitore sarebbe stato costretto a comprare altre azioni a 50 dollari

**D5. Qual è il principale compromesso nell'uso delle opzioni put per proteggere un portafoglio?**
A) Non c'è alcun compromesso; le put offrono una protezione del tutto gratuita
B) Il costo ricorrente del premio riduce il rendimento complessivo del portafoglio se alla fine la protezione non viene usata, come un'assicurazione per la quale non si chiede mai un indennizzo
C) Le opzioni put eliminano per sempre ogni possibile rischio d'investimento
D) Comprare put richiede di vendere tutte le altre posizioni del portafoglio

## Chiave delle risposte
D1: B
D2: B
D3: B
D4: B
D5: B

## Risposte e spiegazioni
**D1.** Un'opzione put concede specificamente il diritto facoltativo di vendere al prezzo di esercizio, l'immagine speculare del diritto di comprare di un'opzione call.

**D2.** Entrambe le strutture comportano un costo anticipato per una protezione dal ribasso che alla fine può servire oppure no.

**D3.** Questa strategia combina una posizione azionaria esistente con un'opzione put per limitare il rischio di ribasso, preservando la partecipazione a ulteriori guadagni.

**D4.** La put ha limitato la perdita alla differenza tra il prezzo di acquisto e il prezzo di esercizio, più il premio pagato, invece dell'intero calo del mercato.

**D5.** Come per un'assicurazione, il costo continuo del premio pesa davvero sui rendimenti quando alla fine la protezione non serve.

## Punti chiave
- Un'opzione put dà all'acquirente il diritto, ma non l'obbligo, di vendere azioni a un prezzo di esercizio prestabilito.
- Le put funzionano in modo simile a un'assicurazione: si paga un premio per una protezione che può restare inutilizzata se non si verifica alcun calo.
- Una strategia di put protettiva limita il rischio di ribasso su un'azione posseduta, preservando la partecipazione a ulteriori rialzi.
- Il costo ricorrente del premio è il principale compromesso, perché riduce il rendimento complessivo se alla fine la protezione non serve.
