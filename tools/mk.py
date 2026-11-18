# usage: mk.py <repo> <locale> <draftfile...>; draft: line1 ID, line2 TITLE, line3 SUMMARY, rest body
import sys,re,json
repo,loc=sys.argv[1],sys.argv[2]
TN={'pt-BR':'Imobiliário','pt-PT':'Imobiliário','de':'Immobilien','it':'Immobiliare','nl':'Vastgoed','fr-CA':'Immobilier','fr-FR':'Immobilier'}
for d in sys.argv[3:]:
    lines=open(d,encoding='utf-8').read().split('\n')
    lid,title,summ=lines[0].strip(),lines[1].strip(),lines[2].strip()
    body='\n'.join(lines[3:]).strip('\n')
    tr,lv,num=re.match(r'(\w+)-L(\d)-(\d+)',lid).groups()
    en=open(f'{repo}/content/curriculum/{tr}/L{lv}/{lid}.md',encoding='utf-8').read()
    g=lambda k:re.search(rf'(?m)^{k}:\s*(.*)$',en).group(1)
    q=lambda s:json.dumps(s,ensure_ascii=False)
    fm=f"""---
id: {lid}
track: {tr}
officialTrackName: {q(TN.get(loc,'Real Estate')) if tr=='RED' else g('officialTrackName')}
level: {int(lv)}
lessonNumber: {int(num)}
title: {q(title)}
summary: {q(summ)}
version: {g('version')}
author: {g('author')}
date: {g('date')}
locale: {loc}
source_locale: en-US
translationStatus: owner-accepted
---

## {lid}
"""
    open(f'{repo}/content/curriculum/{tr}/L{lv}/{lid}.{loc}.md','w',encoding='utf-8').write(fm+body+'\n')
    print('ok',lid,loc)
