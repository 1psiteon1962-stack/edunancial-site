# Data Governance Policies

**Version:** 1.0  
**Last Updated:** 2026-07-10  
**Owner:** Data Governance Office, Edunancial

---

## 1. Data Ownership

Every data entity in the Edunancial platform must have:

- **Owner Team** — accountable for data quality and appropriate use
- **Owner Email** — point of contact for data-related decisions
- **Data Steward** — responsible for privacy and compliance (may be same as owner)

| Entity | Owner Team | Data Steward |
|--------|-----------|-------------|
| members | platform | privacy@edunancial.com |
| payments | finance | compliance@edunancial.com |
| audit_logs | security | security@edunancial.com |
| ai_interactions | ai | privacy@edunancial.com |
| courses | content | content@edunancial.com |
| support_tickets | support | support-ops@edunancial.com |
| calculator_sessions | product | privacy@edunancial.com |

---

## 2. Data Classification

All data must be classified at ingestion time. Classification drives handling requirements.

| Level | Label | Handling |
|-------|-------|---------|
| 1 | PUBLIC | No restrictions; searchable |
| 2 | INTERNAL | Authenticated staff only |
| 3 | CONFIDENTIAL | Need-to-know; encrypted; access logged |
| 4 | RESTRICTED | Field-level encryption; MFA required; no bulk export |
| 5 | TOP SECRET | Executive only; dual authorization |

Classification is stored on every entity record in the `data_classification` field.

---

## 3. Data Catalog

The data catalog (`public.data_catalog`) documents all data entities including:

- Business-friendly name and description
- Owner and steward
- Classification and PII designation
- Source and downstream systems
- Retention duration
- Schema version

**Catalog Governance Rules:**
1. No new entity type may go to production without a catalog entry.
2. Catalog entries must be reviewed and approved by the Data Governance Office.
3. Schema changes must increment the `schema_version` field.
4. All PII fields must be listed in `pii_fields`.

---

## 4. Data Quality Rules

Data quality is enforced via the `DATA_QUALITY_RULES` registry in `src/lib/data-platform/governance/data-governance.ts`.

### Rule Types

| Type | Description |
|------|-------------|
| `not_null` | Required field must be present |
| `unique` | Value must be globally unique |
| `format` | Value must match a pattern (e.g., email) |
| `range` | Numeric value must be within bounds |
| `referential` | Foreign key must exist |
| `custom` | Business logic validation |

### Severity Levels

| Severity | Action |
|----------|--------|
| `info` | Log only |
| `warning` | Log and alert data owner |
| `error` | Reject write; notify data steward |
| `critical` | Reject write; page on-call; open incident |

### Quality Monitoring

Violations are recorded in `public.data_quality_violations`. A daily job scans all open violations and escalates unresolved critical violations after 24 hours.

---

## 5. Data Lineage

The lineage graph (`LINEAGE_GRAPH` in the governance module) documents all data flows between entities. Lineage must be updated whenever:

- A new ETL pipeline is introduced
- A new downstream consumer is added
- A transformation is added or modified

Lineage entries include:
- Source entity and optional field
- Target entity and optional field
- Transformation description
- Pipeline name and version

---

## 6. Master Data Management

The Master Data Management (MDM) system maintains the canonical reference values for all controlled vocabularies:

| Domain | Description |
|--------|-------------|
| `country` | ISO 3166-1 country codes |
| `currency` | ISO 4217 currency codes |
| `language` | BCP 47 language tags |
| `region` | Edunancial region codes |
| `membership_tier` | Product tier definitions |
| `course_category` | Content taxonomy |
| `payment_provider` | Gateway identifiers |

**MDM Governance Rules:**
1. New MDM values must be approved by the domain owner team.
2. Values may never be hard-deleted; use `is_active = false` to deactivate.
3. Regional labels (`regional_labels`) must be provided for all active values.
4. All application code must validate against MDM before writing controlled fields.

---

## 7. Schema Versioning

All versioned entities include a `data_version` integer field that is auto-incremented on every `UPDATE` via database trigger. This enables:

- Optimistic concurrency control
- Change detection in ETL pipelines
- Conflict resolution in multi-region scenarios

The `schema_version` in the data catalog tracks the overall schema design version and must be updated with any breaking change.

---

## 8. Metadata Standards

All entities include a `metadata` JSONB field for flexible, non-schema-breaking extensions. Governance rules for `metadata`:

- Do not store PII in `metadata` unless the field is tagged in the sensitive field registry.
- Do not use `metadata` to bypass data classification requirements.
- `metadata` fields used in production must be documented in the data catalog entry.
- `metadata` is subject to the same retention and classification as the parent entity.
