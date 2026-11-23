#!/usr/bin/env python3
"""France adaptations for BLUE L1 fr-FR (run after fr_fr.py)."""
import re,glob
R=[
# localisation labels
('Version française (fr-CA) fidèle','Version française (fr-FR) fidèle'),
# Canada-specific notes -> France
('une structure répandue notamment aux États-Unis (au Canada, c’est souvent la société par actions qui joue un rôle comparable)',
 'une structure répandue notamment aux États-Unis (en France, ce sont souvent la SARL ou la SAS qui jouent un rôle comparable)'),
('(au Québec, par exemple, la société en nom collectif à responsabilité limitée, ou S.E.N.C.R.L., joue un rôle semblable)',
 '(en France, par exemple, la société d’exercice libéral à responsabilité limitée, ou SELARL, joue un rôle comparable pour certaines professions réglementées)'),
('le Canada et d’autres pays ont leurs propres règles','la France et d’autres pays ont leurs propres règles'),
('(ou, au Canada, souvent vers une société par actions)','(ou, en France, souvent vers une SARL/EURL ou une SAS/SASU)'),
('(BLUE-L1-021; au Canada, le numéro d’entreprise ou NE)','(BLUE-L1-021; en France, le numéro SIREN)'),
# vocabulary: self-employment
('travailleuses autonomes','travailleuses indépendantes'),('travailleuse autonome','travailleuse indépendante'),
('travailleurs autonomes','travailleurs indépendants'),('travailleur autonome','travailleur indépendant'),
('Travailleur autonome','Travailleur indépendant'),('travail autonome','travail indépendant'),('Travail autonome','Travail indépendant'),
('travailleur indépendant (ou entrepreneur indépendant)','travailleur indépendant (ou prestataire indépendant)'),
('Travailleur indépendant (entrepreneur indépendant)','Travailleur indépendant (prestataire indépendant)'),
('un travailleur indépendant (entrepreneur indépendant)','un travailleur indépendant (prestataire indépendant)'),
# customer service, staffing, SOP, bookkeeping
('service à la clientèle','service client'),('Service à la clientèle','Service client'),
('La dotation en personnel','Le recrutement'),('la dotation en personnel','le recrutement'),('de dotation en personnel','de recrutement'),
('de la dotation en personnel','du recrutement'),('à la dotation en personnel','au recrutement'),('**Dotation en personnel :**','**Recrutement :**'),(', dotation en personnel',', recrutement'),('une dotation réussie','un recrutement réussi'),
('procédure normalisée d’exploitation','procédure opérationnelle standard'),('Procédure normalisée d’exploitation','Procédure opérationnelle standard'),
('(PNE, ou *SOP* en anglais)','(POS, ou *SOP* en anglais)'),(r'\bPNE\b','POS'),
('tenue de livres','tenue comptable'),('Tenue de livres','Tenue comptable'),
# misc Quebec vocabulary
('entreprise d’aménagement paysager','entreprise de paysagisme'),('aménagement paysager','paysagisme'),
('Une massothérapeute travailleuse indépendante','Une praticienne en massage bien-être travailleuse indépendante'),
('une entreprise de massothérapie','une entreprise de massage bien-être'),('massothérapeutes','praticiens en massage'),
('entreprise de services-conseils','société de conseil'),('les services-conseils','le conseil'),
('achalandée','fréquentée'),('chandelles','bougies'),('sur une tablette','sur une étagère'),('sur les tablettes','sur les étagères'),
]
NOTES={
'Note de localisation (fr-CA) : Il s’agit d’un système propre aux États-Unis.':
'Note de localisation (fr-FR) : Il s’agit d’un système propre aux États-Unis. En France, les entreprises sont plutôt identifiées par un numéro SIREN (et un numéro SIRET pour chaque établissement), attribué par l’INSEE lors de l’immatriculation; vérifiez les exigences en vigueur auprès des autorités ou d’un professionnel.',
'Note de localisation (fr-CA) : Au Canada, l’Agence du revenu du Canada (et, au Québec, Revenu Québec) examine la relation de travail réelle':
'Note de localisation (fr-FR) : En France, c’est la relation de travail réelle qui compte, et notamment l’existence d’un lien de subordination (le pouvoir de donner des ordres, d’en contrôler l’exécution et d’en sanctionner les manquements); l’URSSAF et les tribunaux peuvent requalifier une relation présentée comme indépendante. Vérifiez les critères en vigueur auprès des autorités ou d’un professionnel.',
'Note de localisation (fr-CA) : Au Canada, l’Agence du revenu du Canada (et, au Québec, Revenu Québec) examine notamment':
'Note de localisation (fr-FR) : En France, une activité exercée de façon habituelle dans un but lucratif est généralement considérée comme une activité professionnelle; ses revenus doivent généralement être déclarés, et des régimes simplifiés comme celui de la micro-entreprise peuvent s’appliquer aux petites activités. Vérifiez les règles en vigueur auprès des autorités ou d’un professionnel.',
}
for f in sorted(glob.glob('work/BLUE-L1-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    out=[]
    for line in s.split('\n'):
        for k,v in NOTES.items():
            if line.startswith(k): line=v
        out.append(line)
    s='\n'.join(out)
    for a,b in R:
        s=re.sub(a,b,s) if a.startswith(r'\b') else s.replace(a,b)
    open(f,'w',encoding='utf-8').write(s)
left=[]
for f in sorted(glob.glob('work/BLUE-L1-fr-FR/*.txt')):
    s=open(f,encoding='utf-8').read()
    for w in ['Canada','Québec','fr-CA','autonome','PNE','S.E.N.C','NEQ','Agence du revenu','dotation','tenue de livres','massoth','services-conseils','service à la clientèle']:
        if w in s: left.append((f,w,s.count(w)))
print(left)
