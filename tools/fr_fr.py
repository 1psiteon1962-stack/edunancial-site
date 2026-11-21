import sys,re,glob,os
C,L=sys.argv[1:3]; src=f'work/{C}-{L}-fr-CA'; dst=f'work/{C}-{L}-fr-FR'; os.makedirs(dst,exist_ok=True)
M=[(r'\bchars\b','voitures'),(r'\bchar\b','voiture'),(r'\bmagasiner\b','comparer les offres'),(r'\bmagasinage\b','comparaison des offres'),(r'\bfin de semaine\b','week-end'),(r'\bfins de semaine\b','week-ends'),
(r'\bcourriels\b','e-mails'),(r'\bcourriel\b','e-mail'),(r'\bcondos\b','appartements en copropriété'),(r'\bcondo\b','appartement en copropriété'),(r'\bmise de fonds\b','apport personnel'),(r'\bmises de fonds\b','apports personnels'),
(r'\bimmeubles à revenus\b','immeubles de rapport'),(r'\bimmeuble à revenus\b','immeuble de rapport'),(r'\bimpôts? fonciers?\b','taxe foncière'),(r'\btaxes municipales\b','taxe foncière'),(r'\bévaluation municipale\b','valeur locative cadastrale'),
(r'\bFPI\b','SIIC'),(r'\bmagasin\b','magasin'),(r'\bgains en capital\b','plus-values'),(r'\bgain en capital\b','plus-value'),(r'\bdollars\b','euros'),
(r'(\d[\d  ]*(?:,\d+)?) ?\$',lambda m:m.group(1).rstrip()+' €'),(r'\$ ?(\d[\d  ,]*)',lambda m:m.group(1).rstrip()+' €'),(r'\bcomté\b','département'),(r'\bpatente\b','brevet')]
for f in sorted(glob.glob(src+'/*.txt')):
    s=open(f,encoding='utf-8').read()
    for a,b in M: s=re.sub(a,b,s)
    open(dst+'/'+os.path.basename(f),'w',encoding='utf-8').write(s)
print('ok')
