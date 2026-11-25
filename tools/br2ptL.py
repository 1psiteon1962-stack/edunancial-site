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
('em uma ','numa '),('em um ','num '),('Em uma ','Numa '),('Em um ','Num '),
('educação contábil','literacia contabilística'),('contábeis','contabilísticos'),('contábil','contabilístico'),
('registros','registos'),('registro','registo'),('registra ','regista '),('Revisar ','Rever '),
('Correção de equívoco','Correção de um equívoco'),('externa usada','externa utilizada'),
('estoques','inventários'),('estoque','inventário'),('Estoque','Inventário'),('aluguel','renda'),('varejistas','retalhistas'),('varejista','retalhista'),
('equipe','equipa'),('ruim','mau'),('Cite ','Indique '),('Aprenda ','Saiba '),('planejamento','planeamento'),('planejar','planear'),
('contato','contacto'),('seção','secção'),('ótima','excelente'),('ótimo','excelente'),('econômic','económic'),('usuário','utilizador'),
('arquivo','ficheiro'),('celular','telemóvel'),('tela ','ecrã '),('O que você','O que'),('fato ','facto '),
('demanda','procura'),('giro','rotação'),('leva em conta','tem em conta'),('dificuldade para ','dificuldade em '),('por via das dúvidas','pelo sim, pelo não'),('acabe sendo','acabe por ser'),('O que é fluxo de caixa num negócio?','O que é o fluxo de caixa num negócio?'),('a confiabilidade','a fiabilidade'),('confiabilidade','fiabilidade'),('confiável','fiável'),('Nenhuma estatística ou citação externa usada','Nenhuma estatística ou citação externa utilizada'),
]
for a,b in R: s=s.replace(a,b)
s=re.sub(r'US\$ (\d+)\.(\d{3})\.(\d{3})',r'\1 \2 \3 $',s)
s=re.sub(r'US\$ (\d+)\.(\d{3})',r'\1 \2 $',s)
s=re.sub(r'US\$ (\d+)',r'\1 $',s)
open(dst,'w').write(s)
for i,l in enumerate(s.split('\n'),1):
    for m in re.findall(r'\b\w+ndo\b|\bvocê\b|\bvocês\b|\bseu\b|\bsua\b|\bBrasil\b|\btime\b',l):
        print(i,m,'|',l[:110])
