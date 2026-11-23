# pt_notes_PURPLE.py : Brazil->Portugal note swaps on PURPLE-L5 pt-PT copy (run BEFORE pt_pt.py), plus R$ -> euros
import glob,re
A="por isso confirme com um advogado"
C="por isso confirme com um contabilista certificado"
AC="por isso confirme com um advogado e um contabilista certificado"
I="em Portugal, por exemplo, segundo a informação disponível, "
S=[
I+"o direito das sociedades e o direito civil são nacionais e estão sobretudo no Código das Sociedades Comerciais e no Código Civil, e impostos como o IMT, o IMI e o imposto do selo aplicam-se em todo o país, embora cada município fixe a taxa do IMI dentro de certos limites, "+AC,
I+"a LLC americana não existe como tal, as formas mais comuns são a sociedade por quotas e a sociedade unipessoal por quotas, e a sociedade é em regra tributada em IRC, não podendo escolher a tributação dos sócios como uma LLC americana, "+AC,
I+"é comum uma sociedade gestora de participações sociais (SGPS) ou outra sociedade holding deter as participações e os bens, mas as operações entre sociedades relacionadas devem seguir os preços de mercado pelas regras de preços de transferência, "+C,
I+"esta figura não existe como nos Estados Unidos, cada imóvel pode ficar numa sociedade por quotas própria ou numa holding, e a transmissão de um imóvel para uma sociedade exige em regra escritura ou documento particular autenticado, registo predial e pagamento de IMT e imposto do selo, "+AC,
I+"quando o contrato de sociedade de uma sociedade por quotas nada diz, aplicam-se as regras supletivas do Código das Sociedades Comerciais, que podem não corresponder ao que os sócios combinaram de boca, e um acordo parassocial pode completar o contrato, "+A,
I+"o capital de um seguro de vida pago por morte a um beneficiário designado em regra não integra a herança e pode não estar sujeito a imposto do selo nem a IRS, mas o tratamento dos prémios pagos pela sociedade depende da estrutura, "+AC,
I+"o fiador pode responder pela dívida sem poder exigir primeiro a execução dos bens do devedor quando renuncia ao benefício da excussão prévia, o que é comum nos empréstimos bancários, e o aval numa livrança responsabiliza pessoalmente quem o assina, "+A,
I+"os tribunais podem desconsiderar a personalidade coletiva em casos de abuso, como a confusão de patrimónios ou a subcapitalização manifesta, e os gerentes podem responder perante a Autoridade Tributária e a Segurança Social por dívidas da sociedade em certas situações, "+A,
I+"o trust revogável não existe como nos Estados Unidos, a herança passa em regra por habilitação de herdeiros e partilha, que podem ser feitas em cartório notarial ou no balcão das heranças quando há acordo entre os herdeiros, e a transmissão gratuita pode pagar imposto do selo, embora o cônjuge, os filhos e os pais estejam em regra isentos, "+AC,
I+"o trust não é uma figura do direito português, exceto em certas situações na Zona Franca da Madeira, e os trusts constituídos no estrangeiro têm regras próprias de tributação e de declaração dos beneficiários efetivos, "+AC,
I+"a compropriedade dá a cada comproprietário uma quota, que passa aos seus próprios herdeiros, e não ao outro comproprietário, pelo que a sobrevivência automática ao estilo americano não existe, enquanto os bens do casal seguem o regime de bens do casamento, "+A,
I+"o capital de um seguro de vida e de alguns planos poupança-reforma pode ser pago diretamente aos beneficiários designados, fora da partilha da herança, mas os herdeiros legitimários têm direito a uma parte mínima da herança que pode limitar estas designações, "+A,
I+"não existe um equivalente direto ao plano de participação acionária dos trabalhadores dos Estados Unidos, a sucessão numa empresa familiar costuma usar doações de quotas, pactos sociais e acordos parassociais, e a transmissão de quotas pode ter consequências em imposto do selo e em IRS, "+AC,
I+"a lei declara impenhoráveis certos bens e limita a penhora de salários e pensões, a casa de morada de família tem algumas proteções em processos de execução fiscal, e os credores podem pedir a impugnação pauliana dos atos que prejudiquem a garantia dos seus créditos, "+A,
I+"a Autoridade de Supervisão de Seguros e Fundos de Pensões (ASF) supervisiona as seguradoras e os mediadores de seguros, e o seguro de perdas de exploração costuma exigir um dano material coberto, por isso confirme com um mediador de seguros",
I+"o senhorio deve assegurar o gozo do locado para os fins a que se destina e fazer as obras de conservação necessárias, o arrendamento urbano segue regras próprias do Código Civil e do Novo Regime do Arrendamento Urbano, e o despejo pode exigir uma ação judicial ou o procedimento especial de despejo, "+A,
I+"o Fundo de Garantia de Depósitos protege os depósitos até cem mil euros por depositante e por instituição, o Sistema de Indemnização aos Investidores tem regras e limites próprios, e a proteção de planos de pensões e de PPR perante os credores depende do produto e da lei aplicável, "+A,
I+"sem convenção antenupcial o regime supletivo é a comunhão de adquiridos, em que os bens adquiridos durante o casamento em regra são comuns, e a convenção antenupcial é feita por escritura pública ou por declaração na conservatória do registo civil, "+A,
I+"os montantes pagos pelo vendedor por violação das declarações e garantias podem ser tratados como ajustamento do preço ou de outra forma, conforme a redação do contrato, com efeitos no IRC ou no IRS de cada parte, "+C,
I+"muitas atividades dependem de comunicação prévia ou de licenciamento junto do município e de entidades setoriais, como a Autoridade de Segurança Alimentar e Económica (ASAE) ou a autoridade ambiental, e o tratamento de dados pessoais deve cumprir o Regulamento Geral sobre a Proteção de Dados (RGPD), "+A,
I+"na transmissão de um estabelecimento comercial, os contratos de trabalho passam em regra para o adquirente, que pode responder por certas dívidas laborais anteriores, e a cessão de contratos e de licenças costuma exigir o consentimento da outra parte, "+A,
I+"a garantia mais usada nos imóveis é a hipoteca, registada na conservatória do registo predial, e a sua execução exige em regra uma ação judicial, embora o penhor de bens móveis e a reserva de propriedade também sejam usados, "+A,
I+"é comum assinar primeiro um contrato-promessa de compra e venda com um sinal, e as condições, como a aprovação do crédito à habitação, devem constar por escrito do contrato-promessa antes da escritura e do registo, já que a perda do sinal ou a sua restituição em dobro dependem do que foi acordado e da lei, "+A,
I+"o arrendamento não habitacional dá às partes muita liberdade para fixar o prazo, a renovação e as obras, o arrendatário pode em certos casos transmitir a posição por trespasse do estabelecimento sem autorização do senhorio, e o IMI cabe por lei ao proprietário, "+A,
I+"não existe congelamento geral das rendas nos novos contratos, a atualização anual das rendas segue em regra um coeficiente publicado pelo Governo, a caução e as rendas antecipadas têm limites legais, e o despejo pode exigir uma ação judicial ou o procedimento especial de despejo, "+A,
I+"as marcas e as patentes são registadas no Instituto Nacional da Propriedade Industrial (INPI) com base no Código da Propriedade Industrial, e os direitos sobre programas de computador criados por um trabalhador no exercício das suas funções pertencem em regra ao empregador, "+A,
I+"o direito à marca é em regra de quem a regista primeiro no INPI, a marca da União Europeia junto do EUIPO cobre todos os Estados-Membros com um único pedido, e Portugal faz parte do Sistema de Madrid, "+A,
I+"as regalias pagas a entidades no estrangeiro costumam ter retenção na fonte de IRC ou de IRS, que pode ser reduzida por uma convenção para evitar a dupla tributação ou pelas regras da União Europeia, e as licenças de marca devem prever o controlo da qualidade, "+AC,
I+"o Código do Trabalho presume a existência de um contrato de trabalho quando se verificam certos indícios, como o horário fixado pelo beneficiário ou a utilização dos seus equipamentos, e a Autoridade para as Condições do Trabalho (ACT) pode atuar contra os falsos recibos verdes, "+A,
I+"o Código do Trabalho só admite o pacto de não concorrência do trabalhador por escrito, por um período máximo de dois anos em regra, para atividades que possam causar prejuízo ao empregador e com uma compensação durante a limitação, e na venda de um estabelecimento o vendedor pode assumir por contrato uma obrigação de não concorrência razoável, "+A,
I+"a Comissão do Mercado de Valores Mobiliários (CMVM) supervisiona as ofertas de valores mobiliários, as ofertas públicas seguem o Código dos Valores Mobiliários e as regras europeias sobre prospetos, e certas ofertas particulares ou de pequeno montante podem ficar dispensadas, "+A,
I+"as campanhas de recompensa podem ficar sujeitas às regras de defesa do consumidor, e o financiamento colaborativo de capital ou por empréstimo só pode ser oferecido através de plataformas autorizadas ao abrigo do regulamento europeu sobre prestadores de serviços de financiamento colaborativo, sob supervisão da CMVM, "+A,
I+"o Código da Publicidade e a lei sobre práticas comerciais desleais proíbem a publicidade enganosa, a Direção-Geral do Consumidor e a ASAE podem aplicar coimas, e a Auto Regulação Publicitária faz a autorregulação do setor, "+A,
I+"o Regulamento Geral sobre a Proteção de Dados (RGPD) exige um fundamento de licitude para cada tratamento, como o consentimento ou o interesse legítimo, é fiscalizado em Portugal pela Comissão Nacional de Proteção de Dados (CNPD) e limita as transferências de dados para fora do Espaço Económico Europeu a certas situações, "+A,
I+"os regulamentos europeus Roma I e Bruxelas I-A definem em regra a lei aplicável e o tribunal competente nos contratos com ligação à União Europeia, as sentenças de fora da União precisam em regra de revisão e confirmação por um tribunal da relação, e a Lei da Arbitragem Voluntária e a Convenção de Nova Iorque facilitam o reconhecimento das decisões arbitrais estrangeiras, "+A,
I+"o Código Civil admite a impossibilidade não imputável ao devedor e permite pedir a resolução ou a modificação do contrato por alteração anormal das circunstâncias, e as partes podem em regra fixar o preço numa moeda estrangeira, "+A,
I+"o Código de Processo Civil prevê tentativas de conciliação, a Lei da Mediação regula a mediação, os julgados de paz tratam de causas de menor valor e um processo comum com recursos pode levar anos, "+A,
I+"a parte vencida paga em regra as custas, que incluem uma compensação limitada pelos honorários do advogado da parte vencedora, e os julgados de paz e a injunção oferecem caminhos mais baratos para certas dívidas, "+A,
I+"os consultores para investimento e os intermediários financeiros precisam de autorização da CMVM ou do Banco de Portugal, os mediadores de seguros são supervisionados pela ASF e os contabilistas certificados têm de estar inscritos na Ordem dos Contabilistas Certificados, por isso confirme a habilitação de cada profissional",
I+"os atos societários são registados na conservatória do registo comercial, a sociedade tem de manter atualizado o Registo Central do Beneficiário Efetivo e de entregar todos os anos a Informação Empresarial Simplificada (IES) e a declaração Modelo 22 de IRC, "+C,
I+"são comuns as sociedades familiares que detêm os bens, e a doação de quotas a filhos ou netos, muitas vezes com reserva de usufruto, está em regra isenta de imposto do selo, embora outras transmissões possam pagar imposto do selo e IMT, "+AC,
I+"os donativos a entidades reconhecidas ao abrigo do Estatuto dos Benefícios Fiscais podem dar dedução em IRS ou ser majorados como custo em IRC, dentro de limites, as fundações precisam de reconhecimento administrativo e a figura americana do fundo de donativos orientado pelo doador não é comum, "+AC,
I+"o Código Civil fixa prazos de prescrição que variam conforme o tipo de direito, e o arrendatário habitacional tem em certos casos direito de preferência na venda do imóvel arrendado, a exercer num prazo curto depois de ser notificado, "+A,
I+"os acórdãos de uniformização de jurisprudência do Supremo Tribunal de Justiça e as decisões do Tribunal Constitucional ou do Tribunal de Justiça da União Europeia podem mudar o rumo de processos em curso, "+A,
I+"o Código de Processo Civil prevê multa e indemnização por litigância de má-fé, e as infrações fiscais por falta de pagamento ou de declaração podem dar origem a coimas elevadas ao abrigo do Regime Geral das Infrações Tributárias, "+AC,
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
for f in sorted(glob.glob('work/PURPLE-L5-pt-PT/b*.txt')):
    t=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1
        return r[0].upper()+r[1:] if m.group(0)[0]=='N' else r
    t=P.sub(rep,t)
    t=money(t)
    open(f,'w',encoding='utf-8').write(t)
print('replaced',k,'of',len(S))
