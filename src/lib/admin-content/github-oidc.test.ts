import assert from "node:assert/strict";
import { createSign, generateKeyPairSync } from "node:crypto";
import test from "node:test";

import { authorizeGithubActionsRun, GITHUB_RUNNER_WORKFLOWS } from "./github-actions-runner-auth";
import { GITHUB_OIDC_ISSUER, type GithubOidcPolicy, type Jwk, resetGithubOidcCacheForTests, verifyGithubOidcToken } from "./github-oidc";

const NOW = 1_800_000_000;
const REPO = "1psiteon1962-stack/edunancial-site";
const AUD = "https://edunancial.com/api/admin";
const WORKFLOW = ".github/workflows/production-curriculum-audit.yml";
const WORKFLOW_REF = `${REPO}/${WORKFLOW}@refs/heads/main`;

const signer = generateKeyPairSync("rsa", { modulusLength: 2048 });
const attacker = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...(signer.publicKey.export({ format: "jwk" }) as Jwk), kid: "kid-1", alg: "RS256", use: "sig" };
const jwks = async () => ({ keys: [jwk] });

const b64 = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
function sign(claims: Record<string, unknown>, opts: { kid?: string; alg?: string; key?: typeof signer.privateKey; header?: Record<string, unknown> } = {}) {
  const head = b64({ alg: opts.alg ?? "RS256", kid: opts.kid ?? "kid-1", typ: "JWT", ...opts.header });
  const body = b64(claims);
  const s = createSign("RSA-SHA256");
  s.update(`${head}.${body}`);
  return `${head}.${body}.${s.sign(opts.key ?? signer.privateKey).toString("base64url")}`;
}
const goodClaims = (over: Record<string, unknown> = {}) => ({
  iss: GITHUB_OIDC_ISSUER, aud: AUD, sub: `repo:${REPO}:ref:refs/heads/main`,
  iat: NOW - 30, nbf: NOW - 30, exp: NOW + 270,
  repository: REPO, repository_id: "123456", ref: "refs/heads/main", event_name: "schedule", run_id: "987654",
  workflow_ref: WORKFLOW_REF, job_workflow_ref: WORKFLOW_REF, ...over,
});
const policy = (over: Partial<GithubOidcPolicy> = {}): GithubOidcPolicy => ({
  audience: AUD, repository: REPO, ref: "refs/heads/main", workflowPath: WORKFLOW,
  allowedEvents: ["schedule", "workflow_dispatch", "push"], nowSeconds: NOW, ...over,
});
async function check(token: string, over: Partial<GithubOidcPolicy> = {}, fetcher = jwks) {
  resetGithubOidcCacheForTests();
  return verifyGithubOidcToken(token, policy(over), fetcher);
}

test("accepts a valid GitHub-signed token with matching claims", async () => {
  const claims = await check(sign(goodClaims()));
  assert.equal(claims?.repository, REPO);
});

test("rejects bad signature, foreign key, alg none/HS256, unknown kid, crit header", async () => {
  const good = sign(goodClaims());
  const [h, p] = good.split(".");
  assert.equal(await check(`${h}.${p}.${Buffer.from("x").toString("base64url")}`), null);
  assert.equal(await check(sign(goodClaims(), { key: attacker.privateKey })), null);
  assert.equal(await check(`${b64({ alg: "none", kid: "kid-1" })}.${p}.x`), null);
  assert.equal(await check(sign(goodClaims(), { alg: "HS256" })), null);
  assert.equal(await check(sign(goodClaims(), { kid: "unknown" })), null);
  assert.equal(await check(sign(goodClaims(), { header: { crit: ["exp"] } })), null);
  // Tampered payload with the original signature.
  assert.equal(await check(`${h}.${b64(goodClaims({ repository: "evil/repo" }))}.${good.split(".")[2]}`), null);
});

test("rejects wrong issuer, audience, repository, repository id, ref, event, workflow", async () => {
  for (const bad of [
    { iss: "https://evil.example" }, { aud: "https://other.example" }, { repository: "evil/edunancial-site" },
    { ref: "refs/heads/feature" }, { ref: "refs/pull/1/merge" }, { event_name: "pull_request" },
    { workflow_ref: `${REPO}/.github/workflows/other.yml@refs/heads/main`, job_workflow_ref: `${REPO}/.github/workflows/other.yml@refs/heads/main` },
  ]) {
    assert.equal(await check(sign(goodClaims(bad))), null, JSON.stringify(bad));
  }
  assert.equal(await check(sign(goodClaims()), { repositoryId: "999" }), null);
  assert.ok(await check(sign(goodClaims()), { repositoryId: "123456" }));
});

test("accepts an ordinary (non-reusable) job token that has no job_workflow_ref", async () => {
  assert.ok(await check(sign(goodClaims({ job_workflow_ref: undefined }))));
});

test("accepts a token whose job_workflow_ref matches the authorized workflow", async () => {
  assert.ok(await check(sign(goodClaims({ job_workflow_ref: WORKFLOW_REF }))));
});

test("rejects a job running inside a reusable workflow from another repository", async () => {
  const token = sign(goodClaims({ job_workflow_ref: "evil/repo/.github/workflows/steal.yml@refs/heads/main" }));
  assert.equal(await check(token), null);
  assert.equal(await check(sign(goodClaims({ job_workflow_ref: "" }))), null, "present but empty is not a match");
});

test("rejects a token missing workflow_ref, even if job_workflow_ref matches", async () => {
  assert.equal(await check(sign(goodClaims({ workflow_ref: undefined }))), null);
  assert.equal(await check(sign(goodClaims({ workflow_ref: undefined, job_workflow_ref: undefined }))), null);
});

test("rejects expired, not-yet-valid, future-issued, and over-long tokens; tolerates small skew", async () => {
  assert.equal(await check(sign(goodClaims({ exp: NOW - 61 }))), null);
  assert.ok(await check(sign(goodClaims({ exp: NOW - 30 }))));
  assert.equal(await check(sign(goodClaims({ nbf: NOW + 120 }))), null);
  assert.equal(await check(sign(goodClaims({ iat: NOW + 120 }))), null);
  assert.equal(await check(sign(goodClaims({ iat: NOW - 30, exp: NOW + 7200 }))), null);
  assert.equal(await check(sign(goodClaims({ exp: "never" }))), null);
});

test("signed run_id must match a supplied run-id header value", async () => {
  assert.ok(await check(sign(goodClaims()), { runId: "987654" }));
  assert.equal(await check(sign(goodClaims()), { runId: "111" }), null);
});

test("fails closed when JWKS is unavailable or malformed", async () => {
  assert.equal(await check(sign(goodClaims()), {}, async () => { throw new Error("down"); }), null);
  assert.equal(await check(sign(goodClaims()), {}, async () => ({ keys: "nope" as never })), null);
  assert.equal(await check(sign(goodClaims()), {}, async () => ({ keys: [{ ...jwk, kty: "EC" }] })), null);
});

test("unknown-kid refetches are rate limited (no JWKS amplification)", async () => {
  resetGithubOidcCacheForTests();
  let calls = 0;
  const counting = async () => { calls += 1; return { keys: [jwk] }; };
  assert.ok(await verifyGithubOidcToken(sign(goodClaims()), policy(), counting));
  for (let i = 0; i < 5; i += 1) await verifyGithubOidcToken(sign(goodClaims(), { kid: `forged-${i}` }), policy(), counting);
  assert.equal(calls, 1, "forged kids inside the cooldown window must not trigger JWKS refetches");
});

test("rejects malformed inputs", async () => {
  for (const token of ["", "a.b", "a.b.c.d", "!!.!!.!!", "x".repeat(20_000)]) assert.equal(await check(token), null);
});

test("authorizeGithubActionsRun: requires config and OIDC bearer, binds endpoint to workflow file", async () => {
  const env = { EDUNANCIAL_GITHUB_OWNER: "1psiteon1962-stack", EDUNANCIAL_GITHUB_REPO: "edunancial-site" };
  const req = (token: string, runId?: string) => new Request("https://edunancial.com/x", {
    headers: { authorization: `Bearer ${token}`, ...(runId ? { "x-github-run-id": runId } : {}) },
  });
  const token = sign(goodClaims());
  resetGithubOidcCacheForTests();
  assert.equal(await authorizeGithubActionsRun(req(token), ["schedule"], GITHUB_RUNNER_WORKFLOWS.productionAudit, { env, fetcher: jwks, nowSeconds: NOW }), true);
  resetGithubOidcCacheForTests();
  assert.equal(await authorizeGithubActionsRun(req(token, "987654"), ["schedule"], GITHUB_RUNNER_WORKFLOWS.productionAudit, { env, fetcher: jwks, nowSeconds: NOW }), true);
  resetGithubOidcCacheForTests();
  assert.equal(await authorizeGithubActionsRun(req(token, "1"), ["schedule"], GITHUB_RUNNER_WORKFLOWS.productionAudit, { env, fetcher: jwks, nowSeconds: NOW }), false);
  resetGithubOidcCacheForTests();
  assert.equal(await authorizeGithubActionsRun(req(token), ["schedule"], GITHUB_RUNNER_WORKFLOWS.githubExport, { env, fetcher: jwks, nowSeconds: NOW }), false, "audit token cannot drive the Git export endpoint");
  resetGithubOidcCacheForTests();
  assert.equal(await authorizeGithubActionsRun(req(token), ["push"], GITHUB_RUNNER_WORKFLOWS.productionAudit, { env, fetcher: jwks, nowSeconds: NOW }), false, "event not allowed for this endpoint");
  assert.equal(await authorizeGithubActionsRun(req(token), ["schedule"], GITHUB_RUNNER_WORKFLOWS.productionAudit, { env: {}, fetcher: jwks, nowSeconds: NOW }), false, "missing repo config fails closed");
  assert.equal(await authorizeGithubActionsRun(new Request("https://edunancial.com/x"), ["schedule"], GITHUB_RUNNER_WORKFLOWS.productionAudit, { env, fetcher: jwks, nowSeconds: NOW }), false);
  // A legacy GITHUB_TOKEN (opaque, not a JWT) is no longer accepted.
  assert.equal(await authorizeGithubActionsRun(req("ghs_legacyOpaqueToken"), ["schedule"], GITHUB_RUNNER_WORKFLOWS.productionAudit, { env, fetcher: jwks, nowSeconds: NOW }), false);
});
