# usage: mk3.py <repo> <draftfile...>
# draft: blocks separated by lines "@@@ <locale>"; each block: line1 TITLE, line2 SUMMARY, rest body (## sections)
# file name: <ID>.txt  (e.g. BLUE-L3-001.txt)
import sys, re, json, os
repo = sys.argv[1]
q = lambda s: json.dumps(s, ensure_ascii=False)
for d in sys.argv[2:]:
    lid = os.path.basename(d).split('.')[0]
    tr, lv, num = re.match(r'(\w+)-L(\d)-(\d+)', lid).groups()
    en = open(f'{repo}/content/curriculum/{tr}/L{lv}/{lid}.md', encoding='utf-8').read()
    g = lambda k: re.search(rf'(?m)^{k}:\s*(.*)$', en).group(1).strip().strip('"')
    raw = open(d, encoding='utf-8').read()
    for blk in re.split(r'(?m)^@@@ ', raw)[1:]:
        loc, rest = blk.split('\n', 1)
        loc = loc.strip()
        lines = rest.strip('\n').split('\n')
        title, summ = lines[0].strip(), lines[1].strip()
        body = '\n'.join(lines[2:]).strip('\n')
        assert body.startswith('## '), (lid, loc, 'body must start with ## section')
        fm = f"""---
id: {lid}
track: {tr}
officialTrackName: {q(g('officialTrackName'))}
level: {int(lv)}
lessonNumber: {int(num)}
title: {q(title)}
summary: {q(summ)}
version: {q(g('version'))}
author: {q(g('author'))}
date: {q(g('date'))}
locale: {q(loc)}
source_locale: "en-US"
---
# {lid}: {title}

"""
        open(f'{repo}/content/curriculum/{tr}/L{lv}/{lid}.{loc}.md', 'w', encoding='utf-8').write(fm + body + '\n')
        print('ok', lid, loc)
