# Derive BLUE L1 es-ES from the es-Caribbean batches: vocabulary, number format, euro amounts, Spain regional notes.
import re,glob,os
src='/home/claude/l5work/work/fix/BLUE-L1-es-Caribbean'; dst='/home/claude/l5work/work/fix/BLUE-L1-es-ES'
KEEPUSD={'021'}
NOTE={  # lesson -> list of (old regional text start, full replacement sentence/fragment up to the closing marker)
'003':[('las leyes varían según el país; por ejemplo, en la República Dominicana','las leyes varían según el país; por ejemplo, en España quien trabaja por cuenta propia como autónomo debe darse de alta en el censo de Hacienda y en el régimen de autónomos de la Seguridad Social, y algunas actividades requieren además licencias municipales.)*')],
'004':[('los requisitos de constitución y de formalidades varían según el estado o el país;','los requisitos de constitución y de formalidades varían según el estado o el país; la LLC es una figura de EE. UU., y en España la más parecida es la sociedad limitada (SL), que se constituye en escritura pública ante notario y se inscribe en el Registro Mercantil.)*')],
'005':[('su disponibilidad y sus reglas varían según el estado, el país y la profesión;','su disponibilidad y sus reglas varían según el estado, el país y la profesión; en España, los profesionales colegiados que ejercen en común pueden organizarse como sociedad profesional, una figura con reglas propias.)*')],
'008':[('esto describe la ley contributiva federal de EE. UU.;','esto describe la ley fiscal federal de EE. UU.; en España no existe una elección equivalente a la de la corporación S, y las sociedades mercantiles tributan por el Impuesto sobre Sociedades.)*')],
'009':[('Las reglas sobre cuándo existe una sociedad y cómo responden los socios dependen de cada país;','Las reglas sobre cuándo existe una sociedad y cómo responden los socios dependen de cada país; por ejemplo, en España las sociedades civiles se rigen por el Código Civil y las mercantiles por su propia legislación, con reglas distintas de responsabilidad. Verifica las reglas de tu jurisdicción.')],
'020':[('los requisitos varían mucho según el lugar y la industria;','los requisitos varían mucho según el lugar y la industria; por ejemplo, en España muchas actividades requieren una licencia de actividad o una declaración responsable ante el ayuntamiento, además del alta en el censo de Hacienda y de los permisos propios de cada sector.)*')],
}
R021=[
('El EIN es un concepto propio de EE. UU. (también se usa en Puerto Rico); otros países usan sistemas distintos de identificación fiscal de negocios, como el RNC en la República Dominicana.','El EIN es un concepto propio de EE. UU.; otros países usan sistemas distintos de identificación fiscal de negocios, como el NIF en España.'),
('Recursos de la autoridad fiscal federal de EE. UU. (para estudiantes de EE. UU. y Puerto Rico)','Recursos de la autoridad fiscal federal de EE. UU. (para estudiantes con negocios en EE. UU.); en España, la Agencia Tributaria'),
('(por ejemplo, el RNC en la República Dominicana)','(por ejemplo, el NIF que asigna la Agencia Tributaria en España)'),
('menciona el equivalente dominicano (RNC)','menciona el equivalente español (NIF)'),
]
R=[
('Un suplidor (proveedor)','Un proveedor'),('suplidores','proveedores'),('suplidor','proveedor'),('Suplidores','Proveedores'),('Suplidor','Proveedor'),
('Ventas y mercadeo','Ventas y marketing'),('mercadeo','marketing'),('Mercadeo','Marketing'),
('a efectos contributivos','a efectos fiscales'),('contributivas','fiscales'),('contributivos','fiscales'),('contributiva','fiscal'),('contributivo','fiscal'),
('flujo de efectivo','flujo de caja'),('Flujo de efectivo','Flujo de caja'),
('balance general','balance de situación'),('Balance general','Balance de situación'),
('Un estado de ganancias y pérdidas (también llamado estado de resultados)','Una cuenta de pérdidas y ganancias (también llamada cuenta de resultados)'),
('Un estado de ganancias y pérdidas','Una cuenta de pérdidas y ganancias'),('un estado de ganancias y pérdidas','una cuenta de pérdidas y ganancias'),
('El estado de ganancias y pérdidas','La cuenta de pérdidas y ganancias'),('el estado de ganancias y pérdidas','la cuenta de pérdidas y ganancias'),('del estado de ganancias y pérdidas','de la cuenta de pérdidas y ganancias'),
('Estado de ganancias y pérdidas','Cuenta de pérdidas y ganancias'),('estado de ganancias y pérdidas','cuenta de pérdidas y ganancias'),
('su carro','su coche'),('venta al detal','venta al por menor'),('al detal','al por menor'),('empacar','empaquetar'),('dicta el patrono','dicta la empresa'),
('penalidades','sanciones'),('penalidad','sanción'),
('## Prueba de práctica','## Cuestionario de práctica'),
('una cuenta de pérdidas y ganancias y cómo leerlo','una cuenta de pérdidas y ganancias y cómo leerla'),
]
def nums(s,usd):
    def swap(m): return m.group(0).replace(',','\x00').replace('.',',').replace('\x00','.')
    s=re.sub(r'(?<![\w.])\d{1,3}(?:,\d{3})+(?:\.\d+)?|(?<![\w.,\-])\d+\.\d+(?![\d.])',swap,s)
    s=re.sub(r'(\d),(\d+)%',r'\1,\2 %',s); s=re.sub(r'(\d)%',r'\1 %',s)
    if not usd: s=re.sub(r'\$(\d+(?:[.,]\d+)*)',lambda m:m.group(1)+' €',s)
    return s
for f in sorted(glob.glob(src+'/b*.txt')):
    s=open(f,encoding='utf-8').read(); out=[]
    for ch in re.split(r'(?m)^(?====== )',s):
        m=re.match(r'===== BLUE-L1-(\d{3})',ch)
        if m:
            n=m.group(1)
            if n in NOTE:
                for start,rep in NOTE[n]:
                    i=ch.index(start)
                    j=ch.index(')*',i)+2 if rep.endswith(')*') else ch.index('\n',i)
                    ch=ch[:i]+rep+ch[j:]
            for a,b in R: ch=ch.replace(a,b)
            if n=='021':
                for a,b in R021:
                    assert a in ch,(n,a); ch=ch.replace(a,b)
            ch=nums(ch,n in KEEPUSD)
            assert 'República Dominicana' not in ch and 'Puerto Rico' not in ch and 'RNC' not in ch, n
        out.append(ch)
    open(dst+'/'+os.path.basename(f),'w',encoding='utf-8').write(''.join(out))
print('ok')
