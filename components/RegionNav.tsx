import Link from "next/link";

type Region = {
  code: string;
  name: string;
};

const regions: Region[] = [
  { code: "na", name: "North America" },
  { code: "eu", name: "Europe" },
  { code: "latam", name: "Latin America" },
];

export default function RegionNav() {
  return (
    <ul>
      {regions.map((region) => (
        <li key={region.code}>
          <Link href={`/${region.code}`}>{region.name}</Link>
        </li>
      ))}
    </ul>
  );
}
