from pathlib import Path
p=Path('src/lib/curriculum/authoritative-published.ts')
s=p.read_text()
old='try{const raw=readFileSync(p,"utf8"),a=await detectCurriculumAsset(raw,e.name),r=detected(a,raw);if(r&&!s.lessons[r.id])s.lessons[r.id]=r}catch{}}}await scan(COURSE_CONTENT_DIR);return s}'
new='try{const raw=readFileSync(p,"utf8"),a=await detectCurriculumAsset(raw,e.name),r=detected(a,raw);if(r&&!s.lessons[r.id])s.lessons[r.id]=r;for(const {asset,content} of await detectBundledCurriculumLessons(raw)){const bundled=detected(asset,content);if(bundled&&!s.lessons[bundled.id])s.lessons[bundled.id]=bundled}}catch{}}}await scan(COURSE_CONTENT_DIR);return s}'
if old not in s: raise SystemExit('runtime scan contract not found')
s=s.replace(old,new)
p.write_text(s)
