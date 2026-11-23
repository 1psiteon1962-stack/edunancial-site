# Derive GOLD L1 es-ES from the es-Caribbean batches: vocabulary, Spanish number format, euro amounts.
import re,glob,os
src='/home/claude/l5work/work/fix/GOLD-L1-es-Caribbean'; dst='/home/claude/l5work/work/fix/GOLD-L1-es-ES'
USDWORD={'021','022','024'}   # lessons about the US dollar itself: keep "dólar"
R=[
('promedio del costo en dólares','promedio del coste'),
('Un inversionista','Un inversor'),('un inversionista','un inversor'),('inversionistas','inversores'),('inversionista','inversor'),('Inversionistas','Inversores'),
('costos','costes'),('Costos','Costes'),('costo','coste'),('Costo','Coste'),
('cuenta de cheques','cuenta corriente'),('cuentas de corretaje','cuentas de valores'),('cuenta de corretaje','cuenta de valores'),
('profesional contributivo calificado o a un contador','asesor fiscal cualificado o a un gestor'),('profesional contributivo calificado','asesor fiscal cualificado'),
('contributivas','fiscales'),('contributivos','fiscales'),('contributiva','fiscal'),('contributivo','fiscal'),
('calificado','cualificado'),
('bienes raíces','bienes inmuebles'),
('pólizas comunes de seguro de vivienda, para dueños o para inquilinos','pólizas comunes de seguro de hogar, para propietarios o para inquilinos'),
('pólizas comunes de seguro de vivienda, para dueños o inquilinos','pólizas comunes de seguro de hogar, para propietarios o inquilinos'),
('pólizas de vivienda','pólizas de hogar'),('póliza de vivienda','póliza de hogar'),
('con una tasa de interés alta','con un tipo de interés alto'),
('el dinero de la mesada','el dinero de la paga'),('el dinero de su mesada','el dinero de su paga'),('mesada','paga'),
('## Prueba de práctica','## Cuestionario de práctica'),
('.999','0,999'),
]
DW=[('cantidad fija de dólares','cantidad fija de euros'),('cantidad adicional de dólares','cantidad adicional de euros'),('cantidad específica de dólares','cantidad específica de euros'),('cantidad absoluta de dólares','cantidad absoluta de euros'),('comparaciones en dólares absolutos','comparaciones en euros absolutos'),('cantidades de dólares','cantidades de euros'),('cantidad de dólares','cantidad de euros'),('cantidad dada de dólares','cantidad dada de euros'),('miles de dólares','miles de euros'),('cada dólar','cada euro'),('Cada dólar','Cada euro'),('un dólar','un euro')]
def nums(s):
    def swap(m): return m.group(0).replace(',','\x00').replace('.',',').replace('\x00','.')
    s=re.sub(r'(?<![\w.])\d{1,3}(?:,\d{3})+(?:\.\d+)?|(?<![\w.,\-])\d+\.\d+(?![\d.])',swap,s)
    s=re.sub(r'(\d),(\d+)%',r'\1,\2 %',s); s=re.sub(r'(\d)%',r'\1 %',s)
    s=re.sub(r'\$(\d+(?:[.,]\d+)*)',lambda m:m.group(1)+' €',s)
    return s
for f in sorted(glob.glob(src+'/b*.txt')):
    s=open(f,encoding='utf-8').read(); out=[]
    for ch in re.split(r'(?m)^(?====== )',s):
        m=re.match(r'===== GOLD-L1-(\d{3})',ch)
        if m:
            n=m.group(1)
            for a,b in R: ch=ch.replace(a,b)
            if n not in USDWORD:
                for a,b in DW: ch=ch.replace(a,b)
            ch=nums(ch)
        out.append(ch)
    open(dst+'/'+os.path.basename(f),'w',encoding='utf-8').write(''.join(out))
print('ok')
