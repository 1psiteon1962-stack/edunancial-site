import { US_PAYMENTS } from "@/data/payments/us.payments";

export default function PaymentsPage() {
  return (
    <main className="max-w-6xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold">Payments & Revenue Systems</h1>

      <p className="mt-4 text-lg">
        Edunancial supports U.S. founders with enterprise-grade global payment infrastructure.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Supported Providers</h2>
      <ul className="mt-4 list-disc pl-6">
        {US_PAYMENTS.providers.map(p => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">Core Features</h2>
      <ul className="mt-4 list-disc pl-6">
        {US_PAYMENTS.features.map(f => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </main>
  );
}
