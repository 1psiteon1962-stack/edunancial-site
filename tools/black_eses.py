# Derive GREEN L1 es-ES from es-Caribbean batches: Spain vocabulary, number format, euro amounts, Spain regional notes.
import re,glob,os
src='/home/claude/l5work/work/fix/BLACK-L1-es-Caribbean'; dst='/home/claude/l5work/work/fix/BLACK-L1-es-ES'
NOTES=[]
XX=[
(re.compile(r'\(En Puerto Rico, por ejemplo, la contribución sobre la propiedad inmueble[^)]*\)'),'(En España, por ejemplo, los ayuntamientos cobran a los propietarios el Impuesto sobre Bienes Inmuebles (IBI). Las reglas y exenciones varían, así que verifique las vigentes en su jurisdicción.)'),
(re.compile(r'\(En Puerto Rico, por ejemplo, los empleados y patronos aportan[^)]*\)'),'(En España, por ejemplo, las cotizaciones a la Seguridad Social se reparten entre la empresa y el trabajador.)'),
(re.compile(r'\(Ejemplos de impuestos al consumo en el Caribe[^)]*\)'),'(Un ejemplo de impuesto al consumo en España es el IVA.)'),
(re.compile(r'\(En Puerto Rico, por ejemplo, el comprobante de retención[^)]*\)'),'(En España, por ejemplo, la empresa practica retenciones a cuenta del IRPF sobre la nómina del trabajador, mientras que los trabajadores autónomos suelen hacer pagos fraccionados trimestrales del impuesto. Verifique las reglas vigentes en su jurisdicción.)'),
]
R=[('flujo de efectivo','flujo de caja'),('Flujo de efectivo','Flujo de caja'),('Un inversionista','Un inversor'),('un inversionista','un inversor'),('inversionistas','inversores'),('inversionista','inversor'),('manejar','gestionar'),
('Un patrono','Un empleador'),('un patrono','un empleador'),('El patrono','El empleador'),('el patrono','el empleador'),('los patronos','los empleadores'),('Los patronos','Los empleadores'),('patronos','empleadores'),('patrono','empleador'),
('talonarios de pago','recibos de nómina'),('talonario de pago','recibo de nómina'),('talonarios','recibos de nómina'),('talonario','recibo de nómina'),
('cheques de pago','pagos de nómina'),('cheque de pago','pago de nómina'),('cheque por cheque','nómina a nómina'),('del cheque del empleado','de la nómina del empleado'),('su cheque','su nómina'),
('cuentas de retiro','cuentas de jubilación'),('cuenta de retiro','cuenta de jubilación'),('plan de retiro','plan de jubilación'),('planes de retiro','planes de jubilación'),('sistemas de retiro','sistemas de jubilación'),('sistemas públicos de retiro','sistemas públicos de jubilación'),
('aportes para el retiro','aportes para la jubilación'),('ahorro para el retiro','ahorro para la jubilación'),('ahorren para el retiro','ahorren para la jubilación'),('para el retiro','para la jubilación'),('durante el retiro','durante la jubilación'),('en el retiro','en la jubilación'),('del retiro','de la jubilación'),('de retiro','de jubilación'),('el retiro','la jubilación'),
('las del retiro','las de la jubilación'),
('penalidades','sanciones'),('penalidad','sanción'),
('una computadora portátil','un ordenador portátil'),('Una computadora portátil','Un ordenador portátil'),('La computadora probablemente no se habría comprado','El ordenador probablemente no se habría comprado'),('la computadora está claramente ligada','el ordenador está claramente ligado'),('computadora','ordenador'),
('mercadeo','marketing'),('carros','coches'),('Un carro privado','Un coche privado'),('carro','coche'),('al detal','al por menor'),
('suplidores','proveedores'),('suplidor','proveedor'),('botar','tirar'),('Botar','Tirar'),
('costos','costes'),('Costos','Costes'),('costo','coste'),('Costo','Coste'),
('calificado','cualificado'),('bienes raíces','bienes inmuebles'),
('una cuadra a otra','una calle a otra'),('tiendas en línea','tiendas online'),
('## Prueba práctica','## Cuestionario práctico'),
('dólar por dólar','euro por euro'),('Dólar por dólar','Euro por euro'),('por cada dólar','por cada euro'),('cada dólar','cada euro'),('mismo dólar','mismo euro'),('cantidad de dólares','cantidad de euros'),('dólares','euros'),('Dólares','Euros'),('dólar','euro'),
]
def nums(s):
    def swap(m): return m.group(0).replace(',','\x00').replace('.',',').replace('\x00','.')
    s=re.sub(r'(?<![\w.])\d{1,3}(?:,\d{3})+(?:\.\d+)?|(?<![\w.,\-])\d+\.\d+(?![\d.])',swap,s)
    s=re.sub(r'(\d),(\d+)%',r'\1,\2 %',s); s=re.sub(r'(\d)%',r'\1 %',s)
    s=re.sub(r'\$(\d+(?:[.,]\d+)*)',lambda m:m.group(1)+' €',s)
    return s
for f in sorted(glob.glob(src+'/b*.txt')):
    s=open(f,encoding='utf-8').read(); out=[]
    for ch in re.split(r'(?m)^(?====== )',s):
        if ch.startswith('====='):
            for rx,rep in NOTES: ch=rx.sub(rep,ch)
            for a,b in R: ch=ch.replace(a,b)
            ch=nums(ch)
            assert 'Puerto Rico' not in ch and 'Dominicana' not in ch, ch[:30]
        out.append(ch)
    open(dst+'/'+os.path.basename(f),'w',encoding='utf-8').write(''.join(out))
print('ok')
