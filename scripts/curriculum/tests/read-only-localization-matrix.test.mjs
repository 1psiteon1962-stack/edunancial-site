import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const revised = new URL('../read-only-localization-matrix.mjs',import.meta.url).pathname;
function fixture() {
  const root=mkdtempSync(join(tmpdir(),'edunancial-q2-fixture-'));
  const put=(path,content='---\ntitle: Testing\n---\nBody')=>{
    const target=join(root,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,content);
  };
  put('content/curriculum/RED/L1/RED-L1-001.md','---\nlocale: en-US\n---\nBody');
  put('content/curriculum/RED/L1/es_Caribbean/RED-L1-002.md');
  put('content/curriculum/RED/L1/fr-CA/RED-L1-003.md');
  put('content/curriculum/RED/L1/RED-L1-004.es_Caribbean.md');
  put('content/curriculum/RED/L1/RED-L1-005.fr-CA.md');
  put('content/curriculum/RED/L1/es-Caribbean/RED-L1-006.en-US.md');
  put('content/curriculum/RED/L1/RED-L1-007.md','---\nlocale: fr-CA\n---\nLocalized text');
  put('content/curriculum/RED/L1/RED-L1-008.md');
  put('content/courses/RED/L1/lesson-records.json',JSON.stringify({
    id:'RED-L1-009',translations:{ es_Caribbean:{title:'Spanish',body:'Texto'}, fr_ca:{title:'French',content:'Texte'}, de:{title:'Missing body'} }
  }));
  put('content/courses/RED/L1/RED-L1-010.json',JSON.stringify({id:'RED-L1-010',locale:'es-Caribbean',title:'Título',content:'Texto'}));
  put('content/courses/RED/L1/RED-L1-010.es-Caribbean.md');
  put('content/curriculum/RED/L1/RED-L1-051.md');
  put('content/courses/RED/L1/bad.json','{bad json');
  return root;
}
const run=(root,script)=>JSON.parse(execFileSync(process.execPath,[script],{cwd:root,encoding:'utf8'}));
function row(data,track='RED',level=1){return data.rows.find(x=>x.track===track&&x.level===level)}
function snapshot(root){
  const h=createHash('sha256');
  function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const path=join(dir,entry.name);if(entry.isDirectory())walk(path);else {h.update(path.slice(root.length));h.update(readFileSync(path));}}}
  walk(root);return h.digest('hex');
}
let root;test.before(()=>{root=fixture()});test.after(()=>{rmSync(root,{recursive:true,force:true})});

test('revised scanner preserves 40 track-level rows and scans the same files',()=>{
  const result=run(root,revised);
  assert.equal(result.rows.length,40);
  assert.equal(result.scannedFiles,13);
});
test('revised scanner handles locale directories, suffixes and Markdown front matter',()=>{
  const newRow=row(run(root,revised));
  assert.equal(newRow.englishFoundInGit,2);
  assert.equal(newRow.translations['es-Caribbean'].found,4);
  assert.equal(newRow.translations['fr-CA'].found,4);
});
test('localized directory + conflicting suffix is flagged and omitted conservatively',()=>{
  const data=run(root,revised);
  assert.ok(data.diagnostics.ambiguous.some(x=>x.path.includes('RED-L1-006')));
  assert.ok(row(data).englishMissingFromGit.includes('RED-L1-006'));
});
test('legacy locale spellings converge to the same translation bucket',()=>{
  const data=run(root,revised);
  assert.deepEqual(Object.keys(row(data).translations).sort(),['es-Caribbean','fr-CA']);
});
test('JSON title plus content is treated as a translation, never as English',()=>{
  const data=run(root,revised);
  assert.ok(!row(data).englishMissingFromGit.includes('RED-L1-008'));
  assert.ok(row(data).englishMissingFromGit.includes('RED-L1-009'));
  assert.ok(row(data).englishMissingFromGit.includes('RED-L1-010'));
});
test('incomplete translations, invalid JSON and out-of-range IDs are not silent',()=>{
  const data=run(root,revised);
  assert.ok(data.diagnostics.incompleteTranslations.some(x=>x.locale==='de'));
  assert.ok(data.diagnostics.invalidJson.some(x=>x.path.endsWith('/bad.json')));
  assert.ok(data.diagnostics.outOfRange.some(x=>x.id==='RED-L1-051'));
});
test('duplicate locale-path pair is reported rather than double-counted',()=>{
  const data=run(root,revised);
  assert.equal(row(data).translations['es-Caribbean'].found,4);
  assert.ok(data.diagnostics.duplicates.some(x=>x.id==='RED-L1-010'));
});
test('script is read-only, never changes fixture files',()=>{
  const before=snapshot(root);
  run(root,revised);
  assert.equal(snapshot(root),before);
});
test('missing Git IDs are explicitly not described as absent from production',()=>{
  const data=run(root,revised);
  assert.match(data.purpose,/NOT FOUND IN GIT/i);
  assert.match(data.purpose,/not missing in Netlify Blob or production/i);
});

test('committed array-based locale seeds are included in the Git-only inventory',()=>{
  const seedRoot=mkdtempSync(join(tmpdir(),'edunancial-q2-seeds-'));
  try {
    const path=join(seedRoot,'curriculum/seeds/translations/RED-L1-es-Caribbean.json');
    mkdirSync(dirname(path),{recursive:true});
    writeFileSync(path,JSON.stringify([
      {lessonId:'RED-L1-011',locale:'es_Caribbean',title:'Titulo',summary:'Resumen',body:'Texto'},
      {lesson_id:'RED-L1-012',locale:'fr-ca',title:'Titre',body:'Texte'}
    ]));
    const before=snapshot(seedRoot);
    const data=run(seedRoot,revised);
    assert.equal(row(data).translations['es-Caribbean'].found,1);
    assert.equal(row(data).translations['fr-CA'].found,1);
    assert.equal(data.scannedFiles,1);
    assert.equal(snapshot(seedRoot),before);
    assert.ok(data.purpose.includes('Git'));
  }finally{rmSync(seedRoot,{recursive:true,force:true});}
});

test('partial seed translations are reported, not silently counted',()=>{
  const seedRoot=mkdtempSync(join(tmpdir(),'edunancial-q2-partials-'));
  try {
    const path=join(seedRoot,'curriculum/seeds/translations/partials.json');
    mkdirSync(dirname(path),{recursive:true});
    writeFileSync(path,JSON.stringify([
      {lessonId:'RED-L1-017',locale:'es-Caribbean',title:'Solo titulo'},
      {lessonId:'RED-L1-018',locale:'fr-CA',title:'Titre',body:'Texte'},
      {lessonId:'RED-L1-019',locale:'es-Caribbean',title:'Titulo',body:'Texto'}
    ]));
    const data=run(seedRoot,revised);
    assert.equal(row(data).translations['es-Caribbean'].found,1);
    assert.equal(row(data).translations['fr-CA'].found,1);
    assert.ok(data.diagnostics.incompleteTranslations.some(x=>x.id==='RED-L1-017'));
  }finally{rmSync(seedRoot,{recursive:true,force:true});}
});

test('duplicate seed records are deduplicated with an explicit diagnostic',()=>{
  const seedRoot=mkdtempSync(join(tmpdir(),'edunancial-q2-seed-duplicates-'));
  try {
    const path=join(seedRoot,'curriculum/seeds/translations/dupes.json');
    mkdirSync(dirname(path),{recursive:true});
    writeFileSync(path,JSON.stringify([
      {lessonId:'RED-L1-019',locale:'es-Caribbean',title:'Uno',body:'Texto'},
      {lessonId:'RED-L1-019',locale:'es-Caribbean',title:'Dos',body:'Texto'}
    ]));
    const data=run(seedRoot,revised);
    assert.equal(row(data).translations['es-Caribbean'].found,1);
    assert.ok(data.diagnostics.duplicates.some(x=>x.id==='RED-L1-019'));
  }finally{rmSync(seedRoot,{recursive:true,force:true});}
});
