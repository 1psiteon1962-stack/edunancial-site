# Enterprise Data Architecture

**Version:** 1.0  
**Last Updated:** 2026-07-10  
**Owner:** Platform Engineering, Edunancial

---

## Overview

The Edunancial Enterprise Data Platform provides the unified data foundation for all services across the platform. It is designed to support millions of members, multi-region deployments, regulatory compliance (GDPR, CCPA, PIPEDA), and AI readiness.

---

## Architecture Principles

| Principle | Description |
|-----------|-------------|
| **Data as a Product** | Every dataset has an owner, classification, quality rules, and retention policy |
| **Privacy by Design** | PII protection, consent management, and minimal data collection built into every layer |
| **Zero Trust** | No implicit trust — all access requires authentication, authorization, and audit logging |
| **Immutable Audit Trail** | Security and compliance events are written once and never modified |
| **AI Readiness** | Data is structured, tagged, and anonymization-ready for ML pipelines |
| **Multi-Region** | Regional data sovereignty enforced through lifecycle policies and storage partitioning |
| **Modular** | Each layer (governance, lifecycle, warehouse, AI, security) is independently deployable |

---

## Platform Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                            │
│   Web · Mobile · API · AI Tutor · Calculator · Support              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                     DATA ACCESS LAYER                               │
│   Service APIs · GraphQL · REST · Event Bus                         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                     OPERATIONAL DATA STORE                          │
│   Supabase / PostgreSQL · Row Level Security · Encryption at Rest   │
│   Members · Memberships · Courses · Payments · Support · AI         │
└──────────┬──────────────────────────────────────────┬───────────────┘
           │                                          │
┌──────────▼──────────┐                   ┌──────────▼────────────────┐
│  DATA GOVERNANCE    │                   │   DATA LIFECYCLE MGMT     │
│  Catalog · Lineage  │                   │   Retention · Archive     │
│  Quality · MDM      │                   │   Legal Hold · GDPR       │
│  Ownership          │                   │   Backup · Recovery       │
└─────────────────────┘                   └───────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                  ENTERPRISE DATA WAREHOUSE                          │
│   Warehouse Events · ETL Pipelines · Analytics Aggregates           │
│   BI Reports · Historical Data · Data Lake Export (Parquet)         │
└──────────┬──────────────────────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────────────────────┐
│                       AI DATA LAYER                                 │
│   Feature Store · Training Datasets · Recommendation Engine         │
│   Learning Analytics · Predictive Models · AI Tutor · NLP Search    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Entity Relationship Overview

### Core Entities

| Entity | Classification | Owner | PII | Retention |
|--------|---------------|-------|-----|-----------|
| `members` | CONFIDENTIAL | Platform | Yes | 10 years |
| `memberships` | CONFIDENTIAL | Product | No | 10 years |
| `courses` | PUBLIC | Content | No | 5 years |
| `lessons` | PUBLIC | Content | No | 5 years |
| `course_enrollments` | CONFIDENTIAL | Platform | No | 5 years |
| `lesson_progress` | CONFIDENTIAL | Platform | No | 5 years |
| `certificates` | CONFIDENTIAL | Platform | No | 10 years |
| `calculator_sessions` | CONFIDENTIAL | Product | Yes | 90 days |
| `payments` | RESTRICTED | Finance | Yes | 7 years |
| `payment_methods` | RESTRICTED | Finance | Yes | Lifetime of member |
| `support_tickets` | CONFIDENTIAL | Support | Yes | 3 years |
| `blog_articles` | PUBLIC | Content | No | 5 years |
| `notifications` | CONFIDENTIAL | Platform | No | 6 months |
| `admin_users` | CONFIDENTIAL | Security | Yes | Lifetime |
| `audit_logs` | RESTRICTED | Security | Partial | 7 years |
| `ai_interactions` | CONFIDENTIAL | AI | No | 1 year |

---

## Multi-Region Strategy

| Region | Code | Primary Regulations | Data Residency |
|--------|------|---------------------|----------------|
| North America | NA | CCPA, PIPEDA | US East + Canada |
| Latin America | LA | LGPD, local laws | Brazil + Mexico |
| Caribbean | CARIB | Local DPAs | Trinidad + Jamaica |
| Europe | EU | GDPR | EU regions only |
| Asia-Pacific | APAC | PDPA, APPs | Singapore + Australia |
| Middle East & Africa | MENA | Local laws | UAE |
| Sub-Saharan Africa | SSA | POPIA, local | South Africa |

---

## Technical Stack

| Component | Technology |
|-----------|-----------|
| Operational DB | PostgreSQL 15 (via Supabase) |
| Row-Level Security | Supabase RLS policies |
| Encryption at Rest | AES-256-GCM |
| In-Transit Encryption | TLS 1.3 |
| Event Bus | Supabase Realtime + webhook pipelines |
| Warehouse Staging | `warehouse_events` table → batch ETL |
| Analytics Aggregates | Scheduled SQL aggregation jobs |
| ML Feature Store | `ai_dataset_registry` + Parquet exports |
| Audit Log Storage | Append-only PostgreSQL table + archival |
| Backup Storage | AES-256 encrypted cloud storage |
