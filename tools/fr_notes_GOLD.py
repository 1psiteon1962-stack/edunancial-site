import glob,re
S=["en France, par exemple, de nombreux contrats d'assurance habitation plafonnent la garantie des espèces, des bijoux et des métaux précieux et exigent souvent une déclaration particulière ou un coffre agréé, à confirmer avec un courtier en assurance",
"en France, par exemple, l'État émet des obligations indexées sur l'inflation, les OATi et les OAT€i, dont les coupons et l'indexation du capital relèvent en principe de la fiscalité des revenus de capitaux mobiliers, à confirmer avec un conseiller fiscal",
"en France, par exemple, l'accès à de nombreux fonds de capital-investissement ou fonds alternatifs réservés aux investisseurs professionnels suppose un ticket d'entrée minimal élevé ou ce statut, sous le contrôle de l'AMF, à confirmer avec un conseiller en investissements financiers",
"en France, par exemple, toute personne qui entre dans l'Union européenne ou en sort avec de l'or d'investissement ou des moyens de paiement d'une valeur de 10 000 euros ou plus doit le déclarer à la douane, à confirmer avec la douane ou un commissionnaire en douane",
"en France, par exemple, un plan d'épargne retraite ou un PEA ne permet pas de détenir des lingots physiques, et la cession d'or d'investissement relève soit d'une taxe forfaitaire sur le prix de cession, soit, sur option et avec justificatifs, du régime des plus-values, à confirmer avec un conseiller fiscal",
"en France, par exemple, les objets d'art et de collection relèvent soit d'une taxe forfaitaire sur le prix de vente, soit, sur option, du régime des plus-values avec un abattement selon la durée de détention, à confirmer avec un conseiller fiscal",
"en France, par exemple, celui qui achète et revend de façon habituelle peut être considéré comme exerçant une activité commerciale imposée dans la catégorie des bénéfices industriels et commerciaux, alors que l'investisseur particulier relève du régime des plus-values, à confirmer avec un conseiller fiscal",
"en France, par exemple, un transfert de résidence depuis un pays situé hors de l'Union européenne peut permettre d'importer ses biens personnels en franchise de droits, mais l'or d'investissement et les objets de valeur doivent souvent être déclarés, et la déclaration d'argent liquide s'applique à la sortie de l'Union, à confirmer avec un commissionnaire en douane",
"en France, par exemple, il n'existe pas de taux maximal propre aux objets de collection comme aux États-Unis, mais une taxe forfaitaire sur le prix de cession ou, sur option, le régime des plus-values avec abattement pour durée de détention, à confirmer avec un conseiller fiscal"]
k=0; P=re.compile(r"au Canada, par exemple,.*?à confirmer avec (?:un|une|la|le) [^;:]*?(?=[;:])",re.S)
for f in sorted(glob.glob('work/GOLD-L5-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1; return r
    s=P.sub(rep,s)
    s=re.sub(r"\bun plus-value\b","une plus-value",s); s=re.sub(r"\bdu plus-value\b","de la plus-value",s); s=re.sub(r"\ble plus-value\b","la plus-value",s); s=re.sub(r"\bce plus-value\b","cette plus-value",s)
    open(f,'w',encoding='utf-8').write(s)
print('replaced',k,'of',len(S))
