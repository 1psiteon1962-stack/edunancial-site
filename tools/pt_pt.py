# pt_pt.py COLOR LEVEL : lexical pt-BR -> pt-PT pass, in place on work/{C}-{L}-pt-PT (run after copying + notes)
import sys,re,glob
C,L=sys.argv[1:3]; d=f'work/{C}-{L}-pt-PT'
W=[(r'\bPor que\b','Porque'),(r'\bpor que\b','porque'),('FATO VERIFICADO','FACTO VERIFICADO'),('## Gabarito','## Chave de Respostas'),
(r'\bde fato\b','de facto'),(r'\bDe fato\b','De facto'),(r'\bfato\b','facto'),(r'\bfatos\b','factos'),(r'\bFato\b','Facto'),
(r'\bcontato\b','contacto'),(r'\bcontatos\b','contactos'),
(r'\bregistro\b','registo'),(r'\bregistros\b','registos'),(r'\bregistrad([oa]s?)\b',r'registad\1'),(r'\bregistrar\b','registar'),
(r'\bplanejament(o|os)\b',r'planeament\1'),(r'\bPlanejament(o|os)\b',r'Planeament\1'),(r'\bplanejar\b','planear'),(r'\bplaneja\b','planeia'),(r'\bplanejam\b','planeiam'),(r'\bplanejad([oa]s?)\b',r'planead\1'),(r'\bplanejou\b','planeou'),(r'\bplanejasse\b','planeasse'),
(r'\bequipe\b','equipa'),(r'\bequipes\b','equipas'),(r'\bEquipe\b','Equipa'),
(r'\bcontrole\b','controlo'),(r'\bcontroles\b','controlos'),
(r'\becon[ôo]mic','económic'),(r'\bEcon[ôo]mic','Económic'),(r'\bacadêmic','académic'),(r'\bfenômen','fenómen'),(r'\bprêmio','prémio'),(r'\bgêner','géner'),(r'\bônus\b','ónus'),(r'\bbônus\b','bónus'),(r'\bconvênio','convénio'),
(r'\bincorporador(a|es|as)?\b',lambda m:'promotor'+(m.group(1) or '')),(r'\bIncorporador(a|es|as)?\b',lambda m:'Promotor'+(m.group(1) or '')),
(r'\brenda de aluguel\b','renda'),(r'\brendas de aluguel\b','rendas'),(r'\breceita de aluguel\b','receita de rendas'),
(r'\baluguel de curta temporada\b','arrendamento de curta duração'),(r'\baluguéis de curta temporada\b','arrendamentos de curta duração'),(r'\bcurta temporada\b','curta duração'),(r'\bcurtíssima duração\b','curtíssima duração'),
(r'\bimóve(l|is) de aluguel\b',lambda m:'imóve'+m.group(1)+' para arrendamento'),
(r'\baluguel mensal\b','renda mensal'),(r'\bao aluguel\b','ao arrendamento'),(r'\bno aluguel\b','no arrendamento'),(r'\bum aluguel\b','um arrendamento'),(r'\baluguéis\b','rendas'),(r'\baluguel\b','arrendamento'),(r'\bAluguel\b','Arrendamento'),
(r'\balugar\b','arrendar'),(r'\baluga\b','arrenda'),(r'\balugam\b','arrendam'),(r'\balugad([oa]s?)\b',r'arrendad\1'),(r'\balugue\b','arrende'),
(r'\blocação\b','arrendamento'),(r'\blocações\b','arrendamentos'),(r'\bLocação\b','Arrendamento'),
(r'\b([Oo]) locador\b',r'\1 senhorio'),(r'\blocador(es)?\b',lambda m:'senhorio'+('s' if m.group(1) else '')),(r'\bLocador\b','Senhorio'),
(r'\btaxa básica de juros\b','taxa de juro de referência'),(r'\btaxas? de juros\b',lambda m:m.group(0).replace('juros','juro')),
(r'\bimposto de renda\b','IRS'),
(r'\bo ganho de capital\b','a mais-valia'),(r'\bdo ganho de capital\b','da mais-valia'),(r'\bao ganho de capital\b','à mais-valia'),(r'\bno ganho de capital\b','na mais-valia'),(r'\bpelo ganho de capital\b','pela mais-valia'),(r'\bsobre ganho de capital\b','sobre a mais-valia'),(r'\bganhos de capital\b','mais-valias'),(r'\bganho de capital\b','mais-valia'),
(r'\bpessoas físicas\b','pessoas singulares'),(r'\bpessoa física\b','pessoa singular'),(r'\bpessoas jurídicas\b','pessoas coletivas'),(r'\bpessoa jurídica\b','pessoa coletiva'),
(r'\bcotistas\b','participantes'),(r'\bcotista\b','participante'),(r'\bcotas\b','unidades de participação'),
(r'\bsócio administrador\b','sócio-gerente'),(r'\bcorretor de seguros\b','mediador de seguros'),
(r'\boferta e demanda\b','oferta e procura'),(r'\bdemanda\b','procura'),(r'\bdemandas\b','procuras'),(r'\bdemandam\b','exigem'),
(r'\busuário','utilizador'),(r'\bgerenciar\b','gerir'),(r'\bgerenciamento\b','gestão'),
(r'\bem uma\b','numa'),(r'\bem um\b','num'),(r'\bem umas\b','numas'),(r'\bem uns\b','nuns'),(r'\bEm uma\b','Numa'),(r'\bEm um\b','Num'),
(r'\bde uma\b','de uma'),(r'\bmorar\b','viver'),(r'\bmora\b','vive'),(r'\bmoradia\b','habitação'),
(r'\bônibus\b','autocarro'),(r'\btrem\b','comboio'),(r'\bcelular\b','telemóvel'),(r'\btela\b','ecrã'),
(r'\bdetalhad','pormenorizad'),(r'\bmelhora\b','melhoria'),(r'\bmelhoras\b','melhorias'),
]
PROG=r'\b(está|estão|estava|estavam|esteja|estejam|estiver|estiverem|estamos|estou|estar|continua|continuam|continuar|continuou|continuava|seguem|segue|vinha|vinham|ficam|fica)\s+(\w+?)(ando|endo|indo)\b'
def prog(m):
    end={'ando':'ar','endo':'er','indo':'ir'}[m.group(3)]
    return f'{m.group(1)} a {m.group(2)}{end}'
KEEP=set('que não nunca só também já sempre quem qual quais quando porque onde como mesmo ainda tudo nada apenas bem talvez ou e se de para por sem a ao em pouco muito mais menos antes depois cujo cuja cujos cujas todos todas ambos quanto quanta enquanto embora caso'.split())
MOD=set('pode podem deve devem poderia poderiam vai vão costuma costumam consegue conseguem tende tendem precisa precisam deveria deveriam'.split())
FIN=set('move desfaz conecta conectam aplica aplicam somam intensificam acumula compara limita limitava baseou comprometeu compromete mostra mostrou torna tornam tornou organizam encaixa distingue adapta adaptam relacionam diluem beneficia estende apoia sustenta traduz trata combinam afastam perde paga alcança baseia investiu desfez comporta comportam manifesta manifestam espalha deteriora qualifica qualificam esgota concretiza'.split())
def clit(s):
    def f(m):
        pre,verb=m.group(1),m.group(2)
        if pre.lower() in KEEP: return m.group(0)
        if pre.lower() in MOD and re.search(r'(ar|er|ir|or)$',verb): return f'{pre} {verb}-se'
        if verb in FIN:
            seg=re.split(r'[,;:—.()\n]',s[max(0,m.start()-200):m.start()])[-1]
            if re.search(r'\b(que|porque|quando|embora|enquanto|caso|onde|quem|qual|quais|como|se)\b',seg,re.I): return m.group(0)
            return f'{pre} {verb}-se'
        return m.group(0)
    return re.sub(r'\b(\w+) se (\w+)\b',f,s)
ART={'a':'o','da':'do','na':'no','pela':'pelo','à':'ao','uma':'um','sua':'seu','própria':'próprio','mesma':'mesmo','essa':'esse','nessa':'nesse','dessa':'desse','esta':'este','desta':'deste','nesta':'neste','toda':'todo','qualquer':'qualquer','nova':'novo','alguma':'algum','nenhuma':'nenhum','maior':'maior','menor':'menor','cuja':'cujo','A':'O','Da':'Do','Essa':'Esse','Uma':'Um'}
ARTP={'as':'os','das':'dos','nas':'nos','outras':'outros','suas':'seus','essas':'esses','mesmas':'mesmos','pelas':'pelos','novas':'novos'}
ADJ={'tributada':'tributado','gerada':'gerado','recebida':'recebido','máxima':'máximo','usada':'usado','futura':'futuro','líquida':'líquido','própria':'próprio','reduzida':'reduzido','obtida':'obtido','esperada':'esperado','projetada':'projetado','estimada':'estimado','garantida':'garantida'}
def income(s):
    s=re.sub(r'\brendas? (de|do|dos) aluguel\b','RENTX',s); s=re.sub(r'\brendas? (de|do) aluguéis\b','RENTX',s)
    s=re.sub(r'\bnão renda\b','não RENDV',s)
    s=re.sub(r'\b(\w+) rendas\b',lambda m:(ARTP.get(m.group(1),m.group(1)))+' rendimentos',s)
    s=re.sub(r'\b(\w+) renda\b',lambda m:(ART.get(m.group(1),m.group(1)))+' rendimento',s)
    s=re.sub(r'\brendas\b','rendimentos',s); s=re.sub(r'\brenda\b','rendimento',s)
    AJ='|'.join(ADJ)
    s=re.sub(r'\b(rendimento(?: (?:real|total|mensal|atual|anual|tributável))?) (seja |for |é |foi |ser |fosse |seria )?('+AJ+r')\b',lambda m:m.group(1)+' '+(m.group(2) or '')+ADJ[m.group(3)],s)
    s=re.sub(r'\b(rendimentos(?: (?:reais|totais|mensais|atuais))?) (sejam |forem |são |foram |serem )?('+AJ.replace('|','s|')+r's)\b',lambda m:m.group(1)+' '+(m.group(2) or '')+ADJ[m.group(3)[:-1]]+'s',s)
    return s
for fn in sorted(glob.glob(d+'/*.txt')):
    s=open(fn,encoding='utf-8').read()
    s=income(s)
    for a,b in W: s=re.sub(a,b,s)
    s=s.replace('RENTX','renda').replace('RENDV','renda')
    s=re.sub(PROG,prog,s)
    s=clit(s)
    for a,b in [('vão se acumulando','se vão acumulando'),('vinha se formando','se vinha a formar'),('de facto aplicam-se','de facto se aplicam')]: s=s.replace(a,b)
    s=re.sub(r'\bprecis(a|am|ava|avam|aria|ariam|e|em) (?!de\b)(\w+(ar|er|ir|or))\b',r'precis\1 de \2',s)
    s=re.sub(r'\bprecis(a|am|ava|avam|aria|ariam|e|em) (?!de\b)(\w+(ar|er|ir|or))-se\b',r'precis\1 de \2-se',s)
    open(fn,'w',encoding='utf-8').write(s)
print('ok')
