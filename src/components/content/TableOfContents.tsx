export interface TocItem {
  id: string;
  heading: string;
  summary: string;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-[#101a2f] p-6">
      <h2 className="text-lg font-bold text-white">Table of contents</h2>
      <ol className="mt-4 space-y-4 text-sm text-slate-300">
        {items.map((item, index) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="font-semibold text-white hover:text-blue-300">
              {index + 1}. {item.heading}
            </a>
            <p className="mt-1 text-slate-400">{item.summary}</p>
          </li>
        ))}
      </ol>
    </aside>
  );
}
