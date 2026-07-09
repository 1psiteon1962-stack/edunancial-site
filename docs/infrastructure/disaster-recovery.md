# Disaster Recovery Framework

## Recovery Objectives

All RTO/RPO targets are configured in `src/lib/disaster-recovery/config.ts` → `DR_OBJECTIVES`. Adjust values to match your actual SLAs.

| Service | Tier | RTO (max downtime) | RPO (max data loss) |
|---|---|---|---|
| payment-service | critical | 5 min | 1 min |
| auth-service | critical | 10 min | 5 min |
| primary-database | critical | 10 min | 5 min |
| api-gateway | high | 15 min | 0 |
| web-frontend | high | 30 min | 0 |
| course-engine | medium | 60 min | 60 min |
| notification-service | low | 120 min | 120 min |
| search-indexer | low | 240 min | 1440 min |

## Failover Configuration

Configured in `FAILOVER_CONFIG`:

- **Primary region:** `us-east-1`
- **Failover regions:** `us-west-2`, `eu-west-1`
- **Automatic failover:** Disabled by default — enable when infrastructure supports it
- **Health check interval:** Every 30 seconds
- **Failure threshold:** 3 consecutive failures before failover is triggered

## Incident Severity Levels

| Level | Description | Response Time | Examples |
|---|---|---|---|
| SEV-1 | Critical — complete outage or data breach | < 5 min | DB down, payment service down, data loss |
| SEV-2 | High — major feature unavailable | < 15 min | Auth service degraded, backup failure |
| SEV-3 | Medium — partial degradation | < 60 min | Slow queries, elevated error rates |
| SEV-4 | Low — minor issue | Next business day | Non-critical job failure |

## Incident Response Workflow

```
1. Detection (automated alert or user report)
       │
       ▼
2. Incident Commander assigned (first on-call engineer)
       │
       ▼
3. Severity assessment → select runbook
       │
       ▼
4. Mitigate → communicate → resolve
       │
       ▼
5. Post-mortem (within 48h for SEV-1/2)
```

## Runbooks

Two runbooks are pre-defined in `src/lib/disaster-recovery/config.ts`:

### RB-001: Database Primary Failure
- Trigger: Primary PostgreSQL unreachable for > 30 seconds
- Estimated resolution: 15 minutes
- Key steps: Confirm failure → Promote replica → Update connection string → Verify → Notify

### RB-002: Complete Service Outage
- Trigger: All services returning 5xx for > 2 minutes
- Estimated resolution: 30 minutes
- Key steps: Triage → Rollback deployment → Check infrastructure → Restore from backup → Post-incident

## Infrastructure Recovery Checklist

Run after any major incident before declaring recovery complete:

1. Verify all servers are reachable (DevOps, 5 min)
2. Confirm load balancer health targets (DevOps, 5 min)
3. Verify database replication (DBA, 10 min)
4. Run database integrity checks (DBA, 20 min)
5. Confirm all API services healthy via `/api/health` (Backend, 5 min)
6. Smoke test critical user flows — login, enrollment, payment (Frontend, 15 min)
7. Verify backup jobs running (DevOps, 5 min)
8. Review security alerts from outage window (Security, 10 min)
9. Communicate restoration to stakeholders (Leadership, 10 min)

## Post-Mortem Template

Every SEV-1 and SEV-2 incident requires a post-mortem within 48 hours:

```markdown
# Post-Mortem: [Incident Title]

**Date:** YYYY-MM-DD
**Severity:** SEV-X
**Duration:** X minutes
**Incident Commander:** [name]

## Summary
[2-3 sentence summary of what happened and impact]

## Timeline
- HH:MM — [action/observation]
- ...

## Root Cause
[Detailed root cause analysis — 5 whys]

## Impact
- Users affected: [number/percent]
- Data loss: [yes/no/amount]
- Revenue impact: [estimate]

## What Went Well
- [item]

## What Went Poorly
- [item]

## Action Items
| Item | Owner | Due Date | Priority |
|---|---|---|---|
| [action] | [owner] | YYYY-MM-DD | High |
```

## DR Testing Schedule

| Test | Frequency | Owner |
|---|---|---|
| Backup restore test (staging) | Weekly | DevOps |
| Failover drill (staging) | Quarterly | Engineering Lead |
| Full DR simulation | Annually | Engineering + Leadership |
| Runbook review | Quarterly | On-call team |

## Dashboard

The DR dashboard is available at `/admin/disaster-recovery`. It shows:
- Failover configuration summary
- RTO/RPO targets per service with test status
- Full runbook viewer with step-by-step commands
- Infrastructure recovery checklist
