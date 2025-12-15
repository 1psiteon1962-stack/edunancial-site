import mirrors from "../data/payments/mirrors.json";

export function resolveMirror(hostname) {
  for (const mirrorKey in mirrors) {
    const config = mirrors[mirrorKey];
    if (config.domains && config.domains.includes(hostname)) {
      return mirrorKey;
    }
  }
  return "us"; // safe default
}
