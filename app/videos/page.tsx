/* app/videos/page.tsx */
"use client";

// RELATIVE IMPORT — NO ALIASES
import { videos } from "../../data/videos";

export default function VideosPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">
          Educational Videos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-2">
                {video.title}
              </h2>

              {video.description && (
                <p className="text-sm mb-3">
                  {video.description}
                </p>
              )}

              <div className="text-xs text-gray-600">
                Level {video.level} · {video.language.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
