import glob,re
A='por lo que conviene confirmarlo con un abogado'; F='por lo que conviene confirmarlo con un asesor fiscal'; B='por lo que conviene confirmarlo con su banco'; L='por lo que conviene confirmarlo con un asesor laboral'; D='por lo que conviene confirmarlo con un agente de aduanas'
E='en España, por ejemplo, '
S=[E+"el comprador de activos puede amortizar los bienes por su valor de adquisición en el Impuesto sobre Sociedades, mientras que el vendedor persona física suele preferir vender participaciones, que tributan en la base del ahorro del IRPF, "+F,
E+"en el IRPF las ganancias de operaciones con precio aplazado a más de un año pueden imputarse a medida que se cobran los pagos, "+F,
E+"las comisiones forman parte del salario, así que la empresa debe practicar la retención del IRPF y cotizar a la Seguridad Social sobre ellas, "+L,
E+"la Ley 12/1992 del Contrato de Agencia puede dar al agente una indemnización por clientela al terminar el contrato, y los tribunales a veces la extienden a distribuidores, "+A,
E+"según el Plan General de Contabilidad una marca creada internamente no suele registrarse como activo, mientras que una marca adquirida sí y se amortiza, y conviene registrarla en la Oficina Española de Patentes y Marcas, "+F,
E+"el negocio debe darse de alta en el censo de empresarios de la Agencia Tributaria y repercutir el IVA, y las ventas a consumidores de otros países de la UE pueden declararse por la ventanilla única (OSS), "+F,
E+"el IVA de un anticipo se devenga en el momento del cobro, mientras que la contabilidad reconoce el ingreso a medida que se presta el servicio, "+F,
E+"los gastos de publicidad suelen ser deducibles en el Impuesto sobre Sociedades si están contabilizados, justificados con factura y relacionados con la actividad, "+F,
E+"el vendedor responde por los vicios ocultos según el Código Civil, la publicidad inmobiliaria engañosa está prohibida por la normativa de consumo y algunas comunidades autónomas exigen información adicional en la venta de viviendas, "+A,
E+"una oferta pública de valores está supervisada por la CNMV y puede exigir un folleto salvo que se aplique una excepción por número de inversores o importe, y las declaraciones falsas pueden generar responsabilidad, "+A,
E+"la Ley General para la Defensa de los Consumidores y Usuarios prohíbe las prácticas engañosas y los comercios deben indicar el precio por unidad de medida, "+A,
E+"el Impuesto sobre Sociedades permite compensar las bases imponibles negativas de años anteriores en ejercicios futuros dentro de ciertos límites anuales, "+F,
E+"en situaciones de emergencia declaradas el Gobierno puede adoptar medidas sobre precios de productos esenciales, y la normativa de consumo sanciona los abusos, "+A,
E+"los vendedores no establecidos que venden a consumidores en España pueden tener que declarar el IVA por la ventanilla única, y en Canarias, Ceuta y Melilla no se aplica el IVA sino impuestos propios, "+F,
E+"el euro es la moneda local, así que el riesgo cambiario surge al vender o comprar en otras monedas, y las diferencias de cambio se integran en la base imponible del Impuesto sobre Sociedades, "+F,
E+"la Ley 15/2007 de Defensa de la Competencia y el Derecho de la UE prohíben en general que el proveedor fije el precio de reventa, y la CNMC vigila estos acuerdos, "+A,
E+"la normativa de consumo exige que darse de baja de un servicio sea tan sencillo como darse de alta y prohíbe cobros no autorizados, "+A,
E+"el factoring y el confirming son habituales y las entidades suelen limitar la parte de un solo deudor, y la Ley de Morosidad fija plazos máximos de pago entre empresas, "+B,
E+"los gastos ordinarios de crear contenido suelen ser gasto del ejercicio, mientras que el desarrollo de una web o un software puede activarse como inmovilizado intangible y amortizarse, "+F,
E+"la Ley General de Publicidad, la Ley de Competencia Desleal y el código de conducta de Autocontrol sobre influencers exigen identificar con claridad la publicidad, por ejemplo con la etiqueta #publi, "+A,
E+"la venta de oro de inversión está exenta de IVA y los comerciantes de metales preciosos son sujetos obligados de la Ley 10/2010 de prevención del blanqueo de capitales, "+A,
E+"el Fondo de Garantía de Depósitos cubre los depósitos hasta 100.000 euros por titular y entidad, y las entidades que asesoran deben evaluar la idoneidad según las normas MiFID supervisadas por la CNMV, por lo que conviene confirmarlo con la CNMV o con su entidad",
E+"el factoring, el confirming y el descuento comercial son habituales, y CESCE ofrece seguros de crédito a la exportación, "+B,
E+"la reserva de dominio y la prenda sin desplazamiento sobre bienes muebles pueden inscribirse en el Registro de Bienes Muebles para oponerse a terceros, "+A,
E+"la Ley 9/2017 de Contratos del Sector Público regula las licitaciones, que se publican en la Plataforma de Contratación del Sector Público, "+A,
E+"aplican el RGPD y la Ley Orgánica de Protección de Datos, la LSSI exige consentimiento previo para enviar comunicaciones comerciales por correo electrónico salvo a clientes previos, y las brechas deben notificarse a la AEPD en 72 horas, "+A,
E+"la Ley 15/2007 de Defensa de la Competencia prohíbe los acuerdos entre competidores que restrinjan la competencia, y la CNMC publica criterios sobre cooperación, "+A,
E+"el franquiciador debe entregar al futuro franquiciado información precontractual por escrito con antelación a la firma según la Ley de Ordenación del Comercio Minorista y su reglamento, "+A,
E+"la ganancia por vender participaciones tributa para una persona física en la base del ahorro del IRPF, mientras que una venta de activos tributa primero en el Impuesto sobre Sociedades y otra vez al repartir el dinero, "+F,
E+"una ganancia con precio aplazado puede imputarse a medida que se cobran los pagos, y la parte contingente de un earnout puede tributar cuando se materializa, "+F,
E+"las recompensas por recomendación deben identificarse como publicidad y las afirmaciones sobre resultados o ingresos deben poder probarse según la normativa de publicidad y consumo, "+A,
E+"el reglamento europeo sobre bloqueo geográfico impide discriminar a clientes de otros países de la UE por su nacionalidad o residencia en las ventas en línea, aunque permite ofertas distintas en condiciones distintas, "+A,
E+"el etiquetado de alimentos, incluida la información sobre alérgenos, sigue el Reglamento europeo 1169/2011 con supervisión de la AESAN, y los alimentos para animales tienen normas propias, "+A,
E+"como parte de la unión aduanera de la UE se aplica el Arancel Aduanero Común, y los acuerdos comerciales de la UE pueden reducir los aranceles si se cumplen las normas de origen, "+D,
E+"los gastos de atenciones a clientes son deducibles en el Impuesto sobre Sociedades con un límite ligado a la cifra de negocios, "+F,
E+"las ventas a distancia a consumidores de otros países de la UE por encima del umbral comunitario tributan en el país de destino y pueden declararse por la ventanilla única, y en Canarias se aplica el IGIC, "+F,
E+"no existe una norma general que proteja las disculpas y lo que se reconozca puede usarse como prueba, mientras que los productos inseguros deben comunicarse a las autoridades de consumo, "+A,
E+"los autónomos suelen hacer pagos fraccionados trimestrales del IRPF y las sociedades pagos fraccionados del Impuesto sobre Sociedades, "+F,
E+"la Ley 15/2007 de Defensa de la Competencia prohíbe los acuerdos para fijar precios y el abuso de posición dominante, y la Ley de Ordenación del Comercio Minorista limita la venta a pérdida, "+A,
E+"comercializar participaciones en una inversión inmobiliaria colectiva puede estar sujeto a la supervisión de la CNMV, a las normas de financiación participativa o a las de instituciones de inversión colectiva, "+A,
E+"la normativa de consumo prohíbe cobrar pagos adicionales que el consumidor no haya aceptado expresamente, como las casillas premarcadas, y la distribución de seguros está supervisada por la Dirección General de Seguros y Fondos de Pensiones, "+A,
E+"las sociedades tributan en el Impuesto sobre Sociedades a un tipo general con tipos reducidos para algunas empresas, y los gastos de publicidad suelen ser deducibles, "+F,
E+"el plan debe incluir el alta censal, el IVA o el IGIC en Canarias y las obligaciones de facturación, "+F]
LAB=['006', '007', '008', '009', '010', '001', '002', '003', '004', '005', '011', '012', '013', '014', '015', '016', '017', '018', '019', '020', '026', '027', '028', '029', '030', '021', '022', '023', '024', '025', '036', '037', '038', '040', '032', '033', '034', '046', '049', '041', '042', '043', '045']
S=[x for _,x in sorted(zip(LAB,S))]
k=0; P=re.compile(r'en Puerto Rico, por ejemplo,[^\n]*?por lo que conviene confirmarlo con (?:un|una|el|la|su|sus) [^;:.)\n]*?(?=[;:.)])')
for f in sorted(glob.glob('work/ORANGE-L5-es-ES/*.txt')):
    s=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1; return r
    s=P.sub(rep,s)
    s=s.replace('un CPA','un asesor fiscal').replace('CPA','asesor fiscal').replace('Puerto Rico','España').replace('Hacienda de España','Hacienda')
    open(f,'w',encoding='utf-8').write(s)
print('replaced',k,'of',len(S))
