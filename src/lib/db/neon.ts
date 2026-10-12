import { neon } from "@neondatabase/serverless";

function isNetlifyProduction(): boolean {
  return process.env.CONTEXT === "production";
}

function isNetlifyNonProduction(): boolean {
  return process.env.CONTEXT === "deploy-preview" || process.env.CONTEXT === "branch-deploy";
}

export function readDatabaseUrl(): string | null {
  const productionUrl =
    process.env.DATABASE_URL?.trim() || process.env.NETLIFY_DATABASE_URL?.trim() || null;
  const previewUrl =
    process.env.PREVIEW_DATABASE_URL?.trim() ||
    process.env.NETLIFY_PREVIEW_DATABASE_URL?.trim() ||
    null;

  if (isNetlifyNonProduction()) {
    // Preview and branch deploys fail closed instead of silently inheriting production data.
    return previewUrl;
  }

  if (isNetlifyProduction()) {
    return productionUrl;
  }

  // Local/CI may explicitly opt into an isolated database, while preserving
  // existing local development behavior when only DATABASE_URL is configured.
  return previewUrl || productionUrl;
}

export function getNeonSql() {
  const databaseUrl = readDatabaseUrl();
  return databaseUrl ? neon(databaseUrl) : null;
}
