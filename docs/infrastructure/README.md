# Infrastructure Platform — README

This directory contains the technical documentation for the Edunancial infrastructure management, monitoring, observability, backup, and disaster recovery platform.

## Quick Links

| Document | Description |
|---|---|
| [architecture.md](./architecture.md) | System architecture and component overview |
| [monitoring.md](./monitoring.md) | Monitoring, observability, and integration guide |
| [logging.md](./logging.md) | Centralized logging standards and schema |
| [backup-strategy.md](./backup-strategy.md) | Backup automation and recovery procedures |
| [disaster-recovery.md](./disaster-recovery.md) | DR framework, RTO/RPO, and runbooks |
| [runbooks.md](./runbooks.md) | Operational runbooks and incident response |

## Platform Components

### Source Locations

```
src/
├── lib/
│   ├── monitoring/          # Metrics types, provider interface, demo adapter
│   ├── logging/             # Structured logger, transports, demo log generator
│   ├── backup/              # Backup types, provider interface, demo provider
│   ├── disaster-recovery/   # DR types, RTO/RPO config, runbooks, checklists
│   ├── alerting/            # Alert rules, notification channels, routing
│   └── ha/                  # High-availability config, deployment readiness
│
├── components/
│   └── monitoring/          # Shared UI: StatusBadge, MetricCard, etc.
│
└── app/
    ├── api/
    │   ├── health/          # GET /api/health — standard health check endpoint
    │   ├── monitoring/
    │   │   ├── metrics/     # GET /api/monitoring/metrics
    │   │   └── logs/        # GET /api/monitoring/logs
    │   └── backups/
    │       └── status/      # GET /api/backups/status
    └── admin/
        ├── infrastructure/  # Operational dashboard
        ├── monitoring/      # Application monitoring & observability
        ├── logs/            # Log viewer
        ├── backups/         # Backup management
        ├── disaster-recovery/ # DR dashboard + runbooks
        └── alerts/          # Alert rules & notifications
```

## Admin Dashboards

All dashboards are accessible under `/admin/`:

- **`/admin/infrastructure`** — Real-time operational overview (CPU, memory, disk, services, jobs)
- **`/admin/monitoring`** — API latency, database metrics, queue health, observability events
- **`/admin/logs`** — Structured log viewer with category/severity filtering
- **`/admin/backups`** — Backup schedule status, records, verification, and PITR docs
- **`/admin/disaster-recovery`** — RTO/RPO targets, runbooks, failover config, recovery checklist
- **`/admin/alerts`** — Firing alerts, rules configuration, and notification channels

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/health` | Load balancer / orchestrator health check |
| `GET /api/monitoring/metrics` | Infrastructure snapshot (JSON) |
| `GET /api/monitoring/logs` | Filtered log entries (JSON, query params: `severity`, `category`, `service`, `search`, `limit`, `offset`) |
| `GET /api/backups/status` | Backup dashboard summary |

## Integrating Production Providers

The platform uses a provider/adapter pattern. All demo adapters are safe placeholders. Replace them by implementing the relevant interface:

| Interface | File | Purpose |
|---|---|---|
| `MetricsProvider` | `src/lib/monitoring/types.ts` | Real-time infrastructure metrics (Datadog, New Relic, Prometheus) |
| `LogTransport` | `src/lib/logging/types.ts` | Log storage/query (OpenSearch, Datadog, Sumo Logic) |
| `BackupProvider` | `src/lib/backup/types.ts` | Backup storage (S3, GCS, Azure Blob) |
| `NotificationChannel` | `src/lib/alerting/types.ts` | Alert notifications (Slack, email, PagerDuty, SMS) |

## Getting Started

```bash
# Development server
npm run dev

# Health check
curl http://localhost:3000/api/health

# Metrics snapshot
curl http://localhost:3000/api/monitoring/metrics

# Log query
curl "http://localhost:3000/api/monitoring/logs?severity=error&limit=20"
```
