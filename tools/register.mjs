import { readdirSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const repo = process.argv[2];
const { checksumFile } = await import(repo + '/scripts/curriculum/lib/checksum.mjs');
const { readRegistry, writeRegistry } = await import(repo + '/scripts/curriculum/lib/registry.mjs');
const { appendLedgerEntry } = await import(repo + '/scripts/curriculum/lib/ledger.mjs');
process.chdir(repo);
const reg = readRegistry();
const now = new Date().toISOString();
const names = { RED: 'Real Estate', WHITE: 'Paper Assets', PURPLE: 'Law' };
let added = 0;
for (const c of Object.keys(names)) {
  const dir = `content/curriculum/${c}/L2`;
  reg.tracks[c] ??= { code: c, name: names[c], levels: {} };
  reg.tracks[c].levels['2'] ??= { assets: {} };
  const assets = reg.tracks[c].levels['2'].assets;
  for (const f of readdirSync(dir).filter(f => /^[A-Z]+-L2-\d{3}\.md$/.test(f)).sort()) {
    const id = f.slice(0, -3);
    if (assets[id]) continue;
    const path = `${dir}/${f}`;
    const t = readFileSync(path, 'utf8');
    const title = JSON.parse(t.match(/^title: (.+)$/m)[1]);
    const ingestionId = randomUUID();
    assets[id] = { id, type: 'lesson', track: c, trackName: names[c], level: 2, lessonNumber: Number(id.slice(-3)), title, version: '1.0', author: 'Waldemar M. Caban, JD MA', date: '2026-11-13', path, checksum: checksumFile(path), status: 'active', ingestionId, importedAt: now, validationPassed: true, warnings: [], metadata: { officialTrackName: names[c], migratedFrom: `content/courses/${c.toLowerCase()}/level-2/en_us/full-50-lessons-${c.toLowerCase()}-l2-full-50-lessons.md` } };
    appendLedgerEntry({ ingestionId, assetId: id, action: 'migrate-legacy-l2-master', path, checksum: assets[id].checksum, timestamp: now });
    added++;
  }
}
writeRegistry(reg);
console.log('registered', added);
