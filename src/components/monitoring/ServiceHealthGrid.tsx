import { type ServiceHealthCheck } from "@/lib/monitoring";
import StatusBadge from "./StatusBadge";

interface ServiceHealthGridProps {
  services: ServiceHealthCheck[];
}

export default function ServiceHealthGrid({ services }: ServiceHealthGridProps) {
  return (
    <section aria-label="Service health grid">
      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
      >
        {services.map((svc) => (
          <div
            key={svc.service}
            className="rounded-xl border border-white/10 bg-[#101a2f] p-4 flex items-center justify-between gap-3"
            role="listitem"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{svc.service}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {svc.latencyMs.toFixed(0)} ms latency
              </p>
              {svc.message && (
                <p className="mt-0.5 text-xs text-amber-400 truncate" title={svc.message}>
                  {svc.message}
                </p>
              )}
            </div>
            <StatusBadge status={svc.status} size="sm" />
          </div>
        ))}
      </div>
    </section>
  );
}
