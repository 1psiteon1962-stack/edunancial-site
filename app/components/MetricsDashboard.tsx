'use client'

export default function MetricsDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Edunancial Metrics</h1>
      <p className="mt-4 text-gray-600">
        Global performance dashboard for founders, affiliates, and regions.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold">Founders</h2>
          <p className="text-2xl mt-2">—</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold">Revenue</h2>
          <p className="text-2xl mt-2">—</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-semibold">Regions</h2>
          <p className="text-2xl mt-2">—</p>
        </div>
      </div>
    </div>
  )
}
