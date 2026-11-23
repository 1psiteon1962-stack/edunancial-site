# pt_extra.py COLOR LEVEL : extra pt-BR -> pt-PT lexical fixes (run after pt_pt.py)
import sys,re,glob
C,L=sys.argv[1:3]
W=[(r'\bplanos de previdência\b','planos de pensões'),(r'\bplano de previdência\b','plano de pensões'),(r'\bconta de previdência\b','conta de reforma'),
(r'\baposentadoria\b','reforma'),(r'\bAposentadoria\b','Reforma'),
(r'\ba inadimplência\b','o incumprimento'),(r'\buma inadimplência\b','um incumprimento'),(r'\bda inadimplência\b','do incumprimento'),(r'\bde inadimplência\b','de incumprimento'),(r'\bem caso de inadimplência\b','em caso de incumprimento'),(r'\be inadimplência\b','e incumprimento'),(r'\binadimplência\b','incumprimento'),
(r'\bficar inadimplente\b','entrar em incumprimento'),(r'\binadimplente\b','em incumprimento'),
(r'Uma hipoteca ou alienação fiduciária é','Uma hipoteca é'),(r'\bA Receita Federal\b','A Autoridade Tributária'),
(r'"extinção do condomínio"','"divisão de coisa comum"'),(r'\ba extinção do condomínio\b','a divisão de coisa comum'),(r'\bextinção do condomínio\b','divisão de coisa comum'),(r'\bcondomínio por frações\b','compropriedade por quotas'),
(r'\bregistra\b','regista'),(r'\bregistram\b','registam'),(r'\bregistrou\b','registou'),(r'\bregistre\b','registe'),(r'\bregistrem\b','registem'),(r'\bregistrá-l','registá-l'),(r'\bregistrando\b','registando'),
(r'\bcontadores\b','contabilistas'),(r'\bcontador\b','contabilista'),(r'\bContador\b','Contabilista'),
(r'\besportes\b','desportos'),(r'\besporte\b','desporto'),(r'\bótimo\b','excelente'),(r'\bcadastrem\b','registem'),(r'\bcadastro\b','registo'),(r'\btreinamento\b','formação'),
]
for f in sorted(glob.glob(f'work/{C}-{L}-pt-PT/*.txt')):
    t=open(f,encoding='utf-8').read()
    for a,b in W: t=re.sub(a,b,t)
    open(f,'w',encoding='utf-8').write(t)
print('ok')
