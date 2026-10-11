import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const branches = process.argv.slice(2);
if (!branches.length) throw Error('Supply source branch names');
const path = 'curriculum/registry.json';
const registry = JSON.parse(readFileSync(path, 'utf8'));
let added = 0;
const black = registry.tracks.BLACK.levels['4'].assets;
for (const filename of readdirSync('content/curriculum/BLACK/L4').filter(x => /^BLACK-L4-[0-9]{3}\.md$/.test(x))) {
  const id = filename.slice(0, -3);
  if (black[id]) continue;
  const filePath = 'content/curriculum/BLACK/L4/' + filename;
  const bytes = readFileSync(filePath);
  const source = bytes.toString('utf8');
  const field = key => source.match(new RegExp('^' + key + ': (.+)
for (const branch of branches) {
  const raw = execFileSync('git', ['show', 'origin/' + branch + ':' + path], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const incoming = JSON.parse(raw);
  for (const [track, data] of Object.entries(incoming.tracks)) {
    for (const [level, section] of Object.entries(data.levels ?? {})) {
      const dest = registry.tracks?.[track]?.levels?.[level];
      if (!dest) throw Error('Unknown track/level ' + track + '/' + level);
      for (const [id, asset] of Object.entries(section.assets ?? {})) {
        const old = dest.assets[id];
        if (old) {
          if (old.path !== asset.path || old.checksum !== asset.checksum) throw Error('Registry conflict: ' + id);
          continue;
        }
        const bytes = readFileSync(asset.path);
        const checksum = 'sha256:' + createHash('sha256').update(bytes).digest('hex');
        if (asset.checksum !== checksum) throw Error('Uploaded checksum mismatch: ' + id + ' ' + asset.checksum + ' != ' + checksum);
        dest.assets[id] = asset;
        added++;
      }
    }
  }
}
writeFileSync(path, JSON.stringify(registry, null, 2) + '\n');
console.log('New registered lessons:', added);
, 'm'))?.[1]?.replace(/^"|"$/g, '') || '';
  black[id] = {
    id, type: 'lesson', track: 'BLACK', trackName: 'Leadership & Executive Management',
    level: 4, lessonNumber: Number(id.slice(-3)), title: field('title'),
    version: field('version') || '1.0', author: field('author') || 'Edunancial Faculty',
    date: field('date'), path: filePath,
    checksum: 'sha256:' + createHash('sha256').update(bytes).digest('hex'),
    status: 'active', ingestionId: 'black-l4-registry-recovery',
    importedAt: new Date().toISOString(), validationPassed: true, warnings: [],
    metadata: { officialTrackName: field('officialTrackName'), summary: field('summary') }
  };
  added++;
}

for (const branch of branches) {
  const raw = execFileSync('git', ['show', 'origin/' + branch + ':' + path], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  const incoming = JSON.parse(raw);
  for (const [track, data] of Object.entries(incoming.tracks)) {
    for (const [level, section] of Object.entries(data.levels ?? {})) {
      const dest = registry.tracks?.[track]?.levels?.[level];
      if (!dest) throw Error('Unknown track/level ' + track + '/' + level);
      for (const [id, asset] of Object.entries(section.assets ?? {})) {
        const old = dest.assets[id];
        if (old) {
          if (old.path !== asset.path || old.checksum !== asset.checksum) throw Error('Registry conflict: ' + id);
          continue;
        }
        const bytes = readFileSync(asset.path);
        const checksum = 'sha256:' + createHash('sha256').update(bytes).digest('hex');
        if (asset.checksum !== checksum) throw Error('Uploaded checksum mismatch: ' + id + ' ' + asset.checksum + ' != ' + checksum);
        dest.assets[id] = asset;
        added++;
      }
    }
  }
}
writeFileSync(path, JSON.stringify(registry, null, 2) + '\n');
console.log('New registered lessons:', added);
