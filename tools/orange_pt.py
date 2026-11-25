# orange_pt.py : extra pt-BR->pt-PT pass for work/ORANGE-L1-pt-PT (você, te, gerunds, lexicon)
import glob,re
A=[('deixar você ficar fora','deixá-lo ficar na rua'),('vende a você','vende-lhe'),('acreditar em você','acreditar em si'),('para você saber','para saber'),
('"Você entrega?"','"Fazem entregas?"'),('então você nunca fica no escuro','por isso nunca fica às escuras'),('fica a saber de você','fica a saber da sua existência'),
('escolher você','escolhê-lo'),('para você nunca precisar sair de casa','para nunca precisar de sair de casa'),('para você nunca ficar se perguntando','para nunca ficar a perguntar-se'),
('ainda não conhece você','ainda não o conhece'),('não conhece você','não o conhece'),('já conhece você','já o conhece'),('ainda não conhecem você','ainda não o conhecem'),('interagiu com você','interagiu consigo'),
('— você mesmo pode ir buscá-los','— pode ir buscá-los pessoalmente'),('em cujo trabalho você mesmo não confiaria','em cujo trabalho não confiaria'),
('Quem você é','Quem é'),('quem você é','quem é'),('Quem você ajuda','A quem ajuda'),('quem você ajuda','a quem ajuda'),('torna você diferente','o torna diferente'),
('dá a você o direito','lhe dá o direito'),('faz você ir até eles. Eu vou até você.','obriga-o a ir até eles. Eu vou até si.'),('sobre você','sobre si'),
('quem você está a tentar alcançar','quem está a tentar alcançar'),('ouvem falar de você sem que você pague','ouvem falar de si sem que pague'),('encontraram você','o encontraram'),
('do que você vende, pensa em você primeiro, porque você já','do que vende, pensa primeiro em si, porque já'),('em quem você confia','em quem confia'),('quanto você esperava','quanto esperava'),
('a levar você a','a levá-lo a'),('ajuda você a julgar','ajuda-o a julgar'),('sem você mexer','sem mexer'),('quem você quer alcançar','quem quer alcançar'),('beneficie você','o beneficie'),
('falar com você','falar consigo'),('até você','até si'),('para você','para si'),('com você','consigo'),('de você','de si'),
('te dou','dou-lhe'),('te mandasse','lhe mandasse'),('te passar','passar-lhe'),('depois te mande','depois lhe mande'),('não te incomodo','não o incomodo'),('que te manda','que lhe manda'),('eu te dê','eu lhe dê'),('serviço te dá','serviço dá-lhe'),
('acaba custando','acaba por custar'),('acaba querendo','acaba por querer'),('acabam levando','acabam por levar'),('continuaria sendo','continuaria a ser'),('continuaria valendo','continuaria a valer'),('continuasse sendo','continuasse a ser'),('ficar insistindo','ficar a insistir'),('vivem correndo','vivem a correr'),('viver conquistando','viver a conquistar'),
('jogam no mesmo time','jogam na mesma equipa'),('celular','telemóvel'),('planilha','folha de cálculo'),('Planilha','Folha de cálculo'),('gramados','relvados'),('panfletos','folhetos'),('o outdoor','o cartaz publicitário'),('on-line','online'),
('marmitas saudáveis','refeições saudáveis'),('pet shops','lojas de animais'),('parcões','parques para cães'),('ensino médio','ensino secundário'),('aulas particulares','explicações'),('professora particular','explicadora'),('reforço escolar','explicações'),
('notebook','portátil'),('chutar','adivinhar'),('semana puxada','semana cansativa'),('pede o pedido','pede a encomenda'),('fazer o pedido','fazer a encomenda'),('um pedido de verdade','uma encomenda a sério'),('fazem um pedido de fato','fazem de facto uma encomenda'),
('cachorros','cães'),('cachorro','cão'),('Cachorro','Cão'),('parcelamento em dois meses','pagamento em duas prestações'),('dando uma olhada','a dar uma vista de olhos'),('dar uma olhada','dar uma vista de olhos'),
('a gente','nós'),('ligações','chamadas'),('ligação','chamada'),('Ligação','Chamada'),('ligava para','telefonava a'),('ligar para','telefonar a'),('ligou pessoalmente para','telefonou pessoalmente a'),('ônibus','autocarro'),('tênis','sapatilhas'),
('de verdade','a sério'),('fresquinho','fresco'),('time','equipa'),
]
for f in glob.glob('work/ORANGE-L1-pt-PT/*.txt'):
    s=open(f).read()
    for a,b in A: s=s.replace(a,b)
    s=re.sub(r'(^|[.!?:"“—] )Você ([a-zà-ú])',lambda m:m.group(1)+m.group(2).upper(),s,flags=re.M)
    s=re.sub(r'\bVocê ([a-zà-ú])',lambda m:m.group(1).upper(),s)
    s=re.sub(r' você ',' ',s)
    open(f,'w').write(s)
