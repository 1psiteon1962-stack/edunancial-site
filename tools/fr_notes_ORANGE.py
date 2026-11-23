import glob,re
A='à confirmer avec un avocat'; F='à confirmer avec un conseiller fiscal'; EC='à confirmer avec un expert-comptable'; B='à confirmer avec votre banque'; D='à confirmer avec un commissionnaire en douane'
E='en France, par exemple, '
S=[E+"une entreprise doit facturer la TVA sauf si elle relève de la franchise en base, et les ventes à distance à des consommateurs d'autres pays de l'UE au-delà du seuil européen peuvent être déclarées via le guichet unique (OSS), "+EC,
E+"la TVA sur les acomptes reçus pour des prestations de services est en principe exigible à l'encaissement, alors qu'en comptabilité les sommes reçues d'avance sont enregistrées en produits constatés d'avance, "+EC,
E+"les frais de publicité sont en principe déductibles du résultat imposable s'ils sont engagés dans l'intérêt de l'entreprise et justifiés par des factures, "+EC,
E+"le vendeur est tenu de la garantie des vices cachés prévue par le Code civil, il doit fournir un dossier de diagnostic technique, et les agents immobiliers doivent détenir une carte professionnelle au titre de la loi Hoguet, "+A,
E+"une offre au public de titres est encadrée par l'Autorité des marchés financiers et peut exiger un prospectus sauf exemption, et une information fausse ou trompeuse peut engager la responsabilité de l'émetteur, "+A,
E+"l'acheteur d'actifs peut amortir les biens sur leur nouvelle valeur, la cession d'un fonds de commerce supporte des droits d'enregistrement, et le vendeur particulier de titres est en principe soumis au prélèvement forfaitaire unique, "+F,
E+"la plus-value est en principe imposable l'année de la cession même si le prix est payé en plusieurs fois, ce qui peut créer un décalage de trésorerie pour le vendeur, "+F,
E+"les commissions des salariés sont des éléments de salaire soumis aux cotisations sociales et au prélèvement à la source, et les VRP relèvent d'un statut particulier, "+EC,
E+"l'agent commercial a droit en principe à une indemnité de fin de contrat selon le Code de commerce, souvent évaluée par l'usage à deux années de commissions, alors que le distributeur n'y a pas droit automatiquement, "+A,
E+"les règles comptables françaises interdisent en général d'inscrire à l'actif une marque créée en interne, alors qu'une marque acquise y figure, et le dépôt auprès de l'INPI renforce la protection, "+EC,
E+"le Code de la consommation interdit les pratiques commerciales trompeuses, les magasins doivent signaler les baisses de quantité à prix constant, et le prix à l'unité de mesure doit être affiché, "+A,
E+"un déficit fiscal peut en principe être reporté sur les exercices suivants sans limite de durée mais dans la limite d'un plafond annuel, "+F,
E+"le Code de commerce permet au gouvernement de prendre des mesures temporaires contre des hausses excessives de prix en cas de crise ou de situation exceptionnelle, "+A,
E+"les entreprises étrangères qui vendent à des consommateurs en France peuvent devoir déclarer la TVA via le guichet unique, et les informations destinées aux consommateurs doivent être rédigées en français selon la loi Toubon, "+A,
E+"l'euro est la monnaie locale, si bien que le risque de change apparaît lors de ventes ou d'achats dans d'autres devises, et les écarts de change sont pris en compte dans le résultat fiscal, "+EC,
E+"le Code de commerce interdit d'imposer un prix minimal de revente, et l'Autorité de la concurrence peut sanctionner ces pratiques, "+A,
E+"le Code de la consommation impose d'informer le client avant la reconduction tacite d'un contrat et de permettre une résiliation en ligne simple, dite en trois clics, "+A,
E+"l'affacturage est courant et les factors plafonnent souvent la part d'un seul débiteur, tandis que la loi encadre les délais de paiement entre entreprises, "+B,
E+"les frais courants de création de contenu sont en général des charges de l'exercice, alors qu'un site Web ou un logiciel peut devoir être immobilisé et amorti, "+EC,
E+"la loi de 2023 sur les influenceurs impose la mention claire « publicité » ou « collaboration commerciale », et les recommandations de l'ARPP complètent ces règles, "+A,
E+"le RGPD et la loi Informatique et libertés s'appliquent sous le contrôle de la CNIL, et la prospection par courriel auprès des particuliers exige en principe leur consentement préalable, "+A,
E+"le Code de commerce et le droit européen interdisent les ententes entre concurrents qui restreignent la concurrence, sous le contrôle de l'Autorité de la concurrence, "+A,
E+"la loi Doubin oblige le franchiseur à remettre un document d'information précontractuel au moins vingt jours avant la signature du contrat, "+A,
E+"la plus-value de cession de titres d'un particulier est en principe soumise au prélèvement forfaitaire unique, avec des abattements possibles pour le départ à la retraite d'un dirigeant de PME, "+F,
E+"un complément de prix, ou earn-out, est en principe imposé l'année où il est perçu par le vendeur, "+F,
E+"l'or d'investissement est en principe exonéré de TVA, et les professionnels des métaux précieux sont soumis aux obligations de lutte contre le blanchiment et à des limites de paiement en espèces, "+A,
E+"l'affacturage et les financements adossés aux créances sont proposés par les banques et des sociétés spécialisées, et Bpifrance propose une assurance-crédit à l'export, "+B,
E+"la clause de réserve de propriété et le gage sans dépossession permettent de protéger le vendeur, et le gage peut être inscrit sur un registre spécial, "+A,
E+"les achats publics relèvent du Code de la commande publique, les avis sont publiés notamment au BOAMP, et l'État doit en principe payer dans un délai de trente jours, "+A,
E+"la TVA est calculée sur le prix remisé, et la TVA sur les cadeaux d'entreprise n'est récupérable que pour des objets de très faible valeur, "+F,
E+"les ventes à distance à des consommateurs d'autres pays de l'UE au-delà du seuil européen sont imposées dans le pays de destination via le guichet unique, et certaines plateformes deviennent redevables de la TVA, "+F,
E+"aucun texte général ne protège les excuses et un aveu peut servir de preuve, tandis que les professionnels doivent signaler aux autorités les produits dangereux, "+A,
E+"les témoignages rémunérés et les récompenses de parrainage doivent être clairement identifiés, et la DGCCRF contrôle les pratiques trompeuses, "+A,
E+"le règlement européen sur le blocage géographique interdit de traiter différemment les clients d'autres pays de l'UE en raison de leur nationalité ou de leur résidence lors des ventes en ligne, "+A,
E+"l'étiquetage des denrées alimentaires, y compris les allergènes, suit le règlement européen 1169/2011, et la loi Toubon impose l'usage du français sur l'étiquetage, "+A,
E+"en tant que membre de l'union douanière de l'UE, la France applique le tarif douanier commun, et les accords commerciaux de l'UE peuvent réduire les droits si les règles d'origine sont respectées, "+D,
E+"la commercialisation de parts d'investissement immobilier collectif, comme les SCPI, est réservée à des sociétés de gestion agréées par l'AMF, et le financement participatif immobilier est encadré, "+A,
E+"le Code de la consommation interdit les cases précochées pour des paiements supplémentaires, et la distribution d'assurance comporte un devoir de conseil contrôlé par l'ACPR, "+A,
E+"l'impôt sur les sociétés comporte un taux normal et un taux réduit pour certaines PME, et les frais de publicité sont en principe déductibles, "+EC,
E+"les appareils électriques vendus doivent porter le marquage CE et respecter les normes applicables, et les producteurs doivent participer à la filière de recyclage des déchets électriques, "+A,
E+"les sociétés versent en principe des acomptes trimestriels d'impôt sur les sociétés et les indépendants paient l'impôt sur le revenu par acomptes au titre du prélèvement à la source, "+F,
E+"le Code de commerce interdit les ententes sur les prix, les prix abusivement bas et la revente à perte, sous le contrôle de l'Autorité de la concurrence, "+A]
k=0; P=re.compile(r"(?:au Canada|au Québec), par exemple,[^\n]*?à confirmer avec (?:un|une|la|le|votre) [^.;:)\n]*?(?=[.;:)])")
for f in sorted(glob.glob('work/ORANGE-L5-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1; return r
    s=P.sub(rep,s)
    s=re.sub(r"\bun plus-value\b","une plus-value",s); s=re.sub(r"\bdu plus-value\b","de la plus-value",s); s=re.sub(r"\ble plus-value\b","la plus-value",s); s=re.sub(r"\bce plus-value\b","cette plus-value",s)
    open(f,'w',encoding='utf-8').write(s)
print('replaced',k,'of',len(S))
