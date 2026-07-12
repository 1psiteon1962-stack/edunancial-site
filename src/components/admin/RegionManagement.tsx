import Link from "next/link";

const segments = [
  { name: "North America", href: "/north-america" },
  { name: "Caribbean", href: "/caribbean" },
  { name: "Latin America", href: "/latin-america" },
  { name: "Western Europe", href: "/western-europe" },
  { name: "Eastern Europe", href: "/eastern-europe" },
  { name: "Africa", href: "/africa" },
  { name: "East Africa", href: "/east-africa" },
  { name: "West Africa", href: "/west-africa" },
  { name: "Southern Africa", href: "/southern-africa" },
  { name: "Middle East", href: "/middle-east" },
  { name: "Asia-Pacific", href: "/asia-pacific" },
];

export default function RegionManagement() {
  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <h2 className="text-4xl font-black text-white">Region Management</h2>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {segments.map((segment) => (
          <Link
            key={segment.name}
            href={segment.href}
            className="rounded-lg bg-slate-800 px-4 py-3 text-white font-semibold hover:bg-slate-700 transition-colors"
          >
            {segment.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
