import Link from "next/link";

import type { BreadcrumbItem } from "@/lib/content/seo";

export function BreadcrumbTrail({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-white">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            <Link href={item.href} className="hover:text-white">
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
