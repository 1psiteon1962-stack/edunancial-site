"""Post-pass for pt-PT files produced by pt_pt.py: removes Brazilian 'você',
fixes 'renda' (BR income) and article agreement left by aluguéis->rendas.
Usage: python3 pt_pt_post.py <dir>"""
import re, glob, sys

D = sys.argv[1]

FIXED = [
    # rendas (rents) agreement
    (r'\bOs rendas\b', 'As rendas'), (r'\bos rendas\b', 'as rendas'),
    (r'\bdos rendas\b', 'das rendas'), (r'\bnos rendas\b', 'nas rendas'),
    (r'\baos rendas\b', 'às rendas'), (r'\bpelos rendas\b', 'pelas rendas'),
    (r'rendas costumam ser limitados', 'rendas costumam ser limitadas'),
    (r'rendas normalmente ficam fixos', 'rendas normalmente ficam fixas'),
    # renda (BR income)
    (r'\brenda de arrendamento\b', 'receita de arrendamento'),
    (r'\buma boa renda como empregado\b', 'um bom rendimento como trabalhador por conta de outrem'),
    (r'\ba sua própria renda\b', 'o seu próprio rendimento'),
    (r'\bpela renda pessoal\b', 'pelo rendimento pessoal'),
    (r'\buma renda pessoal\b', 'um rendimento pessoal'),
    (r'\ba renda pessoal\b', 'o rendimento pessoal'),
    (r'\brenda pessoal\b', 'rendimento pessoal'),
    (r'\bda renda do tomador\b', 'do rendimento do mutuário'),
    (r'\bRenda\b', 'Receita'), (r'\brenda\b', 'receita'),
    # object você
    (r'esses juros por você', 'esses juros por si'),
    (r'obrigam você legalmente', 'obrigam-no legalmente'),
    (r'continua a pagar você, o mercado se mexendo ou não', 'continua a pagar-lhe, quer o mercado se mexa quer não'),
    (r'trabalha contra você', 'trabalha contra si'),
    (r'por que as reservas protegem você', 'por que as reservas o protegem'),
    (r'protegendo você de', 'protegendo-o de'),
    (r'não deixa você se beneficiar', 'não lhe permite beneficiar'),
    (r'dívida protege você antes', 'dívida o protege antes'),
    (r'você, com o seu próprio rendimento,', 'o próprio devedor, com o seu próprio rendimento,'),
    (r'\*você\* colocou', '*efetivamente* colocou'),
    (r'sem que você perceba', 'sem que se aperceba'),
    (r'você é dono\b', 'é proprietário'),
    (r'trabalhando para pagar', 'a trabalhar para pagar'),
    (r'\bpegou emprestado\b', 'pediu emprestado'),
    (r'\bpegue emprestado\b', 'peça emprestado'),
    (r'\bpegar emprestado\b', 'pedir emprestado'),
    (r'\bdo fechamento\b', 'do fecho do negócio'),
    (r'\btomadores\b', 'mutuários'), (r'\btomador\b', 'mutuário'),
    (r'\b([Pp]recisa[m]?) (ser|ter|conseguir|fazer|manter|saber|pagar|cobrir|decidir|entender)\b', r'\1 de \2'),
    (r'\bo arrendamento que um imóvel\b', 'a renda que um imóvel'),
    (r'\be o arrendamento que ele realmente recebe\b', 'e a renda que ele realmente recebe'),
]
GERUND_ADV = re.compile(r'\b(está|estão|estava|estavam|continua|continuam|fica|ficam) (realmente|sempre|ainda|já|mesmo|só|apenas) (\w+?)(ando|endo|indo)\b')
def ger_adv(m):
    return f"{m.group(1)} {m.group(2)} a {m.group(3)}{ {'ando':'ar','endo':'er','indo':'ir'}[m.group(4)] }"


def drop_subject(t):
    # sentence-initial "Você x" -> "X"
    t = re.sub(r'(^|[\n.!?]\s+|- |\[[A-Z ]+\] |"|\*\*)Você (\w)', lambda m: m.group(1) + m.group(2).upper(), t)
    # remaining subject "você " before a word
    t = re.sub(r'\bvocê (?=\w)', '', t)
    return t

n = 0
for p in sorted(glob.glob(f'{D}/*.pt-PT.md')):
    t0 = open(p, encoding='utf8').read()
    t = t0
    for a, b in FIXED:
        t = re.sub(a, b, t)
    t = drop_subject(t)
    t = GERUND_ADV.sub(ger_adv, t)
    if t != t0:
        open(p, 'w', encoding='utf8').write(t)
        n += 1
print('post-fixed', n)
