import Link from "next/link";

export const metadata = {
  title: "Changelog | Edunancial Developer Portal",
  description: "API changelog and version history",
};

const releases = [
  {
    version: "1.0.0",
    date: "2025-01-01",
    type: "major" as const,
    items: [
      { type: "new", text: "Initial API platform release" },
      { type: "new", text: "JWT and API key authentication" },
      { type: "new", text: "REST v1 endpoints: /auth/token, /auth/refresh, /auth/revoke" },
      { type: "new", text: "Webhook framework: incoming validation and outgoing dispatch" },
      { type: "new", text: "Rate limiting with X-RateLimit headers" },
      { type: "new", text: "Standard JSON response envelopes" },
      { type: "new", text: "Pagination, sorting, and filtering conventions" },
      { type: "new", text: "Integration hub: Stripe, PayPal, GA, Clarity, Email, SMS, AI, CRM" },
      { type: "new", text: "API v2 forward-compatible health endpoint" },
    ],
  },
];

const typeColors = {
  new: "bg-green-100 text-green-700",
  changed: "bg-blue-100 text-blue-700",
  deprecated: "bg-yellow-100 text-yellow-700",
  fixed: "bg-purple-100 text-purple-700",
  removed: "bg-red-100 text-red-700",
  security: "bg-orange-100 text-orange-700",
} as const;

const versionColors = {
  major: "bg-blue-600 text-white",
  minor: "bg-green-600 text-white",
  patch: "bg-gray-500 text-white",
} as const;

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/developer" className="hover:text-blue-600">Developer Portal</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Changelog</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Changelog</h1>
        <p className="text-gray-600 mb-10">
          All notable changes to the Edunancial API platform are documented here.
          We follow{" "}
          <a href="https://semver.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Semantic Versioning
          </a>.
        </p>

        <div className="space-y-8">
          {releases.map((release) => (
            <div key={release.version} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-sm font-bold px-3 py-1 rounded-full font-mono ${versionColors[release.type]}`}>
                  v{release.version}
                </span>
                <span className="text-gray-500 text-sm">{release.date}</span>
              </div>
              <ul className="space-y-2">
                {release.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5 ${typeColors[item.type as keyof typeof typeColors]}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
