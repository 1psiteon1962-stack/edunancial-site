import Link from "next/link";

type RegionMeta = {
  code: string;
  name: string;
  path: string;
};

const REGIONS: RegionMeta[] = [
  { code: "us", name: "United States", path: "/us" },
  { code: "caribbean", name: "Caribbean", path: "/caribbean" },
  { code: "latin", name: "Latin America", path: "/latin" },
  { code: "europe", name: "Europe", path: "/europe" },
  { code: "africa", name: "Africa", path: "/africa" },
  { code: "asia", name: "Asia-Pacific", path: "/asia" },
];

export default function RegionsPage() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Regions</h1>

      <p style={{ marginTop: 10 }}>
        Select your region to view localized resources, languages, and tools.
      </p>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gap: 14,
          maxWidth: 520,
        }}
      >
        {REGIONS.map((r) => (
          <Link
            key={r.code}
            href={r.path}
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid #ddd",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {r.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
