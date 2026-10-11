import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readRegistry, writeRegistry, listAllAssets } from './lib/registry.mjs';
import { checksumFile, normalizeChecksum } from './lib/checksum.mjs';
const SRC = '0b9844b2d';
const src = JSON.parse(execFileSync('git', ['show', `${SRC}:curriculum/registry.json`], { encoding: 'utf8', maxBuffer: 1e8 }));
const reg = readRegistry();
const before = listAllAssets(reg).length;
const srcAssets = src.tracks.BLACK.levels['4'].assets;
const dest = (reg.tracks.BLACK.levels['4'] ||= { assets: {} });
dest.assets ||= {};
let restored = 0; const problems = [];
for (const [id, e] of Object.entries(srcAssets)) {
  if (dest.assets[id]) { problems.push(`${id}: already present`); continue; }
  if (!existsSync(e.path)) { problems.push(`${id}: file missing ${e.path}`); continue; }
  const actual = checksumFile(e.path);
  if (normalizeChecksum(e.checksum) !== actual) {
    // Only accept the committed bytes as authoritative when the stored value is the
    // known pre-#1203 double-prefixed defect AND the file is byte-identical to the upload commit.
    const unchanged = execFileSync('git', ['diff', '--name-only', SRC, 'HEAD', '--', e.path], { encoding: 'utf8' }).trim() === '';
    if (!(e.checksum.startsWith('sha256:sha256:') && unchanged)) problems.push(`${id}: unexplained checksum mismatch`);
  }
  dest.assets[id] = { ...e, checksum: actual };
  restored++;
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
writeRegistry(reg);
console.log(`restored=${restored} before=${before} after=${listAllAssets(reg).length}`);
