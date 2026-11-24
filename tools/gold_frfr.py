#!/usr/bin/env python3
"""France adaptations for GOLD L1 fr-FR (run after fr_fr.py)."""
import re,glob
NOTE_CA='(Au Canada, par exemple, le traitement dépend notamment de la question de savoir si l’opération est considérée comme un placement, ce qui donne généralement lieu à un plus-value, ou comme une activité commerciale, ce qui peut donner lieu à un revenu d’entreprise; l’Agence du revenu du Canada et un professionnel qualifié peuvent préciser ce qui s’applique à votre situation.)'
NOTE_FR='(En France, par exemple, la vente de métaux précieux par un particulier relève par défaut d’une taxe forfaitaire sur les métaux précieux calculée sur le prix de cession, ou, sur option et sous conditions de justificatifs, du régime des plus-values, avec un abattement selon la durée de détention; les taux et les conditions évoluent, alors vérifiez les règles en vigueur auprès de l’administration fiscale (impots.gouv.fr) ou d’un professionnel qualifié.)'
R=[(NOTE_CA,NOTE_FR),
('fonds négocié en bourse (FNB)','fonds indiciel coté (ETF)'),(r'\bFNB\b','ETF'),
('compte de courtage ordinaire','compte-titres ordinaire'),('compte de courtage','compte-titres'),
('compte chèques','compte courant'),('service à la clientèle','service client'),
('coffret de sûreté à la banque','coffre loué à la banque'),('coffrets de sûreté bancaires','coffres bancaires'),('coffret de sûreté bancaire','coffre bancaire'),
('l’assurance-dépôts habituelle','la garantie des dépôts habituelle'),
('polices d’assurance habitation ordinaires, pour propriétaires ou pour locataires,','contrats d’assurance habitation ordinaires, pour propriétaires ou pour locataires,'),
('polices d’assurance habitation','contrats d’assurance habitation'),('police d’assurance habitation','contrat d’assurance habitation'),
('une police distincte spécialisée','un contrat distinct spécialisé'),('une police spécialisée','un contrat spécialisé'),('à une police existante','à un contrat existant'),
('fiscaliste ou à un comptable qualifié','conseiller fiscal ou à un expert-comptable qualifié'),('fiscaliste ou un comptable qualifié','conseiller fiscal ou un expert-comptable qualifié'),
('un fiscaliste qualifié','un conseiller fiscal qualifié'),
(r'\bchaque dollar\b','chaque euro'),(r'\bChaque dollar\b','Chaque euro'),(r'\bdu plus-value\b','de la plus-value'),(r'\bLe plus-value\b','La plus-value'),(r'\ble plus-value\b','la plus-value'),(r'\bun plus-value\b','une plus-value'),(r'\bpar dollar dépensé\b','par euro dépensé'),(r'\bun dollar qui\b','un euro qui'),
('impôt sur les gains en capital','imposition des plus-values'),('l’impôt sur les plus-values','l’imposition des plus-values'),
('un plus-value','une plus-value'),('crée généralement un plus-value','crée généralement une plus-value'),
('le 1er de chaque mois','le 1er de chaque mois'),
('fiducies','trusts (fiducies)'),
('Faire croître','Faire fructifier'),('faire croître, transmettre','faire fructifier, transmettre'),
]
for f in sorted(glob.glob('work/GOLD-L1-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    for a,b in R:
        s=re.sub(a,b,s) if a.startswith(r'\b') else s.replace(a,b)
    # GOLD-022 (and 021): metals are quoted in US dollars, so restore dollars there
    def fix(m):
        t=m.group(0)
        t=t.replace('euros','dollars').replace('dollars américains','dollars américains')
        return t
    s=re.sub(r'===== GOLD-L1-02[12]\n.*?(?=\n===== |\Z)',fix,s,flags=re.S)
    open(f,'w',encoding='utf-8').write(s)
print('ok')
