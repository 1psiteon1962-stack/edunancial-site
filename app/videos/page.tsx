import { videos } from "@/data/videos";

export default function VideosPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Videos</h1>

      {videos.map(video => (
        <div key={video.id} className="mb-6">
          <h2 className="text-xl font-semibold">{video.title}</h2>
          {video.description && (
            <p className="text-sm mt-2">{video.description}</p>
          )}
        </div>
      ))}
    </main>
  );
}
