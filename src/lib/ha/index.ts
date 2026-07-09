// ─── High Availability & Deployment Readiness ─────────────────────────────────

export type DeploymentStrategy = "rolling" | "blue_green" | "canary" | "recreate";

export interface HealthCheckConfig {
  path: string;
  intervalSeconds: number;
  timeoutSeconds: number;
  healthyThreshold: number;
  unhealthyThreshold: number;
}

export interface DeploymentReadiness {
  strategy: DeploymentStrategy;
  maxUnavailablePercent: number;
  maxSurgePercent: number;
  progressDeadlineSeconds: number;
  readinessGracePeriodSeconds: number;
  healthCheck: HealthCheckConfig;
}

export interface ScalingPolicy {
  minReplicas: number;
  maxReplicas: number;
  targetCpuPercent: number;
  targetMemoryPercent?: number;
  scaleUpCooldownSeconds: number;
  scaleDownCooldownSeconds: number;
}

export interface RegionConfig {
  id: string;
  name: string;
  provider: string;
  primary: boolean;
  active: boolean;
  healthEndpoint: string;
}

export const DEPLOYMENT_READINESS: DeploymentReadiness = {
  strategy: "rolling",
  maxUnavailablePercent: 25,
  maxSurgePercent: 25,
  progressDeadlineSeconds: 600,
  readinessGracePeriodSeconds: 30,
  healthCheck: {
    path: "/api/health",
    intervalSeconds: 15,
    timeoutSeconds: 5,
    healthyThreshold: 2,
    unhealthyThreshold: 3,
  },
};

export const SCALING_POLICY: ScalingPolicy = {
  minReplicas: 2,
  maxReplicas: 20,
  targetCpuPercent: 70,
  targetMemoryPercent: 80,
  scaleUpCooldownSeconds: 60,
  scaleDownCooldownSeconds: 300,
};

export const MULTI_REGION_CONFIG: RegionConfig[] = [
  { id: "us-east-1",  name: "US East (N. Virginia)", provider: "aws", primary: true,  active: true,  healthEndpoint: "https://us-east.edunancial.com/api/health" },
  { id: "us-west-2",  name: "US West (Oregon)",      provider: "aws", primary: false, active: false, healthEndpoint: "https://us-west.edunancial.com/api/health" },
  { id: "eu-west-1",  name: "EU West (Ireland)",     provider: "aws", primary: false, active: false, healthEndpoint: "https://eu-west.edunancial.com/api/health" },
];

// Zero-downtime deployment checklist
export const ZERO_DOWNTIME_CHECKLIST: string[] = [
  "Database migrations are backwards-compatible (never drop/rename columns in the same deploy)",
  "New code handles both old and new data formats during transition",
  "Feature flags wrap all significant behavior changes",
  "Health check endpoint responds before traffic is routed to new instances",
  "Graceful shutdown: drain in-flight requests before termination (SIGTERM handler)",
  "Readiness probe is distinct from liveness probe",
  "Session state stored externally (Redis/DB) — not in process memory",
  "Load balancer sticky sessions disabled unless explicitly required",
  "Rollback procedure documented and tested",
  "Deployment monitored for 10 minutes after completion before closing change window",
];
