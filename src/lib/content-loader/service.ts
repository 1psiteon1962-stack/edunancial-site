import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";

import { verifyDestinationPath } from "@/lib/admin-content/security";
import { slugify } from "@/lib/admin-content/utils";
import { composeNextContent, type ContentLoaderMode } from "@/lib/content-loader/content";
import { publishDestinationToGithub } from "@/lib/content-loader/github";

type ContentLoaderPayload = {
  color: "Red" | "White" | "Blue";
  level: "1" | "2" | "3" | "4" | "5";
  language: "English" | "Spanish" | "French" | "Portuguese" | "Arabic" | "Japanese" | "Korean" | "Chinese";
  category: "Book" | "Course" | "Lesson" | "Article" | "FAQ" | "Video" | "Prompt" | "Other";
  destination: string;
  content: string;
};

const TEXT_FILE_EXTENSIONS = new Set([".txt", ".md", ".mdx", ".json", ".csv", ".html", ".yml", ".yaml", ".xml"]);
const DESTINATION_ROOTS = ["content", "curriculum", "data", "assets"] as const;

async function walkForDestinations(baseDirectory: string, relativeDirectory = ""): Promise<string[]> {
  const absoluteDirectory = join(baseDirectory, relativeDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true }).catch(() => []);
  const destinations: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      destinations.push(...(await walkForDestinations(baseDirectory, relativePath)));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!TEXT_FILE_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue;
    destinations.push(relativePath.replaceAll("\\", "/"));
  }

  return destinations;
}

export async function listContentLoaderDestinations() {
  const repositoryRoot = process.cwd();
  const discovered = await Promise.all(
    DESTINATION_ROOTS.map(async (root) => {
      const rootDestinations = await walkForDestinations(join(repositoryRoot, root));
      return rootDestinations.map((entry) => `${root}/${entry}`);
    }),
  );
  return [...new Set(discovered.flat())].sort((left, right) => left.localeCompare(right));
}

export async function readExistingDestinationContent(destination: string) {
  const verifiedDestination = verifyDestinationPath(destination);
  const absolutePath = join(process.cwd(), verifiedDestination);
  const existing = await readFile(absolutePath, "utf8").catch(() => "");
  return existing;
}

export async function saveContentLoaderDraft(payload: ContentLoaderPayload, mode: ContentLoaderMode) {
  const verifiedDestination = verifyDestinationPath(payload.destination);
  const existing = await readExistingDestinationContent(verifiedDestination);
  const draftContent = composeNextContent(existing, payload.content, mode);
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const filename = `${timestamp}-${slugify(payload.category)}-${slugify(payload.language)}-${slugify(payload.color)}-L${payload.level}.md`;
  const destinationDirectory = join(process.cwd(), "curriculum/staging/content-loader/drafts");
  const draftPath = join(destinationDirectory, filename);

  await mkdir(dirname(draftPath), { recursive: true });
  await writeFile(draftPath, draftContent, "utf8");

  return {
    draftPath: draftPath.replace(`${process.cwd()}/`, ""),
    destination: verifiedDestination,
  };
}

export async function publishContentLoaderUpdate(payload: ContentLoaderPayload, mode: ContentLoaderMode, actor: string) {
  const verifiedDestination = verifyDestinationPath(payload.destination);
  return publishDestinationToGithub({
    destination: verifiedDestination,
    incomingContent: payload.content,
    mode,
    actor,
    metadata: {
      color: payload.color,
      level: payload.level,
      language: payload.language,
      category: payload.category,
    },
  });
}
