# pt_notes_RED.py : exact Brazil->Portugal note swaps on RED-L5 pt-PT copy (run BEFORE pt_pt lexical pass)
import glob,sys
R=[
# b01
('o IPTU e as taxas','o IMI, o condomínio'),
('no Brasil, por exemplo, ITBI, escritura e registro)','em Portugal, por exemplo, IMT, Imposto do Selo, escritura e registo)'),
('enquanto no Brasil a LLC não existe — a forma mais próxima é a sociedade limitada, que paga IRPJ e CSLL, inclusive no lucro presumido, e não é transparente, e muitas famílias usam uma holding patrimonial cuja conveniência depende também do ITBI e do ITCMD',
 'enquanto em Portugal a LLC não existe — a forma mais próxima é a sociedade por quotas (Lda.), que paga IRC e não é fiscalmente transparente, e a conveniência de pôr imóveis numa sociedade depende também do IMT, do Imposto do Selo e do IMI'),
('o que muda no Brasil.','o que muda em Portugal.'),
('no Brasil não existe um equivalente à permuta 1031, e para pessoa física o ganho de capital na venda de um imóvel é em geral tributado a alíquotas progressivas de 15% a 22,5%, mas há isenção quando o valor da venda de um imóvel residencial é aplicado na compra de outro imóvel residencial no Brasil em até 180 dias, em regra uma vez a cada cinco anos,',
 'em Portugal não existe um equivalente à permuta 1031: para um residente, em regra metade da mais-valia na venda de um imóvel é somada aos outros rendimentos e tributada às taxas progressivas do IRS, mas a mais-valia da venda da habitação própria e permanente pode ficar excluída se o valor for reinvestido noutra habitação própria e permanente dentro dos prazos legais (em regra 24 meses antes ou 36 meses depois da venda),'),
('no Brasil não há permuta 1031, mas existe uma isenção para quem reinveste a venda de um imóvel residencial em outro em até 180 dias.',
 'em Portugal não há permuta 1031, mas existe a exclusão por reinvestimento na habitação própria e permanente.'),
# b02
('no Brasil, por exemplo, não há permuta 1031 e a pessoa física não deprecia o imóvel, mas existem a isenção para quem reinveste a venda de um imóvel residencial em outro em até 180 dias, os fundos imobiliários e os planos de previdência como o PGBL e o VGBL —',
 'em Portugal, por exemplo, não há permuta 1031 e a pessoa singular não deprecia o imóvel arrendado, mas existem a exclusão por reinvestimento na habitação própria e permanente, os fundos de investimento imobiliário e as SIGI, e os planos de poupança-reforma (PPR) —'),
# b03
('no Brasil, por exemplo, linhas do Sistema Financeiro da Habitação e o uso do FGTS são em regra reservados à moradia própria,',
 'em Portugal, por exemplo, as recomendações do Banco de Portugal permitem financiar em regra até 90% do valor na habitação própria e permanente, contra até 80% noutras finalidades,'),
('e o que existe no Brasil.','e o que existe em Portugal.'),
('no Brasil não existe um programa equivalente para investidores pessoas físicas, embora existam incentivos regionais, como os ligados à SUDENE e à SUDAM, voltados a empresas que investem nessas regiões;',
 'em Portugal não existe um programa equivalente para investidores particulares, embora existam benefícios fiscais regionais, como os destinados ao investimento empresarial nos territórios do interior;'),
('e como isso funciona com o IPTU no Brasil.','e como isso funciona com o IMI em Portugal.'),
('no Brasil, por exemplo, o IPTU é lançado pelo município com base no valor venal do imóvel, e o contribuinte pode apresentar impugnação administrativa ao lançamento no prazo previsto na legislação municipal, em geral contado da notificação,',
 'em Portugal, por exemplo, o IMI é calculado sobre o valor patrimonial tributário (VPT) fixado pela Autoridade Tributária, e o proprietário pode pedir uma segunda avaliação no prazo legal, em regra de 30 dias contados da notificação, ou apresentar reclamação graciosa contra a liquidação,'),
('no Brasil, o valor venal usado no IPTU costuma vir da planta genérica de valores aprovada por lei municipal, muitas vezes atualizada só de tempos em tempos,',
 'em Portugal, o VPT usado no IMI resulta de uma fórmula legal (com coeficientes de localização, área, idade e qualidade) e pode ficar desatualizado, sendo possível pedir uma nova avaliação depois de decorridos os prazos legais,'),
('no Brasil, o IPTU é contestado no município, conforme a legislação local.','em Portugal, o VPT que serve de base ao IMI é contestado junto da Autoridade Tributária.'),
# b04
('e, no Brasil, a holding patrimonial e a doação com reserva de usufruto —','e, em Portugal, as sociedades familiares e a doação com reserva de usufruto —'),
('no Brasil o trust não existe como instituto próprio, e as famílias costumam usar a holding patrimonial, a doação com reserva de usufruto e o testamento, sendo possível o inventário extrajudicial em cartório quando todos os herdeiros são maiores, capazes e estão de acordo.',
 'em Portugal o trust não é, em regra, reconhecido como instituto próprio (com exceção da Zona Franca da Madeira), e as famílias costumam usar sociedades familiares, a doação com reserva de usufruto e o testamento, sendo possível fazer a habilitação de herdeiros e a partilha num cartório notarial quando há acordo entre todos.'),
('enquanto no Brasil os bens podem ser transferidos na herança pelo valor de mercado, mas a diferença em relação ao custo de aquisição do falecido fica sujeita ao imposto sobre ganho de capital, além do ITCMD estadual, e o Código Civil reserva metade do patrimônio aos herdeiros necessários (a legítima) —',
 'enquanto em Portugal a herança não paga mais-valias à morte e o herdeiro passa em regra a ter como valor de aquisição o valor considerado para efeitos do Imposto do Selo, imposto de 10% sobre as transmissões gratuitas do qual estão isentos o cônjuge, os descendentes e os ascendentes, e o Código Civil reserva aos herdeiros legitimários uma parte da herança (a legítima, que chega a dois terços quando há cônjuge e filhos) —'),
('no Brasil, usam-se holding patrimonial, doação com reserva de usufruto e testamento.','em Portugal, usam-se sociedades familiares, doação com reserva de usufruto e testamento.'),
('nos EUA pode afastar o imposto sobre a valorização anterior, no Brasil há ganho de capital sobre a diferença e ITCMD —','nos EUA pode afastar o imposto sobre a valorização anterior, em Portugal não há mais-valias à morte e aplica-se o Imposto do Selo, com isenção para a família próxima —'),
('no Brasil, a portabilidade do financiamento para outro banco permite trocar a taxa sem refazer toda a operação, mas costuma ter custos de avaliação e registro)',
 'em Portugal, transferir o crédito à habitação para outro banco permite mudar de condições, mas costuma envolver custos de avaliação, escritura e registo e, conforme o contrato, uma comissão de reembolso antecipado)'),
('no Brasil, por exemplo, por meio do crédito com garantia de imóvel)','em Portugal, por exemplo, através de um reforço do crédito com hipoteca ou de um crédito multiopções)'),
# b05
('no Brasil, além da legislação municipal, a Lei do Inquilinato trata da locação para temporada (até 90 dias) e o Superior Tribunal de Justiça já admitiu que a convenção de condomínio pode restringir locações por aplicativo de curtíssima duração,',
 'em Portugal, por exemplo, o arrendamento de curta duração a turistas está sujeito ao regime do Alojamento Local, com registo obrigatório, e esse regime foi alterado várias vezes nos últimos anos, com os municípios a poderem limitar novos registos e o condomínio a poder, em certas condições, opor-se ao alojamento local numa fração,'),
('e, no Brasil, também condomínios —','e, em Portugal, também os condomínios —'),
('no Brasil, o plano empresário do crédito imobiliário segue essa lógica, com liberações conforme medições da obra)','em Portugal, o financiamento bancário à promoção imobiliária segue em regra essa lógica, com libertações conforme os autos de medição da obra)'),
('no Brasil, por exemplo, o repasse das unidades aos compradores finais)','em Portugal, por exemplo, a venda das frações aos compradores finais, com o respetivo crédito à habitação)'),
('fundos de investimento imobiliário (FIIs) no Brasil —','fundos de investimento imobiliário e SIGI em Portugal —'),
('fundo de investimento imobiliário (FII) no Brasil —','fundo de investimento imobiliário ou uma SIGI em Portugal —'),
('REIT e FII versus','REIT e SIGI versus'),
('REITs e FIIs','REITs e SIGI'),('REITs ou FIIs','REITs ou SIGI'),('REIT ou FII','REIT ou SIGI'),
('e no Brasil os rendimentos de FIIs distribuídos a pessoas físicas são em regra isentos de imposto de renda quando cumpridas as condições legais (como cotas negociadas em bolsa, número mínimo de cotistas e participação individual limitada), enquanto o ganho na venda das cotas é tributado;',
 'e em Portugal os dividendos de uma SIGI recebidos por pessoas singulares residentes são em regra tributados à taxa liberatória de 28%, com opção de englobamento, e o ganho na venda das ações também é tributado;'),
('enquanto no Brasil a pessoa física não deprecia o imóvel, mas pode contar com hipóteses de isenção do ganho de capital na venda de imóvel residencial —','enquanto em Portugal a pessoa singular não deprecia o imóvel arrendado, mas pode contar com a exclusão da mais-valia por reinvestimento na habitação própria e permanente —'),
('no Brasil, normalmente feita por uma imobiliária ou administradora)','em Portugal, normalmente feita por uma imobiliária ou por uma empresa de gestão de arrendamento)'),
# b06
('no Brasil, por exemplo, o uso do solo é definido pelo plano diretor e pela lei municipal de zoneamento, e uma obra depende de aprovação do projeto e de alvará na prefeitura, às vezes com estudo de impacto de vizinhança;',
 'em Portugal, por exemplo, o uso do solo é definido sobretudo pelo Plano Diretor Municipal (PDM), e uma obra depende em regra de licenciamento ou de comunicação prévia na câmara municipal, nos termos do Regime Jurídico da Urbanização e Edificação (RJUE), recentemente alterado;'),
('no Brasil, depende do plano diretor, do zoneamento municipal e do alvará.','em Portugal, depende do PDM e do licenciamento ou comunicação prévia na câmara municipal.'),
('no Brasil, por exemplo, a maior parte do crédito imobiliário usa a alienação fiduciária (Lei 9.514/1997), cuja execução é extrajudicial, feita pelo cartório de registro de imóveis depois da intimação do devedor e seguida de leilão, o que pode tornar o processo bem mais rápido do que uma execução judicial, e uma sociedade pode recorrer à recuperação judicial ou extrajudicial,',
 'em Portugal, por exemplo, o crédito à habitação é garantido por hipoteca e a execução corre em regra por via judicial, os bancos têm de seguir o Procedimento Extrajudicial de Regularização de Situações de Incumprimento (PERSI) com clientes particulares em atraso, existe a dação em pagamento como solução negociada, uma empresa pode recorrer ao Processo Especial de Revitalização (PER) e uma pessoa singular ao Processo Especial para Acordo de Pagamento (PEAP) ou à insolvência com exoneração do passivo restante,'),
('no Brasil, a alienação fiduciária permite execução extrajudicial em cartório.','em Portugal, há o PERSI para particulares em atraso e o PER para empresas.'),
('no Brasil, por exemplo, por aval ou fiança dos sócios em uma dívida da empresa)','em Portugal, por exemplo, por aval ou fiança dos sócios numa dívida da empresa)'),
('no Brasil, muitas vezes em condomínio entre herdeiros)','em Portugal, muitas vezes em compropriedade ou em herança indivisa entre herdeiros)'),
('no Brasil, o acordo de sócios ou de quotistas de uma holding familiar costuma ser o instrumento usado para isso.','em Portugal, o pacto social e um acordo parassocial de uma sociedade familiar costumam ser os instrumentos usados para isso.'),
('como a permuta 1031 dos EUA ou, no Brasil, a isenção por reinvestimento em 180 dias —','como a permuta 1031 dos EUA ou, em Portugal, a exclusão por reinvestimento na habitação própria e permanente —'),
('ou, no Brasil, o imposto sobre o ganho de capital da pessoa física, de 15% a 22,5% conforme o valor do ganho, com isenção quando o valor da venda de um imóvel residencial é aplicado na compra de outro imóvel residencial no Brasil em até 180 dias, benefício que só pode ser usado uma vez a cada cinco anos —',
 'ou, em Portugal, a tributação em IRS de metade da mais-valia de um residente às taxas progressivas, com exclusão quando a venda da habitação própria e permanente é reinvestida noutra habitação própria e permanente dentro dos prazos legais —'),
('e, no Brasil, o prazo de 180 dias para a isenção por reinvestimento)','e, em Portugal, os prazos legais da exclusão por reinvestimento)'),
('a permuta 1031 nos EUA, o ganho de capital e a isenção por reinvestimento em 180 dias no Brasil —','a permuta 1031 nos EUA, a mais-valia e a exclusão por reinvestimento na habitação própria em Portugal —'),
# b07
('no Brasil, as plataformas de investimento participativo são reguladas pela CVM, e o investidor deve confirmar se a plataforma está registrada antes de investir.',
 'em Portugal, as plataformas de financiamento colaborativo são supervisionadas pela CMVM, ao abrigo do regulamento europeu sobre prestadores de serviços de financiamento colaborativo, e o investidor deve confirmar se a plataforma está autorizada antes de investir.'),
('no Brasil, o crédito com garantia de imóvel, ou home equity)','em Portugal, um crédito com hipoteca sobre a habitação ou um crédito multiopções)'),
('no Brasil, em geral por alienação fiduciária, com execução extrajudicial)','em Portugal, em geral por hipoteca)'),
('e como a situação é diferente no Brasil.','e como a situação é diferente em Portugal.'),
('no Brasil não há um status equivalente, e a pessoa física tributa a renda de aluguel pela tabela progressiva mensal (carnê-leão) e na declaração anual, podendo deduzir apenas certas despesas, como IPTU e taxa de administração pagos por ela, sem compensar prejuízos com aluguéis contra o salário;',
 'em Portugal não há um estatuto equivalente: as rendas de uma pessoa singular são rendimentos da categoria F do IRS, em regra tributados a uma taxa autónoma (com taxas reduzidas para contratos de longa duração) ou, por opção, englobados, podendo deduzir-se certas despesas, como o IMI e o condomínio, e as perdas só são reportáveis contra rendimentos prediais futuros, e não contra o salário;'),
('no Brasil não há equivalente.','em Portugal não há equivalente.'),
('o Brasil, por exemplo, tem acordos para evitar a dupla tributação com dezenas de países, mas não com os Estados Unidos, caso em que a compensação do imposto pago no exterior depende de regras de reciprocidade.',
 'Portugal, por exemplo, tem convenções para evitar a dupla tributação com dezenas de países, incluindo os Estados Unidos e o Brasil, e quando não há convenção aplica-se em regra o crédito de imposto por dupla tributação internacional previsto no IRS.'),
('o Brasil não tem tratado com os Estados Unidos.','Portugal tem convenções com dezenas de países, incluindo os Estados Unidos.'),
# b08
('no Brasil, isso significa verificar o potencial construtivo que a legislação municipal de fato permite e os custos associados, como a outorga onerosa do direito de construir quando houver.',
 'em Portugal, isso significa verificar a capacidade construtiva que o PDM e os restantes planos de facto permitem e os custos associados, como as taxas urbanísticas municipais.'),
('incluindo os canais SUSEP e Procon no Brasil.','incluindo os canais da ASF e o Livro de Reclamações em Portugal.'),
('no Brasil, por exemplo, os seguros são fiscalizados pela SUSEP, e o segurado pode registrar reclamação na própria seguradora, na ouvidoria, no Procon ou na plataforma consumidor.gov.br, além de recorrer ao Judiciário;',
 'em Portugal, por exemplo, os seguros são supervisionados pela Autoridade de Supervisão de Seguros e Fundos de Pensões (ASF), e o tomador do seguro pode reclamar junto da própria seguradora, do provedor do cliente, da ASF ou no Livro de Reclamações, recorrer à arbitragem de conflitos de seguros (CIMPAS) ou aos tribunais;'),
('no Brasil, há canais como SUSEP, ouvidoria, Procon e consumidor.gov.br.','em Portugal, há canais como a seguradora, o provedor do cliente, a ASF, o Livro de Reclamações e o CIMPAS.'),
('no Brasil, por exemplo, com crédito pré-aprovado pelo banco)','em Portugal, por exemplo, com uma aprovação prévia do crédito pelo banco)'),
# b09
('no Brasil, o ganho maior da empresa que depreciou)','em Portugal, a mais-valia maior da empresa que amortizou)'),
('no Brasil, essa dedução existe para empresas (a pessoa jurídica em geral deprecia edificações a cerca de 4% ao ano), mas não para a pessoa física que aluga imóvel em nome próprio.',
 'em Portugal, essa dedução existe para empresas, que em regra amortizam os edifícios a taxas anuais legalmente fixadas (por exemplo, cerca de 2% para edifícios habitacionais), mas não para a pessoa singular que arrenda um imóvel em nome próprio.'),
('reduz o custo contábil do imóvel e aumenta o ganho tributável da empresa que o vende (no Brasil)','reduz o valor contabilístico do imóvel e aumenta a mais-valia tributável da empresa que o vende (em Portugal)'),
('no Brasil, isso vale para empresas, não para a pessoa física.','em Portugal, isso vale para empresas, não para a pessoa singular.'),
# b10
('no Brasil, incluindo a matrícula atualizada e as certidões do vendedor)','em Portugal, incluindo a certidão permanente do registo predial, a caderneta predial e a licença de utilização)'),
]
n=0;miss=[]
for old,new in R:
    hit=0
    for f in sorted(glob.glob('work/RED-L5-pt-PT/*.txt')):
        s=open(f,encoding='utf-8').read()
        if old in s: hit+=s.count(old); s=s.replace(old,new); open(f,'w',encoding='utf-8').write(s)
    n+=hit
    if not hit: miss.append(old[:60])
print('replaced',n,'missing',len(miss)); [print('  MISS',m) for m in miss]
