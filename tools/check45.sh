#!/bin/bash
# check45.sh COLOR LEVEL LOCALE
S=/home/claude/l5work
python3 -I $S/tools/build45.py $1 $2 $3 || exit 1
Z=$S/out/$1-$2-001-050-$3.zip; [ -n "$PARTIAL" ] && Z=$S/out/partial.zip; [ -f $Z ] || exit 1
D=$(mktemp -d); cd $D; unzip -q $Z
python3 -I $S/tools/qc.py *.md
python3 -I - $1 $2 $3 <<'PY'
import glob,yaml,sys,re
C,L,loc=sys.argv[1:4]; R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
H={
   'en-GB':['Scenario Opener', 'Learning Objectives', 'Core Content', 'Worked Example', 'Practice Quiz', 'Answer Key', 'Answers and Explanations', 'Key Takeaways'],
   'es-ES':['Escenario inicial', 'Objetivos de aprendizaje', 'Contenido principal', 'Ejemplo práctico', 'Prueba práctica', 'Clave de respuestas', 'Respuestas y explicaciones', 'Puntos clave'],
   'fr-FR':['Mise en situation', 'Objectifs d’apprentissage', 'Contenu principal', 'Exemple pratique', 'Questionnaire pratique', 'Corrigé', 'Réponses et explications', 'Points clés'],
   'pt-BR':['Cenário de abertura', 'Objetivos de aprendizagem', 'Conteúdo principal', 'Exemplo prático', 'Teste de prática', 'Gabarito', 'Respostas e explicações', 'Pontos-chave'],
   'pt-PT':['Cenário de abertura', 'Objetivos de aprendizagem', 'Conteúdo principal', 'Exemplo prático', 'Teste de prática', 'Chave de Respostas', 'Respostas e explicações', 'Pontos-chave'],
   'it':['Scenario iniziale', 'Obiettivi di apprendimento', 'Contenuto principale', 'Esempio pratico', 'Quiz di esercitazione', 'Chiave delle risposte', 'Risposte e spiegazioni', 'Punti chiave'],
   'nl':['Openingsscenario', 'Leerdoelen', 'Kerninhoud', 'Uitgewerkt voorbeeld', 'Oefenquiz', 'Antwoordsleutel', 'Antwoorden en uitleg', 'Belangrijkste punten'],
   'ht':['Senaryo ouvèti', 'Objektif aprantisaj', 'Kontni prensipal', 'Egzanp pratik', 'Egzamen pratik', 'Kle repons yo', 'Repons ak eksplikasyon', 'Pwen kle yo'],
   'fr-CA':["Mise en situation","Objectifs d’apprentissage","Contenu principal","Exemple pratique","Questionnaire pratique","Corrigé","Réponses et explications","Points clés"],
   'es-Caribbean':["Escenario inicial","Objetivos de aprendizaje","Contenido principal","Ejemplo práctico","Prueba práctica","Clave de respuestas","Respuestas y explicaciones","Puntos clave"],
   'de':["Einstiegsszenario","Lernziele","Hauptinhalt","Durchgerechnetes Beispiel","Übungsquiz","Lösungsschlüssel","Antworten und Erklärungen","Das Wichtigste in Kürze"]}[loc]
E=["Scenario Opener","Learning Objectives","Core Content","Worked Example","Practice Quiz","Answer Key","Answers and Explanations","Key Takeaways"]
M=dict(zip(E,H))
T={
   'en-GB':[('VERIFIED FACT', 'VERIFIED FACT'), ('ILLUSTRATIVE EXAMPLE', 'ILLUSTRATIVE EXAMPLE'), ('ASSUMPTION/OPINION', 'ASSUMPTION/OPINION'), ('REGION-SPECIFIC RULE', 'REGION-SPECIFIC RULE'), ('ESTIMATE', 'ESTIMATE'), ('PRINCIPLE:', 'PRINCIPLE:')],
   'es-ES':[('VERIFIED FACT', 'DATO VERIFICADO'), ('ILLUSTRATIVE EXAMPLE', 'EJEMPLO ILUSTRATIVO'), ('ASSUMPTION/OPINION', 'SUPUESTO/OPINIÓN'), ('REGION-SPECIFIC RULE', 'REGLA ESPECÍFICA DE LA REGIÓN'), ('ESTIMATE', 'ESTIMACIÓN'), ('PRINCIPLE:', 'PRINCIPIO:')],
   'fr-FR':[('VERIFIED FACT', 'FAIT VÉRIFIÉ'), ('ILLUSTRATIVE EXAMPLE', 'EXEMPLE ILLUSTRATIF'), ('ASSUMPTION/OPINION', 'HYPOTHÈSE/OPINION'), ('REGION-SPECIFIC RULE', 'RÈGLE PROPRE À LA RÉGION'), ('ESTIMATE', 'ESTIMATION'), ('PRINCIPLE:', 'PRINCIPE :')],
   'pt-BR':[('VERIFIED FACT', 'FATO VERIFICADO'), ('ILLUSTRATIVE EXAMPLE', 'EXEMPLO ILUSTRATIVO'), ('ASSUMPTION/OPINION', 'SUPOSIÇÃO/OPINIÃO'), ('REGION-SPECIFIC RULE', 'REGRA ESPECÍFICA DA REGIÃO'), ('ESTIMATE', 'ESTIMATIVA'), ('PRINCIPLE:', 'PRINCÍPIO:')],
   'pt-PT':[('VERIFIED FACT', 'FACTO VERIFICADO'), ('ILLUSTRATIVE EXAMPLE', 'EXEMPLO ILUSTRATIVO'), ('ASSUMPTION/OPINION', 'SUPOSIÇÃO/OPINIÃO'), ('REGION-SPECIFIC RULE', 'REGRA ESPECÍFICA DA REGIÃO'), ('ESTIMATE', 'ESTIMATIVA'), ('PRINCIPLE:', 'PRINCÍPIO:')],
   'it':[('VERIFIED FACT', 'FATTO VERIFICATO'), ('ILLUSTRATIVE EXAMPLE', 'ESEMPIO ILLUSTRATIVO'), ('ASSUMPTION/OPINION', 'IPOTESI/OPINIONE'), ('REGION-SPECIFIC RULE', 'REGOLA SPECIFICA DELLA REGIONE'), ('ESTIMATE', 'STIMA'), ('PRINCIPLE:', 'PRINCIPIO:')],
   'nl':[('VERIFIED FACT', 'GEVERIFIEERD FEIT'), ('ILLUSTRATIVE EXAMPLE', 'ILLUSTRATIEF VOORBEELD'), ('ASSUMPTION/OPINION', 'AANNAME/MENING'), ('REGION-SPECIFIC RULE', 'REGIOSPECIFIEKE REGEL'), ('ESTIMATE', 'SCHATTING'), ('PRINCIPLE:', 'PRINCIPE:')],
   'ht':[('VERIFIED FACT', 'FÈ VERIFYE'), ('ILLUSTRATIVE EXAMPLE', 'EGZANP ILISTRATIF'), ('ASSUMPTION/OPINION', 'SIPOZISYON/OPINYON'), ('REGION-SPECIFIC RULE', 'RÈG ESPESIFIK POU REJYON AN'), ('ESTIMATE', 'ESTIMASYON'), ('PRINCIPLE:', 'PRENSIP:')],
   'fr-CA':[("VERIFIED FACT","FAIT VÉRIFIÉ"),("ILLUSTRATIVE EXAMPLE","EXEMPLE ILLUSTRATIF"),("ASSUMPTION/OPINION","HYPOTHÈSE/OPINION"),("REGION-SPECIFIC RULE","RÈGLE PROPRE À LA RÉGION"),("ESTIMATE","ESTIMATION"),("PRINCIPLE:","PRINCIPE :")],
   'es-Caribbean':[("VERIFIED FACT","DATO VERIFICADO"),("ILLUSTRATIVE EXAMPLE","EJEMPLO ILUSTRATIVO"),("ASSUMPTION/OPINION","SUPUESTO/OPINIÓN"),("REGION-SPECIFIC RULE","REGLA ESPECÍFICA DE LA REGIÓN"),("ESTIMATE","ESTIMACIÓN"),("PRINCIPLE:","PRINCIPIO:")],
   'de':[("VERIFIED FACT","GEPRÜFTE TATSACHE"),("ILLUSTRATIVE EXAMPLE","BEISPIEL ZUR VERANSCHAULICHUNG"),("ASSUMPTION/OPINION","ANNAHME/MEINUNG"),("REGION-SPECIFIC RULE","LÄNDERSPEZIFISCHE REGEL"),("ESTIMATE","SCHÄTZUNG"),("PRINCIPLE:","GRUNDSATZ:")]}[loc]
def secs(t):
    parts=re.split(r'^## (.+)$',t,flags=re.M); return [(parts[i].strip(),parts[i+1]) for i in range(1,len(parts),2)]
bad=0
for f in sorted(glob.glob('*.md')):
    t=open(f).read(); lid=f.split('.')[0]; p=[]
    try: d=yaml.safe_load(t.split('---')[1]); assert d['locale']==loc and d['title'] and d['summary']
    except Exception as e: p.append('YAML')
    e=open(f'{R}/{C}/{L}/{lid}.md').read()
    se,st=secs(e),secs(t)
    if [M.get(h,h) for h,_ in se]!=[h for h,_ in st]: p.append(f'H2 {[h for h,_ in st]}')
    else:
        for (h,a),(_,b) in zip(se,st):
            for name,rx in [('bul',r'^\s*[-*] '),('num',r'^\d+\. '),('q',r'^\*\*Q\d'),('opt',r'^[A-D]\) ')]:
                x,y=len(re.findall(rx,a,re.M)),len(re.findall(rx,b,re.M))
                if x!=y: p.append(f'{h}:{name} {x}/{y}')
            if h=='Answer Key' and re.findall(r'Q\d+:\s*[A-D]',a)!=re.findall(r'Q\d+:\s*[A-D]',b): p.append('KEY')
    if len(re.findall(r'^# ',e,re.M))!=len(re.findall(r'^# ',t,re.M)): p.append('H1')
    for a,b in T:
        x=e.count(a)-(e.count('ASSUMPTION/OPINION') if a=='OPINION' else 0); y=t.count(b)
        if x!=y: p.append(f'TAG {a} {x}/{y}')
    if p: bad+=1; print(lid,p)
print(f'{L} structure problems:',bad)
PY
rm -rf $D
