import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import test from "node:test";

import { resetGithubOidcCacheForTests, verifyGithubOidcToken, type GithubOidcPolicy } from "@/lib/admin-content/github-oidc";
import { assertArchiveReadableKey, BLOB_ARCHIVE_CHUNK_BYTES, listArchiveKeys, readArchiveChunk } from "@/lib/curriculum/blob-archive-read";

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const other = generateKeyPairSync("rsa", { modulusLength: 2048 });
const KID = "test-kid";
const jwks = async () => ({ keys: [{ ...publicKey.export({ format: "jwk" }), kid: KID, alg: "RS256", use: "sig" }] });
const NOW = 1_800_000_000;
const policy: GithubOidcPolicy = {
  audience: "edunancial-curriculum-blob-archive",
  repository: "1psiteon1962-stack/edunancial-site",
  ref: "refs/heads/main",
  workflowPath: ".github/workflows/curriculum-blob-archive.yml",
  allowedEvents: ["schedule", "workflow_dispatch"],
  nowSeconds: NOW,
};
const claims = {
  iss: "https://token.actions.githubusercontent.com",
  aud: "edunancial-curriculum-blob-archive",
  sub: "repo:1psiteon1962-stack/edunancial-site:ref:refs/heads/main",
  iat: NOW - 10, nbf: NOW - 10, exp: NOW + 300,
  repository: "1psiteon1962-stack/edunancial-site",
  ref: "refs/heads/main", event_name: "schedule",
  job_workflow_ref: "1psiteon1962-stack/edunancial-site/.github/workflows/curriculum-blob-archive.yml@refs/heads/main",
};
function jwt(payload: object, opts: { key?: typeof privateKey; kid?: string; alg?: string } = {}) {
  const head = Buffer.from(JSON.stringify({ alg: opts.alg ?? "RS256", kid: opts.kid ?? KID, typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign("RSA-SHA256", Buffer.from(head + "." + body), opts.key ?? privateKey).toString("base64url");
  return head + "." + body + "." + signature;
}

test("signed GitHub OIDC identity for permitted main archive workflow is accepted", async () => {
  resetGithubOidcCacheForTests();
  assert.equal((await verifyGithubOidcToken(jwt(claims), policy, jwks))?.repository, policy.repository);
});

test("forged, wrong-algorithm, wrong-repository, wrong-ref, expired and misbound tokens fail closed", async () => {
  resetGithubOidcCacheForTests();
  const badTokens: Array<[string, string]> = [
    ["forged RSA signature", jwt(claims, { key: other.privateKey })],
    ["none algorithm", jwt(claims, { alg: "none" })],
    ["unknown key", jwt(claims, { kid: "unknown" })],
    ["other issuer", jwt({ ...claims, iss: "https://attacker.invalid" })],
    ["other audience", jwt({ ...claims, aud: "unrelated" })],
    ["other repository", jwt({ ...claims, repository: "attacker/edunancial-site" })],
    ["feature branch", jwt({ ...claims, ref: "refs/heads/feature" })],
    ["wrong event", jwt({ ...claims, event_name: "pull_request" })],
    ["wrong workflow", jwt({ ...claims, job_workflow_ref: "owner/repo/.github/workflows/other.yml@refs/heads/main" })],
    ["expired", jwt({ ...claims, exp: NOW - 120 })],
    ["not yet valid", jwt({ ...claims, nbf: NOW + 600 })],
    ["invalid", "not.a.jwt"], ["empty", ""],
  ];
  for (const [label, token] of badTokens) {
    assert.equal(await verifyGithubOidcToken(token, policy, jwks), null, label);
  }
});

test("altering payload after signing invalidates JWT signature", async () => {
  resetGithubOidcCacheForTests();
  const [head, , sig] = jwt(claims).split(".");
  const forged = Buffer.from(JSON.stringify({ ...claims, repository: "attacker/x" })).toString("base64url");
  assert.equal(await verifyGithubOidcToken(head + "." + forged + "." + sig, policy, jwks), null);
});

function memoryStore(objects: Record<string, Buffer>) {
  return {
    async listWorkspaceEntries() { return [...Object.keys(objects), Object.keys(objects)[0]!]; },
    async readBinary(path: string) { return objects[path] ?? null; },
  };
}

test("Blob listing is complete, sorted and deduplicated", async () => {
  const list = await listArchiveKeys(memoryStore({ "b.json": Buffer.from("1"), "a.json": Buffer.from("2") }));
  assert.deepEqual(list.keys, ["a.json", "b.json"]);
  assert.equal(list.count, 2);
});

test("multi-chunk export preserves bytes including accented object key", async () => {
  const big = Buffer.alloc(BLOB_ARCHIVE_CHUNK_BYTES * 2 + 12345, 7);
  big.write("start", 0);
  big.write("end", big.length - 3);
  const key = "uploads/courses/batch_1/upload x – é.zip";
  const store = memoryStore({ [key]: big });
  const expected = createHash("sha256").update(big).digest("hex");
  const parts: Buffer[] = [];
  let offset = 0;
  for (;;) {
    const chunk = await readArchiveChunk(store, key, offset);
    assert.equal(chunk.sha256, expected);
    assert.equal(chunk.size, big.length);
    parts.push(Buffer.from(chunk.dataBase64, "base64"));
    offset += chunk.length;
    if (chunk.done) break;
  }
  assert.equal(parts.length, 3);
  assert.ok(Buffer.concat(parts).equals(big));
});

test("missing object is explicit; traversal, control characters and invalid offsets are refused", async () => {
  const store = memoryStore({ "a.json": Buffer.from("{}") });
  assert.equal((await readArchiveChunk(store, "missing.json", 0)).exists, false);
  for (const key of ["", "/etc/passwd", "a/../b", "./a", "a\u0000b"]) {
    assert.throws(() => assertArchiveReadableKey(key), /Invalid archive key/u);
  }
  await assert.rejects(readArchiveChunk(store, "a.json", -1), /Invalid offset/u);
  await assert.rejects(readArchiveChunk(store, "a.json", 99), /beyond end/u);
});
