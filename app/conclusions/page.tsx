// app/conclusions/page.tsx

import { Region } from "@/lib/core";

export default function Page() {
  const regions: Region[] = [
    "US",
    "EU",
    "LATAM",
    "AFRICA",
  ];

  return (
    <main>
      <h1>Global Conclusions</h1>
      <ul>
        {regions.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </main>
  );
}
