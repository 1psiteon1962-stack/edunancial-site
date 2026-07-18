export const CU_TRACKS = ["RED", "WHITE", "BLUE"] as const;
export const CU_CATEGORIES = ["lessons", "quizzes", "courses", "certificates", "general", "legal"] as const;
export const CU_LEVELS = [1, 2, 3, 4, 5] as const;
export const CU_MODES = ["append", "replace"] as const;

export type CuTrack = (typeof CU_TRACKS)[number];
export type CuCategory = (typeof CU_CATEGORIES)[number];
export type CuLevel = (typeof CU_LEVELS)[number];
export type CuMode = (typeof CU_MODES)[number];

export type CuDraftInput = {
  password: string;
  track: CuTrack;
  category: CuCategory;
  level: CuLevel;
  language: string;
  destination: string;
  mode: CuMode;
  content: string;
};

export type CuDestinationOption = {
  value: string;
  label: string;
  description: string;
};

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[\s_.]+/g, "-")
    .replace(/-+/g, "-") || "content-upload";
}

function verifyCuDestinationPath(destination: string) {
  const normalized = destination.replaceAll("\\", "/").replace(/^\/+/, "");
  const allowedPrefixes = ["content/", "curriculum/", "data/", "assets/"];
  if (!allowedPrefixes.some((prefix) => normalized.startsWith(prefix))) {
    throw new Error(`Destination path is outside approved roots: ${destination}`);
  }
  if (normalized.includes("../") || normalized.includes("..\\") || normalized.startsWith("/")) {
    throw new Error(`Destination path is unsafe: ${destination}`);
  }
  return normalized;
}

function normalizeLanguageSegment(language: string) {
  return slugify(language || "en-US").replace(/-/g, "_") || "en_us";
}

export function inferCuTitle(content: string) {
  for (const line of content.split(/\r?\n/)) {
    if (line.startsWith("# ")) {
      const heading = line.slice(2).trim();
      if (heading) {
        return heading;
      }
    }
  }

  const firstLine = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) {
    return "content-upload";
  }

  return firstLine.replace(/^[#>*\-\d.\s]+/, "").slice(0, 80) || "content-upload";
}

export function inferCuSlug(content: string) {
  return slugify(inferCuTitle(content));
}

export function buildCuDestinationOptions({
  track,
  category,
  level,
  language,
  content,
}: Omit<CuDraftInput, "password" | "destination" | "mode">): CuDestinationOption[] {
  const slug = inferCuSlug(content);
  const normalizedLanguage = normalizeLanguageSegment(language);
  const stagingPath = verifyCuDestinationPath(
    `curriculum/staging/content-upload/${category}/${normalizedLanguage}/${track.toLowerCase()}-l${level}-${slug}.md`,
  );

  const primaryPath = ["lessons", "quizzes", "courses", "certificates"].includes(category)
    ? verifyCuDestinationPath(`content/curriculum/${track}/L${level}/${track.toLowerCase()}-l${level}-${slug}.md`)
    : stagingPath;

  return [
    {
      value: primaryPath,
      label: primaryPath === stagingPath ? "Staging destination" : "Primary destination",
      description:
        primaryPath === stagingPath
          ? "Writes into the temporary curriculum staging area."
          : "Writes directly to the curriculum content tree on main.",
    },
    {
      value: stagingPath,
      label: "Staging fallback",
      description: "Keeps the content in the repository staging workspace for later promotion.",
    },
  ].filter((option, index, all) => all.findIndex((candidate) => candidate.value === option.value) === index);
}

export function validateCuDraftInput(input: CuDraftInput) {
  if (!CU_TRACKS.includes(input.track)) {
    throw new Error("A valid RED / WHITE / BLUE selection is required.");
  }
  if (!CU_CATEGORIES.includes(input.category)) {
    throw new Error("A valid category selection is required.");
  }
  if (!CU_LEVELS.includes(input.level)) {
    throw new Error("A valid level selection is required.");
  }
  if (!CU_MODES.includes(input.mode)) {
    throw new Error("Choose append or replace.");
  }
  if (!input.language.trim()) {
    throw new Error("A language selection is required.");
  }
  if (!input.password) {
    throw new Error("Password is required.");
  }
  if (!input.content.trim()) {
    throw new Error("Paste content is required.");
  }
  return input;
}

export function validateSelectedCuDestination(input: Omit<CuDraftInput, "password" | "mode">) {
  const allowed = buildCuDestinationOptions(input);
  const selected = verifyCuDestinationPath(input.destination);
  if (!allowed.some((option) => option.value === selected)) {
    throw new Error("Destination file is not allowed for the current CU selection.");
  }
  return selected;
}

export function mergeCuContent(existingContent: string, incomingContent: string, mode: CuMode) {
  const nextContent = incomingContent.replace(/\r\n/g, "\n").trim();
  if (!nextContent) {
    throw new Error("Paste content is required.");
  }

  if (mode === "replace" || !existingContent.trim()) {
    return `${nextContent}\n`;
  }

  const previous = existingContent.replace(/\r\n/g, "\n").trimEnd();
  return `${previous}\n\n${nextContent}\n`;
}
