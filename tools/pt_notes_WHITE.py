# pt_notes_WHITE.py : Brazil->Portugal note swaps on WHITE-L5 pt-PT copy (run BEFORE pt_pt.py)
# Each entry: (start snippet, replacement). Text from snippet start up to the end of that sentence
# (first '.' followed by space/newline) is replaced; the final '.' is kept.
import glob,re
R=[
# b01
('no Brasil, por exemplo, uma alta da Selic','em Portugal, por exemplo, uma subida das taxas do Banco Central Europeu costuma fazer descer o preço das obrigações de taxa fixa e de prazo longo já emitidas, enquanto os depósitos e os certificados com taxa variável passam a render mais'),
('no Brasil, por exemplo, essa comparação costuma envolver a previdência','em Portugal, por exemplo, essa comparação costuma envolver os planos de poupança-reforma (PPR), com possível dedução à coleta do IRS dentro de limites, os certificados de aforro e do Tesouro e as aplicações tributadas comuns, como depósitos e fundos, cujos rendimentos costumam ser tributados a uma taxa liberatória de 28%'),
('no Brasil, onde o caixa aplicado','em Portugal, onde o caixa aplicado em depósitos a prazo ou em certificados de aforro pode render mais em períodos de juros altos, esse custo de oportunidade pode ser menor em alguns períodos e maior em outros, e não pode ser estimado com segurança de antemão'),
('no Brasil, por exemplo, o prejuízo em operações comuns','em Portugal, por exemplo, as menos-valias com ações só podem, em regra, ser levadas aos anos seguintes (até cinco anos) se o investidor optar pelo englobamento, e não há uma isenção mensal para vendas de pequeno valor, o que muda o cálculo, por isso confirme os detalhes atuais com um contabilista'),
('no Brasil, o prejuízo com ações em regra compensa','em Portugal, o reporte de menos-valias depende, em regra, da opção pelo englobamento'),
# b02
('no Brasil, essas operações são negociadas na B3','em Portugal, o acesso a opções costuma ser feito através de corretoras com acesso a bolsas europeias ou americanas, e os ganhos em geral são tributados como mais-valias, por isso confirme os detalhes com um contabilista'),
('no Brasil, uma escada pode ser montada','em Portugal, uma escada pode ser montada, por exemplo, com obrigações do Tesouro ou com depósitos a prazo em bancos diferentes, lembrando que o Fundo de Garantia de Depósitos cobre em regra até 100 000 euros por depositante e por instituição'),
('no Brasil, lembre-se dos limites da garantia do FGC','em Portugal, lembre-se do limite do Fundo de Garantia de Depósitos'),
('no Brasil, por exemplo, vendas de ações à vista','em Portugal, por exemplo, as mais-valias com ações e fundos costumam ser tributadas a 28% (ou englobadas, por opção), sem isenção para pequenas vendas, e a detenção por menos de 365 dias pode, em certos casos, obrigar ao englobamento, o que pode influenciar quais ativos vender para rebalancear'),
('no Brasil, a alavancagem em bolsa','em Portugal, a alavancagem costuma ser oferecida pelas corretoras sob regras europeias de proteção do investidor, e a corretora também pode exigir reforço de garantias ou fechar posições'),
('no Brasil, por exemplo, o regime tributário da empresa','em Portugal, por exemplo, o regime da empresa (IRC, derrama e tributação autónoma), a tributação dos dividendos distribuídos aos sócios, em regra a 28%, e a tributação das mais-valias com ações podem mudar bastante essa comparação, por isso confirme a situação atual com um contabilista'),
# b03
('no Brasil, além da taxa de administração','em Portugal, além da comissão de gestão, alguns fundos ativos cobram comissão de desempenho, o que aumenta essa diferença'),
('no Brasil, por exemplo, muitos fundos abertos sofrem o chamado come-cotas','em Portugal, por exemplo, os rendimentos de fundos costumam ser tributados quando são distribuídos ou quando as unidades de participação são resgatadas, em regra a 28%, e os fundos de acumulação adiam essa tributação, o que também pesa na comparação'),
('ou, no Brasil, o come-cotas de muitos fundos abertos','ou a diferença entre fundos de distribuição e de acumulação'),
('por que, no Brasil, a comparação equivalente é entre PGBL e VGBL','por que, em Portugal, a comparação mais próxima envolve os PPR'),
('no Brasil, a comparação mais próxima é entre o PGBL','em Portugal, a comparação mais próxima envolve os PPR, que permitem uma dedução à coleta do IRS dentro de limites que variam com a idade e têm uma tributação mais favorável no resgate nas condições legais, embora não haja um equivalente exato da conta Roth'),
('no Brasil, PGBL e VGBL formam a comparação mais próxima','em Portugal, os PPR formam a comparação mais próxima'),
('no Brasil, por exemplo, os valores de planos de previdência','em Portugal, por exemplo, os montantes de seguros de vida e de alguns PPR em forma de seguro costumam ser pagos aos beneficiários designados no contrato, mas a relação com a herança e com a legítima pode variar, por isso confirme com um advogado'),
('no Brasil, os herdeiros podem receber os bens','em Portugal, a herança não paga mais-valias à morte, aplica-se o Imposto do Selo de 10% sobre as transmissões gratuitas, do qual estão isentos o cônjuge, os descendentes e os ascendentes, e o Código Civil reserva aos herdeiros legitimários uma parte da herança (a legítima)'),
('no Brasil, a regra é diferente e envolve o ITCMD','em Portugal, a regra é diferente e envolve o Imposto do Selo e a legítima'),
('no Brasil, onde o principal índice de ações','em Portugal, onde o principal índice de ações (PSI) tem poucas empresas e peso relevante em setores como energia, banca e distribuição, essa questão de concentração aparece mesmo para quem só investe no índice'),
('e por que o Brasil, por exemplo, não tem','e por que convém confirmar o acordo entre Portugal e o país de origem do investimento'),
('no Brasil, por exemplo, não há acordo para evitar a dupla tributação','em Portugal, por exemplo, existe um acordo para evitar a dupla tributação com os Estados Unidos, que em regra limita a retenção sobre dividendos americanos, e os rendimentos obtidos no estrangeiro por residentes devem ser declarados no IRS, podendo dar direito a crédito por dupla tributação internacional, por isso confirme os detalhes atuais com um contabilista'),
('o Brasil não tem acordo desse tipo com os Estados Unidos','Portugal tem um acordo desse tipo com os Estados Unidos'),
# b04
('no Brasil, por exemplo, o principal índice de ações já passou','em Portugal, por exemplo, o principal índice de ações já passou por quedas fortes, e a recuperação de algumas delas demorou muitos anos, inclusive quando medida em termos reais, descontada a inflação'),
('no Brasil, por exemplo, os dividendos foram isentos','em Portugal, por exemplo, os dividendos recebidos por pessoas singulares residentes costumam ser tributados a uma taxa liberatória de 28%, com a opção de englobamento, em que só metade dos dividendos de certas empresas é considerada, por isso confirme as regras em vigor com um contabilista'),
('no Brasil, essas regras passaram por mudanças recentes','em Portugal, os dividendos costumam ser tributados a 28%'),
('no Brasil, por exemplo, muitos fundos de investimento em participações','em Portugal, por exemplo, muitos fundos de capital de risco e alguns fundos alternativos têm prazos longos de duração ou de resgate, e vários desses produtos são destinados a investidores qualificados ou profissionais, conforme as regras da CMVM'),
('no Brasil, por exemplo, a natureza dos planos de opções','em Portugal, por exemplo, os ganhos com planos de opções de ações atribuídos pelo empregador são em regra tratados como rendimentos do trabalho (categoria A), e a venda posterior das ações pode gerar mais-valias, por isso confirme o seu caso com um contabilista ou advogado fiscalista'),
('no Brasil, a tributação de stock options já foi alvo de disputas','em Portugal, os ganhos com stock options são em regra rendimentos do trabalho'),
('no Brasil, as regras da CVM passaram a exigir','na União Europeia, as regras de divulgação de informação sobre sustentabilidade passaram a exigir mais transparência dos fundos que se apresentam como sustentáveis, mas ler o documento de informação fundamental e o prospeto continua a ser a melhor forma de confirmar os critérios'),
# b05
('no Brasil, essa reserva costuma ser montada','em Portugal, essa reserva costuma ser montada, por exemplo, com depósitos a prazo mobilizáveis ou certificados de aforro, lembrando que a inflação também corrói o poder de compra dessa reserva ao longo do tempo'),
('no Brasil, por exemplo, os planos PGBL e VGBL permitem','em Portugal, por exemplo, alguns PPR e seguros permitem, no resgate, receber o valor sob a forma de renda, embora muitos aforradores prefiram o resgate de uma só vez ou resgates parciais'),
('por que, no Brasil, a comparação equivalente envolve LCI','por que, em Portugal, a comparação equivalente envolve, por exemplo, os certificados de aforro e do Tesouro'),
('no Brasil, praticamente não há um mercado relevante','em Portugal, praticamente não há um mercado relevante de obrigações municipais para pessoas singulares, e os juros da maioria das aplicações são tributados a 28%, mas a mesma lógica de comparar depois dos impostos vale, por exemplo, para produtos com regras fiscais próprias, como PPR e seguros de capitalização mantidos durante os prazos legais, lembrando que essas regras podem mudar'),
('no Brasil, onde a renda fixa tributável costuma seguir','em Portugal, onde muitos juros são tributados a uma taxa liberatória fixa, a alíquota relevante pode depender mais da opção pelo englobamento e do tipo de produto do que da faixa de rendimento do investidor'),
('no Brasil, o prazo da aplicação pesa bastante','em Portugal, a taxa liberatória fixa e a opção pelo englobamento pesam bastante'),
('por que, no Brasil, que não tem trust','por que, em Portugal, que em regra não reconhece o trust como instituto próprio, o planeamento costuma usar outros instrumentos'),
('o trust é um instituto típico','o trust é um instituto típico de países de tradição jurídica anglo-saxónica, e Portugal em regra não o reconhece como instituto próprio (com exceção da Zona Franca da Madeira), de modo que o planeamento patrimonial costuma usar outros instrumentos, como sociedades familiares, doação com reserva de usufruto e testamento, enquanto trusts constituídos no estrangeiro por residentes podem ter regras fiscais próprias'),
('no Brasil, isso costuma envolver instrumentos','em Portugal, isso costuma envolver instrumentos como sociedades familiares, já que o país em regra não reconhece o trust'),
('no Brasil, por exemplo, uma lei de 2022','em Portugal, por exemplo, desde 2023 as mais-valias com criptoativos detidos menos de 365 dias são em regra tributadas a 28%, as detidas há mais tempo podem ficar isentas, e o regulamento europeu MiCA passou a regular os prestadores de serviços, regras que também podem mudar'),
# b06
('no Brasil, por exemplo, muitos fundos e ETFs que investem','em Portugal, por exemplo, muitos ETFs domiciliados na Europa são oferecidos em versões com e sem cobertura cambial, e o custo da cobertura costuma refletir a diferença entre as taxas de juro na zona euro e no estrangeiro'),
('por que, no Brasil, onde a renda fixa costuma ser tributada','por que, em Portugal, onde muitos rendimentos são tributados a uma taxa liberatória fixa, essa lógica se aplica de outra forma'),
('no Brasil, onde não há uma separação tão clara','em Portugal, onde não há uma separação tão clara entre contas tributáveis e contas com vantagem fiscal para cada tipo de ativo, a ideia aparece de outra forma, por exemplo na escolha entre manter certos investimentos dentro de um PPR ou de um seguro de capitalização ou fora deles'),
('no Brasil, onde a taxa Selic','na zona euro, onde as taxas do Banco Central Europeu mudaram bastante nos últimos anos, essa ligação entre juros e preço das ações também é visível'),
('no Brasil, por exemplo, quem vende ações à vista','em Portugal, por exemplo, dividir a saída por vários anos fiscais pode fazer diferença sobretudo para quem opta pelo englobamento, e as menos-valias podem, nesse caso, ser reportadas aos anos seguintes, por isso confirme as regras atuais com um contabilista'),
('no Brasil, dividir a venda ao longo de vários meses','em Portugal, dividir a venda por vários anos fiscais pode, em certos casos, fazer diferença'),
# b07
('no Brasil, por exemplo, a reserva de emergência','em Portugal, por exemplo, a reserva de emergência costuma ser mantida em depósitos à ordem ou a prazo mobilizáveis e de baixo risco'),
('no Brasil, serviços desse tipo existem','em Portugal, serviços desse tipo existem em várias plataformas, e a consultoria para investimento e a gestão de carteiras são reguladas e supervisionadas pela CMVM, por isso vale confirmar o registo do prestador'),
('no Brasil, não existe um status equivalente.','em Portugal, não existe um estatuto equivalente.'),
('no Brasil, não há um status equivalente para pessoas físicas','em Portugal, não há um estatuto equivalente para pessoas singulares: os ganhos de quem negoceia com frequência são em regra tratados como mais-valias, embora uma atividade organizada e habitual possa, em certos casos, ser vista como atividade empresarial'),
('no Brasil, não existe um status equivalente para pessoas físicas','em Portugal, não existe um estatuto equivalente para pessoas singulares'),
('no Brasil, por exemplo, residentes que mantêm investimentos','em Portugal, por exemplo, os residentes devem declarar no IRS os rendimentos obtidos no estrangeiro e, em certos casos, as contas de que são titulares no estrangeiro, por isso confirme as exigências atuais com um contabilista'),
('no Brasil, por exemplo, a garantia do FGC e os mecanismos','em Portugal, por exemplo, o Fundo de Garantia de Depósitos e o Sistema de Indemnização aos Investidores, que cobre em regra até 25 000 euros, não cobrem contas em corretoras estrangeiras não autorizadas em Portugal, que seguem as proteções, se houver, do país onde a corretora está registada'),
('no Brasil, o FGC não cobre corretoras estrangeiras','em Portugal, as garantias nacionais não cobrem todas as corretoras estrangeiras'),
# b08
('no Brasil, um exemplo comum é o COE','em Portugal, um exemplo comum são os produtos financeiros complexos e os depósitos estruturados vendidos por bancos, e só os depósitos estão em regra cobertos pelo Fundo de Garantia de Depósitos'),
('no Brasil, o COE não tem garantia do FGC','em Portugal, muitos produtos estruturados não são cobertos pelo Fundo de Garantia de Depósitos'),
('no Brasil, opções de venda sobre ações','em Portugal, o acesso a opções de venda costuma ser feito através de bolsas estrangeiras, e a liquidez de algumas séries é limitada, o que também afeta o custo da proteção'),
('no Brasil, por exemplo, a remuneração de muitos assessores','em Portugal, por exemplo, as regras europeias (DMIF II) distinguem a consultoria independente, que não pode reter comissões de terceiros, da consultoria não independente, que pode recebê-las, o que muda os incentivos'),
('no Brasil, as regras da CVM exigem','em Portugal, as regras europeias exigem que os intermediários avaliem a adequação dos produtos ao perfil do cliente e ajam no seu melhor interesse, mas o alcance desses deveres depende do serviço prestado, por isso pergunte diretamente que registo na CMVM e que deveres se aplicam ao profissional'),
('no Brasil, muitas famílias formalizam','em Portugal, muitas famílias formalizam esse tipo de regra numa sociedade familiar, com acordo parassocial ou protocolo familiar, por isso vale procurar aconselhamento jurídico'),
('no Brasil, por exemplo, essa escolha aparece','em Portugal, por exemplo, essa escolha aparece com frequência na decisão entre aplicações de taxa variável, de taxa fixa e indexadas à inflação'),
# b09
('e como a regra funciona de forma diferente no Brasil','e como a regra pode funcionar de forma diferente em Portugal'),
('no Brasil, a maioria dos fundos não distribui','em Portugal, a tributação dos fundos depende de serem de distribuição ou de acumulação, e a lógica de prestar atenção à data de distribuição vale sobretudo para fundos e ETFs de distribuição, por isso confirme as regras de cada produto'),
('no Brasil, a maioria dos fundos segue outra lógica','em Portugal, os fundos de acumulação seguem outra lógica'),
]
def end_of(t,i):
    m=re.compile(r'\.(?=\s|$)').search(t,i)
    return m.start()
for f in sorted(glob.glob('work/WHITE-L5-pt-PT/b*.txt')):
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
print(subprocess.run("grep -c 'Brasil\\|Selic\\|CDI\\|B3\\|FGC\\|CVM\\|PGBL\\|VGBL\\|ITCMD\\|LCI\\|Tesouro Direto\\|come-cotas\\|CPF' work/WHITE-L5-pt-PT/b*.txt",shell=True,capture_output=True,text=True).stdout)
