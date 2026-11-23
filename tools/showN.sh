#!/bin/bash
# show1.sh COLOR FROM TO -> English L1 (title, summary, body; hard wraps joined)
R=/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum
for i in $(seq $2 $3); do f=$(printf "%s/%s/L${LV:-1}/%s-L${LV:-1}-%03d.md" $R $1 $1 $i)
python3 -I - "$f" <<'PY'
import sys,re
t=open(sys.argv[1]).read(); fm,b=t.split('---',2)[1:]
g=lambda k: re.search(r'^'+k+r':\s*(.*)$',fm,re.M).group(1).strip().strip('"')
print('@@',sys.argv[1].split('/')[-1][:-3],'|',g('title'),'| SUM:',g('summary'))
out=[];buf=[]
for line in b.strip().split('\n'):
    if line.strip()=='' : 
        if buf: out.append(' '.join(buf)); buf=[]
        continue
    if re.match(r'^(#|\s*[-*>]|\s*\d+\.|\s*[A-D][).]|\*\*|\|)',line) or not buf: 
        if buf: out.append(' '.join(buf))
        buf=[line.rstrip()]
    else: buf.append(line.strip())
if buf: out.append(' '.join(buf))
print('\n'.join(out))
PY
done
