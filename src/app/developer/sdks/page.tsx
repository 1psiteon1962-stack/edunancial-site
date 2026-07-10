import Link from "next/link";

export const metadata = {
  title: "SDKs & Libraries | Edunancial Developer Portal",
  description: "Official Edunancial SDKs and client libraries",
};

const sdks = [
  {
    language: "JavaScript / TypeScript",
    icon: "🟨",
    status: "coming-soon" as const,
    description: "First-party SDK for Node.js, browser, and edge runtimes.",
    installCmd: "npm install @edunancial/sdk",
  },
  {
    language: "Python",
    icon: "🐍",
    status: "coming-soon" as const,
    description: "Python SDK with async support for Django, FastAPI, and Flask.",
    installCmd: "pip install edunancial",
  },
  {
    language: "iOS (Swift)",
    icon: "🍎",
    status: "planned" as const,
    description: "Native Swift SDK for iOS and macOS apps.",
    installCmd: ".package(url: \"https://github.com/edunancial/ios-sdk\")",
  },
  {
    language: "Android (Kotlin)",
    icon: "🤖",
    status: "planned" as const,
    description: "Kotlin SDK for Android applications.",
    installCmd: "implementation 'com.edunancial:sdk:1.0.0'",
  },
];

const statusColors = {
  available: "bg-green-100 text-green-700",
  "coming-soon": "bg-blue-100 text-blue-700",
  planned: "bg-gray-100 text-gray-600",
} as const;

export default function SdksPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/developer" className="hover:text-blue-600">Developer Portal</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">SDKs &amp; Libraries</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">SDKs &amp; Libraries</h1>
        <p className="text-gray-600 mb-10">
          Official Edunancial client libraries. All SDKs wrap the REST API and share the same
          authentication and error-handling conventions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {sdks.map((sdk) => (
            <div key={sdk.language} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{sdk.icon}</span>
                  <h2 className="text-base font-semibold text-gray-900">{sdk.language}</h2>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[sdk.status]}`}>
                  {sdk.status.replace("-", " ")}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{sdk.description}</p>
              <pre className="bg-gray-100 text-gray-800 p-3 rounded text-xs font-mono overflow-x-auto">
                {sdk.installCmd}
              </pre>
            </div>
          ))}
        </div>

        {/* REST API as alternative */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Use the REST API Directly</h2>
          <p className="text-gray-600 text-sm mb-4">
            While SDKs are being built, you can use the REST API directly from any language.
            All you need is an API key and the ability to make HTTP requests.
          </p>
          <Link
            href="/developer/docs"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View API Reference →
          </Link>
        </div>
      </div>
    </main>
  );
}
