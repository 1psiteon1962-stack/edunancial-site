import { US_SECURITY } from "@/data/security/us.security";

export default function SecurityPage() {
  return (
    <main className="max-w-5xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold">Security, IP & Infrastructure</h1>

      <p className="mt-4 text-lg">
        Edunancial is designed from day one for legal protection, cybersecurity, 
        and investor-grade operational resilience.
      </p>

      <ul className="mt-8 space-y-2 list-disc pl-6 text-lg">
        {Object.entries(US_SECURITY).map(([key, value]) => (
          <li key={key}>
            {key}: {Array.isArray(value) ? value.join(", ") : String(value)}
          </li>
        ))}
      </ul>
    </main>
  );
}
