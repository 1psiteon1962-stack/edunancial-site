import re,glob
R=[
(r"Au Canada et au Québec, la LLC n'existe pas","En France, la LLC n'existe pas : on utilise plutôt la SCI (société civile immobilière), en principe transparente fiscalement sauf option pour l'impôt sur les sociétés, ou une société commerciale comme la SARL ou la SAS, soumise à l'impôt sur les sociétés, d'où l'importance de consulter un notaire ou un fiscaliste."),
(r" de plus, l'Agence du revenu du Canada traite",""),
(r"Au Canada et au Québec, il n'existe pas d'équivalent général à l'échange 1031","En France, il n'existe pas d'équivalent à l'échange 1031 : la cession d'un bien locatif par un particulier relève en général du régime des plus-values immobilières des particuliers, avec des abattements pour durée de détention qui conduisent à une exonération d'impôt sur le revenu après 22 ans et de prélèvements sociaux après 30 ans, d'où l'importance de consulter un notaire ou un fiscaliste."),
(r", et il n'existe pas au Canada de programme fédéral équivalent","; il n'existe pas en France de programme équivalent, même si certains dispositifs visent des territoires précis, comme les zones de revitalisation rurale ou le dispositif Denormandie dans l'ancien, d'où l'importance de consulter un fiscaliste avant tout placement."),
(r"au Québec, par exemple, la contestation commence","en France, par exemple, la taxe foncière repose sur la valeur locative cadastrale fixée par l'administration fiscale, et une réclamation contre l'avis d'imposition doit en général être déposée auprès du service des impôts au plus tard le 31 décembre de l'année suivant celle de la mise en recouvrement, avec un recours possible ensuite devant le tribunal administratif."),
(r"au Québec, la valeur inscrite au rôle","en France, la valeur locative cadastrale des locaux d'habitation repose encore largement sur des bases fixées en 1970 et actualisées chaque année par un coefficient, de sorte qu'une baisse récente du marché ne se traduit généralement pas directement par une taxe foncière plus faible."),
(r"au Canada, par exemple, les distributions d'une SIIC","en France, par exemple, l'équivalent est la SIIC (société d'investissement immobilier cotée), tenue de distribuer une large part de ses résultats, dont les dividendes sont en général soumis pour un particulier au prélèvement forfaitaire unique ou, sur option, au barème progressif, et le report d'impôt d'un échange de type 1031 n'a pas d'équivalent en France;"),
(r"ce statut est une notion du droit fiscal américain, et le Canada","ce statut est une notion du droit fiscal américain, et la France n'a pas d'équivalent : en location nue, le déficit foncier est imputable sur le revenu global dans une limite annuelle, l'excédent étant reportable sur les revenus fonciers des années suivantes, tandis qu'en location meublée non professionnelle les déficits ne s'imputent que sur des revenus de même nature;"),
(r"le Canada, par exemple, a conclu des conventions","la France, par exemple, a conclu des conventions fiscales avec de nombreux pays pour éviter la double imposition, et les revenus d'un bien situé à l'étranger doivent en général être déclarés, d'où l'importance de vérifier la convention applicable avec un fiscaliste;"),
(r"au Canada, par exemple, lorsqu'un immeuble est vendu","en France, par exemple, un particulier en location nue ne peut pas amortir le bien, alors qu'en location meublée non professionnelle l'amortissement est possible et, depuis la loi de finances pour 2025, les amortissements déduits sont réintégrés dans le calcul de la plus-value lors de la vente, ce qui rapproche ce régime d'une récupération de l'amortissement;"),
(r"au Canada, par exemple, il n'existe pas de majoration du coût","en France, par exemple, il n'existe pas de majoration du coût à l'américaine, mais la plus-value latente n'est pas imposée au décès : les héritiers reçoivent les biens à leur valeur déclarée dans la succession, qui supporte en revanche des droits de succession selon le lien de parenté, et la réserve héréditaire limite la liberté de disposer;"),
(r"auprès d'un fiscaliste ou d'un notaire au Québec","auprès d'un fiscaliste ou d'un notaire."),
(r"disposition réputée au Canada","absence d'imposition de la plus-value au décès en France, compensée par les droits de succession —"),
(r"au Québec, par exemple, le zonage relève","en France, par exemple, les règles d'urbanisme relèvent du plan local d'urbanisme (PLU) adopté par la commune ou l'intercommunalité, et un projet exige en général un permis de construire ou une déclaration préalable, avec parfois l'avis de l'architecte des Bâtiments de France en secteur protégé."),
(r"au Québec, par exemple, le créancier hypothécaire","en France, par exemple, la saisie immobilière est une procédure judiciaire menée devant le juge de l'exécution, un particulier surendetté peut saisir la commission de surendettement de la Banque de France, et une entreprise relève des procédures collectives;"),
(r"au Québec, par exemple, les experts en sinistre","en France, par exemple, l'assuré peut se faire assister par un expert d'assuré face à l'expert mandaté par l'assureur puis, en cas de désaccord persistant, saisir le service réclamations de l'assureur et la Médiation de l'assurance;")]
n=0
for f in sorted(glob.glob('work/RED-L5-fr-FR/*.txt')):
    s=open(f).read()
    for a,b in R:
        if a.startswith('disposition'): 
            if a in s: s=s.replace(a+' —',b).replace(a,b); n+=1
            continue
        m=re.search(re.escape(a)+r'.*?[.;](?=\s|$)',s,re.S)
        if m: s=s[:m.start()]+b+s[m.end():]; n+=1
    open(f,'w').write(s)
print('replaced',n)
