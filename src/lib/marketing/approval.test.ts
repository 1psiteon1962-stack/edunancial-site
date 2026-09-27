import { assertApprovedBeforeScheduling, assertScheduledBeforePublishing, canApprove } from './approval';

function expectThrow(fn: () => void) {
  let threw = false;
  try { fn(); } catch { threw = true; }
  if (!threw) throw new Error('Expected operation to fail closed');
}

if (!canApprove('review')) throw new Error('Review state must be approvable');
expectThrow(() => assertApprovedBeforeScheduling('draft'));
assertApprovedBeforeScheduling('approved');
expectThrow(() => assertScheduledBeforePublishing('approved'));
assertScheduledBeforePublishing('scheduled');
