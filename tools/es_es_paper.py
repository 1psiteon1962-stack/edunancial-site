# es_es.py COLOR LEVEL : es-Caribbean batches -> es-ES draft (lexical)
import sys,re,glob,os
C,L=sys.argv[1:3]; src=f'work/{C}-{L}-es-Caribbean'; dst=f'work/{C}-{L}-es-ES'; os.makedirs(dst,exist_ok=True)
M=[(r'\b(la|una|esta|esa|dicha|cada|toda|nueva|menor|mayor) contribuci[oó]n\b',lambda m:{'la':'el','una':'un','esta':'este','esa':'ese','dicha':'dicho','cada':'cada','toda':'todo','nueva':'nuevo','menor':'menor','mayor':'mayor'}[m.group(1)]+' contribución'),
(r'\b(las|unas|estas|esas|dichas|todas) contribuciones\b',lambda m:{'las':'los','unas':'unos','estas':'estos','esas':'esos','dichas':'dichos','todas':'todos'}[m.group(1)]+' contribuciones'),
(r'\bde el contribución\b','del contribución'),(r'\ba el contribución\b','al contribución'),
(r'\bcontribuciones (pagadas|adeudadas|diferidas|aplazadas|retenidas|federales|locales|municipales)\b',lambda m:'contribuciones '+{'pagadas':'pagados','adeudadas':'adeudados','diferidas':'diferidos','aplazadas':'aplazados','retenidas':'retenidos','federales':'federales','locales':'locales','municipales':'municipales'}[m.group(1)]),
(r'\bcontribución (separada|adicional|diferida|aplazada|adeudada|pagada|federal|local|municipal|propia|específica)\b',lambda m:'contribución '+{'separada':'separado','adicional':'adicional','diferida':'diferido','aplazada':'aplazado','adeudada':'adeudado','pagada':'pagado','federal':'federal','local':'local','municipal':'municipal','propia':'propio','específica':'específico'}[m.group(1)]),
(r'\bcontribución sobre la propiedad inmueble\b','contribución sobre la propiedad'),
(r'\bbienes raíces\b','bienes inmuebles'),(r'\bBienes raíces\b','Bienes inmuebles'),(r'\bde bienes inmuebles\b','inmobiliario'),
(r'\bcontributivos\b','fiscales'),(r'\bcontributivas\b','fiscales'),(r'\bcontributivo\b','fiscal'),(r'\bcontributiva\b','fiscal'),
(r'\bcontribución sobre ingresos\b','impuesto sobre la renta'),(r'\bcontribución sobre la propiedad\b','impuesto sobre bienes inmuebles (IBI)'),(r'\bcontribuciones sobre la propiedad\b','impuestos sobre bienes inmuebles'),(r'\bcontribución sobre ganancias de capital\b','tributación de las ganancias patrimoniales'),(r'\bganancias de capital\b','ganancias patrimoniales'),(r'\bcontribuciones\b','impuestos'),(r'\bcontribución\b','impuesto'),(r'\bContribución\b','Impuesto'),
(r'\bfinanciamientos\b','financiaciones'),(r'\bfinanciamiento\b','financiación'),(r'\bFinanciamiento\b','Financiación'),
(r'\binversionistas\b','inversores'),(r'\binversionista\b','inversor'),(r'\bInversionista\b','Inversor'),
(r'\bapartamentos\b','pisos'),(r'\bapartamento\b','piso'),(r'\bcarro\b','coche'),(r'\bcomputadora\b','ordenador'),(r'\bcelular\b','móvil'),
(r'\bmercadeo\b','marketing'),(r'\bmanejar\b','gestionar'),(r'\bmanejo\b','gestión'),(r'\bchequear\b','comprobar'),(r'\bcierre de la compraventa\b','firma de la escritura'),(r'\bgastos de cierre\b','gastos de compraventa'),
(r'\bimpuesto sobre la alquiler\b','impuesto sobre la renta'),(r'\bla alquiler\b','el alquiler'),(r'\buna alquiler\b','un alquiler'),(r'\bsu alquiler\b','su alquiler'),(r'\bde alquiler\b','de alquiler'),
(r'\$(\d)',r'\1 €')]
for f in sorted(glob.glob(src+'/*.txt')):
    s=open(f,encoding='utf-8').read()
    for a,b in M: s=re.sub(a,b,s)
    s=re.sub(r'(\d[\d.,]*) € ?(millones|mil)',r'\1 \2 de euros',s)
    open(dst+'/'+os.path.basename(f),'w',encoding='utf-8').write(s)
print('ok')
