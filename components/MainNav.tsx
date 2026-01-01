// components/MainNav.tsx

import Link from "next/link";

export default function MainNav({ lang }: { lang: string }) {
  return (
    <nav className="flex gap-6 text-sm font-medium">
      <Link href={`/${lang}`}>USA</Link>
      <Link href={`/africa/${lang}`}>Africa</Link>
      <Link href={`/asia/${lang}`}>Asia</Link>
      <Link href={`/europe/${lang}`}>Europe</Link>
      <Link href={`/mena/${lang}`}>MENA</Link>
    </nav>
  );
}
