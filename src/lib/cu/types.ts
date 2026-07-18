import {
  CU_CATEGORY_OPTIONS,
  CU_LANGUAGE_OPTIONS,
  CU_TRACK_OPTIONS,
} from "@/lib/cu/constants";

export type CuCategory = (typeof CU_CATEGORY_OPTIONS)[number];
export type CuTrack = (typeof CU_TRACK_OPTIONS)[number];
export type CuLanguage = (typeof CU_LANGUAGE_OPTIONS)[number];

export type CuFileStatus = "pending" | "published" | "error";

export type CuFileRecord = {
  id: string;
  name: string;
  relativePath: string;
  extension: string;
  mimeType: string;
  size: number;
  category: CuCategory;
  track: CuTrack;
  language: CuLanguage;
  level: number;
  isText: boolean;
  textContent: string | null;
  previewText: string | null;
  contentBase64: string;
  status: CuFileStatus;
  sourceLabel: string;
  error: string | null;
  destination: string | null;
};

export type CuPublishInput = Pick<
  CuFileRecord,
  | "id"
  | "name"
  | "extension"
  | "mimeType"
  | "size"
  | "category"
  | "track"
  | "language"
  | "level"
  | "contentBase64"
>;

export type CuPublishResult = {
  id: string;
  destination: string;
  published: boolean;
  error?: string;
};
