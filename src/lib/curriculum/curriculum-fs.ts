/**
 * Curriculum file access that works whether or not the raw lesson files are on disk.
 *
 * The deployed Netlify server handler does not ship the raw files under
 * content/curriculum and content/courses (they exceeded the AWS Lambda 250 MB
 * unzipped limit). Instead it ships content/generated/curriculum-archive.bin,
 * built at prebuild by scripts/curriculum/generate-curriculum-archive.mjs from the
 * same committed Git files.
 *
 * Every function here checks the real filesystem first and only falls back to the
 * archive for paths inside the archived roots. Local development, tests and CI
 * therefore behave exactly as before; production reads identical bytes from the
 * archive. Directory listings merge disk and archive entries so nothing committed
 * can disappear because it is only present in one of them.
 */
import * as fs from "node:fs";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { gunzipSync } from "node:zlib";

const ARCHIVED_ROOTS = ["content/curriculum", "content/courses"] as const;
const MAGIC = "EDUARCH2";

// [byte offset into the body, gzipped length, 1 when the original bytes are binary]
type ArchiveEntry = [number, number, number];
type Archive = {
  fd: number | null;
  bodyStart: number;
  files: Map<string, ArchiveEntry>;
  dirs: Map<string, Map<string, "file" | "dir">>;
};

let archive: Archive | null = null;
let archivePathOverride: string | null = null;

function repoRoot(): string {
  return process.cwd();
}

function archivePath(): string {
  return archivePathOverride ?? join(repoRoot(), "content", "generated", "curriculum-archive.bin");
}

/**
 * Loads only the archive's header (paths and offsets, about 1.5 MB). File contents
 * stay compressed on disk and are inflated one file at a time by readArchived().
 */
function load(): Archive {
  if (archive) return archive;
  const files = new Map<string, ArchiveEntry>();
  const dirs = new Map<string, Map<string, "file" | "dir">>();
  const addEntry = (dir: string, name: string, kind: "file" | "dir") => {
    let entries = dirs.get(dir);
    if (!entries) dirs.set(dir, (entries = new Map()));
    if (entries.get(name) !== "dir") entries.set(name, kind);
  };
  let fd: number | null = null;
  let bodyStart = 0;
  try {
    const path = archivePath();
    if (fs.existsSync(path)) {
      fd = fs.openSync(path, "r");
      const prefix = Buffer.alloc(MAGIC.length + 4);
      fs.readSync(fd, prefix, 0, prefix.length, 0);
      if (prefix.toString("ascii", 0, MAGIC.length) !== MAGIC) throw new Error("not a curriculum archive");
      const headerLength = prefix.readUInt32BE(MAGIC.length);
      const header = Buffer.alloc(headerLength);
      fs.readSync(fd, header, 0, headerLength, prefix.length);
      bodyStart = prefix.length + headerLength;
      const parsed = JSON.parse(header.toString("utf8")) as { files?: Array<[string, number, number, number]> };
      for (const entry of parsed.files ?? []) {
        const [filePath, offset, length, binary] = entry;
        if (typeof filePath !== "string" || !Number.isFinite(offset) || !Number.isFinite(length)) continue;
        files.set(filePath, [offset, length, binary ? 1 : 0]);
        const parts = filePath.split("/");
        for (let i = 1; i < parts.length; i += 1) {
          addEntry(parts.slice(0, i - 1).join("/"), parts[i - 1]!, "dir");
        }
        addEntry(parts.slice(0, -1).join("/"), parts[parts.length - 1]!, "file");
      }
    }
  } catch {
    // A missing or unreadable archive leaves disk access unchanged.
    if (fd !== null) {
      try { fs.closeSync(fd); } catch { /* ignore */ }
    }
    fd = null;
    files.clear();
    dirs.clear();
  }
  archive = { fd, bodyStart, files, dirs };
  return archive;
}

function readArchived(entry: ArchiveEntry): Buffer {
  const current = load();
  if (current.fd === null) throw new Error("curriculum archive is not open");
  const [offset, length] = entry;
  const packed = Buffer.alloc(length);
  fs.readSync(current.fd, packed, 0, length, current.bodyStart + offset);
  return gunzipSync(packed);
}

/** Repository-relative POSIX key for a path inside an archived root, else null. */
function archiveKey(path: fs.PathLike): string | null {
  const text = String(path);
  const absolute = isAbsolute(text) ? text : resolve(repoRoot(), text);
  const rel = relative(repoRoot(), absolute);
  if (!rel || rel.startsWith("..") || isAbsolute(rel)) return null;
  const key = rel.split(sep).join("/");
  return ARCHIVED_ROOTS.some((root) => key === root || key.startsWith(`${root}/`)) ? key : null;
}

function archivedFile(path: fs.PathLike): ArchiveEntry | undefined {
  const key = archiveKey(path);
  return key ? load().files.get(key) : undefined;
}

function archivedDir(path: fs.PathLike): Map<string, "file" | "dir"> | undefined {
  const key = archiveKey(path);
  return key ? load().dirs.get(key) : undefined;
}


function enoent(path: fs.PathLike, syscall: string): NodeJS.ErrnoException {
  const error = new Error(`ENOENT: no such file or directory, ${syscall} '${String(path)}'`) as NodeJS.ErrnoException;
  error.code = "ENOENT";
  error.errno = -2;
  error.syscall = syscall;
  error.path = String(path);
  return error;
}

type Encoding = BufferEncoding | { encoding?: BufferEncoding | null; flag?: string } | null | undefined;

function encodingOf(options: Encoding): BufferEncoding | null {
  if (!options) return null;
  if (typeof options === "string") return options;
  return options.encoding ?? null;
}

export function existsSync(path: fs.PathLike): boolean {
  if (fs.existsSync(path)) return true;
  return Boolean(archivedFile(path) || archivedDir(path));
}

export function readFileSync(path: fs.PathLike, options: BufferEncoding | { encoding: BufferEncoding; flag?: string }): string;
export function readFileSync(path: fs.PathLike, options?: { encoding?: null; flag?: string } | null): Buffer;
export function readFileSync(path: fs.PathLike, options?: Encoding): string | Buffer {
  const encoding = encodingOf(options);
  try {
    return encoding ? fs.readFileSync(path, encoding) : fs.readFileSync(path);
  } catch (error) {
    const file = archivedFile(path);
    if (!file || (error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const buffer = readArchived(file);
    return encoding ? buffer.toString(encoding) : buffer;
  }
}

type StatLike = { isFile(): boolean; isDirectory(): boolean; size: number };

export function statSync(path: fs.PathLike): StatLike {
  if (fs.existsSync(path)) return fs.statSync(path);
  const file = archivedFile(path);
  if (file) return { isFile: () => true, isDirectory: () => false, size: readArchived(file).length };
  if (archivedDir(path)) return { isFile: () => false, isDirectory: () => true, size: 0 };
  throw enoent(path, "stat");
}

export type DirentLike = { name: string; isFile(): boolean; isDirectory(): boolean };

function mergedEntries(path: fs.PathLike): Map<string, "file" | "dir"> {
  const merged = new Map<string, "file" | "dir">();
  let diskOk = false;
  try {
    for (const entry of fs.readdirSync(path, { withFileTypes: true })) {
      merged.set(entry.name, entry.isDirectory() ? "dir" : "file");
    }
    diskOk = true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const archived = archivedDir(path);
  if (!diskOk && !archived) throw enoent(path, "scandir");
  for (const [name, kind] of archived ?? []) if (!merged.has(name)) merged.set(name, kind);
  return merged;
}

export function readdirSync(path: fs.PathLike): string[];
export function readdirSync(path: fs.PathLike, options: { withFileTypes: true }): DirentLike[];
export function readdirSync(path: fs.PathLike, options?: { withFileTypes?: boolean }): string[] | DirentLike[] {
  const entries = [...mergedEntries(path)].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  if (options?.withFileTypes) {
    return entries.map(([name, kind]) => ({ name, isFile: () => kind === "file", isDirectory: () => kind === "dir" }));
  }
  return entries.map(([name]) => name);
}

/** Promise variants for callers that used node:fs/promises. */
export async function readFileAsync(path: fs.PathLike, encoding: BufferEncoding): Promise<string> {
  return readFileSync(path, encoding);
}

export async function readdirWithTypesAsync(path: fs.PathLike): Promise<DirentLike[]> {
  return readdirSync(path, { withFileTypes: true });
}

/** Test-only: point at a fixture archive (or null for the default) and drop the cache. */
export function setCurriculumArchivePathForTests(path: string | null): void {
  if (archive?.fd != null) {
    try { fs.closeSync(archive.fd); } catch { /* ignore */ }
  }
  archivePathOverride = path;
  archive = null;
}
