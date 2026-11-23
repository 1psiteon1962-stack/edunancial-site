import glob,re
A='por lo que conviene confirmarlo con un abogado'; F='por lo que conviene confirmarlo con un asesor fiscal'; N='por lo que conviene confirmarlo con un notario'
S=["en España, por ejemplo, junto al Código Civil común conviven derechos civiles forales o especiales en territorios como Cataluña, Aragón, Navarra, el País Vasco, Galicia y Baleares, que pueden cambiar las reglas sobre familia y herencia, "+A,
"en España, por ejemplo, la sociedad limitada y la sociedad anónima se rigen por la Ley de Sociedades de Capital y tributan en el Impuesto sobre Sociedades, mientras que el empresario individual tributa en el IRPF, "+F,
"en España, por ejemplo, las operaciones entre partes vinculadas deben valorarse a precio de mercado según la Ley del Impuesto sobre Sociedades y pueden exigir documentación específica, "+F,
"en España, por ejemplo, aportar un inmueble a una sociedad requiere escritura pública ante notario e inscripción en el Registro de la Propiedad, y puede generar una ganancia patrimonial en el IRPF y la plusvalía municipal, "+N,
"en España, por ejemplo, cuando los estatutos sociales o el pacto de socios guardan silencio se aplican las reglas de la Ley de Sociedades de Capital, que pueden no ajustarse a lo que querían los socios, "+A,
"en España, por ejemplo, la indemnización de un seguro de vida por fallecimiento suele tributar en el Impuesto sobre Sucesiones y Donaciones del beneficiario, y la compra de las participaciones del socio fallecido puede tener sus propias consecuencias fiscales, "+F,
"en España, por ejemplo, no existe una protección general de la vivienda habitual frente a los acreedores como el homestead de algunos estados, aunque la Ley de Enjuiciamiento Civil declara inembargables parte del salario y ciertos bienes, "+A,
"en España, por ejemplo, el Tribunal Supremo aplica la doctrina del levantamiento del velo cuando la sociedad se usa para defraudar o abusar del derecho, y los administradores pueden responder personalmente según la Ley de Sociedades de Capital, "+A,
"en España, por ejemplo, el testamento abierto se otorga ante notario, la ley reserva una legítima a los herederos forzosos, y si no hay testamento se tramita una declaración de herederos, además del Impuesto sobre Sucesiones, "+N,
"en España, por ejemplo, el derecho común no regula el trust anglosajón como figura propia y suelen usarse otras figuras como fundaciones o la fiducia de algunos derechos forales, y los trusts extranjeros pueden generar obligaciones de información ante Hacienda, "+F,
"en España, por ejemplo, la copropiedad suele ser una comunidad de bienes por cuotas sin derecho automático de acrecer para el superviviente, salvo que se pacte otra cosa o lo determine el régimen matrimonial, "+N,
"en España, por ejemplo, el plan de pensiones se paga a los beneficiarios designados y la prestación que cobran suele tributar como rendimiento del trabajo en su IRPF, "+F,
"en España, por ejemplo, la venta de participaciones por un particular suele tributar como ganancia patrimonial en la base del ahorro del IRPF, y la transmisión de la empresa familiar puede tener reducciones en el Impuesto sobre Sucesiones y Donaciones si se cumplen los requisitos, "+F,
"en España, por ejemplo, el acreedor puede ejercer la acción pauliana del Código Civil contra los actos hechos en fraude de acreedores, y en un concurso la Ley Concursal permite rescindir ciertos actos perjudiciales, "+A,
"en España, por ejemplo, la Dirección General de Seguros y Fondos de Pensiones supervisa a las aseguradoras y a los mediadores, y el Consorcio de Compensación de Seguros cubre ciertos riesgos extraordinarios, por lo que conviene confirmarlo con un corredor de seguros",
"en España, por ejemplo, la Ley de Arrendamientos Urbanos obliga al arrendador a hacer las reparaciones necesarias para conservar la vivienda habitable, y el desahucio solo puede hacerse por vía judicial, "+A,
"en España, por ejemplo, los derechos consolidados de los planes de pensiones no suelen poder embargarse hasta que son disponibles, aunque las aportaciones hechas para perjudicar a los acreedores pueden impugnarse, "+A,
"en España, por ejemplo, el régimen supletorio en el derecho común es la sociedad de gananciales, mientras que en Cataluña y Baleares es la separación de bienes, y las capitulaciones matrimoniales se otorgan ante notario, "+N,
"en España, por ejemplo, el tratamiento fiscal de una indemnización pagada por el vendedor por incumplir las manifestaciones y garantías puede variar según cómo se haya pactado, "+F,
"en España, por ejemplo, muchas actividades necesitan licencia o declaración responsable ante el ayuntamiento, y la exportación de productos de doble uso requiere autorización del Ministerio competente, "+A,
"en España, por ejemplo, la ganancia por vender acciones suele tributar en la base del ahorro del IRPF con tipos progresivos, y las sociedades pueden aplicar una exención por participaciones significativas si se cumplen los requisitos, "+F,
"en España, por ejemplo, la hipoteca se constituye en escritura pública ante notario y solo nace con su inscripción en el Registro de la Propiedad, "+N,
"en España, por ejemplo, es habitual firmar primero un contrato de arras con una señal, y las arras penitenciales del Código Civil permiten desistir perdiendo o devolviendo duplicada la señal, antes de otorgar la escritura ante notario, "+N,
"en España, por ejemplo, las obras de mejora del arrendatario suelen amortizarse según su vida útil, y la aportación del arrendador a esas obras puede tener efectos fiscales para ambas partes, "+F,
"en España, por ejemplo, el desahucio por impago se tramita ante los juzgados, y las viviendas de uso turístico necesitan licencia o registro según la comunidad autónoma y el municipio, "+A,
"en España, por ejemplo, el Impuesto sobre Sociedades ofrece deducciones por investigación, desarrollo e innovación y una reducción de las rentas procedentes de ciertos activos intangibles, "+F,
"en España, por ejemplo, la marca puede registrarse en la Oficina Española de Patentes y Marcas o en la Oficina de Propiedad Intelectual de la Unión Europea, y el titular puede pedir a la aduana que retenga mercancías sospechosas de falsificación, "+A,
"en España, por ejemplo, la Ley del Contrato de Agencia reconoce al agente una indemnización por clientela al terminar el contrato, y los tribunales la han extendido a veces a distribuidores, "+A,
"en España, por ejemplo, el Estatuto de los Trabajadores considera relación laboral la que tiene dependencia y ajenidad, y los llamados falsos autónomos pueden ser reclasificados como trabajadores, "+A,
"en España, por ejemplo, el pacto de no competencia tras el contrato de trabajo no puede durar más de dos años para técnicos ni seis meses para los demás trabajadores y exige un interés empresarial efectivo y una compensación económica adecuada, "+A,
"en España, por ejemplo, la oferta pública de valores exige en general un folleto aprobado por la Comisión Nacional del Mercado de Valores, salvo las excepciones previstas, "+A,
"en España, por ejemplo, las plataformas de financiación participativa deben estar autorizadas por la Comisión Nacional del Mercado de Valores bajo el reglamento europeo de crowdfunding, "+A,
"en España, por ejemplo, la publicidad engañosa está regulada por la Ley General de Publicidad y la Ley de Competencia Desleal, además de las normas de consumo, "+A,
"en España, por ejemplo, enviar comunicaciones comerciales por correo electrónico exige en general el consentimiento previo según la LSSI, y las brechas de datos personales deben notificarse a la Agencia Española de Protección de Datos en un plazo de 72 horas, "+A,
"en España, por ejemplo, el Reglamento europeo Roma I respeta en general la ley elegida por las partes en un contrato, y España es parte del Convenio de Nueva York sobre laudos arbitrales extranjeros, "+A,
"en España, por ejemplo, el Código Civil exonera en general de responsabilidad por caso fortuito o fuerza mayor, y el Tribunal Supremo ha aplicado de forma restrictiva la doctrina rebus sic stantibus, "+A,
"en España, por ejemplo, los pleitos civiles se ven ante los juzgados sin jurado, y desde 2025 la ley exige en muchos casos intentar antes un medio adecuado de solución de controversias como la mediación, "+A,
"en España, por ejemplo, rige en general el criterio del vencimiento, por el que la parte que pierde paga las costas de la otra, con ciertos límites, "+A,
"en España, por ejemplo, las empresas de servicios de inversión y los asesores financieros deben estar autorizados por la Comisión Nacional del Mercado de Valores y evaluar la idoneidad de sus recomendaciones, "+A,
"en España, por ejemplo, las sociedades deben depositar cada año sus cuentas anuales en el Registro Mercantil, y no hacerlo puede llevar al cierre de la hoja registral y a multas, "+A,
"en España, por ejemplo, muchas familias usan una sociedad patrimonial o holding y un protocolo familiar, y la empresa familiar puede tener una reducción importante en el Impuesto sobre Sucesiones y Donaciones si se cumplen los requisitos, "+F,
"en España, por ejemplo, los donativos a entidades acogidas a la ley de mecenazgo pueden dar derecho a deducción en el IRPF o en el Impuesto sobre Sociedades dentro de ciertos límites, "+F,
"en España, por ejemplo, la acción por responsabilidad extracontractual prescribe en general en un año según el Código Civil, y las acciones personales sin plazo especial en cinco años, "+A,
"en España, por ejemplo, una sentencia del Tribunal Supremo, del Tribunal Constitucional o del Tribunal de Justicia de la Unión Europea puede cambiar la interpretación de una norma mientras dura el pleito, "+A,
"en España, por ejemplo, la Ley de Enjuiciamiento Civil permite imponer multas por mala fe procesal y condenar en costas a quien litiga con temeridad, "+A]
k=0; P=re.compile(r'en Puerto Rico, por ejemplo,[^\n]*?por lo que conviene confirmarlo con (?:un|una|el|la|su|sus) [^;:.)\n]*?(?=[;:.)])')
for f in sorted(glob.glob('work/PURPLE-L5-es-ES/*.txt')):
    s=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1; return r
    s=P.sub(rep,s)
    s=s.replace('un CPA','un asesor fiscal').replace('CPA','asesor fiscal').replace('Puerto Rico','España').replace('Hacienda de España','Hacienda')
    open(f,'w',encoding='utf-8').write(s)
print('replaced',k,'of',len(S))
