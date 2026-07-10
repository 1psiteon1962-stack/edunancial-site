# AI Data Architecture

**Version:** 1.0  
**Last Updated:** 2026-07-10  
**Owner:** AI Platform Engineering, Edunancial

---

## Overview

The Edunancial AI Data Layer provides privacy-first, governed interfaces between the operational data store and AI/ML services. No raw PII ever enters an AI model. All AI services operate on pseudonymized or anonymized inputs.

---

## AI Service Registry

| Service | Purpose | PII Access | Legal Basis |
|---------|---------|-----------|-------------|
| Recommendation Engine | Course recommendations | None | Legitimate interest |
| Learning Analytics | Engagement & outcome analysis | None | Legitimate interest |
| Predictive Models | Churn, LTV, completion probability | None | Legitimate interest |
| AI Tutor | Conversational course assistance | None (redacted) | Contract |
| Personalization Engine | Content & notification personalization | None | Legitimate interest |
| NLP Search | Semantic course/content search | None (redacted) | Legitimate interest |
| Content Moderation | UGC and ticket moderation | None (redacted) | Legal obligation |

---

## Privacy-Safe Inference Pipeline

```
Member Action
     │
     ▼
Operational DB (raw data, PII present)
     │
     ▼
AI Input Preparation Layer
  ┌──────────────────────────────────┐
  │  1. Identify PII fields          │
  │  2. Apply service PII handling   │
  │     - redact_before_inference    │
  │     - pseudonymize               │
  │     - none (public fields only)  │
  │  3. Hash sensitive identifiers   │
  │  4. Validate input schema        │
  └──────────────────────────────────┘
     │
     ▼
AI Model Inference (no raw PII)
     │
     ▼
AI Interaction Record (hashes only, no raw input)
     │
     ▼
Audit Log (interaction type, tokens, latency, feedback)
```

---

## AI Interaction Storage

AI interactions are stored in `public.ai_interactions` with the following privacy controls:

- **No raw prompts stored** — only `input_hash` (SHA-256 of normalized input)
- **No raw outputs stored** — only `output_hash`
- **PII detection flag** — `pii_detected` set if PII was found in input
- **PII redaction flag** — `pii_redacted` must be `true` if `pii_detected` is `true`
- **Data quality rule** — writing `pii_detected = true, pii_redacted = false` is a **CRITICAL** violation

---

## AI Training Datasets

Training datasets are managed through the `ai_dataset_registry`. No dataset may be used for training without:

1. Formal entry in the registry
2. Privacy compliance certification (`privacy_compliant = true`)
3. Anonymization confirmation (`anonymized = true`) with method documented
4. Approval by Data Governance Office (`approved_by`, `approved_at`)

### Approved Datasets

| Dataset | Purpose | Anonymization | Approval |
|---------|---------|---------------|---------|
| `course-recommendation-v1` | Collaborative filtering | Pseudonymization | Required |
| `learning-outcome-prediction-v1` | Completion prediction | Pseudonymization | Required |
| `financial-calculator-patterns-v1` | Personalization | Generalization | Required |
| `support-nlp-corpus-v1` | NLP model training | Suppression | Required |

---

## Member Feature Vectors

For ML models requiring member-level features, a `MemberFeatureVector` is constructed from:

- Pseudonymized member ID (not the real UUID)
- Aggregate behavioral signals (no raw events)
- Membership tier (no PII)
- Regional context (no geo-location)

Feature vectors are validated before use and stored in the AI feature store (Parquet format) for offline training.

---

## Rate Limiting

All AI services have rate limits to prevent abuse and manage costs:

| Service | Requests/Min | Requests/Day |
|---------|-------------|-------------|
| Recommendation Engine | 60 | 5,000 |
| Learning Analytics | 30 | 1,000 |
| Predictive Models | 20 | 500 |
| AI Tutor | 10 | 200 |
| Personalization Engine | 120 | 10,000 |
| NLP Search | 100 | 20,000 |
| Content Moderation | 200 | 50,000 |

---

## Regional Enablement

AI services are enabled per region. Services requiring higher privacy scrutiny may not be enabled in all regions until compliance review is complete.

| Service | NA | EU | LA | CARIB | APAC | MENA | SSA |
|---------|----|----|----|----|------|------|-----|
| Recommendation Engine | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Learning Analytics | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Predictive Models | ✓ | ✓ | ✓ | — | — | — | — |
| AI Tutor | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Personalization Engine | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| NLP Search | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Content Moderation | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Future ML Expansion

The AI Data Layer is designed to accommodate:

1. **LLM Fine-tuning** — Support NLP corpus datasets already prepared
2. **Real-time personalization** — Streaming feature updates via `warehouse_events`
3. **Federated learning** — Regional model training without cross-border data transfer
4. **Explainability layer** — Model decision audit log (future `ai_model_decisions` table)
5. **A/B testing** — Model variant experiments tracked in `ai_interactions.metadata`
6. **Multi-modal models** — Video/audio content analysis (field stubs ready in `lessons`)
