import re,sys,glob,os
repo,level=sys.argv[1],sys.argv[2]
US=re.compile(r'FHA|\bVA\b|IRS|401\(k\)|Fannie|Freddie|EE\.\s?UU\.|Estados Unidos|Seguro Social|Medicare|Roth|\bIRA\b|W-2|1099|SBA|\bSEC\b|FDIC|1031|Hacienda federal')
def cap(src,dst): return dst[0].upper()+dst[1:] if src[0].isupper() else dst
R=[ # (pattern, replacement) applied in order; case-insensitive with capitalisation kept
 (r'\b(la|una|esta|esa) tasa de interés (más )?alta\b', None),
]
def sub(pat,rep,t):
    return re.sub(pat,lambda m: cap(m.group(0),rep(m) if callable(rep) else m.expand(rep)),t,flags=re.I)
ART_F2M={'la':'el','una':'un','esta':'este','esa':'ese','las':'los','unas':'unos','estas':'estos','esas':'esos','nuestra':'nuestro','cada':'cada','su':'su','tu':'tu','sus':'sus','tus':'tus'}
ART_M2F={v:k for k,v in ART_F2M.items() if k not in('cada','su','tu','sus','tus')}
ADJ_F2M={'alta':'alto','baja':'bajo','fija':'fijo','variable':'variable','promedio':'promedio','anual':'anual','efectiva':'efectivo','nominal':'nominal','actual':'actual','vigente':'vigente'}
def conv(t):
    # tasa(s) de interés -> tipo(s) de interés with agreement
    def tasa(m):
        art,pl,adv,adj=m.group(1),m.group(2),m.group(3) or '',m.group(4) or ''
        a=''
        if art:
            a=ART_F2M.get(art.lower(),art)+' '
        n='tipos' if pl else 'tipo'
        ad=''
        if adj:
            base=adj.lower(); plural=base.endswith('s') and base not in('variables',)
            b=base[:-1] if base.endswith('as') else base
            mm=ADJ_F2M.get(b,ADJ_F2M.get(base,base))
            if base.endswith('as'): mm=mm+'s'
            ad=' '+adv+mm
        return a+n+' de interés'+ad
    t=re.sub(r'\b(?:(la|las|una|unas|esta|estas|esa|esas|nuestra|cada|su|sus|tu|tus) )?tasa(s)? de interés(?: (más |menos )?(altas?|bajas?|fijas?|variables?|promedio|anual(?:es)?|efectivas?|nominal(?:es)?|actual(?:es)?|vigentes?)\b)?',
             lambda m: cap(m.group(0),tasa(m)),t,flags=re.I)
    # retiro (retirement) -> jubilación, keep 'un retiro' (retreat)
    t=sub(r'\bdel retiro\b','de la jubilación',t)
    t=sub(r'\bal retiro\b','a la jubilación',t)
    t=sub(r'\bel retiro\b','la jubilación',t)
    t=sub(r'\b(su|tu|sus|tus|de|para|hacia|antes del|para su|para tu) retiro\b',lambda m:m.group(1)+' jubilación',t)
    t=sub(r'\bretiro (anticipado|temprano)\b',lambda m:'jubilación anticipada',t)
    # renta (rent) -> alquiler, protecting income tax uses
    t=re.sub(r'\b(sobre la|de la|la) renta (fija|variable|imponible|gravable|disponible|neta|bruta)\b',lambda m:'\x00'+m.group(0)+'\x01',t,flags=re.I)
    t=re.sub(r'sobre la renta','\x02',t,flags=re.I)
    def renta(m):
        art=(m.group(1) or '')
        pl=m.group(2)
        a={'la':'el','una':'un','las':'los','de la':'del','a la':'al'}.get(art.lower().strip(),art.strip())
        n='alquileres' if pl else 'alquiler'
        return (a+' ' if a else '')+n
    t=re.sub(r'(?<![\x00\w])\b(?:(la|una|las|de la|a la|su|tu|sus|tus|de|en) )?renta(s)?\b(?![\x01])',lambda m: cap(m.group(0),renta(m)),t,flags=re.I)
    t=t.replace('\x02','sobre la renta')
    t=re.sub('[\x00\x01]','',t)
    # puntaje -> puntuación
    t=sub(r'\b(el|un|del|al) puntaje\b',lambda m:{'el':'la','un':'una','del':'de la','al':'a la'}[m.group(1).lower()]+' puntuación',t)
    t=sub(r'\bpuntajes\b','puntuaciones',t); t=sub(r'\bpuntaje\b','puntuación',t)
    # computadora -> ordenador
    t=sub(r'\b(la|una) computadora\b',lambda m:{'la':'el','una':'un'}[m.group(1).lower()]+' ordenador',t)
    t=sub(r'\bcomputadoras\b','ordenadores',t); t=sub(r'\bcomputadora\b','ordenador',t)
    # simple swaps
    for a,b in [('cuenta de cheques','cuenta corriente'),('cuentas de cheques','cuentas corrientes'),('chequeras','talonarios'),('chequera','talonario'),
                ('mercadeo','marketing'),('carros','coches'),('carro','coche'),('celulares','móviles'),('celular','móvil'),
                ('costos','costes'),('costo','coste'),('jugo','zumo'),('estacionamiento','aparcamiento'),('rentar','alquilar'),
                ('boletos','billetes'),('boleto','billete'),('meseros','camareros'),('mesero','camarero')]:
        t=sub(r'\b'+a+r'\b',b,t)
    # manejar (verb) -> gestionar
    t=sub(r'\bmanej(ar|a|an|as|amos|ó|aron|ando|ado|ada|ados|adas|e|en|ará|arán|aría|arían|arlo|arla|arlos|arlas)\b',lambda m:'gestion'+m.group(1),t)
    # bienes raíces
    t=sub(r'\ben (los )?bienes raíces\b','en el sector inmobiliario',t)
    t=sub(r'\binversionistas? (en|de) bienes raíces\b',lambda m:m.group(0).split()[0]+' inmobiliario'+('s' if m.group(0).split()[0].lower().endswith('s') else ''),t)
    MASC='sector|mercado|abogado|desarrollo|financiamiento|contrato|negocio|portafolio|proyecto|tema|préstamo|patrimonio|crédito|fondo|ciclo|valor|profesional|agente|corredor|activo|inversor|análisis|equipo|especialista|asesor'
    FEMN='decisión|transacción|compra|sindicación|tenencia|propiedad|oportunidad|negociación|inversión|cartera|empresa|agencia|operación|carrera|estrategia|ley|venta|industria|firma|experiencia|asesoría'
    def br(m):
        noun=m.group(1); low=noun.lower()
        pl=low.endswith('s') and not low.endswith('análisis')
        stem=low[:-2] if low.endswith(('ones','dades','ores','les','tes')) and pl else (low[:-1] if pl else low)
        if re.fullmatch(MASC,stem) or low=='análisis': return noun+' inmobiliario'+('s' if pl else '')
        if re.fullmatch(FEMN,stem): return noun+' inmobiliaria'+('s' if pl else '')
        return noun+' de bienes inmuebles'
    t=re.sub(r'\b(\w+) de bienes raíces\b(?= (?:residenciales|comerciales|industriales|locales|propios|ajenos)\b)',lambda m:m.group(1)+' de inmuebles',t,flags=re.I)
    t=re.sub(r'\b(\w+) de bienes raíces\b',br,t,flags=re.I)
    t=sub(r'\bbienes raíces\b','bienes inmuebles',t)
    t=sub(r'\binversionistas?\b',lambda m:'inversores' if m.group(0).lower().endswith('s') else 'inversor',t)
    return t
# fix 'inmobiliario' agreement after feminine/plural nouns
FEM=re.compile(r'\b(\w+?)(a|as|ión|iones|dad|dades) inmobiliario\b',re.I)
def agree(t):
    def f(m):
        w=m.group(1)+m.group(2); end=m.group(2).lower()
        pl=end.endswith('s')
        return w+' inmobiliaria'+('s' if pl else '')
    t=FEM.sub(f,t)
    t=re.sub(r'\b(\w+(?:os|es)) inmobiliario\b',lambda m:m.group(1)+(' inmobiliarias' if m.group(1).lower().endswith(('ones','dades')) else ' inmobiliarios'),t)
    return t
def money(l):
    if US.search(l): return l
    def f(m):
        n=m.group(1)
        n=n.replace(',','\x00').replace('.',',').replace('\x00','.')
        return n+(' '+m.group(2) if m.group(2) else '')+' €'
    return re.sub(r'\$(\d[\d,]*(?:\.\d+)?)(?:\s?(millones|mil|millón))?',f,l)
def conv_text(t): return '\n'.join(money(conv(l)) for l in t.split('\n'))
n=0
for src in sorted(glob.glob(f'{repo}/content/curriculum/*/L{level}/*.es-Caribbean.md')):
    s=open(src,encoding='utf-8').read()
    m=re.match(r'^---\n(.*?)\n---\n(.*)$',s,re.S)
    fm,body=m.group(1),m.group(2)
    fm=re.sub(r'(?m)^locale:.*$','locale: es-ES',fm)
    fm=re.sub(r'(?m)^(title|summary):\s*(.+)$',lambda mm: mm.group(1)+': '+conv_text(mm.group(2)),fm)
    out='---\n'+fm+'\n---\n'+conv_text(body)
    dst=src.replace('.es-Caribbean.md','.es-ES.md')
    open(dst,'w',encoding='utf-8').write(out); n+=1
print('wrote',n)
