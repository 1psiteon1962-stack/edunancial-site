# Derive RED L1 es-ES from es-Caribbean batches: Spain vocabulary, number format, euro amounts, Spain regional notes.
import re,glob,os
src='/home/claude/l5work/work/fix/RED-L1-es-Caribbean'; dst='/home/claude/l5work/work/fix/RED-L1-es-ES'
NOTES=[
(' En Puerto Rico, por ejemplo, la contribución sobre la propiedad inmueble la administra el CRIM, y en la República Dominicana existe el Impuesto al Patrimonio Inmobiliario, que administra la DGII.',' En España, por ejemplo, los ayuntamientos cobran a los propietarios el Impuesto sobre Bienes Inmuebles (IBI), calculado sobre el valor catastral.'),
(' En Puerto Rico y en la República Dominicana, por ejemplo, el cierre suele incluir honorarios notariales y derechos de inscripción en el registro de la propiedad; confirma los costos actuales con un notario o abogado local.',' En España, por ejemplo, la compraventa suele incluir gastos de notaría, de registro de la propiedad y de gestoría, además del impuesto que corresponda (ITP, o IVA y AJD en vivienda nueva); confirma los costes actuales con un notario o asesor local.'),
(' En Puerto Rico y en la República Dominicana las reglas de depreciación son distintas; consulta con un profesional de impuestos local.',' En España, la amortización de los inmuebles arrendados tiene sus propias reglas en el IRPF; consulta con un asesor fiscal.'),
(' El intercambio 1031 es una disposición del Código de Rentas Internas federal; si vives en Puerto Rico o en la República Dominicana, confirma con un profesional de impuestos si te aplica y cómo.',' El intercambio 1031 es una disposición del código tributario federal de EE. UU.; si resides en España no te aplica, y conviene consultar con un asesor fiscal cómo tributan allí las ganancias patrimoniales.'),
('esto describe la práctica común en EE. UU., que incluye a Puerto Rico; en otros países, como la República Dominicana, las reglas son distintas.','esto describe la práctica común en EE. UU.; en otros países las reglas son distintas. En España, por ejemplo, los daños por inundación suelen cubrirse como riesgo extraordinario a través del Consorcio de Compensación de Seguros.'),
]
R=[
# mortgage rate vocabulary
('Hipotecas de tasa fija frente a hipotecas de tasa ajustable','Hipotecas a tipo fijo frente a hipotecas a tipo variable'),
('### Hipotecas de tasa ajustable (ARM)','### Hipotecas a tipo variable (ARM)'),('hipotecas de tasa fija','hipotecas a tipo fijo'),('hipoteca de tasa fija','hipoteca a tipo fijo'),('Hipotecas de tasa fija','Hipotecas a tipo fijo'),
('hipotecas de tasa ajustable','hipotecas a tipo variable'),('hipoteca de tasa ajustable','hipoteca a tipo variable'),
('préstamos de tasa fija','préstamos a tipo fijo'),('prestatario con tasa fija','prestatario a tipo fijo'),('el de tasa fija','el de tipo fijo'),('las de tasa ajustable','las de tipo variable'),('las de tasa fija','las de tipo fijo'),
('una tasa fija comparable','un tipo fijo comparable'),
('una tasa de interés más baja','un tipo de interés más bajo'),('la misma tasa de interés','el mismo tipo de interés'),('una tasa de interés','un tipo de interés'),('la tasa de interés','el tipo de interés'),('las tasas de interés','los tipos de interés'),('tasas de interés','tipos de interés'),('tasa de interés','tipo de interés'),
('las tasas hipotecarias','los tipos hipotecarios'),('tasa de interés hipotecaria','tipo de interés hipotecario'),('el tipo de interés hipotecaria','el tipo de interés hipotecario'),
# down payment
('pronto pagos','pagos iniciales'),('pronto pago','pago inicial'),('(o pago inicial)','(o entrada)'),
# financing
('del financiamiento','de la financiación'),('El financiamiento','La financiación'),('el financiamiento','la financiación'),('del financiamiento','de la financiación'),('un faltante de financiamiento','un déficit de financiación'),('faltante de financiamiento','déficit de financiación'),('financiamiento','financiación'),
('la financiación hipotecario','la financiación hipotecaria'),('la financiación comercial se evalúa de forma distinta que el residencial','la financiación comercial se evalúa de forma distinta que la residencial'),
# rent
('cheques de renta','pagos de alquiler'),('cheque de renta','pago de alquiler'),('pagos de renta','pagos de alquiler'),('ingresos de alquiler','ingresos por alquiler'),('ingreso de alquiler','ingreso por alquiler'),
('cobrar una renta considerable','cobrar un alquiler considerable'),('la posible renta','el posible alquiler'),('la renta no pagada','el alquiler no pagado'),('La renta no pagada','El alquiler no pagado'),('renta no pagada','alquiler no pagado'),('de la renta cobrada','del alquiler cobrado'),('de la renta','del alquiler'),('la renta','el alquiler'),('de renta','de alquiler'),('con la renta','con el alquiler'),
('el posible alquiler no pagada','el posible alquiler no pagado'),('tipos de interés más bajas','tipos de interés más bajos'),('la financiación es distinto','la financiación es distinta'),('la financiación queda finalizado','la financiación queda finalizada'),
# real estate words
('agente de bienes raíces','agente inmobiliario'),('mercado local de bienes raíces','mercado inmobiliario local'),('una transacción de bienes raíces','una transacción inmobiliaria'),('inversionistas de bienes raíces','inversores inmobiliarios'),('inversión en bienes raíces','inversión inmobiliaria'),
('en bienes raíces','en el sector inmobiliario'),('Bienes raíces','Bienes inmuebles'),('bienes raíces','bienes inmuebles'),
('Una inversionista','Una inversora'),('una inversionista','una inversora'),('inversionistas','inversores'),('inversionista','inversor'),
('valorización','revalorización'),('se valoriza','se revaloriza'),('valorizándose','revalorizándose'),
('remodelaciones','reformas'),('remodelación','reforma'),('remodelar','reformar'),('remodelada','reformada'),
('Estimados','Presupuestos'),('estimados','presupuestos'),('un estimado','un presupuesto'),('Un estimado','Un presupuesto'),('el estimado','el presupuesto'),('cada estimado','cada presupuesto'),('Varios estimados','Varios presupuestos'),
('plomería','fontanería'),('comercio al detal','comercio al por menor'),('al detal','al por menor'),('lotificaciones','urbanizaciones'),
('un apartamento en un condominio','un piso en un edificio en régimen de comunidad'),('un edificio de condominios','un edificio de pisos'),('Un edificio de condominios','Un edificio de pisos'),('los condominios','los edificios de pisos'),
('préstamo para carros','préstamo para coches'),('carros','coches'),
('pies cuadrados','metros cuadrados'),('(a menudo a una o dos millas)','(a menudo a menos de tres kilómetros)'),('a una o dos millas de distancia','a menos de tres kilómetros'),
('manejar','gestionar'),('manejan','gestionan'),('maneja','gestiona'),
('costos','costes'),('Costos','Costes'),('costo','coste'),('Costo','Coste'),
('impuesto sobre la propiedad','impuesto sobre bienes inmuebles'),('impuestos sobre la propiedad','impuestos sobre bienes inmuebles'),('Impuesto sobre la propiedad','Impuesto sobre bienes inmuebles'),
('tributable','imponible'),
('## Prueba de práctica','## Cuestionario de práctica'),
('varios miles de dólares','varios miles de euros'),('dólares','euros'),
]
def nums(s):
    def swap(m): return m.group(0).replace(',','\x00').replace('.',',').replace('\x00','.')
    s=re.sub(r'(?<![\w.])\d{1,3}(?:,\d{3})+(?:\.\d+)?|(?<![\w.,\-])\d+\.\d+(?![\d.])',swap,s)
    s=re.sub(r'(\d),(\d+)%',r'\1,\2 %',s); s=re.sub(r'(\d)%',r'\1 %',s)
    s=re.sub(r'−\$(\d+(?:[.,]\d+)*)',lambda m:'−'+m.group(1)+' €',s)
    s=re.sub(r'\$(\d+(?:[.,]\d+)*)',lambda m:m.group(1)+' €',s)
    return s
for f in sorted(glob.glob(src+'/b*.txt')):
    s=open(f,encoding='utf-8').read(); out=[]
    for ch in re.split(r'(?m)^(?====== )',s):
        if ch.startswith('====='):
            for a,b in NOTES:
                ch=ch.replace(a,b)
            for a,b in R: ch=ch.replace(a,b)
            ch=nums(ch)
            assert 'Puerto Rico' not in ch and 'Dominicana' not in ch and '$' not in ch, ch[:30]
        out.append(ch)
    open(dst+'/'+os.path.basename(f),'w',encoding='utf-8').write(''.join(out))
print('ok')
