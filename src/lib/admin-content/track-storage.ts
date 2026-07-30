/**
 * Course track management store.
 *
 * Persists track configuration at `.admin-data/tracks.json`.
 * RED, WHITE, and BLUE are the default tracks; the Owner can define
 * additional tracks without modifying source code.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface CourseTrack {
  id: string;
  slug: string;       // URL-safe identifier, e.g. "red", "green"
  label: string;      // Display name, e.g. "Real Estate"
  color: string;      // Tailwind-compatible color token or hex, e.g. "red", "#22c55e"
  description: string;
  isDefault: boolean; // true for the built-in RED / WHITE / BLUE tracks
  status: "active" | "archived";
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const DEFAULT_TRACKS: CourseTrack[] = [
  {
    id: "track_red",
    slug: "red",
    label: "Real Estate",
    color: "red",
    description: "Real estate investment strategies including tax liens, foreclosures, and creative financing.",
    isDefault: true,
    status: "active",
    order: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    createdBy: "system",
  },
  {
    id: "track_white",
    slug: "white",
    label: "Paper Assets",
    color: "slate",
    description: "Stocks, bonds, options, and retirement investment vehicles.",
    isDefault: true,
    status: "active",
    order: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    createdBy: "system",
  },
  {
    id: "track_blue",
    slug: "blue",
    label: "Business",
    color: "blue",
    description: "Business, entrepreneurship, and profit optimization.",
    isDefault: true,
    status: "active",
    order: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    createdBy: "system",
  },
];

const DATA_DIR = join(process.cwd(), ".admin-data");
const TRACKS_FILE = join(DATA_DIR, "tracks.json");

async function ensureDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readTracks(): Promise<CourseTrack[]> {
  await ensureDir();
  try {
    const raw = await readFile(TRACKS_FILE, "utf8");
    return JSON.parse(raw) as CourseTrack[];
  } catch {
    return DEFAULT_TRACKS;
  }
}

async function writeTracks(tracks: CourseTrack[]): Promise<void> {
  await ensureDir();
  await writeFile(TRACKS_FILE, JSON.stringify(tracks, null, 2), "utf8");
}

function generateId(slug: string): string {
  return `track_${slug}_${Date.now().toString(36)}`;
}

export async function listTracks(): Promise<CourseTrack[]> {
  const tracks = await readTracks();
  return [...tracks].sort((a, b) => a.order - b.order);
}

export async function getTrack(id: string): Promise<CourseTrack | null> {
  const tracks = await readTracks();
  return tracks.find((t) => t.id === id) ?? null;
}

export async function getTrackBySlug(slug: string): Promise<CourseTrack | null> {
  const tracks = await readTracks();
  return tracks.find((t) => t.slug === slug) ?? null;
}

export async function createTrack(
  data: Omit<CourseTrack, "id" | "isDefault" | "createdAt" | "updatedAt">,
): Promise<CourseTrack> {
  const tracks = await readTracks();
  const slug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const existing = tracks.find((t) => t.slug === slug);
  if (existing) {
    throw new Error(`A track with slug "${slug}" already exists.`);
  }

  const now = new Date().toISOString();
  const newTrack: CourseTrack = {
    id: generateId(slug),
    slug,
    label: data.label,
    color: data.color,
    description: data.description ?? "",
    isDefault: false,
    status: data.status ?? "active",
    order: data.order ?? tracks.length,
    createdAt: now,
    updatedAt: now,
    createdBy: data.createdBy,
  };

  await writeTracks([...tracks, newTrack]);
  return newTrack;
}

export async function updateTrack(
  id: string,
  patch: Partial<Pick<CourseTrack, "label" | "color" | "description" | "status" | "order">>,
): Promise<CourseTrack | null> {
  const tracks = await readTracks();
  const idx = tracks.findIndex((t) => t.id === id);
  if (idx < 0) return null;

  const updated: CourseTrack = {
    ...tracks[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  tracks[idx] = updated;
  await writeTracks(tracks);
  return updated;
}

export async function deleteTrack(id: string): Promise<boolean> {
  const tracks = await readTracks();
  const track = tracks.find((t) => t.id === id);
  if (!track) return false;
  if (track.isDefault) {
    throw new Error("Default tracks (RED, WHITE, BLUE) cannot be deleted.");
  }

  const filtered = tracks.filter((t) => t.id !== id);
  await writeTracks(filtered);
  return true;
}

/**
 * Returns only the active track slugs — compatible with the legacy
 * COURSE_TRACKS constant in constants.ts.
 */
export async function getActiveTrackSlugs(): Promise<string[]> {
  const tracks = await readTracks();
  return tracks.filter((t) => t.status === "active").map((t) => t.slug);
}
