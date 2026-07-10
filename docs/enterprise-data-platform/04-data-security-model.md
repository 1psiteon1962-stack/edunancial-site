# Data Security Model

**Version:** 1.0  
**Last Updated:** 2026-07-10  
**Owner:** Security Engineering, Edunancial

---

## 1. Encryption Standards

### At-Rest Encryption

| Scope | Algorithm | Key Length | Key Rotation |
|-------|-----------|-----------|-------------|
| Database (full) | AES-256-GCM | 256-bit | 90 days |
| PII fields (field-level) | AES-256-GCM | 256-bit | 30 days |
| Payment data (field-level) | AES-256-GCM | 256-bit | 30 days |
| Backups | AES-256-CBC | 256-bit | 90 days |

### In-Transit Encryption

- All external API traffic: TLS 1.3 minimum
- Internal service-to-service: mTLS
- API transport cipher: ChaCha20-Poly1305 (preferred) or AES-256-GCM
- No TLS 1.0 or 1.1 permitted

### Key Management

- All encryption keys stored in a Secrets Manager (HSM-backed where available)
- Keys are never logged, exported, or included in application code
- Key rotation is automated and triggers re-encryption within the scheduled maintenance window
- Key access is logged in the security audit trail

---

## 2. Access Control

### Role-Based Access Control (RBAC)

| Role | Max Classification | MFA Required | Region Scope |
|------|--------------------|-------------|-------------|
| super_admin | TOP SECRET | Yes | Global |
| admin | CONFIDENTIAL | Yes | Assigned |
| analyst | INTERNAL | No | Assigned |
| support | CONFIDENTIAL | No | Assigned |
| content_manager | INTERNAL | No | Global |
| ai_engineer | INTERNAL | Yes | Global |

### Zero Trust Principles

1. **Verify Explicitly** — every request requires valid authentication + authorization
2. **Least Privilege** — roles grant minimum permissions needed
3. **Assume Breach** — all access is logged; anomaly detection is active
4. **MFA for Sensitive Roles** — `super_admin` and `admin` require MFA at login

### Supabase Row-Level Security (RLS)

All operational tables have RLS policies enforcing:
- Members can only read/write their own records
- Admins are constrained to their assigned `region_scope`
- Service role key (bypasses RLS) is restricted to backend service accounts only

---

## 3. Audit Logging

The `public.audit_logs` table is append-only and enforced at the database level via rules:

```sql
create rule no_update_audit_logs as
  on update to public.audit_logs do instead nothing;

create rule no_delete_audit_logs as
  on delete to public.audit_logs do instead nothing;
```

### What Is Logged

| Event Category | Examples | Risk Level |
|---------------|---------|-----------|
| Authentication | login, logout, failed login | medium–high |
| Data access | read of RESTRICTED records | medium |
| Data mutation | create, update, delete | low–high |
| Permission changes | role grant/revoke | high |
| Data export | bulk export, download | high |
| Config changes | platform settings | high |
| Access denied | authorization failures | high–critical |
| Security events | lockout, MFA failure | critical |

### Audit Log Retention

Audit logs are retained for **7 years** (active) + **10 years** (archive). GDPR right-to-erasure does **not** apply to audit logs (legal obligation basis).

---

## 4. Data Classification & Tagging

All entities carry a `data_classification` field. Application code must:

1. Check classification before serving data to a consumer.
2. Apply masking for CONFIDENTIAL/RESTRICTED fields when served outside the owning service.
3. Log access to RESTRICTED and above.
4. Require approval for bulk export of CONFIDENTIAL and above.

### Sensitive Field Registry

All PII and sensitive fields are registered in `SENSITIVE_FIELD_REGISTRY` with:
- `tags` — e.g., `pii`, `pci`, `financial`, `gdpr_subject`
- `maskPattern` — how to mask the value in logs/exports
- `notes` — handling guidance

Fields tagged `pci` must never be stored as raw values. Only gateway tokens and last-four digits are stored.

---

## 5. Secure Export Architecture

Export requests require:
1. Minimum role check
2. Format whitelist check (not all formats are allowed for all entity types)
3. Approval workflow for CONFIDENTIAL+ entities
4. Audit log entry for every export
5. PII masking applied where `maskPiiOnExport = true`

### Export Policy Summary

| Entity | Min Role | Approval Required | PII Masked | Max Records |
|--------|---------|-------------------|-----------|-------------|
| members | admin | Yes | Yes | 10,000 |
| payments | super_admin | Yes | Yes | 5,000 |
| audit_logs | super_admin | Yes | No | 50,000 |
| analytics aggregates | analyst | No | No | Unlimited |
| ai_interactions | ai_engineer | Yes | Yes | 100,000 |

---

## 6. Privacy Compliance Integration

### GDPR (EU)

- Consent collected at registration with version tracking
- Data subject rights supported: access, rectification, erasure, restriction, portability, objection
- Response deadline: 30 days (enforced in `PrivacyRequest.dueBy`)
- DPO appointed
- Data breach notification capability in place (72-hour GDPR clock)
- SCCs in place for cross-border transfers

### CCPA (California / North America)

- Opt-out of sale mechanism
- Right to know, right to delete
- Non-discrimination policy
- Privacy notice in place

### PIPEDA (Canada)

- Consent, limiting use, accuracy, individual access, challenging compliance controls

---

## 7. Security Headers

All Edunancial web responses include:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | nonce-based CSP with self-only defaults |
| `Cross-Origin-Embedder-Policy` | `require-corp` |
| `Cross-Origin-Opener-Policy` | `same-origin` |

---

## 8. Vulnerability Management

- Dependency scanning on every CI build
- CodeQL static analysis on every PR
- Penetration testing annually (third-party)
- Security incident response plan with defined escalation paths
- Zero-day patch SLA: Critical — 24 hours; High — 7 days
