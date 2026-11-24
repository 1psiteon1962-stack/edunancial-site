#!/usr/bin/env python3
"""France adaptations for BLACK L1 fr-FR (run after fr_fr.py)."""
import re,glob
R=[(r'\bétats des résultats\b','comptes de résultat'),(r'\bÉtat des résultats\b','Compte de résultat'),(r'\bl’état des résultats\b','le compte de résultat'),
(r'\bun état des résultats\b','un compte de résultat'),(r'\bd’état des résultats\b','de compte de résultat'),(r'\bles état des résultats\b','les comptes de résultat'),
(r'\bétat des résultats\b','compte de résultat'),
(r'\bteneur de livres\b','responsable de la tenue comptable'),(r'\bteneurs de livres\b','responsables de la tenue comptable'),
(r'\bservice à la clientèle\b','service client'),(r'\bchaque dollar\b','chaque euro'),(r'\bChaque dollar\b','Chaque euro'),
(r'\bentreprise de consultation\b','société de conseil'),(r'\brendement sur investissement\b','retour sur investissement'),
(r'\bmarge de crédit\b','ligne de crédit (découvert autorisé)'),
]
for f in sorted(glob.glob('work/BLACK-L1-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    for a,b in R: s=re.sub(a,b,s)
    open(f,'w',encoding='utf-8').write(s)
print('ok')
