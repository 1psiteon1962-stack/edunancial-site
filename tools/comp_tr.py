# comp_tr.py extract EN_LESSON_ID  -> numbered variable English lines (fixed lines auto-handled)
# comp_tr.py build EN_LESSON_ID LOCALE VARFILE -> prints work-batch chunk (===== ID / TITLE / SUMMARY / body)
#   VARFILE: line1 = TITLE, line2 = SUMMARY, then one translated line per variable line, same order.
import sys,re
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
FIX={'es':{
 'h':{'Executive Summary':'Resumen ejecutivo','Learning Objectives':'Objetivos de aprendizaje','Prerequisites':'Requisitos previos','Est. Time':'Tiempo estimado','Difficulty':'Dificultad','Core Content':'Contenido principal','Key Definitions':'Definiciones clave','Worked Examples':'Ejemplos prácticos','Common Mistakes':'Errores comunes','FAQ':'Preguntas frecuentes','Key Takeaways':'Puntos clave','Practical Exercise':'Ejercicio práctico','Socratic Teaching Guide':'Guía de enseñanza socrática','Competency Assessment':'Evaluación de competencias','Answer Key':'Clave de respuestas','Competency Standard':'Estándar de competencia','Further Reading':'Lecturas adicionales','Lesson Path':'Ruta de la lección','SEO Block':'Bloque SEO','AI Support Block':'Bloque de apoyo de IA','Localization Block':'Bloque de localización','References and Verification Block':'Bloque de referencias y verificación'},
 'hdr':['**Ruta:** BLUE (Negocios)','**Nivel:** 1 — Conciencia y alfabetización','**ID de la lección:** {id}','**Autor:** Waldemar M. Caban, JD MA','**Tiempo estimado:** 15–20 minutos','**Dificultad:** Principiante'],
 'time':'15–20 minutos','diff':'Principiante (Nivel 1)','soc':'(Nivel 1 — "Qué")','path':'(bloque de ruta)',
 'kv':{'PREVIOUS LESSON':'LECCIÓN ANTERIOR','NEXT LESSON':'SIGUIENTE LECCIÓN','REQUIRED PREREQUISITES':'REQUISITOS PREVIOS OBLIGATORIOS','OPTIONAL REVIEW LESSONS':'LECCIONES OPCIONALES DE REPASO','REMEDIATION LESSONS':'LECCIONES DE REFUERZO','NEXT LESSON UNLOCKED':'SIGUIENTE LECCIÓN DESBLOQUEADA','Suggested URL Slug':'Slug de URL sugerido','Suggested Internal Links':'Enlaces internos sugeridos'},
 'full':{'MINIMUM MASTERY SCORE: 80%':'PUNTUACIÓN MÍNIMA DE DOMINIO: 80%','REQUIRED PRACTICAL TASK: Completion of the Practical Exercise.':'TAREA PRÁCTICA OBLIGATORIA: Completar el ejercicio práctico.','LEVEL COMPLETION REQUIREMENT: Complete all BLUE-L1 lessons (001–050) and pass the Level 1 competency assessment.':'REQUISITO PARA COMPLETAR EL NIVEL: Completar todas las lecciones de BLUE-L1 (001–050) y aprobar la evaluación de competencias del Nivel 1.','Schema Recommendation: Course + LearningResource schema':'Recomendación de esquema: Esquema Course + LearningResource','Search Intent: Informational, beginner-level':'Intención de búsqueda: Informativa, nivel principiante','Suggested External References: General small-business accounting literacy resources':'Referencias externas sugeridas: Recursos generales de alfabetización contable para pequeños negocios','Translation status: English source complete. Locale translations pending (en-GB, es-Caribbean, es-ES, fr-CA, fr-FR, de, it, pt-BR, pt-PT, nl, lg, sw).':'Estado de la traducción: traducción al español ({lv}) completada a partir de la fuente en inglés.','No statistics or external citations used.':'No se usaron estadísticas ni citas externas.','RELATED TRACKS: None published yet.':'RUTAS RELACIONADAS: Todavía no hay ninguna publicada.','RELATED CROSS-TRACK LESSONS: None published yet':'LECCIONES RELACIONADAS DE OTRAS RUTAS: Todavía no hay ninguna publicada','Suggested External References: General small-business operations literacy resources':'Referencias externas sugeridas: Recursos generales de alfabetización sobre operaciones de pequeños negocios'},
 'ak':{'Correct':'Correcta','Explanation':'Explicación','Competency Tested':'Competencia evaluada'},
 'comp':{'Recall':'Recordar','Misconception correction':'Corrección de un error de concepto','Synthesis':'Síntesis','Applied reasoning':'Razonamiento aplicado','Deep synthesis':'Síntesis profunda','Cross-lesson synthesis':'Síntesis entre lecciones','Applied calculation':'Cálculo aplicado','Cross-lesson recall':'Recordar entre lecciones','Deep cross-lesson synthesis':'Síntesis profunda entre lecciones','Applied classification':'Clasificación aplicada','Applied judgment':'Juicio aplicado','Recall/formula':'Recordar y aplicar la fórmula','Analysis':'Análisis','Application':'Aplicación','Applied cross-lesson reasoning':'Razonamiento aplicado entre lecciones','Comparative synthesis':'Síntesis comparativa'},
 'exp':[(r'^Directly stated in Topic (\d+)\.$',r'Se indica directamente en el Tema \1.'),(r'^Stated in Topic (\d+)\.$',r'Se indica en el Tema \1.'),(r'^Defined in Key Definitions\.$','Se define en las definiciones clave.'),(r'^Stated in FAQ\.$','Se indica en las preguntas frecuentes.'),(r'^Directly stated in Topic (\d+)–(\d+)\.$',r'Se indica directamente en los Temas \1–\2.'),(r'^Stated in Topics (\d+)–(\d+)\.$',r'Se indica en los Temas \1–\2.'),(r'^Stated in Topics (\d+) and (\d+)\.$',r'Se indica en los Temas \1 y \2.'),(r'^Directly stated in the Worked Example\.$','Se indica directamente en el ejemplo práctico.'),(r'^Stated in the Worked Example\.$','Se indica en el ejemplo práctico.')],
 'tf':{'True':'Verdadero','False':'Falso'},
 'lab':[('[ESTIMATE, ILLUSTRATIVE EXAMPLE]','[ESTIMACIÓN, EJEMPLO ILUSTRATIVO]'),('[ILLUSTRATIVE EXAMPLE, ESTIMATE]','[EJEMPLO ILUSTRATIVO, ESTIMACIÓN]'),('[REGION-SPECIFIC RULE, VERIFIED FACT]','[REGLA ESPECÍFICA DE LA REGIÓN, DATO VERIFICADO]'),('[REGION-SPECIFIC RULE]','[REGLA ESPECÍFICA DE LA REGIÓN]'),('[ILLUSTRATIVE EXAMPLE]','[EJEMPLO ILUSTRATIVO]'),('[VERIFIED FACT]','[DATO VERIFICADO]'),('[OPINION]','[OPINIÓN]'),('[ASSUMPTION]','[SUPUESTO]'),('[ESTIMATE]','[ESTIMACIÓN]')],
}}
FIX['ht']={
 'h':{'Executive Summary':'Rezime egzekitif','Learning Objectives':'Objektif aprantisaj','Prerequisites':'Kondisyon preyalab','Est. Time':'Tan estime','Difficulty':'Difikilte','Core Content':'Kontni prensipal','Key Definitions':'Definisyon kle','Worked Examples':'Egzanp pratik','Common Mistakes':'Erè kouran','FAQ':'Kesyon moun poze souvan','Key Takeaways':'Pwen kle yo','Practical Exercise':'Egzèsis pratik','Socratic Teaching Guide':'Gid ansèyman sokratik','Competency Assessment':'Evalyasyon konpetans','Answer Key':'Kle repons yo','Competency Standard':'Estanda konpetans','Further Reading':'Lekti anplis','Lesson Path':'Chemen leson an','SEO Block':'Blòk SEO','AI Support Block':'Blòk sipò IA','Localization Block':'Blòk lokalizasyon','References and Verification Block':'Blòk referans ak verifikasyon'},
 'hdr':['**Pakou:** BLUE (Biznis)','**Nivo:** 1 — Konsyans ak alfabetizasyon','**ID leson an:** {id}','**Otè:** Waldemar M. Caban, JD MA','**Tan estime:** 15–20 minit','**Difikilte:** Debitan'],
 'time':'15–20 minit','diff':'Debitan (Nivo 1)','soc':'(Nivo 1 — "Kisa")','path':'(blòk chemen)',
 'kv':{'PREVIOUS LESSON':'LESON ANVAN AN','NEXT LESSON':'PWOCHEN LESON','REQUIRED PREREQUISITES':'KONDISYON PREYALAB OBLIGATWA','OPTIONAL REVIEW LESSONS':'LESON REVIZYON OPSYONÈL','REMEDIATION LESSONS':'LESON RATRAPAJ','NEXT LESSON UNLOCKED':'PWOCHEN LESON DEBLOKE','Suggested URL Slug':'Slug URL sijere','Suggested Internal Links':'Lyen entèn sijere'},
 'full':{'MINIMUM MASTERY SCORE: 80%':'NÒT MINIMÒM POU METRIZ: 80%','REQUIRED PRACTICAL TASK: Completion of the Practical Exercise.':'TACH PRATIK OBLIGATWA: Fè egzèsis pratik la.','LEVEL COMPLETION REQUIREMENT: Complete all BLUE-L1 lessons (001–050) and pass the Level 1 competency assessment.':'KONDISYON POU FINI NIVO A: Fini tout leson BLUE-L1 yo (001–050) epi pase evalyasyon konpetans Nivo 1 an.','Schema Recommendation: Course + LearningResource schema':'Rekòmandasyon schema: Schema Course + LearningResource','Search Intent: Informational, beginner-level':'Entansyon rechèch: Enfòmasyonèl, nivo debitan','Suggested External References: General small-business accounting literacy resources':'Referans ekstèn sijere: Resous jeneral pou alfabetizasyon kontablite ti biznis','Translation status: English source complete. Locale translations pending (en-GB, es-Caribbean, es-ES, fr-CA, fr-FR, de, it, pt-BR, pt-PT, nl, lg, sw).':'Estati tradiksyon: tradiksyon an kreyòl ayisyen fini apati sous angle a.','No statistics or external citations used.':'Nou pa itilize okenn estatistik ni okenn sitasyon ekstèn.','RELATED TRACKS: None published yet.':'PAKOU KI GEN RAPÒ: Poko gen okenn ki pibliye.','RELATED CROSS-TRACK LESSONS: None published yet':'LESON KI GEN RAPÒ NAN LÒT PAKOU: Poko gen okenn ki pibliye','Suggested External References: General small-business operations literacy resources':'Referans ekstèn sijere: Resous jeneral pou alfabetizasyon sou operasyon ti biznis'},
 'ak':{'Correct':'Kòrèk','Explanation':'Eksplikasyon','Competency Tested':'Konpetans yo teste'},
 'comp':{'Recall':'Rapèl','Misconception correction':'Korije yon move konsepsyon','Synthesis':'Sentèz','Applied reasoning':'Rezonman aplike','Deep synthesis':'Sentèz pwofon','Cross-lesson synthesis':'Sentèz ant leson yo','Applied calculation':'Kalkil aplike','Cross-lesson recall':'Rapèl ant leson yo','Deep cross-lesson synthesis':'Sentèz pwofon ant leson yo','Applied classification':'Klasifikasyon aplike','Applied judgment':'Jijman aplike','Recall/formula':'Rapèl ak fòmil','Analysis':'Analiz','Application':'Aplikasyon','Applied cross-lesson reasoning':'Rezonman aplike ant leson yo','Comparative synthesis':'Sentèz konparatif'},
 'exp':[(r'^Directly stated in Topic (\d+)\.$',r'Sa di dirèkteman nan Sijè \1.'),(r'^Stated in Topic (\d+)\.$',r'Sa di nan Sijè \1.'),(r'^Defined in Key Definitions\.$','Sa defini nan definisyon kle yo.'),(r'^Stated in FAQ\.$','Sa di nan kesyon moun poze souvan yo.'),(r'^Directly stated in Topic (\d+)–(\d+)\.$',r'Sa di dirèkteman nan Sijè \1–\2.'),(r'^Stated in Topics (\d+)–(\d+)\.$',r'Sa di nan Sijè \1–\2.'),(r'^Stated in Topics (\d+) and (\d+)\.$',r'Sa di nan Sijè \1 ak \2.'),(r'^Directly stated in the Worked Example\.$','Sa di dirèkteman nan egzanp pratik la.'),(r'^Stated in the Worked Example\.$','Sa di nan egzanp pratik la.')],
 'tf':{'True':'Vrè','False':'Fo'},
 'lab':[('[ESTIMATE, ILLUSTRATIVE EXAMPLE]','[ESTIMASYON, EGZANP ILISTRATIF]'),('[ILLUSTRATIVE EXAMPLE, ESTIMATE]','[EGZANP ILISTRATIF, ESTIMASYON]'),('[REGION-SPECIFIC RULE, VERIFIED FACT]','[RÈG ESPESIFIK POU PEYI A, FÈ VERIFYE]'),('[REGION-SPECIFIC RULE]','[RÈG ESPESIFIK POU PEYI A]'),('[ILLUSTRATIVE EXAMPLE]','[EGZANP ILISTRATIF]'),('[VERIFIED FACT]','[FÈ VERIFYE]'),('[OPINION]','[OPINYON]'),('[ASSUMPTION]','[SIPOZISYON]'),('[ESTIMATE]','[ESTIMASYON]')],
}
LVNAME={'es-Caribbean':'Caribe','es-ES':'España'}
def body(lid):
    t=open(f'{R}/BLUE/L1/{lid}.md',encoding='utf-8').read(); return t[re.search(r'^# ',t,re.M).start():].split('\n')
def classify(line,lid,F):
    s=line.strip()
    if s=='' or s=='---': return line
    m=re.match(r'^(#{2,3}) (.+)$',s)
    if m and m.group(1)=='##' and m.group(2) in F['h']: return '## '+F['h'][m.group(2)]
    if s in ('**Est. Time:** 15–20 minutes','**Difficulty:** Beginner') or re.match(r'^\*\*(Track|Level|Lesson ID|Author):\*\*',s):
        k=['Track','Level','Lesson ID','Author','Est. Time','Difficulty'].index(re.match(r'^\*\*([^:]+):',s).group(1)); return F['hdr'][k].format(id=lid)
    if re.match(r'^`BLUE-L1-\d{3}-[A-Z-]+`$',s): return s
    m=re.match(r'^(`BLUE-L1-\d{3}-SOCRATIC`) \(Level 1 — "What"\)$',s)
    if m: return m.group(1)+' '+F['soc']
    m=re.match(r'^(`BLUE-L1-\d{3}-LOCALIZATION`) \(path block\)$',s)
    if m: return m.group(1)+' '+F['path']
    if s=='15–20 minutes': return F['time']
    if s=='Beginner (Level 1)': return F['diff']
    if re.match(r'^(BLUE-L1-\d{3}(, )?)+$',s) or s=='None': return s
    if s in F['full']: return F['full'][s]
    m=re.match(r'^([A-Z][A-Za-z ]+): ((?:BLUE-L1-\d{3}(?:, )?)+|/[^ ]+)$',s)
    if m and m.group(1) in F['kv']: return F['kv'][m.group(1)]+': '+m.group(2)
    m=re.match(r'^(\d+)\. \*\*Correct:\*\* ([A-D]|True|False)\. \*\*Explanation:\*\* (.+?) \*\*Competency Tested:\*\* (.+)\.$',s)
    if m:
        ex=m.group(3); out=None
        for a,b in F['exp']:
            if re.match(a,ex): out=re.sub(a,b,ex); break
        comp=F['comp'].get(m.group(4))
        if out and comp:
            ans=F['tf'].get(m.group(2),m.group(2))
            return f"{m.group(1)}. **{F['ak']['Correct']}:** {ans}. **{F['ak']['Explanation']}:** {out} **{F['ak']['Competency Tested']}:** {comp}."
    return None
def main():
    mode=sys.argv[1]; lid=sys.argv[2]; F=FIX['es']
    lines=body(lid); var=[]
    for l in lines:
        if classify(l,lid,F) is None: var.append(l)
    if mode=='extract':
        for i,v in enumerate(var,1): print(f'{i:03d}| {v}')
        return
    loc=sys.argv[3]; tr=[x.rstrip('\n') for x in open(sys.argv[4],encoding='utf-8') if x.strip()!='']
    title,summ,tr=tr[0],tr[1],tr[2:]
    assert len(tr)==len(var),f'{lid}: need {len(var)} lines, got {len(tr)}'
    F=FIX[loc.split('-')[0]]
    F2={k:(v if k!='full' else {a:b.replace('{lv}',LVNAME.get(loc,loc)) for a,b in v.items()}) for k,v in F.items()}
    out=[]; it=iter(tr)
    for l in lines:
        c=classify(l,lid,F2)
        if c is None:
            t=next(it)
            for a,b in F['lab']: t=t.replace(a,b)
            out.append(t)
        else: out.append(c)
    print(f'===== {lid}\nTITLE: {title}\nSUMMARY: {summ}\n'+'\n'.join(out).rstrip()+'\n')
main()
