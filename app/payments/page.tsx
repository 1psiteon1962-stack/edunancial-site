type PaymentGroup = {
  title: string;
  providers: string[];
};

const US_PAYMENTS: PaymentGroup = {
  title: "US Payment Options",
  providers: ["Stripe", "Square", "PayPal"],
};

export default function PaymentsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-4xl font-bold">Payments</h1>

      <h2 className="mt-8 text-2xl font-semibold">{US_PAYMENTS.title}</h2>

      <ul className="mt-4 list-disc pl-6">
        {US_PAYMENTS.providers.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </main>
  );
}
