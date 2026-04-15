import crypto from "crypto";

export async function hashIP(ip: string): Promise<string> {
  return crypto.createHash("sha256").update(ip).digest("hex");
}
