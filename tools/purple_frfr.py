#!/usr/bin/env python3
"""France adaptations for PURPLE L1 fr-FR (run after fr_fr.py)."""
import re,glob
P=[ # (regex, replacement) for Canada/Quebec parentheticals
(r'\(Au Canada, la common law s’applique[^)]*\)', '(En France, le droit est surtout codifié, selon la tradition civiliste, mais la jurisprudence des tribunaux joue aussi un rôle important dans l’interprétation des textes.)'),
(r'\(Au Québec, le droit civil analyse plutôt[^)]*\)', '(En droit français, le Code civil exige notamment le consentement des parties, leur capacité de contracter et un contenu licite et certain; la logique de base reste semblable, mais les détails relèvent d’un professionnel.)'),
(r'\(Au Canada, les règles de forme et de preuve[^)]*\)', '(En France, le Code civil exige notamment une preuve écrite au-delà d’un certain montant, et la vente immobilière passe par un acte notarié. Vérifiez auprès d’un professionnel.)'),
(r'\(Au Canada, ces mêmes normes[^)]*\)', '(En France, la logique diffère : le juge pénal statue selon son « intime conviction », et la preuve en matière civile obéit à des règles propres. Vérifiez auprès d’un professionnel.)'),
(r'\(ou, au Québec, selon le cas, un notaire\)', '(ou, en France, selon le cas, un notaire)'),
(r'\(souvent sans aucune formalité officielle, même si certaines inscriptions peuvent être exigées selon la province\)', '(avec peu de formalités, même si une immatriculation est généralement exigée; en France, depuis 2022, le statut d’entrepreneur individuel prévoit en principe une séparation entre patrimoine professionnel et patrimoine personnel, avec des exceptions importantes — vérifiez auprès d’un professionnel)'),
(r'\(La LLC est une structure surtout américaine; au Canada, c’est souvent la société par actions qui joue un rôle comparable\.\)', '(La LLC est une structure surtout américaine; en France, ce sont souvent la SARL ou la SAS qui jouent un rôle comparable.)'),
(r'dans certains pays comme le Canada, varient', 'selon les pays, varient'),
(r'\(Les règles précises varient selon le territoire; au Canada, elles relèvent[^)]*\)', '(En France, les associés d’une SNC sont indéfiniment et solidairement responsables des dettes sociales; les règles précises relèvent du Code de commerce. Vérifiez auprès d’un professionnel.)'),
(r'\(Au Canada, ces protections relèvent surtout[^)]*\)', '(En France, ces protections relèvent surtout du Code du travail; vérifiez les règles applicables auprès d’un professionnel.)'),
(r'\(Au Canada, les règles varient selon la province; l’Ontario[^)]*\)', '(En France, une clause de non-concurrence dans un contrat de travail n’est généralement valable que si elle est limitée dans le temps et dans l’espace, justifiée par l’intérêt de l’entreprise et assortie d’une contrepartie financière. Vérifiez auprès d’un professionnel.)'),
(r'\(Au Canada, les enregistrements de marques et de brevets[^)]*\)', '(En France, les marques et les brevets se déposent auprès de l’Institut national de la propriété industrielle, l’INPI.)'),
(r'\(Au Québec, le Code civil décrit la propriété[^)]*\)', '(En France, le Code civil définit la propriété comme le droit de jouir et de disposer des choses de la manière la plus absolue, dans les limites fixées par la loi; la logique est semblable.)'),
(r'\(Ces types d’actes sont surtout américains; au Canada[^)]*\)', '(Ces types d’actes sont surtout américains; en France, la vente immobilière est constatée par un acte authentique reçu par un notaire, puis publiée au service de la publicité foncière. Vérifiez auprès d’un professionnel.)'),
(r'\(Au Canada, l’assurance titres est offerte[^)]*\)', '(En France, l’assurance titres est peu répandue : la vérification du titre repose surtout sur le notaire, dont la responsabilité professionnelle peut être engagée.)'),
(r'; au Québec, on parle d’hypothèque légale de la construction\)', ')'),
(r'\(Au Canada, ces règles relèvent des provinces; au Québec[^)]*\)', '(En France, ces règles relèvent notamment de la loi du 6 juillet 1989 sur les baux d’habitation, et le dépôt de garantie est strictement encadré. Vérifiez les règles locales auprès d’un professionnel.)'),
(r'\(Les pratiques varient selon la province; au Québec, par exemple, un dépôt[^)]*\)', '(Les pratiques varient selon le pays; en France, par exemple, l’acheteur verse souvent un dépôt de garantie à la signature de l’avant-contrat et bénéficie d’un délai légal de rétractation. Vérifiez auprès d’un professionnel.)'),
(r'\(au Québec, c’est le notaire qui reçoit l’acte de vente\)', '(en France, c’est le notaire qui reçoit l’acte de vente)'),
(r'\(Au Canada, les recours varient selon la province[^)]*\)', '(En France, la saisie immobilière est une procédure judiciaire encadrée par le Code des procédures civiles d’exécution. Vérifiez auprès d’un professionnel.)'),
(r'\(Au Canada, cette réglementation relève des autorités[^)]*\)', '(En France, cette réglementation relève notamment de l’Autorité des marchés financiers, l’AMF.)'),
(r'\(Au Canada, cette notion existe aussi[^)]*\)', '(En Europe, des notions comparables existent, comme celle d’« investisseur qualifié » ou de client professionnel; vérifiez les critères en vigueur auprès des autorités ou d’un professionnel.)'),
(r'\(Au Canada, ces règles relèvent des lois provinciales sur les valeurs mobilières[^)]*\)', '(En France, ces règles relèvent notamment du règlement européen sur les abus de marché, appliqué par l’Autorité des marchés financiers, l’AMF.)'),
(r'\(Au Canada, les obligations des conseillers[^)]*\)', '(En France et dans l’Union européenne, les obligations des conseillers dépendent de leur statut et de la réglementation applicable; renseignez-vous directement auprès du conseiller et des autorités.)'),
(r'\(Au Québec, la fiducie est régie par le Code civil[^)]*\)', '(En France, la fiducie existe dans le Code civil depuis 2007, mais son usage est encadré et moins courant que celui des trusts des pays de common law.)'),
(r'\(Les règles varient selon la province; au Québec, par exemple, le mandat de protection[^)]*\)', '(En France, le mandat de protection future permet d’anticiper une éventuelle inaptitude; ses conditions de mise en œuvre sont encadrées. Vérifiez auprès d’un professionnel.)'),
(r'\(Au Canada, les délais relèvent principalement[^)]*\)', '(En France, le délai de prescription de droit commun en matière civile est en principe de cinq ans, avec de nombreuses exceptions; vérifiez auprès d’un professionnel.)'),
(r'\(au Canada, chaque province a son barreau[^)]*\)', '(en France, les barreaux locaux et le Conseil national des barreaux peuvent orienter vers des avocats; certaines questions relèvent aussi d’un notaire)'),
(r'\(Au Canada, les règles sur les honoraires conditionnels[^)]*\)', '(En France, les honoraires fixés uniquement en fonction du résultat sont interdits; un honoraire de résultat n’est permis qu’en complément d’un honoraire de base.)'),
(r'\(Au Québec, par exemple, les parties ne peuvent généralement pas[^)]*\)', '(En France, il n’existe pas de « cour des petites créances » à proprement parler, mais les litiges de faible montant peuvent être portés devant le tribunal judiciaire, souvent sans obligation d’être représenté par un avocat; vérifiez les seuils en vigueur.)'),
]
R=[ # vocabulary
('Un propriétaire d’entreprise dans une province suppose','Un propriétaire d’entreprise dans un pays suppose'),('des règles d’une autre province','des règles d’un autre pays'),('les règles d’une autre province','les règles d’un autre pays'),
('d’une province, d’une ville ou d’un pays à l’autre','d’une région, d’une ville ou d’un pays à l’autre'),
('(SENC, en anglais *general partnership*)','(SNC, en anglais *general partnership*)'),
('Lever le voile corporatif','Lever le voile de la personnalité morale'),('lever le voile corporatif','lever le voile de la personnalité morale'),('voile corporatif','voile de la personnalité morale'),
('marques de commerce','marques'),('marque de commerce','marque'),('Marques de commerce','Marques'),
('pour des taxe foncière impayés','pour une taxe foncière impayée'),
('travailleurs autonomes','travailleurs indépendants'),('travailleur autonome','travailleur indépendant'),
('courtiers immobiliers','agents immobiliers'),('courtier immobilier','agent immobilier'),
('une entreprise de services-conseils','une entreprise de conseil'),('les services-conseils continus','le conseil continu'),
('consultante pigiste','consultante indépendante'),
('droit criminel','droit pénal'),('Droit criminel','Droit pénal'),('affaires criminelles','affaires pénales'),('affaire criminelle','affaire pénale'),('civile ou criminelle','civile ou pénale'),
('responsabilité criminelle','responsabilité pénale'),('poursuites criminelles','poursuites pénales'),('exposition criminelle','exposition pénale'),('risques criminels','risques pénaux'),
('en matière criminelle','en matière pénale'),('tribunal criminel','tribunal pénal'),('Droit civil ou droit criminel','Droit civil ou droit pénal'),
('(en anglais *tort*; au Québec, on parle de responsabilité civile extracontractuelle)','(en anglais *tort*; en France, on parle de responsabilité civile extracontractuelle, ou délictuelle)'),('D’affaire uniquement criminelle','D’affaire uniquement pénale'),('surtout civile, et non criminelle.','surtout civile, et non pénale.'),('Version française (fr-CA)','Version française (fr-FR)'),
]
for f in sorted(glob.glob('work/PURPLE-L1-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    for a,b in P:
        s,n=re.subn(a,b,s)
    for a,b in R: s=s.replace(a,b)
    open(f,'w',encoding='utf-8').write(s)
left=[]
for f in sorted(glob.glob('work/PURPLE-L1-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    for w in ['Canada','Québec','province','crimin','SENC','corporatif','marque de commerce','autonome','courtier','pigiste','services-conseils','taxe foncière impayés','fr-CA']:
        for m in re.finditer(w,s): left.append((f[-7:],s[max(0,m.start()-50):m.end()+30].replace('\n',' ')))
for x in left: print(x)
