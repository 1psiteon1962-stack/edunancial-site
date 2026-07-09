# Operational Runbooks

## On-Call Quick Reference

| Situation | Runbook | Dashboard |
|---|---|---|
| Service unreachable | RB-001, RB-002 | `/admin/infrastructure` |
| High error rate | Check API monitoring | `/admin/monitoring` |
| Backup failure | Review backup status | `/admin/backups` |
| Security alert | Check security logs | `/admin/logs` |
| Database issue | RB-001 | `/admin/monitoring` |
| Alert firing | Check alert details | `/admin/alerts` |

## Common Operational Tasks

### Investigate a Firing Alert

1. Open `/admin/alerts` — find the firing alert
2. Note the `service` and `message`
3. Open `/admin/monitoring` — check that service's metrics
4. Open `/admin/logs` — filter by `service` and `severity: error`
5. Check the correlation ID in logs to trace the request chain
6. Escalate via the appropriate channel per alert severity

### Acknowledge and Silence an Alert

Via API (when implemented):
```bash
curl -X POST /api/alerting/alerts/{alertId}/acknowledge \
  -H "Authorization: ******" \
  -d '{"acknowledgedBy": "ops@edunancial.com"}'
```

Currently: Update `alert.status` in your alerting provider, or configure a silence window in `DEFAULT_ALERT_RULES[].silenceWindowSeconds`.

### Check System Health

```bash
# Quick health check
curl https://edunancial.com/api/health

# Infrastructure snapshot
curl https://edunancial.com/api/monitoring/metrics | jq .data.overallStatus

# Recent errors
curl "https://edunancial.com/api/monitoring/logs?severity=error&limit=10"
```

### Trigger a Manual Backup

Implement in your backup provider's API and expose via an admin action endpoint. Reference `BackupProvider.store()` in `src/lib/backup/providers.ts`.

### Initiate Failover

1. Confirm primary region is unhealthy (check `/api/health` from multiple locations)
2. Notify incident commander and escalate per `FAILOVER_CONFIG.notifyOnFailover`
3. If `automaticFailoverEnabled: false`, manually:
   - Update DNS to point to failover region
   - Update `DATABASE_URL` and other env vars in failover region
   - Start services in failover region
   - Verify health via `/api/health`
4. Update status page
5. Open incident record and begin runbook

### Scale a Service

When CPU/memory alerts are firing before auto-scaling is configured:

```bash
# Kubernetes (when deployed)
kubectl scale deployment api-gateway --replicas=5

# Or via your cloud provider console:
# AWS: ECS → Service → Update → Desired count
# GCP: Cloud Run → Edit & Deploy → Min/Max instances
```

Current scaling thresholds: `targetCpuPercent: 70`, `targetMemoryPercent: 80` (see `src/lib/ha/index.ts` → `SCALING_POLICY`).

### Zero-Downtime Deployment Checklist

Before deploying to production, verify all items in `ZERO_DOWNTIME_CHECKLIST` (`src/lib/ha/index.ts`):

- [ ] Database migrations are backwards-compatible
- [ ] New code handles both old and new data formats
- [ ] Feature flags wrap significant behavior changes
- [ ] Health check endpoint responds before traffic is routed
- [ ] Graceful shutdown handler (`SIGTERM`) is in place
- [ ] Session state stored externally
- [ ] Rollback procedure documented and tested
- [ ] Deployment monitored for 10 minutes after completion

## Escalation Contacts

Configure escalation contacts in your incident management tool (PagerDuty, OpsGenie).
Reference roles defined in runbooks: `on-call-engineer`, `engineering-lead`, `cto`, `executive-team`.

## Alert Thresholds (Quick Reference)

| Alert | Threshold | Source File |
|---|---|---|
| CPU exhaustion | > 90% for 5 min | `src/lib/alerting/rules.ts` ar-006 |
| Memory exhaustion | > 90% for 5 min | ar-007 |
| Disk space | > 85% | ar-008 |
| High API latency | P99 > 1000ms for 5 min | ar-010 |
| High error rate | > 5% for 2 min | ar-002 |
| Service down | 1+ failure for 1 min | ar-001 |
| Database failure | 1+ failure for 30s | ar-009 |
| Auth anomaly | > 20 failures in 5 min | ar-004 |
| Backup failure | Any failure | ar-003 |

Customize thresholds by editing the rule in `src/lib/alerting/rules.ts`.
