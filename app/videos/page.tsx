import { videos } from "../../data/videos";

export default function VideosPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Videos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold mb-2">{video.title}</h2>

            {video.description && (
              <p className="text-sm mb-3">{video.description}</p>
            )}

            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Watch
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
