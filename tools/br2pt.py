import re,sys,glob,os
S='/home/claude/l5work/work'
R=[
(r'R\$ ?(−?)', None),
]
def money(s):
    s=re.sub(r'−R\$ ?([0-9][0-9.]*)',r'−\1 €',s)
    s=re.sub(r'R\$ ?([0-9][0-9.,]*)',r'\1 €',s)
    s=re.sub(r'US\$ ?([0-9][0-9.,]*)',r'\1 dólares',s)
    s=s.replace('milhares de reais','milhares de euros')
    return s
W=[
('Ao final desta lição','No final desta lição'),('## Gabarito','## Chave de Respostas'),
('renda de aluguel','rendimento das rendas'),('Renda de aluguel','Rendimento das rendas'),
('renda líquida','rendimento líquido'),('renda total','rendimento total'),('renda mensal','rendimento mensal'),('renda extra','rendimento extra'),('renda tributável','rendimento tributável'),('renda pessoal','rendimento pessoal'),('potencial de renda','potencial de rendimento'),
('geradores de renda','geradores de rendimento'),('que geram renda','que geram rendimento'),('gerar renda','gerar rendimento'),('gera renda','gera rendimento'),('a renda','o rendimento'),('A renda','O rendimento'),('de renda','de rendimento'),('uma renda','um rendimento'),('renda ','rendimento '),
('aluguéis','rendas'),('aluguel','renda'),('Aluguel','Renda'),
('contrato de locação','contrato de arrendamento'),('Contrato de locação','Contrato de arrendamento'),('locação','arrendamento'),
('locadores','senhorios'),('locadora','senhoria'),('locador','senhorio'),('Locadores','Senhorios'),('Locador','Senhorio'),
('financiamento imobiliário','crédito à habitação'),('financiamentos imobiliários','créditos à habitação'),('Financiamento imobiliário','Crédito à habitação'),('Financiamentos imobiliários','Créditos à habitação'),
('parcelas','prestações'),('parcela','prestação'),('Parcelas','Prestações'),('Parcela','Prestação'),
('tomadores','mutuários'),('tomador','mutuário'),('Tomador','Mutuário'),
('custos de fechamento','custos de aquisição'),('Custos de fechamento','Custos de aquisição'),('no fechamento','na escritura'),('do fechamento','da escritura'),('ao fechamento','à escritura'),('o fechamento','a escritura'),('fechamento','escritura'),
('patrimônio','património'),('Patrimônio','Património'),('ônus','ónus'),('Ônus','Ónus'),('econômic','económic'),('prêmio','prémio'),('anônim','anónim'),
('registrad','registad'),('registrar','registar'),('registro','registo'),('Registro','Registo'),
('de fato','de facto'),('contato','contacto'),
('banheiros','casas de banho'),('banheiro','casa de banho'),('aquecedor de água','esquentador'),('vaga de garagem','lugar de garagem'),('um porão acabado','uma cave acabada'),
('corretor de imóveis','mediador imobiliário'),('prefeitura','câmara municipal'),('Prefeitura','Câmara municipal'),('A prefeitura','A câmara municipal'),
('score de crédito','pontuação de crédito'),('planejamento','planeamento'),('planejad','planead'),('planejar','planear'),('planejá','planeá'),
('iniciantes','principiantes'),('iniciante','principiante'),('a gente resolve depois','depois logo se vê'),
('de mão na massa','prática e exigente'),('mão na massa','exigente'),
('estouros de custo','derrapagens de custos'),('estourando o orçamento','a ultrapassar o orçamento'),('estourar o orçamento','ultrapassar o orçamento'),('Estouros de custo','Derrapagens de custos'),('estouro de custos','derrapagem de custos'),
('trilha','percurso'),('cotistas','acionistas'),('cotas','ações'),('cota ','ação '),
('encanamento','canalização'),('parte elétrica','instalação elétrica'),('laudo de vistoria','relatório de vistoria'),('laudo','relatório'),
('de primeira viagem','de primeira habitação'),('loteamentos','urbanizações'),('gerenciad','gerid'),
('se apaixonar','se apaixonar'),('ônibus','autocarro'),('time ','equipa '),('equipe','equipa'),
('Isso ','Isto '),(' isso',' isto'),
]
X=[('Aluguéis','Rendas'),('rendas não pagos','rendas não pagas'),('aquecedor','esquentador'),('Em um ','Num '),('Em uma ','Numa '),(' em um ',' num '),(' em uma ',' numa '),('Por que ','Porque é que '),(' por que ',' porque '),(' a seus ',' aos seus '),('com sua ','com a sua '),('todo mundo','toda a gente'),('Ônus','Ónus')]
for b in sorted(glob.glob(f'{S}/RED-L1-pt-BR/*.txt')):
    s=open(b,encoding='utf-8').read()
    s=money(s)
    for a,c in W: s=re.sub(r'(?<![A-Za-zÀ-ÿ])'+re.escape(a),lambda m,c=c:c,s)
    for a,c in X: s=s.replace(a,c)
    # progressive
    s=re.sub(r'\b(est(?:á|ão|ar|ava|eja|ejam)) ([a-zç]+?)(a|e|i)ndo\b', lambda m: f"{m.group(1)} a {m.group(2)}{m.group(3)}r", s)
    open(f'{S}/RED-L1-pt-PT/'+os.path.basename(b),'w',encoding='utf-8').write(s)
print('ok')
