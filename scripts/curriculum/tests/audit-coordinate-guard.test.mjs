import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const script=resolve('scripts/curriculum/production-audit.mjs');
for(const args of [['--tracks','UNKNOWN'],['--levels','0'],['--levels','6'],['--levels','NaN'],['--levels','1.5'],['--locales','not a locale']]){
 test('rejects invalid coordinates: '+args.join(' '),()=>{
  const result=spawnSync(process.execPath,[script,...args],{encoding:'utf8',timeout:3000});
  assert.equal(result.status,2);
  assert.match(result.stderr,/Invalid audit selection/);
 });
}
