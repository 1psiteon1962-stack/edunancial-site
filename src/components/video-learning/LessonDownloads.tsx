"use client";

// ─────────────────────────────────────────────────────────────
// LessonDownloads — Workbooks, checklists, templates, guides
// ─────────────────────────────────────────────────────────────

import type { LessonResource, LessonResourceType } from "@/lib/video-learning/types";

const typeConfig: Record<
  LessonResourceType,
  { icon: string; label: string; color: string }
> = {
  workbook:      { icon: "📒", label: "Workbook",      color: "text-yellow-400" },
  checklist:     { icon: "✅", label: "Checklist",     color: "text-green-400"  },
  template:      { icon: "📊", label: "Template",      color: "text-blue-400"   },
  guide:         { icon: "📄", label: "Guide",         color: "text-slate-300"  },
  spreadsheet:   { icon: "🧮", label: "Spreadsheet",   color: "text-emerald-400"},
  case_study:    { icon: "🔍", label: "Case Study",    color: "text-purple-400" },
  reference:     { icon: "📌", label: "Reference",     color: "text-orange-400" },
  external_link: { icon: "🔗", label: "Resource Link", color: "text-cyan-400"   },
};

interface LessonDownloadsProps {
  resources?: LessonResource[];
  /** Legacy single download URL (shows if no resources array) */
  legacyDownloadUrl?: string;
  lessonTitle?: string;
}

export default function LessonDownloads({
  resources,
  legacyDownloadUrl,
  lessonTitle,
}: LessonDownloadsProps) {
  const hasResources = resources && resources.length > 0;
  const hasLegacy = !!legacyDownloadUrl;

  if (!hasResources && !hasLegacy) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📂</span>
          <h3 className="font-black text-lg text-white">Downloads &amp; Resources</h3>
        </div>
        <p className="text-slate-400 text-sm">
          No downloads available for this lesson yet. Check back after the lesson launches.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
        <span className="text-2xl">📂</span>
        <h3 className="font-black text-lg text-white">Downloads &amp; Resources</h3>
      </div>

      <div className="divide-y divide-slate-800">
        {/* Rich resource list */}
        {hasResources &&
          resources!.map((resource) => {
            const cfg = typeConfig[resource.type] ?? typeConfig.guide;
            const isExternal = resource.type === "external_link" ||
              resource.url.startsWith("http");

            return (
              <a
                key={resource.id}
                href={resource.url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800 transition group"
              >
                <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${cfg.color} group-hover:underline leading-tight`}>
                    {resource.label}
                  </p>
                  {resource.description && (
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex gap-3 mt-1">
                    {resource.format && (
                      <span className="text-xs text-slate-500 uppercase font-bold">
                        {resource.format}
                      </span>
                    )}
                    {resource.fileSize && (
                      <span className="text-xs text-slate-500">{resource.fileSize}</span>
                    )}
                    {resource.isPremium && (
                      <span className="text-xs text-yellow-500 font-bold">⭐ Premium</span>
                    )}
                  </div>
                </div>
                <span className="text-slate-600 group-hover:text-slate-400 text-xl flex-shrink-0">
                  {isExternal ? "↗" : "↓"}
                </span>
              </a>
            );
          })}

        {/* Legacy fallback download */}
        {!hasResources && hasLegacy && (
          <a
            href={legacyDownloadUrl}
            className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800 transition group"
          >
            <span className="text-2xl">📄</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-300 group-hover:underline">
                {lessonTitle ? `${lessonTitle} — Notes PDF` : "Lesson Notes PDF"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Click to download</p>
            </div>
            <span className="text-slate-600 group-hover:text-slate-400 text-xl">↓</span>
          </a>
        )}
      </div>
    </div>
  );
}
