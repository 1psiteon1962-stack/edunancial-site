# pt_voce.py COLOR LEVEL : drop/replace 'você' in pt-PT copy (European register)
import sys,re,glob
C,L=sys.argv[1:3]
SP=[('protege você','protege-o'),('treina você','treina-o'),('preparam você','preparam-no'),('permite que você','permite que'),('pede que você','pede que'),
('discordar de você','discordar de si'),('transferem para você','transferem para si'),('andar rápido com você','andar rápido consigo'),
('sabe mais do que você','sabe mais do que o comprador'),('e não você pessoalmente','e não o próprio fundador pessoalmente'),('foi você quem deu','foi o próprio quem deu'),
('("você cobrirá','("cobrirá'),('credor com quem você já','credor com quem já'),('antes de você precisar','antes de precisar'),('o que você','o que'),('O que você','O que')]
for f in sorted(glob.glob(f'work/{C}-{L}-pt-PT/*.txt')):
    t=open(f,encoding='utf-8').read()
    for a,b in SP: t=t.replace(a,b)
    t=re.sub(r'\bVocê (\w)',lambda m:m.group(1).upper(),t)
    t=re.sub(r'\bvocê ','',t)
    t=re.sub(r'\bvocê\b','si',t)
    open(f,'w',encoding='utf-8').write(t)
print('ok')
