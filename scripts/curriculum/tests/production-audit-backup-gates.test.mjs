import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/production-curriculum-audit.yml','utf8');

test('Neon-only export fails closed on missing credential and export errors',()=>{
  assert.match(workflow,/if \[ -z "\$DATABASE_URL" \]; then/);
  assert.match(workflow,/FAILED: DATABASE_URL secret missing/);
  assert.match(workflow,/failed=1/);
  assert.match(workflow,/exit "\$failed"/);
});

test('learner-path audit runs independently of backup outcome',()=>{
  assert.match(workflow,/audit:\n    needs: backup\n    if: \$\{\{ !cancelled\(\) \}\}/);
  assert.match(workflow,/Upload Neon export evidence \(also on failure\)/);
  assert.match(workflow,/if: always\(\)/);
  assert.match(workflow,/NEON ONLY: Not a Blob backup/);
});
