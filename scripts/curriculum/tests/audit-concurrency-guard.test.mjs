import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const script = resolve('scripts/curriculum/production-audit.mjs');
for (const value of ['0','4','999','NaN','1.5','-1']) {
  test('rejects unsafe audit concurrency '+value,()=>{
    const result=spawnSync(process.execPath,[script,'--concurrency',value,'--levels','1','--tracks','RED','--locales','en-US'],{encoding:'utf8',timeout:3000});
    assert.equal(result.status,2);
    assert.match(result.stderr,/Invalid --concurrency/);
  });
}
