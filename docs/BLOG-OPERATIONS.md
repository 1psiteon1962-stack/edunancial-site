# Blog operations: backup and recovery

## Status

**Not operational until all three are true:** the secrets below are set, a
nightly (or manual) archive run has succeeded, and a restore drill into an
empty Neon branch has passed. Until then, Neon point-in-time restore is the
only blog backup. Record the date of the last passed drill here:

- Last successful restore drill: _none yet_

## Source of truth

- **Blog content lives in Neon** (`blog_articles`, `blog_article_revisions`,
  `blog_article_approvals`, `blog_article_audit_log`). The site reads only Neon.
- **The `blog-archive` branch is an encrypted backup only.** It is never merged
  into `main`, contains no site code, and is never read by the site.
- Curriculum is different: its source of truth is Git. Do not mix the two.

## Security model (this repository is public)

The archive contains confidential material: unpublished drafts and revisions,
rejected text, approver and author identifiers (`approved_by`, `created_by`,
`actor_id` may be email addresses), and audit history. It contains no
passwords, tokens, payment data or member data. Those tables are not
exported, and the export lists its four tables explicitly.

Because anyone can read every branch of a public repository, and a branch
being orphaned or unmerged does **not** make it private:

- The archive is committed **only** as `blog-archive.enc`: the full export,
  gzipped and sealed with **AES-256-GCM** (authenticated encryption) under
  `BLOG_ARCHIVE_ENCRYPTION_KEY`. Without the key it is unreadable, and any
  alteration is detected on decryption.
- Plaintext exists only in the job's memory. The plaintext export mode refuses
  to write inside any Git checkout.
- The push step refuses to commit any file other than `blog-archive.enc`,
  `blog-archive.hmac`, `README.md` and `netlify.toml`.
- `blog-archive.hmac` is a keyed HMAC of the plaintext. It reveals nothing and
  lets the job skip a commit when nothing changed.
- Logs print row counts only, never content, identities or draft hashes.
- The workflow never runs with secrets on pull requests. The PR test job uses
  only a throwaway Postgres container.

**The key is the backup.** Keep an offline copy (password manager) in addition
to the GitHub secret. A lost key means every archive is unrecoverable. On key
rotation, keep the old key as long as you keep archives sealed with it.

## Layers of protection

1. **Neon point-in-time restore.** First choice for "undo the last hours".
   Confirm the restore window on the current Neon plan.
2. **Nightly encrypted archive** (`.github/workflows/blog-archive.yml`, 09:17 UTC).
   Every article, every revision, every approval (including revoked ones) and the
   full audit log, with a MANIFEST of row counts, a SHA-256 per table and a
   `content_sha256` per revision inside the encrypted bundle. The export runs in a
   READ ONLY transaction. The job then decrypts the bundle it just wrote and
   fails unless it matches the database exactly.
3. **Monthly restore drill.** Proves the archive can actually be restored.

## One-time setup (owner)

1. In Neon, create a read-only role on production with `GRANT SELECT` on the four
   blog tables only. Add its connection string as the GitHub secret
   `BLOG_ARCHIVE_DATABASE_URL`.
2. Generate the key: `openssl rand -base64 32`. Save it as the GitHub secret
   `BLOG_ARCHIVE_ENCRYPTION_KEY` **and** in your password manager.
3. Run **Actions → Blog Archive → Run workflow → mode: archive** once. The first
   run creates the `blog-archive` branch.
4. If branch protection applies to all branches, allow GitHub Actions to push to `blog-archive`.
5. Run the restore drill below, then fill in "Last successful restore drill".

Until steps 1-2 are done, the nightly job fails on purpose ("... is not set").
A backup job that silently does nothing would be worse.

## Monthly restore drill

1. In Neon, create a **new schema-only branch** from production (tables, no rows).
   Apply any blog migrations newer than the branch if needed.
2. In that branch only, run: `create table blog_restore_drill_target ();`
   This marker is required. **Never create it in production.**
3. Put that branch's connection string in the secret `BLOG_RESTORE_DATABASE_URL`.
4. **Actions → Blog Archive → Run workflow → mode: restore-drill**. In
   `confirm_target`, type the branch host (the `ep-...neon.tech` part of the URL).
5. The job passes only if every count, table hash and revision
   `content_sha256` matches the archive. Delete the Neon branch afterwards.

The restore stops before writing anything unless **all** of these hold:
- at least one production URL (`BLOG_ARCHIVE_DATABASE_URL` or
  `BLOG_PRODUCTION_DATABASE_URL`) is configured to compare against;
- the target is none of `BLOG_ARCHIVE_DATABASE_URL`, `BLOG_PRODUCTION_DATABASE_URL`,
  `DATABASE_URL`, `NETLIFY_DATABASE_URL` (Neon `-pooler` hostnames count as the
  same database);
- `--confirm-target` matches the target host exactly;
- the target has the `blog_restore_drill_target` marker table, so even an empty
  production database (for example before launch) is refused;
- every blog table in the target is empty;
- the bundle decrypts and authenticates, and its data matches its MANIFEST.

All writes run in one transaction, so a failure leaves the target empty.
Articles are inserted as drafts first, then their revision pointers and status
are set. The publication guard trigger therefore re-checks every
approved/scheduled/published article, and an archive missing the human approval
cannot bring back a published article.

A marketing-campaign link whose campaign does not exist in the target is
restored as empty and reported as a warning. Every other field must match.

## Compare production with the archive (read-only)

**Actions → Blog Archive → mode: verify-production.** Reports any difference
between production and the latest archive. Normal after new edits since the
last nightly run; unexpected deletions or changed old revisions are not.

## Real recovery (production data lost or damaged)

Human decision only; no agent may do this on its own authority.

1. Prefer Neon point-in-time restore into a new branch, then promote it.
2. If that is not possible, run the restore drill into a new empty branch,
   check the result, review the published articles, and only then switch the
   production connection to it (`DATABASE_URL` / `NETLIFY_DATABASE_URL` in Netlify).
3. Never restore into a database that still holds live data. The script refuses this by design.

## Local commands

```
# Tests (unit + real Postgres; needs psql and a scratch server)
BLOG_TEST_PG_URL=postgresql://postgres@127.0.0.1:5432/postgres node --test scripts/blog/tests/*.test.mjs

# Encrypted export (what the workflow runs)
BLOG_ARCHIVE_DATABASE_URL=... BLOG_ARCHIVE_ENCRYPTION_KEY=... node scripts/blog/export-archive.mjs --encrypt-to ./archive

# Compare a database with an archive (read-only; decrypts in memory)
BLOG_VERIFY_DATABASE_URL=... BLOG_ARCHIVE_ENCRYPTION_KEY=... node scripts/blog/restore-from-archive.mjs --archive ./archive --verify-only

# Restore drill
BLOG_RESTORE_DATABASE_URL=... BLOG_ARCHIVE_DATABASE_URL=... BLOG_ARCHIVE_ENCRYPTION_KEY=... \
  node scripts/blog/restore-from-archive.mjs --archive ./archive --confirm-target=<branch host>
```
