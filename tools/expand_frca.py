#!/usr/bin/env python3
"""Expand compact fr-CA BLUE long-format source (work/src/*.src) into full batch blocks.
Usage: expand_frca.py SRC OUT"""
import sys,re
src=open(sys.argv[1],encoding='utf-8').read()
out=[]
for blk in re.split(r'^===== ',src,flags=re.M):
    if not blk.strip(): continue
    lines=blk.split('\n'); lid=lines[0].strip()
    sec={}; cur=None; hdr={}
    for l in lines[1:]:
        m=re.match(r'^@(\w+)\s*$',l)
        if m: cur=m.group(1); sec[cur]=[]; continue
        if cur is None:
            if ':' in l: k,v=l.split(':',1); hdr[k.strip()]=v.strip()
            continue
        sec[cur].append(l)
    g=lambda k:'\n'.join(sec[k]).strip()
    kv=lambda k:[x for x in sec[k] if x.strip()]
    C,_,N=lid.split('-')
    comp=kv('COMP'); path=kv('PATH'); seo=kv('SEO'); ai=kv('AI')
    locnote=('\n'+g('LOCNOTE')) if 'LOCNOTE' in sec else ''
    o=f"""===== {lid}
TITLE: {hdr['TITLE']}
SUMMARY: {hdr['SUMMARY']}
# {lid} : {hdr['TITLE']}

**Volet :** BLUE (Entreprise)
**Niveau :** 1 — Sensibilisation et littératie
**ID de la leçon :** {lid}
**Auteur :** Waldemar M. Caban, JD MA
**Durée estimée :** 15 à 20 minutes
**Difficulté :** Débutant

---

## Résumé
`{lid}-MAIN`
{g('MAIN')}

## Objectifs d’apprentissage
{g('OBJ')}

## Préalables
{g('PRE')}

## Durée estimée
15 à 20 minutes

## Difficulté
Débutant (niveau 1)

---

## Contenu principal

{g('CORE')}

---

## Définitions clés
{g('DEF')}

## Exemples pratiques
{g('EX')}

## Erreurs courantes
{g('ERR')}

## FAQ
{g('FAQ')}

## Points clés
{g('KEY')}

## Exercice pratique
{g('PRAC')}

---

## Guide d’enseignement socratique
`{lid}-SOCRATIC` (niveau 1 — « Quoi »)

{g('SOC')}

## Évaluation des compétences
`{lid}-ASSESSMENT`

{g('ASSESS')}

## Corrigé
`{lid}-ANSWER-KEY`

{g('ANS')}

## Norme de compétence
`{lid}-COMPETENCY`

COMPÉTENCES ENSEIGNÉES : {comp[0]}
COMPÉTENCES MESURÉES : {comp[1]}
SEUIL DE MAÎTRISE MINIMAL : 80 %
TÂCHE PRATIQUE OBLIGATOIRE : Réalisation de l’exercice pratique.
SUJETS DE RATTRAPAGE : {comp[2]}
LEÇON SUIVANTE DÉBLOQUÉE : {comp[3]}
VOLETS CONNEXES : Aucun encore publié.

## Lectures complémentaires
{g('READ')}

## Parcours de la leçon
`{lid}-LOCALIZATION` (bloc de parcours)
LEÇON PRÉCÉDENTE : {path[0]}
LEÇON SUIVANTE : {path[1]}
PRÉALABLES OBLIGATOIRES : {path[2]}
LEÇONS DE RÉVISION FACULTATIVES : {path[3]}
LEÇONS DE RATTRAPAGE : {path[4]}
LEÇONS CONNEXES D’AUTRES VOLETS : Aucune encore publiée
CONDITION D’ACHÈVEMENT DU NIVEAU : Terminer toutes les leçons BLUE-L1 (001 à 050) et réussir l’évaluation des compétences du niveau 1.

## Bloc SEO
`{lid}-SEO`
Titre SEO : {seo[0]}
Méta-description : {seo[1]}
Adresse URL suggérée : {seo[2]}
Mot-clé principal : {seo[3]}
Mots-clés secondaires : {seo[4]}
Liens internes suggérés : {seo[5]}
Références externes suggérées : {seo[6]}
Schéma recommandé : Schéma Course + LearningResource
Intention de recherche : Informative, niveau débutant
Possibilité d’extrait optimisé : {seo[7]}
Questions pour le schéma FAQ : {seo[8]}

## Bloc de soutien IA
`{lid}-AI`
Résumé IA : {ai[0]}
Notes d’enseignement IA : {ai[1]}

## Bloc de localisation
`{lid}-LOCALIZATION`
État de la traduction : Version française (fr-CA) fidèle à la source anglaise.{locnote}

## Bloc de références et de vérification
`{lid}-REFERENCES`
{g('REF')}
"""
    assert len(comp)==4 and len(path)==5 and len(seo)==9 and len(ai)==2, (lid,len(comp),len(path),len(seo),len(ai))
    out.append(o)
open(sys.argv[2],'w',encoding='utf-8').write(''.join(out))
