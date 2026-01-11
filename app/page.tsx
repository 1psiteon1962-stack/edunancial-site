// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Edunancial</h1>
      <p>
        Edunancial is the global routing engine for founders trapped inside broken
        legal, banking, and economic systems.
      </p>

      <p>
        We diagnose where founders will be crushed — and move them into survivable
        jurisdictions before it happens.
      </p>

      <h3>Choose your region:</h3>
      <ul>
        <li><Link href="/us">United States</Link></li>
        <li><Link href="/africa">Africa</Link></li>
        <li><Link href="/asia">Asia</Link></li>
        <li><Link href="/latin-america">Latin America</Link></li>
      </ul>
    </div>
  );
}
