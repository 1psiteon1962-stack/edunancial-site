import sys,re,os
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
C,L,src,dst,out=sys.argv[1:6]
subs=[(r'\bsuplidores\b','proveedores'),(r'\bSuplidores\b','Proveedores'),(r'\bsuplidor\b','proveedor'),(r'\bSuplidor\b','Proveedor'),
(r'\badiestramiento','capacitación'),(r'\bAdiestramiento','Capacitación'),(r'\badiestrar','capacitar'),(r'\bAdiestrar','Capacitar'),
(r'planilla de impuestos','declaración de impuestos'),(r'Planilla de impuestos','Declaración de impuestos'),(r'planillas de impuestos','declaraciones de impuestos'),(r'\bun capacitación','una capacitación'),(r'\bdel capacitación','de la capacitación'),(r'\bal capacitación','a la capacitación'),(r'\bel capacitación','la capacitación'),(r'\bEl capacitación','La capacitación'),(r'\n<!-- Core Content -->\n','\n')]
parts=[]
for n in range(1,51):
    lid=f'{C}-{L}-{n:03d}'
    t=open(f'{R}/{C}/{L}/{lid}.{src}.md',encoding='utf-8').read()
    fm,body=t.split('\n---\n',1)
    title=re.search(r'^title: "(.*)"$',fm,re.M).group(1)
    summ=re.search(r'^summary: "(.*)"$',fm,re.M).group(1)
    body=body[body.index('# '):]
    for a,b in subs:
        body=re.sub(a,b,body); title=re.sub(a,b,title); summ=re.sub(a,b,summ)
    parts.append(f'===== {lid}\nTITLE: {title}\nSUMMARY: {summ}\n{body.rstrip()}\n')
os.makedirs(os.path.dirname(out),exist_ok=True)
open(out,'w',encoding='utf-8').write('\n'.join(parts))
