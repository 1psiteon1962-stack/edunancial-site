import Link from "next/link";
import type { ForumCategoryMeta } from "@/types/community";

interface ForumCategoryCardProps {
  category: ForumCategoryMeta;
}

export default function ForumCategoryCard({ category }: ForumCategoryCardProps) {
  return (
    <Link
      href={`/community/forum/${category.slug}`}
      className="group rounded-xl bg-slate-800 p-6 hover:bg-slate-700 transition-colors block"
      aria-label={`Browse ${category.label} forum`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`h-12 w-12 rounded-lg ${category.color} flex items-center justify-center text-2xl shrink-0`}
          aria-hidden="true"
        >
          {category.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg group-hover:text-yellow-400 transition-colors">
            {category.label}
          </h3>
          <p className="mt-1 text-sm text-slate-400 line-clamp-2">
            {category.description}
          </p>
          <div className="mt-3 flex gap-4 text-xs text-slate-500">
            <span>
              <strong className="text-slate-300">{category.threadCount.toLocaleString()}</strong>{" "}
              threads
            </span>
            <span>
              <strong className="text-slate-300">{category.postCount.toLocaleString()}</strong>{" "}
              posts
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
