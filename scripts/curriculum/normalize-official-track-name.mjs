// Canonicalizes known legacy/short officialTrackName values before curriculum validation.
// This is deliberately narrow: only recognized aliases are changed; unknown values remain
// untouched so the locked taxonomy validator can reject them.

const CANONICAL_TRACK_NAMES = Object.freeze({
  BLACK: 'Leadership & Executive Management',
});

const TRACK_ALIASES = Object.freeze({
  BLACK: new Set(['Leadership', 'Leadership & Executive Management']),
});

export function normalizeOfficialTrackName(content) {
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fmMatch) return { status: 'missing-front-matter', content };

  const [, openDelim, fmBody, closeDelim] = fmMatch;
  const afterFm = content.slice(fmMatch[0].length);
  const trackMatch = fmBody.match(/^track:\s*["']?([^"'\r\n]+)["']?\s*$/m);
  if (!trackMatch) return { status: 'missing-track', content };

  const track = trackMatch[1].trim().toUpperCase();
  const canonical = CANONICAL_TRACK_NAMES[track];
  const aliases = TRACK_ALIASES[track];
  if (!canonical || !aliases) return { status: 'skipped', content };

  const fieldMatch = fmBody.match(/^(officialTrackName:\s*)(.+)$/m);
  if (!fieldMatch) return { status: 'missing-official-track-name', content };

  const rawValue = fieldMatch[2].trim();
  const unquoted = rawValue.replace(/^["'](.*)["']$/, '$1').trim();
  if (unquoted === canonical) return { status: 'already-correct', content };
  if (!aliases.has(unquoted)) return { status: 'unexpected', value: rawValue, content };

  const newFmBody = fmBody.replace(
    /^(officialTrackName:\s*)(.+)$/m,
    `$1"${canonical}"`,
  );
  return {
    status: 'changed',
    track,
    canonical,
    content: `${openDelim}${newFmBody}${closeDelim}${afterFm}`,
  };
}
