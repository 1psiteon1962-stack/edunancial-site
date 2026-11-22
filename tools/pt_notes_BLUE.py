# pt_notes_BLUE.py : Brazil->Portugal note swaps on BLUE-L5 pt-PT copy (run BEFORE pt_pt.py)
# Each entry: (start snippet, replacement). Text from snippet start up to the end of that sentence
# (first '.' followed by space/newline) is replaced; the final '.' is kept.
import glob,re
R=[
# b01
('no Brasil, por exemplo, os movimentos da taxa Selic','em Portugal, por exemplo, as decisões do Banco Central Europeu e a Euribor costumam refletir-se depressa no custo do crédito às empresas, porque muitos empréstimos têm taxa variável, o que torna esse efeito especialmente visível'),
('no Brasil, por exemplo, o setor de franquias é grande','em Portugal, por exemplo, não existe uma lei específica do franchising, e o contrato rege-se sobretudo pelas regras gerais dos contratos e pelas regras europeias de concorrência, por isso convém pedir ao franqueador, antes de assinar, toda a informação sobre taxas, rede e resultados'),
('no Brasil, o franqueador deve entregar a Circular','em Portugal, não existe uma lei específica do franchising, por isso peça toda a informação antes de assinar'),
('no Brasil, por exemplo, não existe um programa igual ao da SBA','em Portugal, por exemplo, não existe um programa igual ao da SBA, e a compra de um negócio costuma ser financiada combinando crédito bancário, linhas com garantia mútua promovidas pelo Banco Português de Fomento e pagamento em prestações ao vendedor, por isso confirme com o seu banco quais as linhas disponíveis e para que finalidade'),
('no Brasil, não existe um programa igual ao da SBA','em Portugal, não existe um programa igual ao da SBA, mas há linhas com garantia mútua'),
('no Brasil, por exemplo, essas formas americanas não existem','em Portugal, por exemplo, essas formas americanas não existem como tais, e a escolha costuma ser entre o empresário em nome individual, a sociedade unipessoal por quotas, a sociedade por quotas e a sociedade anónima'),
('no Brasil, por exemplo, a empresa escolhe em geral entre o Simples','em Portugal, por exemplo, as sociedades pagam IRC, com uma taxa reduzida para a primeira parte do lucro tributável das PME e possível derrama, as pequenas empresas podem, em certas condições, optar pelo regime simplificado, e os dividendos pagos a pessoas singulares costumam ser tributados a 28%, por isso confirme a situação atual com um contabilista'),
('no Brasil, as opções comuns incluem o MEI','em Portugal, as opções comuns incluem a sociedade unipessoal por quotas, a sociedade por quotas e a sociedade anónima'),
('no Brasil, por exemplo, o ganho de capital da pessoa física na venda de quotas','em Portugal, por exemplo, a mais-valia da pessoa singular na venda de quotas ou ações costuma ser tributada a 28%, com a opção de englobamento, e em regra é considerada no ano da venda, mesmo que o preço seja pago em prestações, por isso confirme a estrutura com um contabilista antes de fechar o negócio'),
('no Brasil, o imposto em vendas a prazo pode acompanhar','em Portugal, a mais-valia costuma ser considerada no ano da venda, mesmo com pagamento em prestações'),
# b02
('no Brasil, por exemplo, muitas pequenas empresas vendem a prazo','em Portugal, por exemplo, muitas PME vendem a prazo a outras empresas e recorrem ao factoring ou ao confirming para antecipar esses recebimentos com custo, o que torna essa diferença especialmente visível'),
('no Brasil, por exemplo, o preço de máquinas importadas','em Portugal, por exemplo, o preço de máquinas importadas de fora da União Europeia costuma acompanhar o câmbio do euro, e programas de incentivo com fundos europeus e linhas do Banco Português de Fomento podem apoiar a compra de equipamentos, por isso vale pedir orçamentos atualizados e comparar as condições de financiamento'),
('no Brasil, por exemplo, muitos negócios sentem com força a sazonalidade','em Portugal, por exemplo, muitos negócios sentem com força a sazonalidade do turismo e do fim de ano e precisam de planear o pagamento dos subsídios de férias e de Natal aos trabalhadores'),
('no Brasil, por exemplo, o regime tributário da empresa, o tratamento dos aluguéis','em Portugal, por exemplo, o IRC da empresa, a tributação das rendas na pessoa singular (em regra a 28%, com taxas mais baixas para contratos longos) e a tributação das aplicações financeiras mudam bastante essa comparação, por isso confirme a sua situação com um contabilista'),
# b03
('no Brasil, por exemplo, a Lei de Franquias exige','em Portugal, por exemplo, não existe uma lei específica do franchising, por isso o candidato deve pedir por escrito, com antecedência, informações como taxas, outros franqueados e situação da rede, e rever o contrato com um advogado'),
('no Brasil, por exemplo, esses termos costumam ser registrados','em Portugal, por exemplo, esses termos costumam ficar no pacto social e num acordo parassocial, e o vesting é muitas vezes formalizado através de opções ou de promessas de compra e venda de quotas, por isso vale contar com um advogado'),
('no Brasil, esses termos costumam constar do contrato social','em Portugal, esses termos costumam constar do pacto social e de um acordo parassocial'),
('no Brasil, por exemplo, essas regras costumam ser incluídas no acordo de sócios','em Portugal, por exemplo, essas regras costumam ser incluídas no acordo parassocial e no pacto social, e as regras de sucessão do Código Civil e a legítima reservada aos herdeiros legitimários também têm de ser consideradas, por isso confirme com um advogado'),
('no Brasil, as regras de sucessão do Código Civil','em Portugal, as regras de sucessão do Código Civil e a legítima também têm de ser consideradas'),
('no Brasil, por exemplo, a terceirização é permitida','em Portugal, por exemplo, o recurso a prestadores de serviços é permitido, mas a empresa que contrata pode, em certos casos, responder solidariamente por créditos laborais e contribuições do prestador, e há limites ao outsourcing depois de despedimentos coletivos, por isso vale escolher bem e acompanhar os contratos'),
('no Brasil, a contratante pode responder de forma subsidiária','em Portugal, a empresa que contrata pode, em certos casos, responder solidariamente por obrigações do prestador'),
('no Brasil, por exemplo, o país tem acordos para evitar a dupla tributação com dezenas','em Portugal, por exemplo, o país tem convenções para evitar a dupla tributação com dezenas de países, mas não com todos os parceiros comerciais, e as regras sobre lucros de sociedades controladas no estrangeiro e sobre preços de transferência também se aplicam, por isso confirme a situação com um contabilista'),
('o Brasil tem acordos para evitar a dupla tributação com dezenas','Portugal tem convenções para evitar a dupla tributação com dezenas de países, mas não com todos'),
# b04
('no Brasil, por exemplo, muitos negócios já atravessaram recessões','em Portugal, por exemplo, muitos negócios atravessaram a crise da dívida e o programa de assistência financeira de 2011, além de outras recessões, e as experiências dessas crises mostram tanto recuperações quanto empresas que não sobreviveram'),
('no Brasil, por exemplo, a remuneração do sócio que trabalha','em Portugal, por exemplo, a remuneração do sócio que trabalha na empresa costuma ser feita através da remuneração de gerente e da distribuição de lucros'),
('no Brasil, por exemplo, o pró-labore sofre','em Portugal, por exemplo, a remuneração de gerente é tributada em IRS como rendimento do trabalho e paga contribuições para a Segurança Social, enquanto os lucros distribuídos costumam ser tributados a 28%, por isso confirme a situação atual com um contabilista'),
('no Brasil, isso corresponde em geral ao pró-labore','em Portugal, isso corresponde em geral à remuneração de gerente e à distribuição de lucros'),
('no Brasil, por exemplo, além de fundos de private equity','em Portugal, por exemplo, além de fundos de capital de risco, existem business angels e plataformas de financiamento colaborativo supervisionadas pela CMVM ao abrigo das regras europeias, e um advogado pode ajudar a rever o acordo de investimento'),
('no Brasil, por exemplo, a tributação de planos de opções','em Portugal, por exemplo, a tributação de planos de opções de compra de ações (stock options) e de outros incentivos em participação depende de como o plano é estruturado, e a lei prevê um regime mais favorável para certas startups qualificadas, por isso confirme com um contabilista e um advogado'),
('no Brasil, depende de como o plano é estruturado','em Portugal, depende de como o plano é estruturado e do tipo de empresa'),
('no Brasil, por exemplo, a certificação de Empresa B','em Portugal, por exemplo, a certificação B Corp é concedida por uma organização privada, e não existe uma forma jurídica específica de empresa de benefício como em alguns estados americanos, por isso leia os requisitos e o processo de avaliação antes de decidir'),
('no Brasil, a certificação de Empresa B','em Portugal, a certificação B Corp é concedida por uma organização privada'),
# b05
('no Brasil, por exemplo, muitas empresas familiares enfrentam a sucessão','em Portugal, por exemplo, uma grande parte do tecido empresarial é formada por empresas familiares, e muitas enfrentam dificuldades na passagem para a geração seguinte, o que torna esse planeamento ainda mais importante'),
('no Brasil, muitas empresas familiares enfrentam esse desafio','em Portugal, muitas empresas familiares enfrentam esse desafio na passagem entre gerações'),
('no Brasil, por exemplo, seguradoras oferecem seguros de vida','em Portugal, por exemplo, as seguradoras oferecem seguros de vida em que a própria empresa é a beneficiária, e o tratamento fiscal desses prémios depende das regras do IRC, por isso confirme com um mediador de seguros e um contabilista'),
('no Brasil, por exemplo, a conta garantida e o capital de giro','em Portugal, por exemplo, a conta corrente caucionada e as linhas de apoio à tesouraria funcionam como linhas de crédito, e as taxas costumam acompanhar a Euribor mais um spread, por isso compare a TAEG e as comissões de cada opção'),
('no Brasil, as taxas costumam acompanhar a Selic e o CDI','em Portugal, as taxas costumam acompanhar a Euribor'),
('no Brasil, por exemplo, a holding patrimonial ou familiar','em Portugal, por exemplo, a holding familiar costuma ser constituída como uma sociedade por quotas ou anónima, por vezes como sociedade gestora de participações sociais, e o trust anglo-saxónico não existe, em regra, no direito português, por isso o planeamento costuma usar a holding, a doação de participações com reserva de usufruto e o testamento'),
('no Brasil, por exemplo, a transferência de bens para uma holding','em Portugal, por exemplo, a transferência de imóveis para uma holding pode pagar IMT e Imposto do Selo, a doação de participações paga Imposto do Selo de 10%, com isenção para o cônjuge, os descendentes e os ascendentes, e a holding tem um regime fiscal próprio, por isso confirme com um contabilista e um advogado'),
('no Brasil, o trust anglo-saxão não é reconhecido','em Portugal, o trust anglo-saxónico não existe, em regra, e o planeamento costuma usar a holding'),
('no Brasil, por exemplo, a Lei Geral de Proteção de Dados','na União Europeia, por exemplo, o Regulamento Geral sobre a Proteção de Dados aplica-se a muitas tecnologias que tratam dados pessoais, e o regulamento europeu sobre inteligência artificial está a entrar em vigor por fases, por isso confirme as regras atuais com um advogado'),
('no Brasil, a Lei Geral de Proteção de Dados','na União Europeia, o Regulamento Geral sobre a Proteção de Dados já se aplica a muitas dessas tecnologias'),
# b06
('no Brasil, por exemplo, programas do Sebrae','em Portugal, por exemplo, o IAPMEI, as associações empresariais e alguns programas com fundos europeus oferecem diagnósticos e formação em gestão, por vezes a custo reduzido, o que pode ajudar a testar uma metodologia antes de um investimento maior'),
('no Brasil, por exemplo, exportadores costumam usar contratos de câmbio a termo','em Portugal, por exemplo, as vendas para a zona euro não têm risco cambial, mas os exportadores para fora dela costumam usar contratos de câmbio a prazo e opções cambiais oferecidos pelos bancos'),
('no Brasil, exportadores costumam usar contratos de câmbio a termo','em Portugal, os exportadores para fora da zona euro costumam usar contratos de câmbio a prazo'),
('no Brasil, por exemplo, a cobrança de royalties','em Portugal, por exemplo, a cobrança de royalties entre empresas do mesmo grupo está sujeita às regras de preços de transferência e pode ser analisada pela Autoridade Tributária, que pode aplicar a cláusula geral antiabuso a estruturas sem verdadeiro propósito económico, por isso confirme a estrutura com um contabilista e um advogado'),
('no Brasil, estruturas sem propósito real de negócio','em Portugal, estruturas sem verdadeiro propósito económico podem ser desconsideradas pela Autoridade Tributária'),
('no Brasil, por exemplo, indicadores como os índices de confiança','em Portugal, por exemplo, os indicadores de confiança dos consumidores e das empresas do INE e as estatísticas do Banco de Portugal ajudam a acompanhar esses sinais'),
('no Brasil, os índices de confiança e as pesquisas mensais','em Portugal, os indicadores de confiança do INE e as estatísticas do Banco de Portugal ajudam a acompanhá-los'),
('no Brasil, por exemplo, vender as quotas da empresa','em Portugal, por exemplo, vender as quotas da empresa ou vender os ativos do negócio gera tributações bem diferentes, e a mais-valia da pessoa singular na venda de quotas costuma ser tributada a 28%, com a opção de englobamento, por isso compare as duas vias com um contabilista'),
('no Brasil, vender quotas ou vender ativos','em Portugal, vender quotas ou vender ativos gera tributações bem diferentes'),
# b07
('no Brasil, por exemplo, essas plataformas são reguladas pela CVM','em Portugal, por exemplo, essas plataformas são supervisionadas pela CMVM ao abrigo do regulamento europeu de financiamento colaborativo, com regras de informação e de proteção dos investidores não sofisticados, por isso confirme as regras atuais antes de captar'),
('no Brasil, essas plataformas são reguladas pela CVM','em Portugal, essas plataformas são supervisionadas pela CMVM'),
('no Brasil, por exemplo, o prejuízo fiscal normalmente fica','em Portugal, por exemplo, o prejuízo fiscal normalmente fica dentro da própria empresa e só pode ser deduzido aos lucros tributáveis futuros dela, dentro dos limites da lei, e não ao salário ou a outros rendimentos do sócio pessoa singular, por isso confirme o tratamento do seu caso com um contabilista'),
('no Brasil, o prejuízo fiscal normalmente fica','em Portugal, o prejuízo fiscal normalmente fica dentro da própria empresa'),
('no Brasil, por exemplo, a rede de tratados','em Portugal, por exemplo, a rede de convenções para evitar a dupla tributação não cobre todos os países, e as contas no estrangeiro devem ser indicadas na declaração de IRS, além de outras obrigações de comunicação em certos casos, por isso confirme essas obrigações com um contabilista'),
('no Brasil, por exemplo, o FGC protege','em Portugal, por exemplo, o Fundo de Garantia de Depósitos protege, em regra, até 100 000 euros por depositante e por instituição, e essa proteção não se estende automaticamente a uma conta num banco de outro país, que fica sujeita ao sistema de garantia desse país'),
('no Brasil, a proteção do FGC','em Portugal, a proteção do Fundo de Garantia de Depósitos não se estende automaticamente a uma conta no estrangeiro'),
# b08
('no Brasil, por exemplo, é comum negociar garantias','em Portugal, por exemplo, é comum negociar garantias como uma conta escrow, uma garantia bancária ou uma fiança dos sócios para proteger os pagamentos futuros, por isso discuta essas proteções com um advogado'),
('no Brasil, garantias como a conta vinculada','em Portugal, garantias como a conta escrow ajudam a proteger os pagamentos futuros'),
('no Brasil, essa proteção costuma aparecer como seguro de lucros cessantes, muitas vezes','em Portugal, essa proteção costuma aparecer como seguro de perdas de exploração (lucros cessantes), muitas vezes contratado junto com o seguro multirriscos da empresa, e em regra só funciona quando o dano físico que causou a paragem está coberto pela apólice principal'),
('no Brasil, por exemplo, também é possível registrar uma reclamação na SUSEP','em Portugal, por exemplo, também é possível apresentar uma reclamação à Autoridade de Supervisão de Seguros e Fundos de Pensões, recorrer a um centro de arbitragem ou aos tribunais, por isso confirme os prazos com um advogado'),
('no Brasil, essa proteção costuma aparecer como seguro de lucros cessantes','em Portugal, essa proteção costuma aparecer como seguro de perdas de exploração'),
('no Brasil, por exemplo, é comum combinar uma taxa fixa mensal','em Portugal, por exemplo, é comum combinar uma avença mensal (retainer) com uma comissão de sucesso (success fee) no fecho, e as condições variam bastante, por isso compare as propostas por escrito'),
('no Brasil, por exemplo, isso costuma ser feito no contrato social','em Portugal, por exemplo, isso costuma ser feito no pacto social e no acordo parassocial, por vezes junto com um protocolo familiar, por isso confirme a redação com um advogado'),
('no Brasil, isso costuma ir no contrato social','em Portugal, isso costuma ir no pacto social e no acordo parassocial'),
('no Brasil, por exemplo, muitas dívidas empresariais são atreladas ao CDI','em Portugal, por exemplo, muitas dívidas empresariais estão indexadas à Euribor, que acompanha de perto as expectativas sobre as taxas do Banco Central Europeu, por isso o efeito de cada cenário de juros sobre o custo das dívidas costuma ser rápido'),
('no Brasil, dívidas atreladas ao CDI','em Portugal, as dívidas indexadas à Euribor sentem depressa cada mudança das taxas do Banco Central Europeu'),
# b09
('no Brasil, por exemplo, quando a empresa vende um ativo','em Portugal, por exemplo, quando a empresa vende um ativo, a mais-valia costuma ser calculada sobre o valor de aquisição já deduzido das depreciações e entra no lucro tributável em IRC, podendo haver um regime de reinvestimento que reduz parte da tributação, enquanto a venda das quotas pelo sócio pessoa singular segue as regras das mais-valias em IRS, por isso confirme os dois tratamentos com um contabilista'),
('no Brasil, a venda de ativos pela empresa','em Portugal, a venda de ativos pela empresa e a venda de quotas pelo sócio seguem regras diferentes'),
# b10
('no Brasil, por exemplo, uma reserva desse tipo','em Portugal, por exemplo, uma reserva desse tipo costuma ficar em depósitos a prazo mobilizáveis ou em aplicações de elevada liquidez, o que reduz, mas não elimina, esse custo de oportunidade'),
]
def end_of(t,i):
    m=re.compile(r'\.(?=\s|$)').search(t,i)
    return m.start()
for f in sorted(glob.glob('work/BLUE-L5-pt-PT/b*.txt')):
    t=open(f).read()
    for a,b in R:
        a0=a.rstrip('.'); pos=0
        while True:
            i=t.find(a0,pos)
            if i<0: break
            j=end_of(t,i)
            # keep trailing RSR tag in summaries
            seg=t[i:j]; tail=''
            k=seg.find(', REGRA ESPECÍFICA DA REGIÃO')
            if k>=0: tail=seg[k:]
            new=b.rstrip('.')+tail
            t=t[:i]+new+t[j:]; pos=i+len(new)
    open(f,'w').write(t)
import subprocess
print(subprocess.run("grep -c 'Brasil\\|Selic\\|CDI\\|B3\\|FGC\\|CVM\\|PGBL\\|VGBL\\|ITCMD\\|LCI\\|Tesouro Direto\\|come-cotas\\|CPF\\|Sebrae\\|BNDES\\|SUSEP\\|MEI\\|pró-labore\\|Receita Federal' work/BLUE-L5-pt-PT/b*.txt",shell=True,capture_output=True,text=True).stdout)
