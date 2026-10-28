import { strict as assert } from 'node:assert';
import { APP_KEY, emptyState, mergeRun, normalizeRun, XP_POLICY } from './adapter.js';
assert.equal(APP_KEY, 'addition-ecrite-multiple');
assert.equal(XP_POLICY, 'server-only');
const first = mergeRun(emptyState(), {mode:'classic',level:1,total:10,score:8});
assert.equal(first.classic[0][10], 8);
const lower = mergeRun(first, {mode:'classic',level:1,total:10,score:4});
assert.equal(lower.classic[0][10], 8);
const sudden = mergeRun(lower, {mode:'sudden',level:2,score:7});
assert.equal(sudden.sudden[1], 7);
assert.equal(first.sudden[1], 0);
for (const input of [{mode:'classic',level:1,total:10,score:11},{mode:'classic',level:0,total:4,score:4},{mode:'hard',level:1,score:3},{mode:'sudden',level:1,total:10,score:3}]) {
 assert.throws(() => normalizeRun(input));
}
assert.deepEqual(mergeRun(emptyState(),{mode:'classic',level:3,total:4,score:4}).classic[2],{'4':4});
console.log('8 contrôles de contrat Connect : OK');
