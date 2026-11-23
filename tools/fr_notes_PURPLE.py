import glob,re
A='à confirmer avec un avocat'; F='à confirmer avec un conseiller fiscal'; N='à confirmer avec un notaire'
S=["en France, par exemple, le droit civil est codifié dans le Code civil et l'Alsace-Moselle conserve un droit local sur certains points, "+A,
"en France, par exemple, la LLC n'existe pas et les structures les plus courantes sont la SARL et la SAS, soumises en principe à l'impôt sur les sociétés avec une option temporaire pour l'impôt sur le revenu dans certains cas, "+F,
"en France, par exemple, les conventions entre une société et ses dirigeants ou associés peuvent être des conventions réglementées, et l'administration fiscale peut remettre en cause un acte anormal de gestion entre sociétés liées, "+F,
"en France, par exemple, l'apport d'un immeuble à une société se fait par acte notarié publié au service de la publicité foncière et peut entraîner des droits d'enregistrement et une plus-value imposable, "+N,
"en France, par exemple, lorsque les statuts ou le pacte d'associés sont muets, ce sont les règles du Code de commerce qui s'appliquent et elles peuvent ne pas correspondre à ce que voulaient les associés, "+A,
"en France, par exemple, les capitaux décès d'une assurance vie sont en principe hors succession avec une fiscalité propre, et le rachat des parts d'un associé décédé peut avoir ses propres conséquences fiscales, "+F,
"en France, par exemple, il n'existe pas d'insaisissabilité générale du logement comme le homestead de certains États américains, mais la résidence principale de l'entrepreneur individuel est insaisissable par ses créanciers professionnels, "+A,
"en France, par exemple, les tribunaux ne lèvent le voile social qu'en cas de fictivité ou de confusion des patrimoines, et les dirigeants peuvent répondre de l'insuffisance d'actif en cas de faute de gestion, "+A,
"en France, par exemple, le testament peut être authentique devant notaire ou olographe, la loi réserve une part de la succession aux enfants, et c'est le notaire qui règle la succession sans procédure judiciaire de type probate, "+N,
"en France, par exemple, la fiducie existe dans le Code civil depuis 2007 mais reste très encadrée, et les trusts étrangers sont soumis à des obligations déclaratives et à une fiscalité particulière, "+F,
"en France, par exemple, les copropriétaires d'un bien sont en général en indivision sans droit d'accroissement au profit du survivant, sauf s'ils ont prévu une clause de tontine, "+N,
"en France, par exemple, l'épargne retraite et l'assurance vie sont transmises au bénéficiaire désigné selon des règles fiscales propres qui dépendent du contrat et de l'âge lors des versements, "+F,
"en France, par exemple, la plus-value de cession de titres relève en principe du prélèvement forfaitaire unique ou, sur option, du barème, et la transmission d'une entreprise familiale peut bénéficier d'un pacte Dutreil sous conditions, "+F,
"en France, par exemple, le créancier peut exercer l'action paulienne du Code civil contre les actes faits en fraude de ses droits, et en procédure collective certains actes de la période suspecte peuvent être annulés, "+A,
"en France, par exemple, l'Autorité de contrôle prudentiel et de résolution supervise les assureurs, les intermédiaires doivent être inscrits à l'ORIAS, et un régime spécial couvre les catastrophes naturelles, à confirmer avec un courtier en assurance",
"en France, par exemple, la loi du 6 juillet 1989 oblige le bailleur à remettre un logement décent et à l'entretenir, et l'expulsion d'un locataire exige une décision de justice, "+A,
"en France, par exemple, les sommes placées sur un plan d'épargne retraite sont en principe bloquées jusqu'à la retraite, ce qui peut limiter leur saisie, mais les versements faits pour échapper aux créanciers peuvent être contestés, "+A,
"en France, par exemple, à défaut de contrat de mariage le régime légal est la communauté réduite aux acquêts, et le contrat de mariage est établi chez un notaire avant le mariage, "+N,
"en France, par exemple, le traitement fiscal d'une somme versée au titre d'une garantie d'actif et de passif peut être une réduction du prix ou un produit selon la rédaction de la clause, "+F,
"en France, par exemple, certaines activités exigent une autorisation administrative, l'exportation de biens à double usage nécessite une licence, et certains investissements étrangers sont soumis au contrôle du ministre de l'Économie, "+A,
"en France, par exemple, la plus-value sur la vente d'actions relève en principe du prélèvement forfaitaire unique de 30 % ou, sur option, du barème progressif avec d'éventuels abattements, "+F,
"en France, par exemple, l'hypothèque conventionnelle sur un immeuble est constituée par acte notarié et publiée au service de la publicité foncière, "+N,
"en France, par exemple, l'acheteur signe d'abord une promesse ou un compromis de vente avec un dépôt de garantie, bénéficie d'un délai de rétractation de dix jours pour un logement, puis l'acte authentique est signé devant notaire, "+N,
"en France, par exemple, les aménagements réalisés par le preneur sont en général amortis sur leur durée d'utilisation, et la participation du bailleur à ces travaux peut avoir des effets fiscaux pour les deux parties, "+F,
"en France, par exemple, l'expulsion pour loyers impayés suppose un commandement de payer puis une décision de justice, et la location en meublé de tourisme peut exiger une déclaration ou une autorisation en mairie, "+A,
"en France, par exemple, le crédit d'impôt recherche et un régime de faveur pour certains revenus de la propriété industrielle peuvent réduire l'impôt sur les sociétés, "+F,
"en France, par exemple, la marque peut être déposée à l'INPI ou à l'Office de l'Union européenne pour la propriété intellectuelle, et le titulaire peut déposer une demande d'intervention auprès des douanes contre les contrefaçons, à confirmer avec un conseil en propriété industrielle",
"en France, par exemple, l'agent commercial a droit en principe à une indemnité de fin de contrat selon le Code de commerce, et la rupture brutale d'une relation commerciale établie peut engager la responsabilité de son auteur, "+A,
"en France, par exemple, un prestataire peut être requalifié en salarié s'il existe un lien de subordination, avec des conséquences sociales et fiscales pour l'entreprise, à confirmer avec un avocat en droit du travail",
"en France, par exemple, une clause de non-concurrence d'un salarié n'est valable que si elle est limitée dans le temps et l'espace, justifiée par les intérêts légitimes de l'entreprise et assortie d'une contrepartie financière, à confirmer avec un avocat en droit du travail",
"en France, par exemple, une offre au public de titres exige en général un prospectus approuvé par l'Autorité des marchés financiers, sauf dérogation, "+A,
"en France, par exemple, les plateformes de financement participatif doivent être agréées par l'Autorité des marchés financiers selon le règlement européen sur le financement participatif, "+A,
"en France, par exemple, les pratiques commerciales trompeuses sont interdites par le Code de la consommation et contrôlées notamment par la DGCCRF, "+A,
"en France, par exemple, la prospection commerciale par e-mail exige en principe le consentement préalable du destinataire, et les violations de données personnelles doivent être notifiées à la CNIL dans les 72 heures, "+A,
"en France, par exemple, le règlement européen Rome I permet en général aux parties de choisir la loi applicable à leur contrat, et la France est partie à la Convention de New York sur les sentences arbitrales étrangères, "+A,
"en France, par exemple, l'article 1218 du Code civil définit la force majeure, et depuis 2016 l'article 1195 permet de demander la renégociation d'un contrat en cas de changement imprévisible des circonstances, "+A,
"en France, par exemple, une tentative préalable de règlement amiable est obligatoire avant de saisir le juge pour certains litiges, et le juge peut inviter les parties à une médiation, "+A,
"en France, par exemple, le perdant supporte en général les dépens et peut être condamné à verser une somme au titre des frais d'avocat de l'autre partie selon l'appréciation du juge, "+A,
"en France, par exemple, les sociétés commerciales doivent déposer leurs comptes annuels au greffe du tribunal compétent, et le défaut de dépôt peut entraîner une injonction sous astreinte et des sanctions, à confirmer avec un expert-comptable",
"en France, par exemple, les familles utilisent souvent une société civile ou une holding familiale, les donations bénéficient d'abattements renouvelables, et le pacte Dutreil peut alléger la transmission d'entreprise sous conditions, "+N,
"en France, par exemple, les dons à certains organismes d'intérêt général ouvrent droit à une réduction d'impôt dans certaines limites, "+F,
"en France, par exemple, le délai de prescription de droit commun est de cinq ans selon le Code civil, avec des délais différents pour certaines actions, "+A,
"en France, par exemple, un arrêt de la Cour de cassation, du Conseil d'État, du Conseil constitutionnel ou de la Cour de justice de l'Union européenne peut modifier en cours d'instance l'interprétation d'une règle, à confirmer avec votre avocat",
"en France, par exemple, le juge peut condamner à une amende civile et à des dommages-intérêts la partie qui agit en justice de manière dilatoire ou abusive, "+A]
k=0; P=re.compile(r"(?:au Canada|au Québec), par exemple,[^\n]*?à confirmer avec (?:un|une|la|le|votre) [^.;:)\n]*?(?=[.;:)])")
for f in sorted(glob.glob('work/PURPLE-L5-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1; return r
    s=P.sub(rep,s)
    s=re.sub(r"\bun plus-value\b","une plus-value",s); s=re.sub(r"\bdu plus-value\b","de la plus-value",s); s=re.sub(r"\ble plus-value\b","la plus-value",s); s=re.sub(r"\bce plus-value\b","cette plus-value",s)
    open(f,'w',encoding='utf-8').write(s)
print('replaced',k,'of',len(S))
