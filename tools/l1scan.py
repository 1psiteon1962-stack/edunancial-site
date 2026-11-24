# l1scan.py -> per (color,locale) count of L1 lessons whose structure/answer key differ from English
import glob,re,collections
R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
mp={'Vrai':'T','Faux':'F','True':'T','False':'F','Verdadero':'T','Falso':'F','Wahr':'T','Richtig':'T','Juist':'T','Onjuist':'F','Falsch':'F','Vero':'T','Waar':'T','Onwaar':'F','Verdadeiro':'T','Vrè':'T','Fo':'F'}
def body(t): return t.split('---',2)[2] if t.startswith('---') else t
def sec(b,i):
    s=re.split(r'^## ',b,flags=re.M); return s[i] if i<len(s) else ''
def keys(x): return [mp.get(k,k) for k in re.findall(r'\b([A-D](?! [a-z])|True|False|Vrai|Faux|Verdadero|Falso|Wahr|Richtig|Juist|Onjuist|Falsch|Vero|Waar|Onwaar|Verdadeiro|Vrè|Fo)\b',x)]
def sig(b):
    return (len(re.findall(r'^## ',b,re.M)),len(re.findall(r'^\s*([A-D][.)]) ',sec(b,4),re.M)),tuple(keys(sec(b,5))),len(re.findall(r'^- ',sec(b,7),re.M)))
out=collections.defaultdict(list)
for C in 'RED WHITE BLUE GREEN GOLD PURPLE ORANGE BLACK'.split():
    for i in range(1,51):
        en=f'{R}/{C}/L1/{C}-L1-{i:03d}.md'; se=sig(body(open(en).read()))
        for f in glob.glob(f'{R}/{C}/L1/{C}-L1-{i:03d}.*.md'):
            loc=f.split('.')[-2]
            if sig(body(open(f).read()))!=se: out[(C,loc)].append(i)
for k in sorted(out): print(k[0],k[1],len(out[k]),out[k])
