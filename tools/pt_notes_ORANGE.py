# pt_notes_ORANGE.py : Brazil->Portugal note swaps on ORANGE-L5 pt-PT copy (run BEFORE pt_pt.py), plus R$ -> euros
import glob,re
A="por isso confirme com um advogado"
C="por isso confirme com um contabilista certificado"
AC="por isso confirme com um advogado e um contabilista certificado"
I="em Portugal, por exemplo, segundo a informação disponível, "
S=[
I+"os descontos concedidos na fatura em regra reduzem o valor tributável em IVA, a venda com prejuízo é em regra proibida, e os preços ao consumidor devem ser indicados com o IVA incluído, "+C,
I+"a contabilidade reconhece a receita recebida antecipadamente à medida que o serviço é prestado, mas o IVA pode tornar-se exigível logo no recebimento do adiantamento, "+C,
I+"as despesas de publicidade são em regra gastos dedutíveis em IRC quando ligadas à atividade, enquanto as despesas de representação e certas despesas com viaturas pagam tributação autónoma, "+C,
I+"o vendedor responde pelos defeitos da coisa vendida segundo o Código Civil, o Código da Publicidade proíbe a publicidade enganosa e a mediação imobiliária só pode ser exercida por empresas licenciadas pelo IMPIC, "+A,
I+"as ofertas públicas de valores mobiliários são supervisionadas pela CMVM, as plataformas de financiamento colaborativo seguem o regulamento europeu próprio, e informações falsas ou enganosas num prospeto podem gerar responsabilidade, "+A,
I+"na compra de ativos o comprador pode depreciar os bens pelo novo custo, mas a transmissão de imóveis paga IMT e imposto do selo, e na transmissão de um estabelecimento os contratos de trabalho passam em regra para o adquirente, "+AC,
I+"a mais-valia na venda de um imóvel por um particular é tributada em IRS, e quando o preço é pago em prestações o momento da tributação segue regras próprias, "+C,
I+"as comissões pagas a um trabalhador podem integrar a sua retribuição, com efeitos no subsídio de férias e de Natal, e a anulação de comissões já vencidas depende do que foi acordado por escrito e da lei laboral, por isso confirme com um advogado especializado em direito do trabalho",
I+"o regime do contrato de agência pode dar ao agente uma indemnização de clientela quando o contrato termina, até ao valor médio anual das remunerações dos últimos cinco anos, e exige pré-aviso na denúncia, "+A,
I+"as normas contabilísticas não permitem reconhecer como ativo uma marca gerada internamente, enquanto uma marca adquirida pode ser reconhecida, e o registo no INPI protege a marca, "+C,
I+"o Código da Publicidade e a lei sobre práticas comerciais desleais proíbem a publicidade enganosa, e reduzir a quantidade de um produto sem informar o consumidor de forma clara pode ser considerado uma prática enganosa, "+A,
I+"as despesas de publicidade ligadas à atividade são em regra dedutíveis em IRC, e os prejuízos fiscais de anos anteriores só podem ser deduzidos até um limite do lucro tributável de cada ano, "+C,
I+"a lei sobre práticas comerciais desleais e o regime das infrações contra a economia podem punir a especulação de preços, e a ASAE pode fiscalizar aumentos em situações de crise, "+A,
I+"uma empresa estrangeira em geral precisa de número de identificação fiscal e de registo, ou de um representante, certos produtos exigem a marcação CE ou autorizações setoriais, e o RGPD aplica-se aos dados dos clientes, "+A,
I+"as diferenças de câmbio realizadas e as não realizadas têm regras próprias em IRC e nas normas contabilísticas, "+C,
I+"a imposição de preços de revenda pode ser uma prática restritiva da concorrência que a Autoridade da Concorrência pode investigar e punir com coimas, "+A,
I+"as regras do comércio eletrónico e dos contratos celebrados à distância exigem informação clara antes da contratação, e o consumidor tem em regra catorze dias para exercer o direito de livre resolução, "+A,
I+"os bancos e as empresas de factoring costumam limitar a exposição a um único devedor nas operações de factoring ou de antecipação de faturas, por isso confirme com o seu banco",
I+"os gastos correntes com conteúdos são em regra gastos do período, enquanto um site ou um software desenvolvido pode, em certas condições, ser reconhecido como ativo intangível e amortizado, "+C,
I+"o Código da Publicidade exige que a publicidade seja inequivocamente identificada como tal, e as orientações da Direção-Geral do Consumidor sobre influenciadores recomendam sinalizar os conteúdos comerciais com termos como \"publicidade\", "+A,
I+"o RGPD exige uma base legal para cada tratamento de dados pessoais, garante direitos aos titulares e é fiscalizado pela Comissão Nacional de Proteção de Dados (CNPD), que deve ser notificada das violações de dados relevantes, "+A,
I+"as empresas comuns e certas concentrações entre concorrentes podem ter de ser notificadas à Autoridade da Concorrência ou à Comissão Europeia antes de produzirem efeitos, "+A,
I+"não existe uma lei geral específica das franquias, que seguem sobretudo as regras gerais dos contratos e o regime da agência aplicado por analogia, e o direito europeu da concorrência isenta em certas condições os acordos verticais de franquia, "+A,
I+"o particular que vende quotas paga em regra IRS sobre a mais-valia, enquanto a venda de ativos pela sociedade é tributada em IRC antes de o dinheiro chegar aos sócios, "+C,
I+"a parte do preço paga em prestações ou dependente de resultados futuros pode ter regras próprias quanto ao momento da tributação da mais-valia em IRS ou em IRC, "+C,
I+"o ouro para investimento beneficia em regra de isenção de IVA segundo as regras europeias, enquanto as joias e as moedas de coleção seguem regras diferentes, e a atividade de compra e venda de artigos com metais preciosos exige licenciamento, "+AC,
I+"o Fundo de Garantia de Depósitos protege os depósitos até cem mil euros por depositante e por instituição, mas não cobre os fundos de investimento, e as regras europeias exigem avaliar a adequação dos produtos ao perfil do cliente, por isso confirme os limites atuais com o Fundo de Garantia de Depósitos e com um profissional habilitado",
I+"é comum recorrer ao factoring, ao confirming ou ao desconto de faturas junto de bancos e de sociedades de factoring, com custos e garantias que variam muito, "+AC,
I+"a Central de Responsabilidades de Crédito do Banco de Portugal e as empresas de informação comercial fornecem dados sobre o crédito, e o uso desses dados quando envolve pessoas singulares está sujeito ao RGPD, "+A,
I+"o Código dos Contratos Públicos rege a contratação pública, os procedimentos são publicados no portal BASE e no Diário da República, e as regras europeias aplicam-se acima de certos limiares, "+A,
I+"os descontos concedidos na fatura em regra não entram no valor tributável do IVA, enquanto as ofertas e as amostras têm regras próprias, e os vales podem ter tratamento diferente em IVA conforme sejam de finalidade única ou múltipla, "+C,
I+"o IVA tem taxas diferentes no continente e nas regiões autónomas dos Açores e da Madeira, e as vendas à distância a consumidores de outros Estados-Membros podem exigir IVA do país de destino, com o balcão único OSS a simplificar as declarações, "+C,
I+"o produtor ou o distribuidor que sabe que um produto é perigoso deve informar de imediato as autoridades competentes, como a ASAE, e tomar medidas como a recolha do produto, "+A,
I+"o Código da Publicidade proíbe a publicidade enganosa e oculta, e as orientações da Direção-Geral do Consumidor recomendam que os conteúdos patrocinados ou recompensados sejam claramente identificados como publicidade, "+A,
I+"o regulamento europeu sobre bloqueio geográfico proíbe em regra discriminar os clientes de outros Estados-Membros nas vendas on-line por causa da nacionalidade ou do local de residência, "+A,
I+"os alimentos para animais de companhia seguem as regras europeias de rotulagem e de segurança, com registo dos operadores junto da Direção-Geral de Alimentação e Veterinária, enquanto os alimentos para pessoas são fiscalizados pela ASAE, por isso confirme com um advogado ou com a entidade competente",
I+"as importações de fora da União Europeia pagam em regra direitos aduaneiros pela pauta comum da União e IVA na importação, e as regras de origem e os acordos comerciais da União podem reduzir os direitos de certos produtos, por isso confirme com um despachante oficial ou contabilista certificado",
I+"a CMVM supervisiona as ofertas de valores mobiliários e os organismos de investimento coletivo, incluindo os fundos de investimento imobiliário, e as ofertas públicas seguem as regras europeias sobre prospetos, por isso confirme com um advogado especializado em mercados de capitais",
I+"a lei sobre práticas comerciais desleais proíbe as práticas agressivas, e o consumidor não é obrigado a pagar bens ou serviços que não encomendou, "+A,
I+"as despesas de publicidade são em regra dedutíveis em IRC, mas no regime simplificado o imposto incide sobre uma parte presumida dos rendimentos, por isso o efeito fiscal das despesas de marketing é diferente, "+C,
I+"a escolha entre o regime simplificado e a contabilidade organizada, o enquadramento em IVA e as obrigações de faturação certificada afetam os preços e as obrigações, "+C,
I+"um crescimento rápido pode levar a empresa a ultrapassar o limite do regime simplificado ou da isenção de IVA e a ter de mudar de regime, "+C,
I+"a lei da concorrência proíbe a fixação de preços entre concorrentes e o abuso de posição dominante, incluindo certos preços predatórios, que a Autoridade da Concorrência pode punir com coimas elevadas, "+A,
]
P=re.compile(r"[Nn]o Brasil, por exemplo,[^\n]*?(?:portanto|por isso) confirme [^.;:)\n]*")
k=0
def money(t):
    def num(s): return s.replace('.',' ')
    t=re.sub(r'R\$ ?([0-9]+(?:,[0-9]+)?) milhão',lambda m:m.group(1)+(' milhões' if ',' in m.group(1) else ' milhão')+' de euros',t)
    t=re.sub(r'R\$ ?([0-9]+(?:,[0-9]+)?) milhões',lambda m:m.group(1)+' milhões de euros',t)
    t=re.sub(r'R\$ ?([0-9]+(?:\.[0-9]{3})*(?:,[0-9]+)?)',lambda m:num(m.group(1))+' euros',t)
    t=t.replace('primeiro real','primeiro euro')
    return t
for f in sorted(glob.glob('work/ORANGE-L5-pt-PT/b*.txt')):
    t=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1
        return r[0].upper()+r[1:] if m.group(0)[0]=='N' else r
    t=P.sub(rep,t)
    t=money(t)
    open(f,'w',encoding='utf-8').write(t)
print('replaced',k,'of',len(S))
