#!/usr/bin/env python3
"""France adaptations for WHITE L1 fr-FR (run after fr_fr.py)."""
import re,glob
R=[
# notes
('*(RÈGLE PROPRE À LA RÉGION : il s’agit d’un type de compte de retraite propre aux États-Unis. Au Canada, les équivalents les plus proches sont les régimes offerts par l’employeur, comme un REER collectif ou un régime de retraite collectif; les règles diffèrent, alors vérifiez-les auprès de votre employeur ou d’un professionnel.)*',
 '*(RÈGLE PROPRE À LA RÉGION : il s’agit d’un type de compte de retraite propre aux États-Unis. En France, les dispositifs les plus proches sont l’épargne salariale et les plans d’épargne retraite d’entreprise (comme le PER collectif), qui peuvent comporter un abondement de l’employeur; les règles diffèrent, alors vérifiez-les auprès de votre employeur ou d’un professionnel.)*'),
('*(RÈGLE PROPRE À LA RÉGION : il s’agit d’un type de compte propre aux États-Unis. Au Canada, l’équivalent le plus proche est le REER individuel, que l’on ouvre soi-même auprès d’une institution financière; les règles diffèrent, alors vérifiez-les auprès des autorités ou d’un professionnel.)*',
 '*(RÈGLE PROPRE À LA RÉGION : il s’agit d’un type de compte propre aux États-Unis. En France, l’équivalent le plus proche est le plan d’épargne retraite individuel (PER individuel), que l’on ouvre soi-même auprès d’un établissement financier; les règles diffèrent, alors vérifiez-les auprès des autorités ou d’un professionnel.)*'),
('Au Canada, la comparaison la plus proche oppose le REER, dont les cotisations sont généralement déductibles et les retraits imposables, et le CELI, dont les cotisations ne sont pas déductibles mais dont les retraits sont généralement libres d’impôt; ce n’est qu’une analogie',
 'En France, la comparaison la plus proche oppose le PER, dont les versements peuvent généralement être déduits du revenu imposable mais dont les sorties sont imposées, et des enveloppes comme l’assurance-vie ou le PEA, qui n’offrent pas de déduction à l’entrée mais bénéficient d’une fiscalité allégée à la sortie sous conditions; ce n’est qu’une analogie'),
('(Au Canada, on parle souvent de compte « non enregistré », par opposition aux comptes enregistrés comme le REER ou le CELI.)',
 '(En France, on parle souvent de compte-titres ordinaire, par opposition à des enveloppes fiscales comme le PEA ou le PER.)'),
('(Au Canada, le produit équivalent le plus courant est le certificat de placement garanti, ou CPG.)',
 '(En France, le produit équivalent le plus proche est le compte à terme.)'),
('Au Canada, ces opérations sont encadrées notamment par les lois provinciales sur les valeurs mobilières et par les autorités de réglementation, comme l’Autorité des marchés financiers au Québec.',
 'En France, ces opérations sont encadrées notamment par le Code monétaire et financier et par l’Autorité des marchés financiers (AMF).'),
('(Au Canada, la principale bourse est la Bourse de Toronto, ou TSX.)','(En France, la principale bourse est Euronext Paris.)'),
# ETF
('Un FNB (fonds négocié en bourse, ou ETF en anglais)','Un ETF (fonds indiciel coté, ou *exchange-traded fund* en anglais)'),
('part de FNB','part d’ETF'),('parts de FNB','parts d’ETF'),
(r'\bun FNB\b','un ETF'),(r'\bUn FNB\b','Un ETF'),(r'\bdu FNB\b','de l’ETF'),(r'\bd’un FNB\b','d’un ETF'),(r'\bles FNB\b','les ETF'),(r'\bLes FNB\b','Les ETF'),
(r'\bdes FNB\b','des ETF'),(r'\baux FNB\b','aux ETF'),(r'\bFNB\b','ETF'),
# fees
('ratio des frais de gestion (RFG, ou *expense ratio* en anglais)','taux de frais courants (ou *expense ratio* en anglais)'),
('Qu’est-ce que le ratio des frais de gestion','Qu’est-ce que le taux de frais courants'),('ratio des frais de gestion','taux de frais courants'),
# vocabulary
('conseillers-robots','robots-conseillers'),('Conseillers-robots','Robots-conseillers'),('conseiller-robot','robot-conseiller'),('Conseiller-robot','Robot-conseiller'),
('fonds du marché monétaire','fonds monétaire'),('Fonds du marché monétaire','Fonds monétaire'),
('maisons de courtage','sociétés de courtage'),('maison de courtage','société de courtage'),
('compte chèques','compte courant'),('cotes de crédit','notations de crédit'),
('de leur paie','de leur salaire'),('sur la paie','sur le bulletin de paie'),
('pondéré en dollars','pondéré par les capitaux'),('pondérée en dollars','pondérée par les capitaux'),('pondéré en euros','pondéré par les capitaux'),('pondérée en euros','pondérée par les capitaux'),
('chaque dollar','chaque euro'),('le même dollar','le même euro'),
('Dès que le prix baisse le moindrement','Dès que le prix baisse, si peu que ce soit'),('sont généralement en file pour être remboursés','sont généralement prioritaires pour être remboursés'),('Version française (fr-CA)','Version française (fr-FR)'),
]
for f in sorted(glob.glob('work/WHITE-L1-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    for a,b in R:
        s=re.sub(a,b,s) if a.startswith(r'\b') else s.replace(a,b)
    open(f,'w',encoding='utf-8').write(s)
left=[]
for f in sorted(glob.glob('work/WHITE-L1-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    for w in ['Canada','Québec','REER','CELI','CPG','TSX','FNB','RFG','conseiller-robot','marché monétaire','maison de courtage',' paie,',' paie ',' dollar ','dollars','$']:
        if w in s: left.append((f[-7:],w,s.count(w)))
print(left)
