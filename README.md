# Edunancial curriculum archive (encrypted backup)

curriculum-archive.enc is an AES-256-GCM encrypted export of durable curriculum storage
(published lessons, translation packages, receipts, export manifests, upload checksums).
It is unreadable without the archive key. Never commit plaintext here.
Restore drill: node scripts/curriculum/archive/archive-cli.mjs restore-drill --archive <dir> --to <empty dir>
