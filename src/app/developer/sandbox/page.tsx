import Link from "next/link";

export const metadata = {
  title: "Sandbox | Edunancial Developer Portal",
  description: "Test your Edunancial API integration in the sandbox environment",
};

export default function SandboxPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/developer" className="hover:text-blue-600">Developer Portal</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Sandbox</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Sandbox Environment</h1>
        <p className="text-gray-600 mb-10">
          Test your integration safely without affecting production data.
          All sandbox transactions are isolated and use test API keys.
        </p>

        {/* Environment info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">🟢 Sandbox Base URL</h2>
            <code className="bg-gray-100 px-3 py-2 rounded block text-sm font-mono text-gray-800 break-all">
              https://sandbox.edunancial.com/api/v1
            </code>
            <p className="text-gray-500 text-xs mt-2">
              All sandbox requests must use a <code>ek_test_</code> key.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">🔑 Test API Key</h2>
            <code className="bg-gray-100 px-3 py-2 rounded block text-sm font-mono text-gray-800 break-all">
              ek_test_00000000000000000000000000000000
            </code>
            <p className="text-gray-500 text-xs mt-2">
              This test key is pre-configured for sandbox use.
            </p>
          </div>
        </div>

        {/* Test examples */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Example Requests</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Health check</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">{`curl https://sandbox.edunancial.com/api/v1/health`}</pre>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Issue access token</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">{`curl -X POST https://sandbox.edunancial.com/api/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ek_test_00000000000000000000000000000000" \\
  -d '{"grant_type":"api_key"}'`}</pre>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Trigger test webhook</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">{`curl -X POST https://sandbox.edunancial.com/api/v1/webhooks/outgoing \\
  -H "Authorization: ******" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "payment.succeeded",
    "data": {
      "paymentId": "pay_test_123",
      "amount": 4999,
      "currency": "usd",
      "status": "succeeded",
      "provider": "stripe"
    }
  }'`}</pre>
            </div>
          </div>
        </div>

        {/* Test cards */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stripe Test Cards</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-700">Card Number</th>
                  <th className="text-left py-2 text-gray-700">Scenario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {[
                  ["4242 4242 4242 4242", "Payment succeeds"],
                  ["4000 0000 0000 0002", "Card declined"],
                  ["4000 0025 0000 3155", "Requires authentication"],
                  ["4000 0000 0000 9995", "Insufficient funds"],
                ].map(([num, scenario]) => (
                  <tr key={num}>
                    <td className="py-2 text-blue-600">{num}</td>
                    <td className="py-2 font-sans text-gray-600">{scenario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">Use any future expiry date and any 3-digit CVC.</p>
        </div>
      </div>
    </main>
  );
}
