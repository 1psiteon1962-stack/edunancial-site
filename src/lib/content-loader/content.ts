export type ContentLoaderMode = "append" | "replace";

export function composeNextContent(existingContent: string, incomingContent: string, mode: ContentLoaderMode) {
  if (mode === "replace" || !existingContent) {
    return incomingContent;
  }
  if (!incomingContent) {
    return existingContent;
  }
  const separator = existingContent.endsWith("\n") ? "" : "\n";
  return `${existingContent}${separator}${incomingContent}`;
}
