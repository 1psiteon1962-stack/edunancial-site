export interface RequestMetric {
  method: string;
  route: string;
  status: number;
  durationMs: number;
}

interface RouteMetrics {
  count: number;
  errorCount: number;
  totalDurationMs: number;
}

interface MetricsStore {
  startedAt: string;
  requestCount: number;
  errorCount: number;
  totalDurationMs: number;
  routes: Record<string, RouteMetrics>;
}

declare global {
  // eslint-disable-next-line no-var
  var __edunancialMetricsStore: MetricsStore | undefined;
}

function getMetricsStore(): MetricsStore {
  if (!globalThis.__edunancialMetricsStore) {
    globalThis.__edunancialMetricsStore = {
      startedAt: new Date().toISOString(),
      requestCount: 0,
      errorCount: 0,
      totalDurationMs: 0,
      routes: {},
    };
  }

  return globalThis.__edunancialMetricsStore;
}

function routeKey(method: string, route: string): string {
  return `${method.toUpperCase()} ${route}`;
}

export function recordRequestMetric(metric: RequestMetric): void {
  const store = getMetricsStore();
  const key = routeKey(metric.method, metric.route);

  store.requestCount += 1;
  store.totalDurationMs += metric.durationMs;

  if (metric.status >= 500) {
    store.errorCount += 1;
  }

  if (!store.routes[key]) {
    store.routes[key] = {
      count: 0,
      errorCount: 0,
      totalDurationMs: 0,
    };
  }

  store.routes[key].count += 1;
  store.routes[key].totalDurationMs += metric.durationMs;

  if (metric.status >= 500) {
    store.routes[key].errorCount += 1;
  }
}

export function renderPrometheusMetrics(): string {
  const store = getMetricsStore();
  const lines = [
    "# HELP http_requests_total Total number of observed HTTP requests",
    "# TYPE http_requests_total counter",
    `http_requests_total ${store.requestCount}`,
    "# HELP http_request_errors_total Total number of observed 5xx HTTP responses",
    "# TYPE http_request_errors_total counter",
    `http_request_errors_total ${store.errorCount}`,
    "# HELP http_request_duration_ms_total Cumulative request duration in milliseconds",
    "# TYPE http_request_duration_ms_total counter",
    `http_request_duration_ms_total ${store.totalDurationMs.toFixed(2)}`,
  ];

  for (const [key, value] of Object.entries(store.routes)) {
    const [method, ...routeParts] = key.split(" ");
    const route = routeParts.join(" ");

    lines.push(
      `http_requests_by_route_total{method="${method}",route="${route}"} ${value.count}`,
      `http_request_errors_by_route_total{method="${method}",route="${route}"} ${value.errorCount}`,
      `http_request_duration_ms_by_route_total{method="${method}",route="${route}"} ${value.totalDurationMs.toFixed(2)}`
    );
  }

  return `${lines.join("\n")}\n`;
}
