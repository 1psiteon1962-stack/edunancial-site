import Link from "next/link";

export const metadata = {
  title: "API Documentation | Edunancial Developer Portal",
  description: "REST API reference documentation for the Edunancial platform",
};

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/health",
    description: "Check API health and basic metrics",
    auth: false,
  },
  {
    method: "POST",
    path: "/api/v1/auth/token",
    description: "Issue JWT access + refresh tokens",
    auth: false,
  },
  {
    method: "POST",
    path: "/api/v1/auth/refresh",
    description: "Exchange refresh token for a new access token",
    auth: false,
  },
  {
    method: "POST",
    path: "/api/v1/auth/revoke",
    description: "Revoke the current token or all user tokens",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/v1/webhooks/incoming",
    description: "Receive signed incoming webhook events",
    auth: false,
  },
  {
    method: "POST",
    path: "/api/v1/webhooks/outgoing",
    description: "Trigger a webhook event to registered subscribers",
    auth: true,
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  PATCH: "bg-orange-100 text-orange-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/developer" className="hover:text-blue-600">Developer Portal</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">API Documentation</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">API Reference</h1>
        <p className="text-gray-600 mb-10">
          All endpoints follow REST conventions with versioned routes (
          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">/api/v1/</code>
          ). Responses use a standard JSON envelope.
        </p>

        {/* Response envelope */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Standard Response Envelope</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Success</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">{`{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1"
  }
}`}</pre>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Error</p>
              <pre className="bg-gray-900 text-red-400 p-4 rounded-lg text-xs overflow-x-auto">{`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": [...]
  },
  "meta": { ... }
}`}</pre>
            </div>
          </div>
        </div>

        {/* Rate limits */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate Limiting</h2>
          <p className="text-gray-600 text-sm mb-4">
            Rate limit status is returned in response headers. Exceeding the limit returns{" "}
            <code className="bg-gray-100 px-1 rounded">429 Too Many Requests</code>.
          </p>
          <div className="font-mono text-sm space-y-1">
            <div><span className="text-blue-600">X-RateLimit-Limit</span> — Maximum requests per window</div>
            <div><span className="text-blue-600">X-RateLimit-Remaining</span> — Remaining requests</div>
            <div><span className="text-blue-600">X-RateLimit-Reset</span> — Unix timestamp of window reset</div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-700">Endpoint Group</th>
                  <th className="text-left py-2 text-gray-700">Limit</th>
                  <th className="text-left py-2 text-gray-700">Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="py-2">General API</td><td>120</td><td>1 minute</td></tr>
                <tr><td className="py-2">Auth endpoints</td><td>10</td><td>1 minute</td></tr>
                <tr><td className="py-2">Webhooks</td><td>200</td><td>1 minute</td></tr>
                <tr><td className="py-2">Public</td><td>30</td><td>1 minute</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Endpoint list */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h2>
          <div className="space-y-3">
            {endpoints.map((ep) => (
              <div key={ep.path} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                <span className={`text-xs font-bold px-2 py-1 rounded font-mono shrink-0 ${methodColors[ep.method] ?? "bg-gray-100 text-gray-700"}`}>
                  {ep.method}
                </span>
                <div className="flex-1 min-w-0">
                  <code className="text-sm font-mono text-gray-900">{ep.path}</code>
                  <p className="text-sm text-gray-600 mt-0.5">{ep.description}</p>
                </div>
                {ep.auth && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded shrink-0">
                    Auth required
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagination</h2>
          <p className="text-gray-600 text-sm mb-4">
            Collection endpoints support cursor-based pagination via query parameters.
          </p>
          <div className="font-mono text-sm space-y-1">
            <div><span className="text-blue-600">?page=1</span> — Page number (default: 1)</div>
            <div><span className="text-blue-600">?per_page=20</span> — Items per page (max: 100)</div>
            <div><span className="text-blue-600">?sort=field:asc</span> — Sort by field (comma-separated)</div>
            <div><span className="text-blue-600">?filter[field]=value</span> — Filter by field</div>
          </div>
        </div>
      </div>
    </main>
  );
}
