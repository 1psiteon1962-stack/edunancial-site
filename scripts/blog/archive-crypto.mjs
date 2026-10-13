// Encryption for the blog archive. The repository is PUBLIC, so the archive
// branch must never contain readable blog data: drafts, unpublished revisions,
// approver and actor identities, and audit details are all confidential.
//
// The whole archive (every file buildArchiveFiles produces) is serialized,
// gzipped and sealed with AES-256-GCM under BLOG_ARCHIVE_ENCRYPTION_KEY
// (32 random bytes, base64). Only the sealed bundle and an HMAC of the
// plaintext are committed. Plaintext exists only in process memory.
//
// Format of blog-archive.enc:  "EDUBLOG1" | 12-byte IV | 16-byte GCM tag | ciphertext
import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { gunzipSync, gzipSync } from 'node:zlib';
import { canonicalJson } from './archive-lib.mjs';

const MAGIC = Buffer.from('EDUBLOG1');
export const BUNDLE_FILE = 'blog-archive.enc';
export const HMAC_FILE = 'blog-archive.hmac';

export function parseKey(raw) {
  if (!raw || !raw.trim()) throw new Error('BLOG_ARCHIVE_ENCRYPTION_KEY is not set. Generate one with: openssl rand -base64 32');
  const key = Buffer.from(raw.trim(), 'base64');
  if (key.length !== 32) throw new Error('BLOG_ARCHIVE_ENCRYPTION_KEY must be 32 bytes encoded as base64 (openssl rand -base64 32).');
  return key;
}
const subkey = (key, label) => Buffer.from(hkdfSync('sha256', key, Buffer.alloc(0), `edunancial-blog-archive ${label}`, 32));

const plaintextOf = (files) => Buffer.from(canonicalJson(files), 'utf8');

// Keyed digest of the plaintext: lets the nightly job skip a commit when nothing
// changed (the ciphertext differs every run) without revealing anything.
export function bundleHmac(files, key) {
  return createHmac('sha256', subkey(key, 'hmac')).update(plaintextOf(files)).digest('hex');
}

export function sealBundle(files, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', subkey(key, 'enc'), iv);
  cipher.setAAD(MAGIC);
  const ct = Buffer.concat([cipher.update(gzipSync(plaintextOf(files), { level: 9 })), cipher.final()]);
  return Buffer.concat([MAGIC, iv, cipher.getAuthTag(), ct]);
}

export function openBundle(buf, key) {
  if (buf.length < 36 || !buf.subarray(0, 8).equals(MAGIC)) throw new Error('Not a blog archive bundle (bad header).');
  const decipher = createDecipheriv('aes-256-gcm', subkey(key, 'enc'), buf.subarray(8, 20));
  decipher.setAAD(MAGIC);
  decipher.setAuthTag(buf.subarray(20, 36));
  let plain;
  try { plain = Buffer.concat([decipher.update(buf.subarray(36)), decipher.final()]); }
  catch { throw new Error('Archive bundle failed authentication: wrong key, or the file was altered.'); }
  return JSON.parse(gunzipSync(plain).toString('utf8'));
}

export function hmacEquals(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
