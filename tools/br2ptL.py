# Derive a pt-PT long-format BLUE lesson draft from pt-BR. Output still needs manual review (gerunds, voce, local notes).
import re,sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
R=[('locale: pt-BR','locale: pt-PT'),('Conscientização/Alfabetização','Sensibilização/Literacia'),('Iniciante','Principiante'),
('Patrimônio líquido','Capital próprio'),('patrimônio líquido','capital próprio'),('balanço patrimonial','balanço'),
('dre','demonstração de resultados'),('DRE','demonstração de resultados'),('Múltipla escolha','Escolha múltipla'),
('## Gabarito','## Chave de Respostas'),('LIÇÃO LIBERADA','LIÇÃO DESBLOQUEADA'),('FATO VERIFICADO','FACTO VERIFICADO'),
('Status da tradução: tradução para o português (Brasil)','Estado da tradução: tradução para português (Portugal)'),
('Intenção de busca','Intenção de pesquisa'),('snippet em destaque','excerto em destaque'),
('Por que você acha que','Porque acha que'),('Por que ','Porque é que '),(' por que ',' porque é que '),

('educação contábil','literacia contabilística'),('contábeis','contabilísticos'),('contábil','contabilístico'),
('registros','registos'),('registro','registo'),('registra ','regista '),('Revisar ','Rever '),
('Correção de equívoco','Correção de um equívoco'),('externa usada','externa utilizada'),
('estoques','inventários'),('estoque','inventário'),('Estoque','Inventário'),('aluguel','renda'),('varejistas','retalhistas'),('varejista','retalhista'),
('equipe','equipa'),('ruim','mau'),('Cite ','Indique '),('Aprenda ','Saiba '),('planejamento','planeamento'),('planejar','planear'),
('contato','contacto'),('seção','secção'),('ótima','excelente'),('ótimo','excelente'),('econômic','económic'),('usuário','utilizador'),
('arquivo','ficheiro'),('celular','telemóvel'),('tela ','ecrã '),('O que você','O que'),('fato ','facto '),
('processo de atendimento dos pedidos','processamento das encomendas'),('Atendimento de pedidos','Processamento de encomendas'),('atendimento de pedidos','processamento de encomendas'),('controle','controlo'),('Lembre-se de BLUE','Recorde BLUE'),('on-line','online'),('varejo','retalho'),
('margens menores','margens mais reduzidas'),('margens maiores','margens mais elevadas'),('que você poderia','que poderia'),('seu raciocínio','o seu raciocínio'),('suas palavras','as suas palavras'),
('acontecendo','a acontecer'),('cuida do','trata do'),('administra ','gere '),('órgão público','organismo público'),('repassando','reencaminhando'),('repassa ','reencaminha '),
('os pedidos','as encomendas'),('Os pedidos','As encomendas'),('dos pedidos','das encomendas'),('pedidos','encomendas'),('pedido','encomenda'),('um encomenda','uma encomenda'),('o encomenda','a encomenda'),('do encomenda','da encomenda'),('esse encomenda','essa encomenda'),('grande encomenda','grande encomenda'),('um grande encomenda','uma grande encomenda'),('O encomenda','A encomenda'),('no encomenda','na encomenda'),
('atendem os','processam as'),('atende e envia','processa e envia'),('são atendidos','são processadas'),('atendimento','processamento'),
('demanda','procura'),('Todo mundo','Toda a gente'),('todo mundo','toda a gente'),('Você se lembra','Lembra-se'),('o que você pensaria','o que pensaria'),('que você usa','que utilize'),('que você conhece','que conheça'),('Se você fosse','Se fosse'),('Você acha','Acha'),('você ','') ,('para quem ele é de verdade?','para quem é realmente?'),('assinatura','subscrição'),('cafeterias','cafetarias'),('pesquisa de mercado','estudo de mercado'),('sinônimo','sinónimo'),('ideia ruim','má ideia'),('era ruim','era má'),('atendimento ao cliente','apoio ao cliente'),('giro','rotação'),('leva em conta','tem em conta'),('dificuldade para ','dificuldade em '),('por via das dúvidas','pelo sim, pelo não'),('acabe sendo','acabe por ser'),('O que é fluxo de caixa num negócio?','O que é o fluxo de caixa num negócio?'),('a confiabilidade','a fiabilidade'),('confiabilidade','fiabilidade'),('confiável','fiável'),('Nenhuma estatística ou citação externa usada','Nenhuma estatística ou citação externa utilizada'),
]
for a,b in R: s=s.replace(a,b)
for a,b in [(r'\bem uma ','numa '),(r'\bem um ','num '),(r'\bEm uma ','Numa '),(r'\bEm um ','Num ')]: s=re.sub(a,b,s)
s=re.sub(r'US\$ (\d+)\.(\d{3})\.(\d{3})',r'\1 \2 \3 $',s)
s=re.sub(r'US\$ (\d+)\.(\d{3})',r'\1 \2 $',s)
s=re.sub(r'US\$ (\d+)',r'\1 $',s)
open(dst,'w').write(s)
for i,l in enumerate(s.split('\n'),1):
    for m in re.findall(r'\b\w+ndo\b|\bvocê\b|\bvocês\b|\bseu\b|\bsua\b|\bBrasil\b|\btime\b',l):
        print(i,m,'|',l[:110])
