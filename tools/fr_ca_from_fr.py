import re,sys,glob
# WHITE fr-FR is neutral French already priced in $; produce fr-CA: locale + Quebec ETF term.
repo,level,track=sys.argv[1],sys.argv[2],sys.argv[3]
R=[(r"\bfonds indiciels cotés \(ETF\)","fonds négociés en Bourse (FNB)"),(r"\b([Dd])e l'ETF\b",r"\1u FNB"),(r"\b([Ll])'ETF\b",r"\1e FNB"),(r"\b([Dd])'ETF\b",r"\1e FNB"),(r"\b([Cc])et ETF\b",r"\1e FNB"),(r"\b([Qq])u'ETF\b",r"\1ue FNB"),(r"\bETF\b","FNB"),(r"\be-mails\b","courriels"),(r"\be-mail\b","courriel"),(r"\bweek-ends?\b","fin de semaine")]
n=0
for src in sorted(glob.glob(f'{repo}/content/curriculum/{track}/L{level}/*.fr-FR.md')):
    dst=src.replace('.fr-FR.md','.fr-CA.md')
    s=open(src,encoding='utf-8').read()
    s=re.sub(r'(?m)^locale:.*$','locale: fr-CA',s,count=1)
    for a,b in R: s=re.sub(a,b,s)
    open(dst,'w',encoding='utf-8').write(s); n+=1
print('wrote',n)
