import { getSecurityEnvironmentStatus, isProductionRuntime } from "./env";

function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const normalized = padded + "=".repeat((4 - (padded.length % 4 || 4)) % 4);
  const binary = atob(normalized);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importEncryptionKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    fromBase64Url(secret),
    "AES-GCM",
    false,
    ["decrypt", "encrypt"]
  );
}

export async function encryptSensitiveValue(value: string): Promise<string> {
  const secret = process.env.EDUNANCIAL_ENCRYPTION_KEY;

  if (!secret) {
    if (isProductionRuntime()) {
      throw new Error(
        `Missing security configuration: ${getSecurityEnvironmentStatus().missing.join(", ")}`
      );
    }

    return value;
  }

  const key = await importEncryptionKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(value);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

  return `${toBase64Url(iv)}.${toBase64Url(new Uint8Array(encrypted))}`;
}

export async function decryptSensitiveValue(value: string): Promise<string> {
  const secret = process.env.EDUNANCIAL_ENCRYPTION_KEY;

  if (!secret) {
    if (isProductionRuntime()) {
      throw new Error(
        `Missing security configuration: ${getSecurityEnvironmentStatus().missing.join(", ")}`
      );
    }

    return value;
  }

  const [ivPart, payloadPart] = value.split(".");

  if (!ivPart || !payloadPart) {
    throw new Error("Malformed encrypted payload.");
  }

  const key = await importEncryptionKey(secret);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64Url(ivPart) },
    key,
    fromBase64Url(payloadPart)
  );

  return new TextDecoder().decode(decrypted);
}
