# Scalability & Future Strategy

**Version:** 1.0  
**Last Updated:** 2026-07-10  
**Owner:** Platform Architecture, Edunancial

---

## Current Scale Targets

| Metric | Target | Design Maximum |
|--------|--------|----------------|
| Active Members | 1,000,000 | 10,000,000 |
| Concurrent Users | 50,000 | 500,000 |
| Daily Transactions | 100,000 | 5,000,000 |
| Course Catalog Size | 10,000 | 500,000 |
| Daily Warehouse Events | 10,000,000 | 1,000,000,000 |
| AI Requests / Day | 500,000 | 50,000,000 |

---

## Database Scalability

### Current: Supabase / PostgreSQL

- Horizontal read scaling via read replicas
- Connection pooling via PgBouncer
- Table partitioning for high-volume tables (`audit_logs`, `warehouse_events`, `ai_interactions`)

### Future: Distributed Architecture

As data volumes grow, the following migrations are pre-planned:

| Table | Scaling Strategy | Trigger Threshold |
|-------|-----------------|-------------------|
| `audit_logs` | Time-based partitioning (monthly) | > 100M rows |
| `warehouse_events` | Migrate to Apache Kafka + object storage | > 10B events/day |
| `ai_interactions` | Move to columnar store (ClickHouse/BigQuery) | > 500M rows |
| `analytics_*` | Materialize into dedicated data warehouse | > 1B aggregate rows |
| `members` | Sharding by `region` | > 50M members |

---

## Multi-Region Deployment

The data model is pre-designed for multi-region with:

- `region` field on all major entities
- `region_code` enum covering all target markets
- Per-region retention overrides in `retention_policies`
- Regional compliance status tracked in `PRIVACY_COMPLIANCE`

### Phase 1 — North America + Caribbean (current)

Single Supabase project. Regional tags used for analytics segmentation only.

### Phase 2 — Latin America + Europe

- Separate Supabase projects per legal jurisdiction
- Cross-region data replication for analytics (anonymized only)
- GDPR-compliant EU data residency enforced

### Phase 3 — Global

- Federated database architecture
- Global analytics layer (anonymized aggregates only)
- Regional AI model instances for data sovereignty compliance

---

## Data Lake Compatibility

The `warehouse_events` table and analytics aggregates are designed for future data lake ingestion:

- JSON/JSONB `payload` fields map cleanly to semi-structured lake schemas
- `is_processed` flag enables reliable batch extraction
- Analytics aggregate tables export directly to Parquet
- `ai_dataset_registry` already tracks Parquet exports

**Future Data Lake Stack (planned):**

```
Warehouse Events → Apache Kafka → Apache Spark/Flink
                                       │
                               Apache Iceberg (data lake)
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
              BI (Metabase)    AI Training          Compliance
              Superset         (MLflow)             (custom)
```

---

## AI Expansion Roadmap

| Phase | Capability | Data Requirements |
|-------|-----------|------------------|
| Current | Recommendations, basic personalization | Course + enrollment data |
| Phase 2 | AI Tutor (full), Learning analytics | Progress + interaction data |
| Phase 3 | Predictive churn, LTV models | 12+ months of behavioral data |
| Phase 4 | Federated learning (multi-region) | Regional feature stores |
| Phase 5 | Fine-tuned LLMs for financial education | NLP corpus (anonymized) |
| Phase 6 | Real-time adaptive learning | Streaming events + edge inference |

---

## Performance Optimization

### Index Strategy

- All foreign keys are indexed.
- Composite indexes support common query patterns (e.g., `(member_id, status)`, `(region, created_at)`).
- Partial indexes for filtered queries (e.g., unprocessed warehouse events).
- Covering indexes for analytics read-heavy tables.

### Caching

| Layer | Cache | TTL |
|-------|-------|-----|
| Course metadata | Redis / CDN | 1 hour |
| Member profile | Application cache | 5 minutes |
| Analytics aggregates | Redis | 1 hour |
| MDM values | Application memory | 24 hours |
| AI recommendations | Redis | 15 minutes |

### Query Optimization

- All high-frequency reports use pre-aggregated `analytics_*` tables — no real-time aggregation on `members` or `payments`.
- Warehouse ETL runs in off-peak hours (01:00–04:00 UTC).
- AI training dataset exports are scheduled weekly on Sundays.

---

## Monitoring & Observability

| Signal | Tool | Alert Threshold |
|--------|------|----------------|
| Query performance | pg_stat_statements | P99 > 500ms |
| Replication lag | pg_stat_replication | > 30 seconds |
| Warehouse pipeline failures | Custom alerting | Any failure |
| Data quality violations | data_quality_violations table | Critical within 1 hour |
| Backup completion | backup_registry | > 2 hours late |
| AI rate limit breaches | Application metrics | > 80% of limit |
| Audit log gaps | Log integrity check | Any gap |
