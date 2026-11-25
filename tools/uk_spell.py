# uk_spell.py ROOT [--write] : spelling-only US->UK pass on *.en-GB.md (body + title/summary). No vocabulary swaps.
import sys,re,glob
root=sys.argv[1]; W='--write' in sys.argv
stems={'color':'colour','behavior':'behaviour','favorite':'favourite','favor':'favour','honor':'honour','labor':'labour',
'neighbor':'neighbour','jewelry':'jewellery','skeptic':'sceptic','catalog':'catalogue','gray':'grey'}
ize=['recogniz','organiz','personaliz','prioritiz','summariz','memoriz','emphasiz','realiz','maximiz','minimiz','finaliz',
'analyz','apologiz','categoriz','customiz','optimiz','specializ','utiliz','criticiz','authoriz','standardiz','capitaliz','monetiz','incentiviz','stabiliz','familiariz','visualiz','mobiliz','legitimiz','scrutiniz','jeopardiz','characteriz','prioritiz','itemiz','computeriz','digitiz','energiz','formaliz','generaliz','normaliz','penaliz','subsidiz','synchroniz','summariz']
fixed={'defense':'defence','Defense':'Defence','canceled':'cancelled','canceling':'cancelling','traveled':'travelled','traveling':'travelling',
'labeled':'labelled','labeling':'labelling','counseling':'counselling','counselor':'counsellor','counselors':'counsellors','fulfill':'fulfil','fulfills':'fulfils',
'fulfillment':'fulfilment','enrollment':'enrolment','installment':'instalment','installments':'instalments','mold':'mould','molds':'moulds','center':'centre','centers':'centres','Center':'Centre',
'offense':'offence','modeling':'modelling','modeled':'modelled','fueled':'fuelled','aluminum':'aluminium','license':'licence','licenses':'licences','License':'Licence','Licenses':'Licences',
'program':'programme','programs':'programmes','Program':'Programme','Programs':'Programmes','analog':'analogue'}
protect=re.compile(r'(\b(?:leases or|inventor|it|to|will|can|may|must|should) licenses?\b|[A-Za-z0-9]+(?:-[A-Za-z0-9]+){3,}|Department of (Labor|Defense)|Bureau of Labor|Labor Day|Labor Statistics|Small Business Development Center|Center for|Women\'s Business Center|computer program|software program|program code|driver\'s license|Labour Party|Pearl Harbor)',re.I)
def rep_word(m):
    w=m.group(0)
    if w.lower().startswith('cataloging'): return w[:7]+'uing'
    if w in fixed: return fixed[w]
    lw=w.lower()
    for s,t in stems.items():
        if lw.startswith(s):
            r=t+w[len(s):]
            return r[0].upper()+r[1:] if w[0].isupper() else r
    for s in ize:
        if lw.startswith(s):
            r=s[:-1]+'s'+w[len(s):]
            return r[0].upper()+r[1:] if w[0].isupper() else r
    return w
pat=re.compile(r'\b(?:'+'|'.join(sorted(fixed,key=len,reverse=True))+r'|(?:'+'|'.join(stems)+r')(?:s|ed|ing|able|ably|ite|ites|hood|hoods|ful|ly|y|ism|ical|ically|al|ation|ations|ing|ings)?|(?:'+'|'.join(set(ize))+r')(?:e|es|ed|ing|er|ers|ation|ations|ational)?)\b',re.I)
tot=0;files=0;hits={}
for f in glob.glob(f'{root}/**/*.en-GB.md',recursive=True):
    s=open(f,encoding='utf-8').read(); fm,body=s.split('---',2)[1],s.split('---',2)[2]
    def fixline(line):
        out=[];last=0
        for m in protect.finditer(line):
            out.append(pat.sub(rep_word,line[last:m.start()])); out.append(m.group(0)); last=m.end()
        out.append(pat.sub(rep_word,line[last:]))
        return ''.join(out)
    nfm='\n'.join(fixline(l) if l.startswith(('title:','summary:')) else l for l in fm.split('\n'))
    nb='\n'.join(l if l.lstrip().lower().startswith(('slug:','id:','url:')) else fixline(l) for l in body.split('\n'))
    # do not touch link targets / ids in parentheses or code
    ns='---'+nfm+'---'+nb
    if ns!=s:
        files+=1
        for a,b in zip(re.findall(r'\S+',s),re.findall(r'\S+',ns)):
            if a!=b: hits[(a,b)]=hits.get((a,b),0)+1; tot+=1
        if W: open(f,'w',encoding='utf-8').write(ns)
print('files',files,'changes',tot)
for (a,b),n in sorted(hits.items(),key=lambda x:-x[1])[:400]: print(n,a,'->',b)
