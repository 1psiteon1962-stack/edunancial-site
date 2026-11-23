---
id: WHITE-L4-016
track: WHITE
officialTrackName: "Paper Assets"
level: 4
lessonNumber: 16
title: "Straddle-analyse: waarom inzetten op volatiliteit iets anders is dan inzetten op richting"
summary: "Begrijp hoe een straddle met opties een belegger in staat stelt te verdienen aan een grote koersbeweging in beide richtingen, en wat het verschil is tussen inzetten op volatiliteit en inzetten op richting."
version: "1.0"
author: "Edunancial Faculty"
date: "2026-10-11"
locale: "nl"
source_locale: "en-US"
---
# WHITE-L4-016: Straddle-analyse: waarom inzetten op volatiliteit iets anders is dan inzetten op richting

## Openingsscenario
AANNAME/MENING (hypothetisch scenario uitsluitend voor onderwijsdoeleinden): Stel je voor dat de munt van een middelgrote economie in een paar maanden een groot deel van haar waarde verliest ten opzichte van de belangrijkste reservevaluta's, doordat kapitaal het land ontvlucht en het vertrouwen van beleggers afbrokkelt. Terwijl de munt van een middelgrote economie onvoorspelbaar schommelt te midden van kapitaalvlucht, gelooft een belegger die een gerelateerd, valutagevoelig aandeel volgt dat er een grote koersbeweging aankomt, maar hij heeft geen sterke overtuiging over de richting. Deze les introduceert de strategie die juist voor dat soort onzekerheid is gemaakt.

## Leerdoelen
- De structuur van een optiestrategie met een gekochte straddle (long straddle) uitleggen.
- Uitleggen waarom een straddle verdient aan een grote koersbeweging in beide richtingen.
- De omstandigheden herkennen waaronder een straddle waarschijnlijk geld verliest.
- Aan de hand van het straddle-voorbeeld onderscheid maken tussen een richtingsgok en een gok op volatiliteit.

## Kerninhoud
Een long straddle combineert de aankoop van zowel een calloptie als een putoptie op hetzelfde onderliggende aandeel, met dezelfde uitoefenprijs en dezelfde expiratiedatum. GEVERIFIEERD FEIT: omdat de positie zowel een call omvat (die in waarde stijgt als het aandeel stijgt) als een put (die in waarde stijgt als het aandeel daalt), kan een straddle winstgevend worden als het aandeel een grote beweging in een van beide richtingen maakt. Dat onderscheidt de straddle fundamenteel van een eenvoudige richtingsgok, zoals alleen een call kopen (Les 14) of alleen een put (Les 15).

Dit is het "waarom" dit wordt beschreven als een gok op volatiliteit in plaats van op richting: een belegger die niet weet welke kant een valutagevoelig aandeel op zal gaan in de onzekerheid uit het scenario hierboven, maar er wel van overtuigd is dat er hoe dan ook een flinke beweging komt, kan met een straddle positie innemen op die verwachte volatiliteit zonder de richting goed te hoeven raden. De gezamenlijke premie die voor de call en de put wordt betaald, vormt de totale kosten van deze positie, en het aandeel moet ver genoeg in een van beide richtingen bewegen om die gezamenlijke premie te dekken voordat de positie winstgevend wordt.

Daarom verliest een straddle geld als het aandeel relatief vlak blijft, ook als de belegger "gelijk" had dat er onzekerheid was: zowel de call als de put verliezen in de loop van de tijd waarde (een begrip dat tijdsverval heet en in de meer gevorderde lessen over opties verder wordt behandeld) als de verwachte grote beweging niet vóór de expiratie plaatsvindt. Daarom kun je een straddle het best zien als een pure gok op volatiliteit: de belegger gokt erop dat de omvang van de beweging groter zal zijn dan wat de optiemarkt al in de prijzen heeft verwerkt, niet op een bepaalde richting.

## Uitgewerkt voorbeeld
ILLUSTRATIEF VOORBEELD: Een aandeel noteert op $100. Een belegger koopt zowel een call als een put met een uitoefenprijs van $100 en betaalt een gezamenlijke premie van $8 per aandeel ($800 in totaal voor standaardcontracten). Als het aandeel op de expiratiedatum naar $130 is gestegen, is de call $30 waard (ruim meer dan de gezamenlijke kosten van $8), wat een stevige winst oplevert, ook al vervalt de put waardeloos. Als het aandeel daarentegen naar $70 daalt, is de put $30 waard en levert dat een vergelijkbare winst op, ook al vervalt de call waardeloos. Maar als het aandeel op de expiratiedatum gewoon op $102 staat, zijn beide opties heel weinig waard en verliest de belegger het grootste deel of zelfs alles van de gezamenlijke premie van $800. Dat laat zien dat de strategie een grote beweging nodig had, in welke richting dan ook, om te slagen.

## Oefenquiz
**V1. Wat combineert een long straddle?**
A) Twee callopties met verschillende uitoefenprijzen
B) Een calloptie en een putoptie op hetzelfde aandeel, met dezelfde uitoefenprijs en dezelfde expiratie
C) Het verkopen van een calloptie en het kopen van een aandeel
D) Alleen een putoptie, zonder bijbehorende call

**V2. Waarom wordt een straddle beschreven als een gok op volatiliteit in plaats van op richting?**
A) Hij levert alleen winst op als het aandeel stijgt, net als alleen een calloptie
B) Hij kan winstgevend worden door een grote koersbeweging in beide richtingen, omdat hij een call en een put combineert
C) Hij levert alleen winst op als het aandeel volkomen vlak blijft
D) Straddles hebben helemaal niets te maken met koersbewegingen

**V3. Onder welke omstandigheid verliest een long straddle doorgaans geld?**
A) Wanneer het aandeel een heel grote beweging in een van beide richtingen maakt
B) Wanneer het aandeel relatief vlak blijft, omdat de call en de put dan geen van beide genoeg in waarde stijgen om de betaalde gezamenlijke premie te dekken
C) Straddles leveren altijd winst op, ongeacht de beweging van het aandeel
D) Wanneer de belegger de richting van het aandeel juist voorspelt

**V4. Waarom maakte de belegger in het voorbeeld winst toen het aandeel naar $130 steeg, ook al verviel de put waardeloos?**
A) De winst van $30 op de calloptie was ruim groter dan de gezamenlijke premie van $8 die voor beide opties was betaald
B) De putoptie steeg tegelijkertijd ook in waarde
C) De belegger kreeg de premie voor de waardeloze put terug
D) De winst had niets te maken met de waarde van de calloptie

**V5. Waarom verloor de straddle in het voorbeeld geld toen het aandeel op $102 bleef staan?**
A) Een beweging van $2 was ruim voldoende om met een van beide opties winst te maken
B) Door zo'n kleine beweging stegen de call en de put geen van beide genoeg in waarde om de betaalde gezamenlijke premie van $800 te dekken
C) De straddle-strategie verliest altijd geld, ongeacht de beweging van het aandeel
D) De belegger moest beide opties tegelijkertijd uitoefenen

## Antwoordsleutel
V1: B
V2: B
V3: B
V4: A
V5: B

## Antwoorden en uitleg
**V1.** Een straddle combineert specifiek een call en een put met dezelfde uitoefenprijs en expiratie om in te spelen op een grote beweging in een van beide richtingen.

**V2.** Omdat zowel het call- als het putgedeelte de positie laten verdienen aan een grote beweging, ongeacht de richting, richt de straddle zich op de omvang van de beweging in plaats van op de richting.

**V3.** Bij onvoldoende koersbeweging stijgt geen van beide onderdelen van de straddle genoeg in waarde om de totale premie te compenseren die voor beide opties is betaald.

**V4.** De flinke winst op alleen de call was genoeg om de totale kosten van beide opties ruimschoots te compenseren, ook al verviel de put waardeloos.

**V5.** De kleine koersbeweging bleef achter bij wat nodig was om een van beide opties een winst te laten opleveren die groot genoeg was om de totale premiekosten te compenseren.

## Belangrijkste punten
- Een long straddle combineert een call en een put met dezelfde uitoefenprijs en expiratie op hetzelfde onderliggende aandeel.
- Deze structuur kan verdienen aan een grote koersbeweging in beide richtingen en is daarmee een gok op volatiliteit in plaats van op richting.
- Een straddle verliest geld als het aandeel relatief vlak blijft, omdat geen van beide opties genoeg in waarde stijgt om de gezamenlijke premie te dekken.
- Een straddle slaagt wanneer de werkelijke koersbeweging groter is dan wat de markt in de gezamenlijke optieprijzen had verwacht, ongeacht de richting.
