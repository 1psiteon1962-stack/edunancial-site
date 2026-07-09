import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";

import OperationsDashboard from "@/components/operations/OperationsDashboard";
import { getOperationsDashboardData } from "@/lib/operations";

test("OperationsDashboard renders the command center headline and filter controls", () => {
  const markup = renderToStaticMarkup(
    <OperationsDashboard
      dashboard={getOperationsDashboardData({ severity: "critical" })}
      filters={{ severity: "critical", eventType: "all" }}
    />,
  );

  assert.equal(markup.includes("Enterprise Infrastructure &amp; Resilience Dashboard"), true);
  assert.equal(markup.includes("Apply filters"), true);
  assert.equal(markup.includes("/api/health/readiness"), true);
});
