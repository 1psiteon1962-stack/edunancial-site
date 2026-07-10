# Data Lifecycle Policy

**Version:** 1.0  
**Last Updated:** 2026-07-10  
**Owner:** Data Governance Office, Edunancial

---

## 1. Lifecycle States

Every data entity has a `lifecycle_state` field that follows a defined state machine:

```
         ┌─────────────────────────────┐
         │          active             │◄──── restore ────┐
         └──┬──────────────────────────┘                  │
            │ archive          │ mark_pending_deletion     │
            │                  │                          │
         ┌──▼──────────────┐   │                          │
         │    archived      ├───┘                         │
         └──┬──────────────┘                              │
            │ restore / mark_pending_deletion              │
            │                                             │
         ┌──▼──────────────┐                              │
         │ pending_deletion │──── place_legal_hold ──►    │
         └──┬──────────────┘                              │
            │ delete                                      │
         ┌──▼──────────────┐                              │
         │    deleted       ├──────── restore ─────────►──┘
         └──┬──────────────┘
            │ purge
         ┌──▼──────────────┐
         │    purged        │  (terminal — no transitions)
         └─────────────────┘
            
         ┌─────────────────┐
         │  legal_hold      │──── release_legal_hold ──► active
         └─────────────────┘
```

**State Transitions:**

| From | Transition | To |
|------|-----------|-----|
| active | archive | archived |
| active | place_legal_hold | legal_hold |
| active | mark_pending_deletion | pending_deletion |
| archived | restore | active |
| archived | place_legal_hold | legal_hold |
| archived | mark_pending_deletion | pending_deletion |
| legal_hold | release_legal_hold | active |
| pending_deletion | delete | deleted |
| pending_deletion | place_legal_hold | legal_hold |
| deleted | purge | purged |
| deleted | restore | active |

---

## 2. Retention Policies

| Entity | Active Retention | Archive Retention | Deletion After Archive | GDPR | CCPA |
|--------|-----------------|-------------------|-----------------------|------|------|
| members | 10 years | 1 year | 90 days | ✓ | ✓ |
| payments | 7 years | 5 years | 180 days | ✓ | ✓ |
| audit_logs | 7 years | 10 years | Never | ✗ | ✗ |
| course_enrollments | 5 years | 1 year | 180 days | ✓ | ✓ |
| ai_interactions | 1 year (EU: 6 mo) | 6 months | 90 days | ✓ | ✓ |
| support_tickets | 3 years | 1 year | 90 days | ✓ | ✓ |
| calculator_sessions | 90 days | 30 days | 30 days | ✓ | ✓ |
| notifications | 6 months | 3 months | 90 days | ✓ | ✓ |

**Regional Overrides:**
- EU members: `members` active retention reduced to 7 years
- EU members: `ai_interactions` active retention reduced to 6 months

---

## 3. Data Creation

Rules at data creation time:

1. **Classification required** — `data_classification` must be set before insert.
2. **Lifecycle state** — all entities start as `active`.
3. **Consent captured** — PII entities for EU members must record `gdprConsent = true` and `gdprConsentAt`.
4. **Audit log** — all `CREATE` operations on CONFIDENTIAL/RESTRICTED entities must emit an audit log entry.
5. **Data version** — all versioned entities start at `data_version = 1`.

---

## 4. Data Updates

1. `data_version` auto-increments on every UPDATE via database trigger.
2. `updated_at` auto-refreshes on every UPDATE via database trigger.
3. Schema-breaking changes require a new data catalog `schema_version`.
4. Updates to PII fields on CONFIDENTIAL/RESTRICTED entities must be audit-logged with `entity_version_before` and `entity_version_after`.

---

## 5. Archiving

Records are transitioned from `active` to `archived` by the lifecycle management job when:
- The `active_retention_days` period has elapsed since `created_at`.
- The record has `lifecycle_state = 'active'` and is not under legal hold.

Archived records are moved to cold storage and excluded from operational queries by default.

---

## 6. Legal Hold

When a legal hold is placed on an entity:
1. The entity's `lifecycle_state` is set to `legal_hold`.
2. The entity cannot be deleted or purged while the hold is active.
3. Legal holds are recorded in `public.legal_holds` with `legal_case_ref` and `placed_by`.
4. Only users with the `super_admin` role can place or release legal holds.
5. Legal hold release requires dual authorization (two `super_admin` approvals).

---

## 7. Deletion & Purge

**Soft Deletion:**
- `lifecycle_state` transitions to `deleted`.
- The record remains in the database but is excluded from all operational queries.
- A `deleted_at` timestamp is recorded where the schema supports it.

**Purge:**
- Purged records are permanently removed from the database.
- Before purge, a snapshot is written to `public.archive_log` with the full entity state.
- Purge is irreversible. Once `purged`, no restore is possible.
- Purge is only allowed after the entity has been in `deleted` state for the configured `deletion_after_archive_days`.

---

## 8. GDPR Right to Erasure

When a valid erasure request is received:

1. Check `canProcessErasure()` — rejects if under legal hold or entity is not GDPR-applicable.
2. All PII fields are replaced with anonymized placeholders.
3. Non-PII aggregate data (used in analytics) is retained in anonymized form.
4. The erasure event is recorded in `audit_logs` with the request reference.
5. Completion is reported to the member within 30 days per GDPR Article 17.

Entities that are **never erased** (legal obligation basis):
- `audit_logs` — `gdprApplies = false`
- `payments` — minimum 7-year financial record retention

---

## 9. Backup & Recovery

### Backup Schedule

| Type | Schedule | Retention | Storage Class |
|------|---------|-----------|---------------|
| Full | Weekly (Sunday 02:00 UTC) | 90 days | Cold |
| Incremental | Daily Mon–Sat 02:00 UTC | 30 days | Warm |
| Differential | Every 4 hours | 7 days | Hot |

All backups are AES-256 encrypted. Encryption keys are stored in the Secrets Manager, separate from backup storage.

### Recovery Objectives

| Entity Domain | RTO | RPO | Tier |
|--------------|-----|-----|------|
| Payments | 1 hour | 15 min | Tier 1 |
| Members | 2 hours | 30 min | Tier 1 |
| Audit Logs | 4 hours | 1 hour | Tier 2 |
| Courses | 8 hours | 4 hours | Tier 2 |
| AI Interactions | 24 hours | 12 hours | Tier 3 |

### Backup Verification

Each backup completion is recorded in `public.backup_registry`. A weekly automated recovery test verifies:
- Backup integrity (checksum validation)
- Restore completeness (random record sampling)
- Encryption/decryption success
