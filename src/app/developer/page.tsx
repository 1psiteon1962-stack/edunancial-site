import Link from "next/link";

export const metadata = {
  title: "Developer Portal | Edunancial",
  description: "Build with the Edunancial API Platform",
};

const sections = [
  {
    href: "/developer/docs",
    title: "API Documentation",
    description: "Full reference for all REST API endpoints, request/response schemas, and versioning.",
    icon: "📖",
  },
  {
    href: "/developer/auth",
    title: "Authentication Guide",
    description: "Learn how to authenticate with JWT tokens, API keys, OAuth 2.0, and service accounts.",
    icon: "🔐",
  },
  {
    href: "/developer/sdks",
    title: "SDKs & Libraries",
    description: "Download official SDKs for JavaScript, Python, and mobile platforms.",
    icon: "📦",
  },
  {
    href: "/developer/sandbox",
    title: "Sandbox Environment",
    description: "Test your integration safely using the Edunancial sandbox with real API responses.",
    icon: "🧪",
  },
  {
    href: "/developer/changelog",
    title: "Changelog",
    description: "Track API changes, new features, deprecations, and migration guides.",
    icon: "📝",
  },
];

export default function DeveloperPortalPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>API Platform</span>
            <span className="bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">v1</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Edunancial Developer Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to integrate with the Edunancial platform—authentication,
            webhooks, payments, learning APIs, and more.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/developer/docs"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Read the Docs
            </Link>
            <Link
              href="/developer/sandbox"
              className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Try Sandbox
            </Link>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-gray-900 rounded-xl p-6 mb-12 overflow-x-auto">
          <p className="text-gray-400 text-sm mb-2 font-mono">Quick start — get an access token</p>
          <pre className="text-green-400 font-mono text-sm whitespace-pre">{`curl -X POST https://edunancial.com/api/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"grant_type":"api_key"}' \\
  -H "X-API-Key: ek_test_your_key_here"`}</pre>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link key={section.href} href={section.href}>
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full">
                <div className="text-4xl mb-4">{section.icon}</div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h2>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* API Versions */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Versions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <span className="font-mono font-semibold">v1</span>
                <span className="ml-3 text-sm text-gray-600">Current stable release</span>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <span className="font-mono font-semibold">v2</span>
                <span className="ml-3 text-sm text-gray-600">Forward-compatible preview</span>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Preview
              </span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-sm mt-12">
          Need help?{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact developer support
          </Link>
        </p>
      </div>
    </main>
  );
}
