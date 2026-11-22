# pt_notes_GOLD.py : Brazil->Portugal note swaps on GOLD-L5 pt-PT copy (run BEFORE pt_pt.py)
import glob,re
C="por isso confirme com um contabilista certificado"
S=[
"em Portugal, por exemplo, segundo a informação disponível, o seguro multirriscos habitação costuma excluir ou limitar bastante a cobertura de dinheiro, joias e metais preciosos, salvo se forem declarados e seguros à parte, e o conteúdo de um cofre alugado num banco não fica automaticamente seguro pelo banco, por isso confirme com a sua seguradora ou mediador de seguros",
"em Portugal, por exemplo, segundo a informação disponível, os certificados de aforro e do Tesouro não são indexados diretamente à inflação, mas é possível investir, através de um intermediário financeiro, em obrigações da área do euro indexadas à inflação, e os juros e as mais-valias são em regra tributados a uma taxa liberatória ou especial, "+C,
"em Portugal, por exemplo, segundo a informação disponível, as regras distinguem investidores profissionais e não profissionais, e certos fundos e organismos de investimento alternativo só podem ser comercializados junto de investidores profissionais ou com montantes mínimos de subscrição elevados, sob supervisão da CMVM, por isso confirme com o seu intermediário financeiro e no sítio da CMVM",
"em Portugal, por exemplo, segundo a informação disponível, quem entra ou sai da União Europeia com dez mil euros ou mais em dinheiro líquido, conceito que pode abranger certas formas de ouro, deve declará-lo à Autoridade Tributária e Aduaneira, e o ouro para investimento beneficia em regra de isenção de IVA, por isso confirme com a Autoridade Tributária e Aduaneira e com um despachante oficial",
"em Portugal, por exemplo, segundo a informação disponível, os planos poupança-reforma não permitem deter ouro físico diretamente em nome do participante, embora alguns fundos possam ter exposição a ouro através de instrumentos financeiros, e a ideia de uma conta de reforma autogerida ao estilo americano não existe da mesma forma, "+C,
"em Portugal, por exemplo, segundo a informação disponível, não existe uma taxa especial mais elevada para colecionáveis, e a venda ocasional por particulares de bens móveis como ouro físico ou objetos de coleção pode, em regra, não ficar sujeita a IRS como mais-valia, ao contrário das ações, salvo se houver habitualidade, "+C,
"em Portugal, por exemplo, segundo a informação disponível, a compra e venda habitual de bens com intenção de lucro pode levar a Autoridade Tributária a tratar esses ganhos como rendimentos empresariais e profissionais da categoria B do IRS, com regras e obrigações diferentes das de um investidor ocasional, "+C,
"em Portugal, por exemplo, segundo a informação disponível, quem transfere a residência para o país pode trazer bens pessoais com isenção de direitos ao abrigo do regime de transferência de residência, sob certas condições, mas o dinheiro líquido de dez mil euros ou mais, que pode abranger certas formas de ouro, deve ser declarado à Autoridade Tributária e Aduaneira, por isso confirme com um despachante oficial e com um contabilista certificado",
"em Portugal, por exemplo, segundo a informação disponível, não existe uma taxa especial mais elevada para colecionáveis, e a venda ocasional por particulares de bens móveis como ouro físico ou objetos de coleção pode, em regra, não ficar sujeita a IRS como mais-valia, ao contrário das ações, salvo se houver habitualidade, "+C,
]
P=re.compile(r"no Brasil, por exemplo,.*?por isso confirme com [^;]*")
k=0
for f in sorted(glob.glob('work/GOLD-L5-pt-PT/b*.txt')):
    t=open(f,encoding='utf-8').read()
    def rep(m):
        global k; r=S[k]; k+=1; return r
    t=P.sub(rep,t)
    open(f,'w',encoding='utf-8').write(t)
print('replaced',k,'of',len(S))
