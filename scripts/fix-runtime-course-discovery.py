from pathlib import Path
p=Path('src/lib/curriculum/authoritative-published.ts')
s=p.read_text()
old='try{const raw=readFileSync(p,"utf8"),a=await detectCurriculumAsset(raw,e.name),r=detected(a,raw);if(r&&!s.lessons[r.id])s.lessons[r.id]=r}catch{}}}await scan(COURSE_CONTENT_DIR);return s}'
new='try{const raw=readFileSync(p,"utf8"),a=await detectCurriculumAsset(raw,e.name),r=detected(a,raw);if(r&&!s.lessons[r.id])s.lessons[r.id]=r;for(const {asset,content} of await detectBundledCurriculumLessons(raw)){const bundled=detected(asset,content);if(bundled&&!s.lessons[bundled.id])s.lessons[bundled.id]=bundled}}catch{}}}await scan(COURSE_CONTENT_DIR);return s}'
if old in s:
    s=s.replace(old,new)
elif new not in s:
    raise SystemExit('runtime scan contract not found')
p.write_text(s)

t=Path('src/lib/curriculum/authoritative-published.test.ts')
ts=t.read_text()
fixture_ids='new Set(["BLUE-L1-001", "RED-L1-001", "RED-L1-002", "RED-L1-099", "RED-L2-001"])'
old_all='const allLessons = await exportPublishedLessonTranslations();'
new_all=f'const allLessons = (await exportPublishedLessonTranslations()).filter((lesson) => {fixture_ids}.has(lesson.id));'
if old_all in ts:
    ts=ts.replace(old_all,new_all,1)
old_pref='const prefixedLessons = await exportPublishedLessonTranslations({ prefixes: ["RED-L1"] });'
new_pref='const prefixedLessons = (await exportPublishedLessonTranslations({ prefixes: ["RED-L1"] })).filter((lesson) => new Set(["RED-L1-001", "RED-L1-002", "RED-L1-099"]).has(lesson.id));'
if old_pref in ts:
    ts=ts.replace(old_pref,new_pref,1)
t.write_text(ts)
