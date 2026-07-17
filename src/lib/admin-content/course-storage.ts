import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { AdminCourse, MediaItem } from "./types";

const DATA_DIR = join(process.cwd(), ".admin-data");
const COURSES_FILE = join(DATA_DIR, "courses.json");
const MEDIA_FILE = join(DATA_DIR, "media.json");

async function ensureDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readCourses(): Promise<AdminCourse[]> {
  await ensureDir();
  try {
    const raw = await readFile(COURSES_FILE, "utf8");
    return JSON.parse(raw) as AdminCourse[];
  } catch {
    return [];
  }
}

async function writeCourses(courses: AdminCourse[]): Promise<void> {
  await ensureDir();
  await writeFile(COURSES_FILE, JSON.stringify(courses, null, 2), "utf8");
}

async function readMedia(): Promise<MediaItem[]> {
  await ensureDir();
  try {
    const raw = await readFile(MEDIA_FILE, "utf8");
    return JSON.parse(raw) as MediaItem[];
  } catch {
    return [];
  }
}

async function writeMedia(media: MediaItem[]): Promise<void> {
  await ensureDir();
  await writeFile(MEDIA_FILE, JSON.stringify(media, null, 2), "utf8");
}

export async function listCourses(): Promise<AdminCourse[]> {
  return readCourses();
}

export async function getCourse(id: string): Promise<AdminCourse | null> {
  const courses = await readCourses();
  return courses.find((course) => course.id === id) ?? null;
}

export async function saveCourse(course: AdminCourse): Promise<void> {
  const courses = await readCourses();
  const idx = courses.findIndex((existing) => existing.id === course.id);

  if (idx >= 0) {
    courses[idx] = course;
  } else {
    courses.push(course);
  }

  await writeCourses(courses);
}

export async function deleteCourse(id: string): Promise<void> {
  const courses = await readCourses();
  await writeCourses(courses.filter((course) => course.id !== id));
}

export async function listMedia(): Promise<MediaItem[]> {
  return readMedia();
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  const media = await readMedia();
  const idx = media.findIndex((existing) => existing.id === item.id);

  if (idx >= 0) {
    media[idx] = item;
  } else {
    media.push(item);
  }

  await writeMedia(media);
}

export async function deleteMediaItem(id: string): Promise<void> {
  const media = await readMedia();
  const courses = await readCourses();
  const usedByLesson = courses.some((course) =>
    course.modules.some((module) =>
      module.lessons.some((lesson) => lesson.blocks.some((block) => block.mediaId === id)),
    ),
  );

  if (usedByLesson) {
    throw new Error("Cannot delete media that is referenced by a lesson block");
  }

  await writeMedia(media.filter((item) => item.id !== id));
}
