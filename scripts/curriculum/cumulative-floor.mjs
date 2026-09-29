#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const ROOTS = ['content/curriculum/', 'content/courses/'];
const baseRef = process.env.CURRICULUM_BASE_REF || process.argv[2] || 'origin/main';

function filesAt(ref) {
  try {
    return new Set(execFileSync('git', ['ls-tree','-r','--name-only',ref], {encoding:'utf8'})
      .split(/\r?\n/u).filter(p => ROOTS.some(root => p.startsWith(root))));
  } catch { return new Set(); }
}
function filesHere() {
  return new Set(execFileSync('git',['ls-files',...ROOTS],{encoding:'utf8'})
    .split(/\r?\n/u).filter(Boolean));
}
const base=filesAt(baseRef), head=filesHere();
const missing=[...base].filter(p=>!head.has(p)).sort();
const report={baseRef,baseFiles:base.size,proposedFiles:head.size,missingCount:missing.length,missing};
console.log(JSON.stringify(report,null,2));
if(missing.length){
 console.error('\nCUMULATIVE CURRICULUM FLOOR FAILURE');
 console.error('Existing curriculum files may not disappear while adding or publishing other levels/locales.');
 process.exit(1);
}
console.log('\nCumulative curriculum floor passed.');
