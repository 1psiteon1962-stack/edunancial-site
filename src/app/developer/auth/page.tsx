import Link from "next/link";

export const metadata = {
  title: "Authentication Guide | Edunancial Developer Portal",
  description: "Learn how to authenticate with the Edunancial API",
};

export default function AuthGuidePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/developer" className="hover:text-blue-600">Developer Portal</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Authentication Guide</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Authentication</h1>
        <p className="text-gray-600 mb-10">
          The Edunancial API supports multiple authentication methods. Choose the one that
          fits your integration.
        </p>

        {/* JWT */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎟️</span>
            <h2 className="text-lg font-semibold text-gray-900">JWT Authentication</h2>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Recommended</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Issue short-lived access tokens (default: 15 minutes) and long-lived refresh
            tokens (default: 7 days). Tokens are signed with HS256.
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto mb-4">{`# 1. Get a token
curl -X POST /api/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"grant_type":"api_key"}' \\
  -H "X-API-Key: ek_test_your_key"

# 2. Use the token
curl /api/v1/health \\
  -H "Authorization: ******"

# 3. Refresh when expired
curl -X POST /api/v1/auth/refresh \\
  -H "Content-Type: application/json" \\
  -d '{"refresh_token":"<refresh_token>"}'`}</pre>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <strong>Token lifetime:</strong> Access tokens expire after 15 minutes by default.
            Always refresh using the refresh token before expiry.
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🗝️</span>
            <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Server-to-server integrations use API keys passed in the{" "}
            <code className="bg-gray-100 px-1 rounded">X-API-Key</code> header.
            Keys are prefixed with{" "}
            <code className="bg-gray-100 px-1 rounded">ek_live_</code> or{" "}
            <code className="bg-gray-100 px-1 rounded">ek_test_</code>.
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">{`curl /api/v1/health \\
  -H "X-API-Key: ek_test_your_key_here"`}</pre>
        </div>

        {/* OAuth 2.0 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔄</span>
            <h2 className="text-lg font-semibold text-gray-900">OAuth 2.0</h2>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">Coming soon</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            OAuth 2.0 authorization code flow with PKCE for third-party integrations.
            Supported grant types: <code className="bg-gray-100 px-1 rounded">authorization_code</code>,{" "}
            <code className="bg-gray-100 px-1 rounded">refresh_token</code>,{" "}
            <code className="bg-gray-100 px-1 rounded">client_credentials</code>.
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="font-mono text-blue-600">Authorization URL:</span>
              <span>/oauth/authorize</span>
            </div>
            <div className="flex gap-2">
              <span className="font-mono text-blue-600">Token URL:</span>
              <span>/api/v1/auth/token</span>
            </div>
          </div>
        </div>

        {/* Scopes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Permission Scopes</h2>
          <p className="text-gray-600 text-sm mb-4">
            Scopes follow the pattern <code className="bg-gray-100 px-1 rounded">resource:action</code>.
            Use <code className="bg-gray-100 px-1 rounded">resource:*</code> for all actions on a resource.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-700">Scope</th>
                  <th className="text-left py-2 text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {[
                  ["courses:read", "Read course data"],
                  ["courses:write", "Create and update courses"],
                  ["billing:read", "Read billing information"],
                  ["billing:write", "Create invoices and process payments"],
                  ["users:read", "Read user profiles"],
                  ["users:write", "Create and update users"],
                  ["webhooks:write", "Send webhook events"],
                  ["admin:*", "Full administrative access"],
                ].map(([scope, desc]) => (
                  <tr key={scope}>
                    <td className="py-2 text-blue-600">{scope}</td>
                    <td className="py-2 font-sans text-gray-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Token revocation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Token Revocation</h2>
          <p className="text-gray-600 text-sm mb-4">
            Revoke a token immediately or revoke all tokens for the authenticated user.
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">{`# Revoke current token
curl -X POST /api/v1/auth/revoke \\
  -H "Authorization: ******"

# Revoke ALL tokens for the user
curl -X POST /api/v1/auth/revoke \\
  -H "Authorization: ******" \\
  -H "Content-Type: application/json" \\
  -d '{"revoke_all": true}'`}</pre>
        </div>
      </div>
    </main>
  );
}
