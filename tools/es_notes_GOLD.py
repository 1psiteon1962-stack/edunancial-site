import glob,re
S=["en España, por ejemplo, muchos seguros de hogar limitan la cobertura de joyas, dinero en efectivo y metales preciosos y exigen declararlos aparte, y lo guardado en una caja de seguridad bancaria no siempre está asegurado por el banco, por lo que conviene confirmarlo con un corredor de seguros",
"en España, por ejemplo, el Tesoro ha emitido bonos y obligaciones indexados a la inflación europea, cuyos rendimientos tributan como rendimientos del capital mobiliario en la base del ahorro del IRPF, por lo que conviene confirmarlo con un asesor fiscal",
"en España, por ejemplo, la normativa distingue entre inversores minoristas y profesionales, y el acceso a muchos fondos de capital riesgo o de inversión libre exige una inversión mínima elevada o la condición de inversor profesional, bajo la supervisión de la CNMV, por lo que conviene confirmarlo con un asesor financiero registrado",
"en España, por ejemplo, entrar o salir de la Unión Europea llevando oro de inversión o medios de pago por valor de 10 000 euros o más obliga a declararlo en la aduana, por lo que conviene confirmarlo con la Agencia Tributaria o con un agente de aduanas",
"en España, por ejemplo, los planes de pensiones invierten según su propia política y no permiten guardar lingotes físicos a nombre del partícipe, y aunque el oro de inversión está exento de IVA, sus ganancias tributan en la base del ahorro del IRPF, por lo que conviene confirmarlo con un asesor fiscal",
"en España, por ejemplo, no existe un tipo especial para los objetos de colección, y la ganancia por vender oro, arte o coleccionables suele tributar como ganancia patrimonial en la base del ahorro del IRPF, por lo que conviene confirmarlo con un asesor fiscal",
"en España, por ejemplo, quien compra y vende con habitualidad y medios organizados puede estar realizando una actividad económica que tributa en el IRPF como rendimiento de actividad y puede estar sujeta al IVA, mientras que el inversor particular tributa por ganancias patrimoniales, por lo que conviene confirmarlo con un asesor fiscal",
"en España, por ejemplo, trasladar la residencia desde fuera de la Unión Europea puede permitir importar los bienes personales con franquicia aduanera, pero el oro de inversión y los objetos de valor pueden tener que declararse, y al salir de la Unión Europea se aplica la declaración de medios de pago, por lo que conviene confirmarlo con un agente de aduanas",
"en España, por ejemplo, no existe un tipo máximo especial para los objetos de colección como en Estados Unidos, y la ganancia suele integrarse en la base del ahorro del IRPF con su escala progresiva, por lo que conviene confirmarlo con un asesor fiscal"]
k=0; P=re.compile(r'en Puerto Rico, por ejemplo,.*?por lo que conviene confirmarlo con (?:un|una|el|la) [^;:]*?(?=[;:])',re.S)
for f in sorted(glob.glob('work/GOLD-L5-es-ES/*.txt')):
    s=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1; return r
    s=P.sub(rep,s)
    s=s.replace('un CPA','un asesor fiscal').replace('CPA','asesor fiscal').replace('Puerto Rico','España')
    open(f,'w',encoding='utf-8').write(s)
print('replaced',k,'of',len(S))
# post: sed 's/promedio del costo en dólares/promedio del coste en euros/g; s/cantidad fija en dólares/cantidad fija en euros/g'
