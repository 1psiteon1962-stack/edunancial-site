import re,glob,os,sys,importlib.util
S='/home/claude/l5work/work'
spec=importlib.util.spec_from_file_location('b','/home/claude/l5work/tools/br2pt.py')
src=open('/home/claude/l5work/tools/br2pt.py').read()
ns={}
exec(src.split('for b in sorted')[0],ns)   # load money, W, X without running RED loop
money,W,X=ns['money'],ns['W'],ns['X']
W=[w for w in W if w[0] not in ('cotas','cota ','cotistas')]
NOTE_BR='(No Brasil, por exemplo, o ganho na venda de bens pode estar sujeito ao imposto sobre ganho de capital, com regras e isenções específicas, inclusive para vendas de pequeno valor, e o ouro negociado como ativo financeiro tem tratamento próprio; as regras mudam, então confirme a situação atual com a Receita Federal ou com um contador.)'
NOTE_PT='(Em Portugal, por exemplo, a venda ocasional de ouro físico por particulares pode não estar abrangida pelas mais-valias tributadas em IRS, ao contrário de outros ativos, mas o enquadramento depende das circunstâncias, por exemplo se houver uma atividade habitual de compra e venda; as regras mudam, por isso confirme junto da Autoridade Tributária ou de um contabilista certificado.)'
os.makedirs(f'{S}/GOLD-L1-pt-PT',exist_ok=True)
for b in sorted(glob.glob(f'{S}/GOLD-L1-pt-BR/*.txt')):
    s=open(b,encoding='utf-8').read()
    s=s.replace(NOTE_BR,NOTE_PT)
    s=money(s)
    for a,c in W: s=re.sub(r'(?<![A-Za-zÀ-ÿ])'+re.escape(a),lambda m,c=c:c,s)
    for a,c in X: s=s.replace(a,c)
    s=re.sub(r'\b(est(?:á|ão|ar|ava|eja|ejam)) ([a-zç]+?)(a|e|i)ndo\b', lambda m: f"{m.group(1)} a {m.group(2)}{m.group(3)}r", s)
    for a,c in [('cotas de um fundo','unidades de participação de um fundo'),('comprar e vender cotas','comprar e vender unidades de participação'),('cotas numa corretora','unidades de participação numa corretora'),
                ('conta-corrente','conta à ordem'),('corretora','correttora'),('correttora','corretora'),('mesada','semanada'),('reais','euros'),('real destinado','euro destinado'),('Cada real','Cada euro'),('cada real','cada euro'),('um real que','um euro que'),('por real gasto','por euro gasto'),
                ('Receita Federal','Autoridade Tributária'),('a sua posição','a sua posição'),('ETF','ETF')]:
        s=s.replace(a,c)
    open(f'{S}/GOLD-L1-pt-PT/'+os.path.basename(b),'w',encoding='utf-8').write(s)
print('ok')
